require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // 🔥 Use Gmail App Password
      },
    });

    await transporter.sendMail({
      from: `"College App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
    });

    console.log("✅ OTP email sent successfully to:", email);

  } catch (error) {
    console.log("❌ Email sending failed:", error.message);
    throw error;
  }
};

module.exports = sendEmail;