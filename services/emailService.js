// // services/emailService.js TEST console.log 
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const createTransporter = () => {
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

    return transporter;
  } catch (error) {
    console.error('Erreur lors de la création du transporteur:', error.message);
    throw error; // Re-lancer l'erreur pour remonter dans l'appel
  }
};

const sendConfirmationEmail = async (recipientEmail, { carDetails, startDate, endDate, totalPrice }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: recipientEmail,
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

  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error.message);
    if (error.response) {
      console.error('Réponse du serveur SMTP:', error.response);
    }
  }
};

export { sendConfirmationEmail };
