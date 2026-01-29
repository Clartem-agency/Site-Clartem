const brevo = require('@getbrevo/brevo');

exports.handler = async (event) => {
  // Vérification de sécurité
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // 1. Récupérer les données du formulaire Netlify
    // Netlify envoie les données dans event.body
    const payload = JSON.parse(event.body);
    const formData = payload.data; // Les champs du formulaire sont ici

    console.log("Données reçues :", formData);

    // 2. Configurer Brevo
    let defaultClient = brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let apiInstance = new brevo.TransactionalEmailsApi();
    let sendSmtpEmail = new brevo.SendSmtpEmail();

    // 3. Préparer l'email
    sendSmtpEmail.subject = `Nouveau contact de ${formData['first-name']} - ${formData.subject}`;
    
    // L'email que TU vas recevoir (ta boite pro)
    // MODIFIE ICI SI BESOIN (par défaut je mets celle de ton profil Brevo)
    sendSmtpEmail.to = [{ "email": "contact@clartem.com", "name": "Frédéric" }]; 

    // L'expéditeur (Doit être une adresse validée dans Brevo, utilise ton adresse pro)
    sendSmtpEmail.sender = { "email": "contact@clartem.com", "name": "Site Clartem" };

    // Le Reply-To (Pour que quand tu cliques sur "Répondre", ça réponde au visiteur)
    sendSmtpEmail.replyTo = { "email": formData.email, "name": `${formData['first-name']} ${formData['last-name']}` };

    // Le contenu HTML de l'email
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
    return { statusCode: 500, body: "Erreur interne" };
  }
};
