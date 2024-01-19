import { createTransport, } from 'nodemailer';

const transport = createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  secure: false,
  auth: {
    // type: process.env.SMTP_AUTH_TYPE,
    user: process.env.SMTP_AUTH_USER,
    pass: process.env.SMTP_AUTH_PASS,
  },
  requireTLS: false,
  pool: true,
  maxConnections: +process.env.SMTP_MAX_CONNECTIONS,
  maxMessages: +process.env.SMTP_MAX_MESSAGES,
});

export async function sendEmail(payload) {
  const isVerifiedConnection = await verify();
  if (!isVerifiedConnection) {
    return false;
  }

  const sendedEmailResult = await transport.sendMail({
    from: payload?.from ?? process.env.SMTP_AUTH_USER,
    to: payload?.to,
    subject: payload?.subject,
    cc: payload?.cc ,
    html: payload?.html,
  });

  if (!sendedEmailResult) {
    return false;
  }

  return true;
};

async function verify() {
  return await transport.verify();
}