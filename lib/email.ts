import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM || "Portfolio <onboarding@resend.dev>";
const ownerEmail = process.env.OWNER_EMAIL || "ar416.official@gmail.com";

const resend = apiKey ? new Resend(apiKey) : null;

type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

export async function sendEmail({ to, subject, html, replyTo }: SendArgs) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY missing — skipping send.");
    return { skipped: true };
  }
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
    replyTo,
  });
  if (error) {
    console.error("[email] Resend error:", error);
    throw new Error(error.message || "Email send failed");
  }
  return { id: data?.id, skipped: false };
}

export function ownerInbox() {
  return ownerEmail;
}

export function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const baseShell = (title: string, body: string) => `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background:#f5f5f7; padding:32px 16px;">
    <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.05);">
      <div style="background:linear-gradient(135deg,#FF5733,#FF6B4A); padding:24px 28px; color:#fff;">
        <div style="font-size:13px; opacity:0.9; letter-spacing:0.04em; text-transform:uppercase;">attaurrahman.dev</div>
        <div style="font-size:22px; font-weight:700; margin-top:4px;">${escapeHtml(title)}</div>
      </div>
      <div style="padding:28px; color:#0B1437; line-height:1.6; font-size:14px;">
        ${body}
      </div>
      <div style="background:#f9fafb; padding:14px 28px; color:#6B7280; font-size:11px; text-align:center;">
        Sent automatically from your portfolio · ${new Date().toLocaleString()}
      </div>
    </div>
  </div>
`;

export function contactNotificationHtml(input: {
  name: string;
  email: string;
  subject?: string | null;
  message: string;
}) {
  const body = `
    <p>You have a new message from your portfolio contact form:</p>
    <table cellpadding="0" cellspacing="0" style="width:100%; margin-top:12px; border-collapse:collapse;">
      <tr><td style="padding:8px 0; color:#6B7280; width:96px;">From</td><td style="padding:8px 0;"><strong>${escapeHtml(input.name)}</strong></td></tr>
      <tr><td style="padding:8px 0; color:#6B7280;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(input.email)}" style="color:#FF5733;">${escapeHtml(input.email)}</a></td></tr>
      ${input.subject ? `<tr><td style="padding:8px 0; color:#6B7280;">Subject</td><td style="padding:8px 0;">${escapeHtml(input.subject)}</td></tr>` : ""}
    </table>
    <div style="margin-top:18px; padding:16px; background:#f9fafb; border-radius:10px; white-space:pre-wrap;">${escapeHtml(input.message)}</div>
  `;
  return baseShell("New contact message", body);
}

export function meetingNotificationHtml(input: {
  name: string;
  email: string;
  slotStart: string;
  slotEnd: string;
  timezone: string;
  purpose?: string | null;
}) {
  const start = new Date(input.slotStart);
  const end = new Date(input.slotEnd);
  const body = `
    <p>A new meeting has been scheduled on your portfolio:</p>
    <table cellpadding="0" cellspacing="0" style="width:100%; margin-top:12px; border-collapse:collapse;">
      <tr><td style="padding:8px 0; color:#6B7280; width:120px;">Name</td><td style="padding:8px 0;"><strong>${escapeHtml(input.name)}</strong></td></tr>
      <tr><td style="padding:8px 0; color:#6B7280;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(input.email)}" style="color:#FF5733;">${escapeHtml(input.email)}</a></td></tr>
      <tr><td style="padding:8px 0; color:#6B7280;">When</td><td style="padding:8px 0;"><strong>${start.toUTCString()}</strong> → ${end.toUTCString()}</td></tr>
      <tr><td style="padding:8px 0; color:#6B7280;">Visitor TZ</td><td style="padding:8px 0;">${escapeHtml(input.timezone)}</td></tr>
    </table>
    ${input.purpose ? `<div style="margin-top:18px; padding:16px; background:#f9fafb; border-radius:10px; white-space:pre-wrap;">${escapeHtml(input.purpose)}</div>` : ""}
    <p style="margin-top:18px;">Open the <a href="${escapeHtml(process.env.NEXT_PUBLIC_SITE_URL || "https://attaurrahman.dev")}/admin" style="color:#FF5733; font-weight:600;">admin dashboard</a> to confirm or cancel.</p>
  `;
  return baseShell("New meeting scheduled", body);
}

export function meetingConfirmationHtml(input: {
  name: string;
  slotStart: string;
  slotEnd: string;
  timezone: string;
}) {
  const start = new Date(input.slotStart);
  const end = new Date(input.slotEnd);
  const body = `
    <p>Hi ${escapeHtml(input.name)},</p>
    <p>Thanks for booking a meeting with <strong>M. Atta Ur Rahman</strong>. Your slot is reserved:</p>
    <div style="margin-top:16px; padding:16px; background:#f9fafb; border-radius:10px;">
      <strong>${start.toUTCString()}</strong><br/>
      → ${end.toUTCString()}<br/>
      <span style="color:#6B7280; font-size:12px;">(submitted in ${escapeHtml(input.timezone)})</span>
    </div>
    <p style="margin-top:18px;">Atta will follow up shortly with a meeting link or to confirm. If anything changes on your end, just reply to this email.</p>
    <p style="margin-top:18px; color:#6B7280; font-size:13px;">— attaurrahman.dev</p>
  `;
  return baseShell("Meeting request received", body);
}
