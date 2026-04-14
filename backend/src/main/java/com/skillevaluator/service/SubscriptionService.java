package com.skillevaluator.service;

import com.skillevaluator.model.PlanTier;
import com.skillevaluator.model.Subscription;
import com.skillevaluator.model.User;
import com.skillevaluator.repository.SubscriptionRepository;
import com.skillevaluator.repository.UserRepository;
import com.stripe.model.checkout.Session;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    public Optional<Subscription> getSubscriptionForUser(User user) {
        return subscriptionRepository.findByUser(user);
    }

    @Transactional
    public void handleCheckoutCompleted(Session session) {
        String stripeSubscriptionId = session.getSubscription();
        String stripeCustomerId = session.getCustomer();
        // The metadata should contain the userId
        String userIdStr = session.getMetadata().get("userId");
        if (userIdStr == null) {
            log.error("No userId in session metadata for Stripe Checkout {}", session.getId());
            return;
        }

        Long userId = Long.parseLong(userIdStr);
        String planName = session.getMetadata().get("plan").toUpperCase();
        PlanTier tier = PlanTier.valueOf(planName);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        Subscription sub = subscriptionRepository.findByStripeCustomerId(stripeCustomerId)
                .orElse(Subscription.builder()
                        .stripeCustomerId(stripeCustomerId)
                        .user(user)
                        .build());

        sub.setStripeSubscriptionId(stripeSubscriptionId);
        sub.setPlan(tier);
        sub.setStatus("active");
        
        subscriptionRepository.save(sub);
        log.info("Subscription created/updated for user {} with plan {}", userId, tier);
    }

    @Transactional
    public void handleSubscriptionUpdated(com.stripe.model.Subscription stripeSub) {
        subscriptionRepository.findByStripeSubscriptionId(stripeSub.getId())
                .ifPresent(sub -> {
                    sub.setStatus(stripeSub.getStatus());
                    sub.setCancelAtPeriodEnd(stripeSub.getCancelAtPeriodEnd());
                    sub.setCurrentPeriodEnd(ZonedDateTime.ofInstant(
                            Instant.ofEpochSecond(stripeSub.getCurrentPeriodEnd()), ZoneId.systemDefault()));
                    subscriptionRepository.save(sub);
                    log.info("Subscription {} status updated to {}", stripeSub.getId(), stripeSub.getStatus());
                });
    }

    @Transactional
    public void handleSubscriptionDeleted(com.stripe.model.Subscription stripeSub) {
        subscriptionRepository.findByStripeSubscriptionId(stripeSub.getId())
                .ifPresent(sub -> {
                    sub.setStatus("canceled");
                    sub.setPlan(PlanTier.FREE);
                    subscriptionRepository.save(sub);
                    log.info("Subscription {} deleted, user reverted to FREE", stripeSub.getId());
                });
    }
}
