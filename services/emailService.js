
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

    console.log('Transporteur créé avec successe.');
    return transporter;
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
