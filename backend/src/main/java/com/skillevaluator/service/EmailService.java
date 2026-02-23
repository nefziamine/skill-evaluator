package com.skillevaluator.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendInvitation(String to, String inviteLink, String testTitle) {
        String subject = "Invitation to take assessment: " + testTitle;
        String content = "Hello,\n\n" +
                "You have been invited to take the assessment: " + testTitle + ".\n" +
                "Please use the following link to start your test:\n" +
                inviteLink + "\n\n" +
                "Good luck!";

        System.out.println("DEBUG: Sending invitation email to " + to);
        System.out.println("DEBUG: Content:\n" + content);

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(to);
                message.setSubject(subject);
                message.setText(content);
                mailSender.send(message);
                System.out.println("SUCCESS: Email sent to " + to);
            } catch (Exception e) {
                System.err.println("ERROR: Failed to send email to " + to + ": " + e.getMessage());
            }
        } else {
            System.out.println("WARNING: JavaMailSender not configured. Email NOT sent, only logged to console.");
        }
    }
}
