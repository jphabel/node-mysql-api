import axios from "axios";

export default async function sendEmail({
  to,
  subject,
  html,
  from = process.env.EMAIL_FROM,
}: any) {
  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        name: "Your App",
        email: from,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
    }
  );
}