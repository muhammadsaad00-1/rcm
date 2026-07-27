/**
 * Internal notification helper — sends alerts via Web3Forms to info@renoxmed.com.
 * Fire-and-forget: errors are logged but never thrown (notifications must not block the main response).
 */
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || '853dfd10-7eda-431a-86e3-78d0051d53da';
const NOTIFY_EMAIL = 'info@renoxmed.com';

async function sendNotification({ subject, body }) {
  try {
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        subject,
        from_name: 'RenoxMed Portal',
        email: NOTIFY_EMAIL,
        message: body,
      }),
    });
  } catch (err) {
    console.error('[notify] failed to send notification:', err.message);
  }
}

export async function notifyClaimDenied({ claimNumber, patientName, amount, reason, deniedBy }) {
  await sendNotification({
    subject: `⚠️ Claim Denied — ${claimNumber}`,
    body: `A claim has been denied and requires attention.\n\nClaim: ${claimNumber}\nPatient: ${patientName}\nAmount Denied: $${parseFloat(amount).toFixed(2)}\nReason: ${reason}\nRecorded by: ${deniedBy}\nDate: ${new Date().toLocaleString()}\n\nLog in to the portal to file an appeal: https://renoxmed.com/denials`,
  });
}

export async function notifyPaymentPosted({ paymentNumber, claimNumber, patientName, amount, type, postedBy }) {
  await sendNotification({
    subject: `✅ Payment Posted — ${paymentNumber}`,
    body: `A new payment has been posted to the system.\n\nPayment: ${paymentNumber}\nClaim: ${claimNumber}\nPatient: ${patientName}\nAmount: $${parseFloat(amount).toFixed(2)}\nType: ${type}\nPosted by: ${postedBy}\nDate: ${new Date().toLocaleString()}\n\nView in portal: https://renoxmed.com/payments`,
  });
}
