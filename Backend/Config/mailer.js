

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const SENDER_NAME = process.env.SENDER_NAME || "Coy Discover";

async function sendEmailViaBrevo({ to, name, subject, htmlContent }) {
  if (!BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is missing in .env");
  }
  if (!SENDER_EMAIL) {
    throw new Error("SENDER_EMAIL is missing in .env");
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: to, name: name || to }],
      subject,
      htmlContent,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("❌ Brevo API Error:", errorData);
    throw new Error(
      `Brevo rejected the request (status ${response.status}): ${errorData.message || "unknown"}`
    );
  }

  const data = await response.json();
  console.log("✅ Brevo accepted. Message ID:", data.messageId);
  return data;
}

export async function sendVerificationEmail(to, otp) {
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:480px;margin:auto;padding:24px;">
      <h2 style="color:#6D28D9;">Welcome to Coy Discover!</h2>
      <p>Your 6-digit verification code is:</p>
      <p style="font-size:36px;font-weight:bold;letter-spacing:10px;color:#EC4899;
                text-align:center;padding:16px;background:#FCE7F3;border-radius:12px;">
        ${otp}
      </p>
      <p style="color:#666;font-size:14px;">This code expires in 15 minutes.</p>
      <p style="color:#999;font-size:12px;">If you didn't request this, ignore this email.</p>
    </div>
  `;

  return sendEmailViaBrevo({
    to,
    name: to.split("@")[0],
    subject: "Your Coy Discover verification code",
    htmlContent: html,
  });
}