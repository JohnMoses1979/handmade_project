package com.example.seller.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String fromEmail;

    public EmailService(
            JavaMailSender mailSender,
            @Value("${app.mail.from:${spring.mail.username:}}") String fromEmail
    ) {
        this.mailSender = mailSender;
        this.fromEmail = fromEmail;
    }

    public void sendOtp(String toEmail, String otp) {
        sendHtmlMail(
                toEmail,
                "SelfBusiness Password Reset OTP",
                buildOtpTemplate(otp)
        );
    }

    public void sendOtpEmail(String toEmail, String otp) {
        sendOtp(toEmail, otp);
    }

    public void sendApprovalMail(String toEmail, String sellerName) {
        sendHtmlMail(
                toEmail,
                "SelfBusiness Account Approved",
                buildApprovalTemplate(sellerName)
        );
    }

    public void sendRejectionMail(String toEmail, String sellerName, String reason) {
        sendHtmlMail(
                toEmail,
                "SelfBusiness Account Status Update",
                buildRejectionTemplate(sellerName, reason)
        );
    }

    private void sendHtmlMail(String toEmail, String subject, String htmlBody) {
        if (fromEmail == null || fromEmail.isBlank()) {
            throw new IllegalStateException("SMTP email sender is not configured");
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
        } catch (MailException | MessagingException ex) {
            throw new IllegalStateException("Unable to send email. Check SMTP configuration.", ex);
        }
    }

    private String buildOtpTemplate(String otp) {
        return wrapTemplate(
                "Password Reset Request",
                "Use the OTP below to reset your SelfBusiness seller account password.",
                "<div style=\"margin:24px 0;text-align:center;\">" +
                        "<div style=\"display:inline-block;padding:16px 28px;border-radius:18px;background:#082843;color:#ffffff;" +
                        "font-size:32px;font-weight:800;letter-spacing:8px;\">" + escapeHtml(otp) + "</div>" +
                        "</div>" +
                        "<p style=\"margin:0 0 12px 0;color:#334155;font-size:15px;line-height:1.7;\">" +
                        "This OTP is valid for <strong>10 minutes</strong>. If you did not request a password reset, you can safely ignore this email." +
                        "</p>",
                "#EA580C",
                "Reset OTP"
        );
    }

    private String buildApprovalTemplate(String sellerName) {
        return wrapTemplate(
                "Seller Account Approved",
                "Hello " + escapeHtml(sellerName) + ", your seller account has been approved successfully.",
                "<div style=\"margin:22px 0;padding:18px;border-radius:18px;background:#ECFDF5;border:1px solid #BBF7D0;\">" +
                        "<p style=\"margin:0 0 10px 0;color:#166534;font-size:16px;font-weight:700;\">You are now ready to sell on SelfBusiness.</p>" +
                        "<p style=\"margin:0;color:#334155;font-size:15px;line-height:1.7;\">" +
                        "You can now log in, add products, manage your store, and start receiving orders." +
                        "</p>" +
                        "</div>" +
                        "<div style=\"margin-top:20px;text-align:center;\">" +
                        "<span style=\"display:inline-block;padding:12px 22px;border-radius:999px;background:#082843;color:#ffffff;font-size:14px;font-weight:700;\">" +
                        "Approved Seller Access Enabled" +
                        "</span>" +
                        "</div>",
                "#16A34A",
                "Account Approved"
        );
    }

    private String buildRejectionTemplate(String sellerName, String reason) {
        return wrapTemplate(
                "Seller Application Update",
                "Hello " + escapeHtml(sellerName) + ", we reviewed your seller application.",
                "<div style=\"margin:22px 0;padding:18px;border-radius:18px;background:#FFF7ED;border:1px solid #FED7AA;\">" +
                        "<p style=\"margin:0 0 8px 0;color:#9A3412;font-size:16px;font-weight:700;\">Your account was not approved at this time.</p>" +
                        "<p style=\"margin:0;color:#334155;font-size:15px;line-height:1.7;\">" +
                        "<strong>Reason:</strong> " + escapeHtml(reason) +
                        "</p>" +
                        "</div>" +
                        "<p style=\"margin:0;color:#334155;font-size:15px;line-height:1.7;\">" +
                        "If you need help or want to reapply with corrected details, please contact support." +
                        "</p>",
                "#F97316",
                "Application Update"
        );
    }

    private String wrapTemplate(String eyebrow, String title, String bodyHtml, String accentColor, String badgeText) {
        return "<!DOCTYPE html>" +
                "<html><body style=\"margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;\">" +
                "<div style=\"max-width:640px;margin:0 auto;padding:28px 16px;\">" +
                "<div style=\"background:#ffffff;border-radius:28px;overflow:hidden;box-shadow:0 10px 30px rgba(8,40,67,0.08);\">" +
                "<div style=\"background:linear-gradient(135deg,#082843 0%,#0d3a5c 100%);padding:30px 28px;color:#ffffff;\">" +
                "<div style=\"display:inline-block;padding:7px 14px;border-radius:999px;background:rgba(255,255,255,0.14);font-size:12px;font-weight:700;letter-spacing:0.4px;\">" +
                escapeHtml(eyebrow) +
                "</div>" +
                "<h1 style=\"margin:18px 0 10px 0;font-size:28px;line-height:1.25;\">" + title + "</h1>" +
                "<p style=\"margin:0;color:rgba(255,255,255,0.82);font-size:15px;line-height:1.7;\">" +
                "SelfBusiness Seller Portal" +
                "</p>" +
                "</div>" +
                "<div style=\"padding:30px 28px;\">" +
                "<div style=\"display:inline-block;padding:8px 14px;border-radius:999px;background:" + accentColor + "18;color:" + accentColor + ";font-size:12px;font-weight:700;margin-bottom:16px;\">" +
                escapeHtml(badgeText) +
                "</div>" +
                "<p style=\"margin:0 0 12px 0;color:#0f172a;font-size:22px;font-weight:800;line-height:1.4;\">" +
                title +
                "</p>" +
                "<div style=\"margin:0 0 18px 0;color:#475569;font-size:15px;line-height:1.7;\">" +
                bodyHtml +
                "</div>" +
                "<div style=\"margin-top:28px;padding-top:18px;border-top:1px solid #e2e8f0;color:#64748b;font-size:13px;line-height:1.7;\">" +
                "Need help? Reply to this email or contact the SelfBusiness support team." +
                "<br/>Thank you for choosing SelfBusiness." +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</body></html>";
    }

    private String escapeHtml(String value) {
        if (value == null) {
            return "";
        }
        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
