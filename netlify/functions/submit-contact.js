const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  try {
    // Netlify envoie les données dans event.body sous forme de JSON
    const data = JSON.parse(event.body);
    
    // Log pour déboguer
    console.log('Received data:', JSON.stringify(data, null, 2));
    
    // Les données du formulaire sont dans data.data
    const formData = data.data;
    
    const msg = {
      to: 'contact@clartem.com',
      from: 'contact@clartem.com',
      subject: `Nouveau message de ${formData['first-name']} - ${formData.subject}`,
      replyTo: formData.email,
      html: `
        <p>Vous avez reçu un nouveau message depuis le formulaire de contact de clartem.com.</p><hr>
        <p><strong>Nom :</strong> ${formData['first-name']} ${formData['last-name']}</p>
        <p><strong>Email :</strong> ${formData.email}</p>
        <p><strong>Sujet :</strong> ${formData.subject}</p>
        <p><strong>Message :</strong></p>
        <p style="white-space: pre-wrap;">${formData.message}</p>
        ${formData['image-urls'] ? `<hr><p><strong>Fichiers joints :</strong> <br>${formData['image-urls'].split(', ').join('<br>')}</p>` : ''}
      `,
    };
    
    await sgMail.send(msg);
    console.log('Email sent successfully!');
    
    return { statusCode: 200, body: 'Email sent successfully!' };
  } catch (error) {
    console.error('Error details:', error);
    return { statusCode: 500, body: `Failed to send email: ${error.message}` };
  }
};
