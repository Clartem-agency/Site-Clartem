const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const payload = JSON.parse(event.body).payload.data;
    const msg = {
      to: 'contact@clartem.com', // Votre email de destination
      from: 'contact@clartem.com', // Votre expéditeur vérifié sur SendGrid
      subject: `Nouveau message de ${payload['first-name']} - ${payload.subject}`,
      replyTo: payload.email,
      html: `
        <p>Vous avez reçu un nouveau message depuis le formulaire de contact de clartem.com.</p><hr>
        <p><strong>Nom :</strong> ${payload['first-name']} ${payload['last-name']}</p>
        <p><strong>Email :</strong> ${payload.email}</p>
        <p><strong>Sujet :</strong> ${payload.subject}</p>
        <p><strong>Message :</strong></p>
        <p style="white-space: pre-wrap;">${payload.message}</p>
        ${payload['image-urls'] ? `<hr><p><strong>Fichiers joints :</strong> <br>${payload['image-urls'].split(', ').join('<br>')}</p>` : ''}
      `,
    };
    await sgMail.send(msg);
    return { statusCode: 200, body: 'Email sent successfully!' };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: 'Failed to send email.' };
  }
};
