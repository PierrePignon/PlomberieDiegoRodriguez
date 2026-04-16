import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_f8gw1vd';
const TEMPLATE_ID = 'template_02l5aar';
const PUBLIC_KEY = 'I-kA2IfWnP3BGeGgR';

/**
 * Envoie un email via EmailJS.
 * Le template EmailJS doit contenir les variables : {{to_email}}, {{subject}}, {{message}}
 */
export async function sendEmail({ to, subject, body }) {
  console.log('EmailJS config:', { SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY: PUBLIC_KEY ? 'OK' : 'MISSING' });
  const result = await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      email: to,
      to_email: to,
      subject: subject,
      message: body,
    },
    PUBLIC_KEY
  );
  console.log('EmailJS result:', result);
  return result;
}
