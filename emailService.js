const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.office365.com",
  port: process.env.SMTP_PORT || 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false, // Helpful if you're on a self-managed server
  },
});

exports.sendAlert = async (url) => {
  try {
    const result = await transporter.sendMail({
      from: `"Site Monitor" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `Website Down: ${url}`,
      text: `The website ${url} is currently unreachable.`,
    });
    console.log(`✅ Email sent: ${result.response}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};

// Test block (only runs if this file is executed directly)
if (require.main === module) {
  exports.sendAlert("https://fake-site-test.com")
    .then(() => console.log("✅ Test alert complete."))
    .catch((err) => console.error("❌ Test alert failed:", err));
}

