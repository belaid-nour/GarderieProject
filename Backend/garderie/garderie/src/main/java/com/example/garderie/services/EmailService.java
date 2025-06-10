package com.example.garderie.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.SecureRandom;
import java.util.Random;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String to, String code) {
        sendEmail(to, "Code de vérification de votre email",
                "Bonjour,\n\nVotre code de vérification est : " + code +
                        "\n\nCe code est valable pendant 10 minutes.\n\n" +
                        "Si vous n'avez pas demandé cette vérification, ignorez cet email.\n\nCordialement,\nL'équipe de support");
    }

    public void sendNewPasswordEmail(String to, String newPassword) {
        sendEmail(to, "Votre nouveau mot de passe",
                "Bonjour,\n\nVotre nouveau mot de passe est : " + newPassword +
                        "\n\nPour votre sécurité :\n1. Connectez-vous immédiatement\n2. Changez le mot de passe\n\n" +
                        "Si vous n'avez pas demandé cette réinitialisation, contactez notre support.\n\nCordialement,\nL'équipe de support");
    }

    public void sendPasswordChangeConfirmation(String to) {
        sendEmail(to, "Confirmation de changement de mot de passe",
                "Bonjour,\n\nVotre mot de passe a été modifié avec succès.\n\n" +
                        "Si ce n'était pas vous, contactez immédiatement notre support.\n\nCordialement,\nL'équipe de support");
    }

    private void sendEmail(String to, String subject, String message) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(to);
            mailMessage.setSubject(subject);
            mailMessage.setText(message);
            mailMessage.setFrom(fromEmail);
            mailSender.send(mailMessage);
            log.info("Email envoyé à {}", to);
        } catch (Exception e) {
            log.error("Erreur lors de l'envoi de l'email à {}", to, e);
            throw new RuntimeException("Erreur lors de l'envoi de l'email");
        }
    }

    public String generateValidationCode() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }

    public String generateSecurePassword() {
        String upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lower = "abcdefghijklmnopqrstuvwxyz";
        String digits = "0123456789";
        String special = "!@#$%^&*_=+-/";
        String all = upper + lower + digits + special;

        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder();

        password.append(upper.charAt(random.nextInt(upper.length())));
        password.append(lower.charAt(random.nextInt(lower.length())));
        password.append(digits.charAt(random.nextInt(digits.length())));
        password.append(special.charAt(random.nextInt(special.length())));

        for (int i = 0; i < 8; i++) {
            password.append(all.charAt(random.nextInt(all.length())));
        }

        return shuffleString(password.toString());
    }

    private String shuffleString(String input) {
        char[] chars = input.toCharArray();
        SecureRandom random = new SecureRandom();
        for (int i = 0; i < chars.length; i++) {
            int j = random.nextInt(chars.length);
            char temp = chars[i];
            chars[i] = chars[j];
            chars[j] = temp;
        }
        return new String(chars);
    }
}
