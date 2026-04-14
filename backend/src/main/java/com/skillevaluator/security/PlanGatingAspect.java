package com.skillevaluator.security;

import com.skillevaluator.model.PlanTier;
import com.skillevaluator.model.Subscription;
import com.skillevaluator.model.User;
import com.skillevaluator.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class PlanGatingAspect {

    private final SubscriptionRepository subscriptionRepository;

    @Before("@annotation(requiresPlan)")
    public void checkPlan(RequiresPlan requiresPlan) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof User user)) {
            throw new RuntimeException("Unauthorized");
        }

        Subscription subscription = subscriptionRepository.findByUser(user)
                .orElse(Subscription.builder().plan(PlanTier.FREE).status("active").build());

        // Simple hierarchy: ENTERPRISE > PRO > FREE
        if (getPlanPriority(subscription.getPlan()) < getPlanPriority(requiresPlan.value())) {
            throw new RuntimeException("Upgrade required to access this feature. Current plan: " + subscription.getPlan());
        }
        
        if (!"active".equals(subscription.getStatus()) && !"trialing".equals(subscription.getStatus())) {
            throw new RuntimeException("Subscription is not active. Status: " + subscription.getStatus());
        }
    }

    private int getPlanPriority(PlanTier tier) {
        return switch (tier) {
            case ENTERPRISE -> 2;
            case PRO -> 1;
            case FREE -> 0;
        };
    }
}
