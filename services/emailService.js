
// services/emailService.js

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();



const createTransporter = () => {
  console.log('Tentative de création du transporteur...');

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

try {
    if (transporter) {
      console.log('Transporteur cree avec succes');
      return transporter;
}

} catch (error) {
    console.error('Erreur lors de la creation du transporteur:', error);
  }

  } catch (error) {
    console.error('Erreur lors de la creation du transporteur:', error);
  }
};


const sendConfirmationEmail = async (recipientEmail, { carDetails, startDate, endDate, totalPrice }) => {
  console.log('Début de la fonction sendConfirmationEmail'); // Confirme que la fonction est appelée
  
  // Confirmer que les détails de l'email sont bien passés
  console.log('Détails de l\'email:', recipientEmail, carDetails, startDate, endDate, totalPrice);

  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to:  recipientEmail,
    subject: 'Confirmation de votre réservation de véhicule',
    html: `
      <h1>Votre réservation a été confirmée</h1>
      <p><strong>Marque de voiture:</strong> ${carDetails.brand}</p>
      <p><strong>Modèle de voiture:</strong> ${carDetails.model}</p>
      <p><strong>Année:</strong> ${carDetails.years}</p>
      <p><strong>Prix par jour:</strong> ${carDetails.pricePerDay} €</p>
      <p><strong>Image:</strong> <img src="${carDetails.imageURL}" alt="Car Image" /></p>
      <p><strong>Date de début:</strong> ${startDate}</p>
      <p><strong>Date de fin:</strong> ${endDate}</p>
      <p><strong>Prix total:</strong> ${totalPrice} €</p>
    `,
  };

  console.log('Options de l\'email prêtes:', mailOptions);

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès:', info);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
  }
};

export { sendConfirmationEmail };


// import nodemailer from 'nodemailer'; // Importation du module nodemailer pour l'envoi d'emails
// import dotenv from 'dotenv'; // Importation du module dotenv pour charger les variables d'environnement

// // Charger les variables d'environnement
// dotenv.config(); // Charge les variables d'environnement définies dans le fichier .env

// // Fonction pour créer un transporteur dynamique
// const createTransporter = (emailService) => {
//   // Cette fonction crée un transporteur d'email en fonction du service choisi (gmail, outlook, etc.)
//   switch (emailService) {
//     case 'gmail':  // Si le service choisi est Gmail
//       return nodemailer.createTransport({
//         service: 'gmail',  // Utilise le service Gmail
//         auth: {
//           user: process.env.EMAIL_USER, // Utilise l'email de l'expéditeur stocké dans les variables d'environnement
//           pass: process.env.EMAIL_PASS, // Utilise le mot de passe de l'email (ou mot de passe d'application pour Gmail)
//         },
//       });
//     case 'outlook':  // Si le service choisi est Outlook (Hotmail)
//       return nodemailer.createTransport({
//         service: 'hotmail',  // Utilise le service Hotmail/Outlook
//         auth: {
//           user: process.env.OUTLOOK_USER, // Utilise l'email de l'expéditeur stocké dans les variables d'environnement
//           pass: process.env.OUTLOOK_PASS, // Utilise le mot de passe de l'email (ou mot de passe d'application pour Outlook)
//         },
//       });
//     default:  // Si le service d'email n'est ni Gmail ni Outlook
//       throw new Error('Service de messagerie non pris en charge'); // Lance une erreur si le service est non supporté
//   }
// };

// // Fonction pour envoyer un email de confirmation
// const sendConfirmationEmail = async (recipientEmail, { carDetails, startDate, endDate, totalPrice }) => {
//   // La fonction envoie un email de confirmation avec les détails de la réservation.
  
//   const transporter = createTransporter('gmail'); // Crée un transporteur pour Gmail en appelant la fonction createTransporter
//   console.log('Transporteur créé:', transporter);


//   // Définition des options de l'email (destinataire, sujet, contenu, etc.)
//   const mailOptions = {
//     from: process.env.EMAIL_USER || process.env.OUTLOOK_USER, // L'email de l'expéditeur, récupéré des variables d'environnement
//     to: recipientEmail,            // L'email du destinataire (le client)
//     subject: 'Confirmation de votre réservation de véhicule', // Sujet de l'email
//     html: `  // Contenu HTML de l'email
//       <h1>Votre réservation a été confirmée</h1>
//       <p><strong>Marque de voiture:</strong> ${carDetails.brand}</p>  // Affiche la marque de la voiture
//       <p><strong>Modèle de voiture:</strong> ${carDetails.model}</p>  // Affiche le modèle de la voiture
//       <p><strong>Année:</strong> ${carDetails.years}</p>  // Affiche l'année de la voiture
//       <p><strong>Prix par jour:</strong> ${carDetails.pricePerDay} €</p>  // Affiche le prix par jour de la voiture
//       <p><strong>Image:</strong> <img src="${carDetails.imageURL}" alt="Car Image" /></p>  // Affiche l'image de la voiture
//       <p><strong>Date de début:</strong> ${startDate}</p>  // Affiche la date de début de la réservation
//       <p><strong>Date de fin:</strong> ${endDate}</p>  // Affiche la date de fin de la réservation
//       <p><strong>Prix total:</strong> ${totalPrice} €</p>  // Affiche le prix total de la réservation
//     `,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions); // Envoi de l'email avec les options définies
//     console.log('Email envoyé:', info); // Log l'information si l'email a été envoyé avec succès
//   } catch (error) {  // Si une erreur survient pendant l'envoi de l'email
//     console.error('Erreur lors de l\'envoi de l\'email:', error); // Log de l'erreur pour aider à déboguer
//   }
// };

// export { sendConfirmationEmail }; // Exporte la fonction sendConfirmationEmail pour qu'elle puisse être utilisée ailleurs dans l'application


// // services/emailService.js


// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// // Charger les variables d'environnement
// dotenv.config();

// // Fonction pour créer un transporteur dynamique
// const createTransporter = (emailService) => {
//   switch (emailService) {
//     case 'gmail':
//       return nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: process.env.EMAIL_USER, // Email de l'expéditeur
//           pass: process.env.EMAIL_PASS, // Mot de passe ou mot de passe d'application
//         },
//       });
//     case 'outlook':
//       return nodemailer.createTransport({
//         service: 'hotmail',
//         auth: {
//           user: process.env.OUTLOOK_USER, // Email de l'expéditeur
//           pass: process.env.OUTLOOK_PASS, // Mot de passe
//         },
//       });
//     default:
//       throw new Error('Service de messagerie non pris en charge');
//   }
// };

// // Fonction pour envoyer un email de confirmation
// const sendConfirmationEmail = async (recipientEmail, { carDetails, startDate, endDate, totalPrice }) => {
//   const transporter = createTransporter('gmail'); // Choisir le service d'email (ici Gmail)

//   const mailOptions = {
//     from: process.env.EMAIL_USER,  // L'email de l'expéditeur
//     to: recipientEmail,            // L'email du client
//     subject: 'Confirmation de votre réservation de véhicule',
//     html: `
//       <h1>Votre réservation a été confirmée</h1>
//       <p><strong>Marque de voiture:</strong> ${carDetails.brand}</p>
//       <p><strong>Modèle de voiture:</strong> ${carDetails.model}</p>
//       <p><strong>Année:</strong> ${carDetails.years}</p>
//       <p><strong>Prix par jour:</strong> ${carDetails.pricePerDay} €</p>
//       <p><strong>Image:</strong> <img src="${carDetails.imageURL}" alt="Car Image" /></p>
//       <p><strong>Date de début:</strong> ${startDate}</p>
//       <p><strong>Date de fin:</strong> ${endDate}</p>
//       <p><strong>Prix total:</strong> ${totalPrice} €</p>
//     `,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log('Email envoyé:', info);
//   } catch (error) {
//     console.error('Erreur lors de l\'envoi de l\'email:', error);
//   }
// };

// export { sendConfirmationEmail };
