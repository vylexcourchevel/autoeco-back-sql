// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// dotenv.config();

// // Créer un objet transporteur à l'aide du transport SMTP
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: false, // false pour le port 587
//   auth: {
//     user: process.env.GMAIL_USER, // Utilise l'email depuis .env
//     pass: process.env.GMAIL_PASS  // Utilise le mot de passe depuis .env
//   },
// });

// // Configurer les options de l'email
// const mailOptions = {
//   from: 'vighen.agopoff@gmail.com', // Expéditeur
//   to: "vylex@hotmail.fr", // Destinataire
//   subject: 'Bonjour de Node.js', // Sujet de l'email
//   text: ' 2 eme test !', // Corps de l'email en texte brut
//   html: '<b>2 eme test !</b>', // Corps de l'email en HTML
// };

// // Fonction pour envoyer l'email
// const sendMail = async () => {
//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log('Email envoyé avec succès:', info.messageId);
//   } catch (error) {
//     console.error('Erreur lors de l\'envoi de l\'email:', error);
//   }
// };

// sendMail();


// import  nodemailer from 'nodemailer';


// // Charger les variables d'environnement
// import dotenv from 'dotenv';
// dotenv.config();


// // Créer un objet transporteur à l'aide du transport SMTP
// const transporter = nodemailer.createTransport({
//   service : 'gmail',
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: false, // false pour le port 587
//   auth: {
//     user: process.env.GMAIL_USER ,// Utilise l'email depuis .env
//     pass: process.env.GMAIL_PASS  // Utilise le mot de passe depuis .env
//   },
// });

// // Envoyer un e-mail
// const mailOptions = {
  
//   from: 'vighen.agopoff@gmail.com', // Expéditeur
//   to: "vylex@hotmail.fr", // Destinataire
//   subject: 'Bonjour de Node.js', // Sujet de l'email
//   text: 'Bonjour tout le monde !', // Corps de l'email en texte brut
//   html: '<b>Bonjour tout le monde !</b>', // Corps de l'email en HTML
// };
//  (error, info) => {
//   if (error) {
//     return console.log(error);
//   }
//   console.log('Message envoyé : %s', info.messageId);
// };
// const sendMail = async () => {
//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log('Email envoyé avec succès:', info);
//   } catch (error) {
//     console.error('Erreur lors de l\'envoi de l\'email:', error);
//   }
// };
// sendMail(transporter, mailOptions);