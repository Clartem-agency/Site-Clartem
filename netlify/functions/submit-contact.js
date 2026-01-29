const brevo = require('@getbrevo/brevo');

exports.handler = async (event) => {
  // Vérification de sécurité
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // 1. Récupérer les données du formulaire Netlify
    const payload = JSON.parse(event.body);
    const formData = payload.data;

    console.log("Données reçues :", formData);

    // 2. Configurer Brevo (SYNTAXE CORRIGÉE)
    let apiInstance = new brevo.TransactionalEmailsApi();
    
    // On attache la clé API directement à l'instance
    let apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let sendSmtpEmail = new brevo.SendSmtpEmail();

    // 3. Préparer l'email
    sendSmtpEmail.subject = `Nouveau contact de ${formData['first-name']} - ${formData.subject}`;
    
    // Ton adresse de réception
    sendSmtpEmail.to = [{ "email": "contact@clartem.com", "name": "Frédéric" }]; 

    // L'expéditeur (Validé dans Brevo)
    sendSmtpEmail.sender = { "email": "contact@clartem.com", "name": "Site Clartem" };

    // Le Reply-To (Email du visiteur)
    sendSmtpEmail.replyTo = { "email": formData.email, "name": `${formData['first-name']} ${formData['last-name']}` };

    // Le contenu HTML
    sendSmtpEmail.htmlContent = `
      <html><body>
        <h2>Nouveau message du site</h2>
        <p><strong>De :</strong> ${formData['first-name']} ${formData['last-name']}</p>
        <p><strong>Email :</strong> ${formData.email}</p>
        <p><strong>Sujet :</strong> ${formData.subject}</p>
        <hr>
        <p><strong>Message :</strong></p>
        <p style="white-space: pre-wrap;">${formData.message}</p>
      </body></html>
    `;

    // 4. Envoyer !
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email envoyé avec succès via Brevo');

    return { statusCode: 200, body: "Email sent" };

  } catch (error) {
    console.error('Erreur Brevo:', error);
    // On renvoie l'erreur précise pour le debug
    return { statusCode: 500, body: JSON.stringify(error) };
  }
};
