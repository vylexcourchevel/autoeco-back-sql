import express from 'express';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import carModel from './car.js';
import carImageModel from './carImage.js';
import paymentModel from './payment.js';
import reservationModel from './reservation.js';
import userModel from './user.js';

dotenv.config();

// Vérification de la variable d'environnement DB_URL
const dbUrl = process.env.DB_URL;
if (!dbUrl) {
  console.error('Erreur critique : DB_URL est undefined');
  process.exit(1); // Arrête le processus si la variable est manquante
}

// Connexion à la base de données avec Sequelize
const connection = new Sequelize(dbUrl, {
  dialect: 'mysql',
  logging: console.log, // Facultatif, pour activer les logs SQL
});

// Authentification de la base de données
(async () => {
  try {
    await connection.authenticate();
    console.log('Connexion réussie à la base de données');
  } catch (error) {
    console.error('Impossible de se connecter à la base de données :', error);
    process.exit(1); // Arrête le processus en cas d'échec de la connexion
  }
})();

// Initialisation des modèles
carModel(connection, Sequelize);
carImageModel(connection, Sequelize);
paymentModel(connection, Sequelize);
reservationModel(connection, Sequelize);
userModel(connection, Sequelize);

// Définition des relations entre les modèles
const { Car, CarImage, Payment, Reservation, User } = connection.models;

User.hasMany(Reservation);
Reservation.belongsTo(User);

Reservation.hasMany(Payment);
Payment.belongsTo(Reservation);

Payment.belongsTo(User);
User.hasMany(Payment);

Car.hasMany(CarImage);
CarImage.belongsTo(Car);

Car.hasMany(Reservation);
Reservation.belongsTo(Car);

// Synchroniser les modèles
(async () => {
  try {
    //await connection.sync({ alter: true }); // Synchronisation avec ALTER pour éviter la perte de données
    await connection.sync();
    console.log('Base de données synchronisée');
  } catch (error) {
    console.error('Erreur lors de la synchronisation de la base de données :', error);
    process.exit(1); // Arrête le processus si la synchronisation échoue
  }
})();

export {
  Car,
  CarImage,
  Payment,
  Reservation,
  User
};