package com.skillevaluator.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import jakarta.mail.internet.MimeMessage;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${brevo.api.key:}")
    private String brevoApiKey;

    @Value("${brevo.sender.email:verify@talent-platform.com}")
    private String senderEmail;

    @Value("${brevo.sender.name:Skill Evaluator Pro}")
    private String senderName;

    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    public void sendInvitation(String to, String inviteLink, String testTitle) {
        if (brevoApiKey != null && !brevoApiKey.isEmpty() && !brevoApiKey.startsWith("${")) {
            sendProfessionalBrevoEmail(to, inviteLink, testTitle);
        } else {
            sendBasicEmail(to, inviteLink, testTitle);
        }
    }

    private String getProfessionalHtmlTemplate(String inviteLink, String testTitle) {
        return "<!DOCTYPE html>" +
                "<html><body style='font-family: \"Inter\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif; line-height: 1.6; color: #334155; margin: 0; padding: 40px 20px; background-color: #f1f5f9; min-height: 100vh;'>" +
                "<div style='max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);'>" +
                "  <div style='background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 30px; text-align: center; border-bottom: 4px solid #3b82f6;'>" +
                "    <h1 style='color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;'>Skill Evaluator <span style='color: #3b82f6;'>Pro</span></h1>" +
                "    <p style='color: #94a3b8; font-size: 16px; margin: 10px 0 0 0;'>Technical Assessment Platform</p>" +
                "  </div>" +
                "  <div style='padding: 40px 40px;'>" +
                "    <h2 style='color: #0f172a; margin-top: 0; font-size: 24px; font-weight: 600;'>You've been invited!</h2>" +
                "    <p style='font-size: 16px; color: #475569;'>Hello,</p>" +
                "    <p style='font-size: 16px; color: #475569;'>You have been selected to participate in a professional technical assessment to showcase your skills.</p>" +
                "    <div style='background: #f8fafc; padding: 24px; border-radius: 8px; margin: 30px 0; border: 1px solid #e2e8f0; border-left: 4px solid #3b82f6;'>" +
                "      <p style='margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600;'>Assessment Title</p>" +
                "      <strong style='display: block; font-size: 20px; color: #0f172a; margin-top: 8px;'>" + testTitle + "</strong>" +
                "    </div>" +
                "    <p style='font-size: 16px; color: #475569;'>To begin your evaluation, please click the secure button below to set up your profile and start the test.</p>" +
                "    <div style='text-align: center; margin: 40px 0;'>" +
                "      <a href='" + inviteLink + "' style='background: #3b82f6; color: white; padding: 16px 40px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; display: inline-block; transition: all 0.2s ease;'>Accept Invitation & Start</a>" +
                "    </div>" +
                "    <div style='margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;'>" +
                "      <p style='color: #64748b; font-size: 13px; margin: 0;'>If the button doesn't work, copy and paste this link into your browser:</p>" +
                "      <p style='word-break: break-all; color: #3b82f6; font-size: 13px; margin-top: 5px;'>" + inviteLink + "</p>" +
                "    </div>" +
                "  </div>" +
                "  <div style='background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;'>" +
                "    <p style='font-size: 13px; color: #94a3b8; margin: 0;'>© 2026 Skill Evaluator Pro Platform. Confidential Communication.</p>" +
                "  </div>" +
                "</div>" +
                "</body></html>";
    }

    private void sendProfessionalBrevoEmail(String to, String inviteLink, String testTitle) {
        System.out.println("BREVO: Sending professional invitation to " + to);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", brevoApiKey);

            String htmlContent = getProfessionalHtmlTemplate(inviteLink, testTitle);

            Map<String, Object> body = new HashMap<>();
            body.put("sender", Map.of("name", senderName, "email", senderEmail));
            body.put("to", List.of(Map.of("email", to)));
            body.put("subject", "Invitation: Technical Assessment for " + testTitle);
            body.put("htmlContent", htmlContent);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            restTemplate.postForObject(BREVO_API_URL, entity, String.class);

            System.out.println("SUCCESS: Brevo professional email sent to " + to);
        } catch (Exception e) {
            System.err.println("ERROR: Failed to send Brevo email: " + e.getMessage());
            // Fallback to basic email
            sendBasicEmail(to, inviteLink, testTitle);
        }
    }

    private void sendBasicEmail(String to, String inviteLink, String testTitle) {
        String subject = "Invitation to take assessment: " + testTitle;
        String htmlContent = getProfessionalHtmlTemplate(inviteLink, testTitle);

        System.out.println("DEBUG: Sending basic invitation email to " + to);

        if (mailSender != null) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setTo(to);
                helper.setSubject(subject);
                helper.setText(htmlContent, true);
                mailSender.send(message);
                System.out.println("SUCCESS: Basic email sent to " + to);
            } catch (Exception e) {
                System.err.println("ERROR: Failed to send basic email to " + to + ": " + e.getMessage());
            }
        } else {
            System.out.println("WARNING: No email provider configured (Brevo or JavaMail). Email NOT sent.");
        }
    }
}
