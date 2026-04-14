package com.skillevaluator.controller;

import com.skillevaluator.model.Subscription;
import com.skillevaluator.model.User;
import com.skillevaluator.service.StripeService;
import com.skillevaluator.service.SubscriptionService;
import com.stripe.model.checkout.Session;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/subscription")
@RequiredArgsConstructor
public class SubscriptionController {

    private final StripeService stripeService;
    private final SubscriptionService subscriptionService;

    @PostMapping("/checkout")
    public ResponseEntity<?> createCheckoutSession(@AuthenticationPrincipal User user, @RequestBody Map<String, String> request) {
        try {
            String tier = request.get("tier");
            String cadence = request.get("cadence");
            Session session = stripeService.createCheckoutSession(user, tier, cadence);
            return ResponseEntity.ok(Map.of("url", session.getUrl()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentSubscription(@AuthenticationPrincipal User user) {
        return subscriptionService.getSubscriptionForUser(user)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(Map.of("plan", "FREE", "status", "active")));
    }

    @PostMapping("/portal")
    public ResponseEntity<?> createPortalSession(@AuthenticationPrincipal User user) {
        try {
            Subscription sub = subscriptionService.getSubscriptionForUser(user)
                    .orElseThrow(() -> new RuntimeException("No active subscription found"));
            
            if (sub.getStripeCustomerId() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User does not have a Stripe customer record"));
            }

            String url = stripeService.createCustomerPortalSession(sub.getStripeCustomerId());
            return ResponseEntity.ok(Map.of("url", url));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
