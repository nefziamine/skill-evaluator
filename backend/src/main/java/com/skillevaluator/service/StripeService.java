package com.skillevaluator.service;

import com.skillevaluator.model.User;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class StripeService {

    @Value("${stripe.api.key}")
    private String secretKey;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${stripe.pricing.pro.monthly}")
    private String proMonthlyPriceId;

    @Value("${stripe.pricing.pro.annual}")
    private String proAnnualPriceId;

    @Value("${stripe.pricing.enterprise.monthly}")
    private String enterpriseMonthlyPriceId;

    @Value("${stripe.pricing.enterprise.annual}")
    private String enterpriseAnnualPriceId;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    public Session createCheckoutSession(User user, String tier, String cadence) throws Exception {
        String priceId = getPriceId(tier, cadence);

        Map<String, String> metadata = new HashMap<>();
        metadata.put("userId", user.getId().toString());
        metadata.put("plan", tier);

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setSuccessUrl(frontendUrl + "/recruiter/dashboard?checkout=success")
                .setCancelUrl(frontendUrl + "/pricing")
                .setCustomerEmail(user.getEmail())
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setPrice(priceId)
                        .setQuantity(1L)
                        .build())
                .putAllMetadata(metadata)
                .build();

        return Session.create(params);
    }

    public String createCustomerPortalSession(String stripeCustomerId) throws Exception {
        com.stripe.param.billingportal.SessionCreateParams params = 
            com.stripe.param.billingportal.SessionCreateParams.builder()
                .setCustomer(stripeCustomerId)
                .setReturnUrl(frontendUrl + "/recruiter/dashboard")
                .build();

        com.stripe.model.billingportal.Session session = com.stripe.model.billingportal.Session.create(params);
        return session.getUrl();
    }

    private String getPriceId(String tier, String cadence) {
        if ("PRO".equalsIgnoreCase(tier)) {
            return "annual".equalsIgnoreCase(cadence) ? proAnnualPriceId : proMonthlyPriceId;
        } else if ("ENTERPRISE".equalsIgnoreCase(tier)) {
            return "annual".equalsIgnoreCase(cadence) ? enterpriseAnnualPriceId : enterpriseMonthlyPriceId;
        }
        throw new IllegalArgumentException("Invalid plan tier: " + tier);
    }
}
