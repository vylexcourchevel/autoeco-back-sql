import express from 'express';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'; // Import de bcrypt pour le hashage des mots de passe

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
console.log('DB_URL:', dbUrl); // Vérification

// Initialiser l'application Express
const app = express();
const PORT = process.env.PORT || 8000; // Utilisation d'une valeur par défaut si PORT est undefined

// Connexion à la base de données avec Sequelize
const connection = new Sequelize(dbUrl, {
  dialect: 'mysql',
  logging: console.log, // Facultatif, pour activer les logs SQL
});
console.log(connection);

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
    await connection.sync({ alter: true }); // Synchronisation avec ALTER pour éviter la perte de données
    //await connection.sync();
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

// //FONCTIONNE OK 
// import express from 'express';
// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';
// import bcrypt from 'bcrypt'; // Import de bcrypt pour le hashage des mots de passe

// import carModel from './car.js';
// import carImageModel from './carImage.js';
// import paymentModel from './payment.js';
// import reservationModel from './reservation.js';
// import userModel from './user.js';

// dotenv.config();

// // Vérification de la variable d'environnement DB_URL
// const dbUrl = process.env.DB_URL;
// if (!dbUrl) {
//   console.error('Erreur critique : DB_URL est undefined');
//   process.exit(1); // Arrête le processus si la variable est manquante
// }
// console.log('DB_URL:', dbUrl); // Vérification

// // Initialiser l'application Express
// const app = express();
// const PORT = process.env.PORT || 8000; // Utilisation d'une valeur par défaut si PORT est undefined

// // Connexion à la base de données avec Sequelize
// const connection = new Sequelize(dbUrl, {
//   dialect: 'mysql',
//   logging: console.log, // Facultatif, pour activer les logs SQL
// });
// console.log(connection);

// // Authentification de la base de données
// (async () => {
//   try {
//     await connection.authenticate();
//     console.log('Connexion réussie à la base de données');
//   } catch (error) {
//     console.error('Impossible de se connecter à la base de données :', error);
//     process.exit(1); // Arrête le processus en cas d'échec de la connexion
//   }
// })();

// // Initialisation des modèles
// carModel(connection, Sequelize);
// carImageModel(connection, Sequelize);
// paymentModel(connection, Sequelize);
// reservationModel(connection, Sequelize);
// userModel(connection, Sequelize);

// // Définition des relations entre les modèles
// const { Car, CarImage, Payment, Reservation, User } = connection.models;

// User.hasMany(Reservation);
// Reservation.belongsTo(User);

// Reservation.hasMany(Payment);
// Payment.belongsTo(Reservation);

// Payment.belongsTo(User);
// User.hasMany(Payment);

// Car.hasMany(CarImage);
// CarImage.belongsTo(Car);

// Car.hasMany(Reservation);
// Reservation.belongsTo(Car);

// // Fonction pour créer un administrateur si nécessaire
// const createAdminIfNeeded = async () => {
//   try {
//     const adminExists = await User.findOne({ where: { isAdmin: true } });
//     if (!adminExists) {
//       const hashedPassword = await bcrypt.hash('password123', 10);
//       await User.create({
//         firstName: 'Vighen',
//         lastName: 'Admin',
//         email: 'vighen@hotmai.fr',
//         password: hashedPassword,
//         isAdmin: true,
//         address: '123 Rue Admin',
//         phoneNumber: '0000000000',
//       });
//       console.log('Administrateur créé avec succès.');
//     } else {
//       console.log('Un administrateur existe déjà.');
//     }
//   } catch (error) {
//     console.error('Erreur lors de la création de l\'administrateur :', error);
//   }
// };

// // Synchroniser les modèles et créer l'administrateur
// (async () => {
//   try {
//     await connection.sync({ alter: true }); // Synchronisation avec ALTER pour éviter la perte de données
//     console.log('Base de données synchronisée');
//     await createAdminIfNeeded(); // Appel de la fonction de création d'admin
//   } catch (error) {
//     console.error('Erreur lors de la synchronisation de la base de données :', error);
//     process.exit(1); // Arrête le processus si la synchronisation échoue
//   }
// })();

// export {
//   Car,
//   CarImage,
//   Payment,
//   Reservation,
//   User
// };

// TEST AJJOUT DE ADMIN TEMPORAIRE POUR ACCEDER A LA BDD 


// //index.js
// import express from 'express';
// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';  // Import dotenv pour charger les variables d'environnement

// import carModel from './car.js';
// import carImageModel from './carImage.js';
// import paymentModel from './payment.js';
// import reservationModel from './reservation.js';
// import userModel from './user.js';

// // Charger les variables d'environnement
// dotenv.config();

// // Initialiser l'application Express
// const app = express();
// const PORT = process.env.PORT ;

// // Connexion à la base de données avec les variables d'environnement
// const connection = new Sequelize(
//     process.env.DB_NAME,      // Nom de la base de données
//     process.env.DB_USER,      // Identifiant MySQL
//     process.env.DB_PASSWORD,  // Mot de passe MySQL
//     {
//         host: process.env.DB_HOST,    // URL de MySQL
//         dialect: process.env.DB_DIALECT,  // Type de base de données
//         port: process.env.DB_PORT, 
//         logging: console.log,         // Active les logs SQL (peut être désactivé en mettant `false`)
//     }
// );
// console.log('Nom de la base :', process.env.DB_NAME);
// console.log('Utilisateur :', process.env.DB_USER);
// console.log('Hôte :', process.env.DB_HOST);


// // Authentification et connexion à la base de données
// (async () => {
//     try {
//         await connection.authenticate();
//         console.log('Connexion réussie à la base de données');
//     } catch (error) {
//         console.error('Impossible de se connecter à la base de données :', error);
//     }
// })();

// // Création des connexions aux tables via les modèles
// carModel(connection, Sequelize);
// carImageModel(connection, Sequelize);
// paymentModel(connection, Sequelize);
// reservationModel(connection, Sequelize);
// userModel(connection, Sequelize);

// // Récupération des modèles créés
// const {
//     Car,
//     CarImage,
//     Payment,
//     Reservation,
//     User
// } = connection.models;

// // Définition des relations entre les modèles
// User.hasMany(Reservation);
// Reservation.belongsTo(User);

// Reservation.hasMany(Payment);
// Payment.belongsTo(Reservation);

// Payment.belongsTo(User);
// User.hasMany(Payment);

// Car.hasMany(CarImage);
// CarImage.belongsTo(Car);

// Car.hasMany(Reservation);
// Reservation.belongsTo(Car);

// // Synchroniser les modèles avec la base de données
// (async () => {
//   await connection.sync();
//    //sequelize.sync({ force: true })
//     console.log('Base de données synchronisée');
// })();

// // Exportation des modèles pour utilisation dans d'autres parties de l'application
// export {
//     Car,
//     CarImage,
//     Payment,
//     Reservation,
//     User
// };



// // // TEST RAJOUT variable d'environnement 


// // // src/models/index.js

// // import express from 'express';
// // //import multer from 'multer';

// // import { Sequelize } from 'sequelize';
// // import carModel from './car.js';
// // import carImageModel from './carImage.js';
// // // Importer d'autres modèles si nécessaire
// // import paymentModel from './payment.js';
// // import reservationModel from './reservation.js';
// // import userModel from './user.js';

// // // Initialiser l'application Express
// // const app = express();
// // const PORT = process.env.PORT;

// // // Nouvelle connexion à la base de données
// // const connection = new Sequelize(
// //     'autoeco', // Nom de la base de données
// //     'root', // Identifiant MySQL
// //     '', // Mot de passe MySQL
// //     {
// //         host: 'localhost', // URL de MySQL
// //         dialect: 'mysql', // Type de base de données
// //        // logging: console.log, // Active les logs SQL
// //     }
// // );

// // // Authentification et connexion à la base de données
// // try {
// //     await connection.authenticate();
// //     //await connection.sync({ force: true });
// // } catch (error) {
// //     console.error('Unable to connect to the database:', error);
// // }

// // // Création des connexions aux tables via les modèles
// // carModel(connection, Sequelize);
// // carImageModel(connection, Sequelize);
// // // carLocationModel(connection, Sequelize);
// // // carTypeModel(connection, Sequelize);
// // paymentModel(connection, Sequelize);
// // reservationModel(connection, Sequelize);
// // userModel(connection, Sequelize);

// // // Récupération des modèles créés
// // const {
// //     Car,
// //     CarImage,
// //     // CarLocation,
// //     // CarType,
// //     Payment,
// //     Reservation,
// //     User
// // } = connection.models;

// // // Définition des relations entre les modèles
// // User.hasMany(Reservation);
// // Reservation.belongsTo(User);

// // Reservation.hasMany(Payment);
// // Payment.belongsTo(Reservation);

// // Payment.belongsTo(User);
// // User.hasMany(Payment);

// // Car.hasMany(CarImage);
// // CarImage.belongsTo(Car);

// // Car.hasMany(Reservation);
// // Reservation.belongsTo(Car);

// // await connection.sync();
// //  //await connection.sync({alter: true});

// // // Démarrage du serveur
// // // app.listen(PORT, () => {
// // //     console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
// // // });

// // // Exportation des modèles pour utilisation dans d'autres parties de l'application
// // export {
// //     Car,
// //     CarImage,
// //     // CarLocation,
// //     // CarType,
// //     Payment,
// //     Reservation,
// //     User
// // };
















// // import { Sequelize } from "sequelize";
// //  import carModel from "./car.js";
// //  import carImageModel from "./carImage.js";
// // // import carLocationModel from "./carLocation.js";
// // // import carTypeModel from "./carType.js";
// // import paymentModel from "./payment.js";
// // import reservationModel from "./reservation.js";
// // import userModel from "./user.js";

// // // Nouvelle connexion à la base de données
// // const connection = new Sequelize(
// //     'autoeco', // Nom de la base de données
// //     'root', // Identifiant MySQL
// //     '', // Mot de passe MySQL
// //     {
// //         host: 'localhost', // URL de MySQL
// //         dialect: 'mysql' // Type de base de données
// //     }
// // );

// // // Authentification et connexion à la base de données
// // try {
// //     await connection.authenticate();
// //     console.log('Connection has been established successfully.');
// // } catch (error) {
// //     console.error('Unable to connect to the database:', error);
// // }

// // // Création des connexions aux tables via les modèles
// //  carModel(connection, Sequelize);
// //  carImageModel(connection, Sequelize);
// // // carLocationModel(connection, Sequelize);
// // // carTypeModel(connection, Sequelize);
// //  paymentModel(connection, Sequelize);
// //  reservationModel(connection, Sequelize);
// //  userModel(connection, Sequelize);

// // // Récupération des modèles créés
// // const {
// //      Car,
// //      Payment,
// //      Reservation,
// //      User,
// //      CarImage
// //       // CarImage,
// //  // CarLocation,
// //  // CarType,
// // } = connection.models;

// // // Définition des relations entre les modèles

// // User.hasMany(Reservation);
// // Reservation.belongsTo(User);

// // Reservation.hasMany(Payment);
// // Payment.belongsTo(Reservation);

// // Payment.belongsTo(User);
// // User.hasMany(Payment);

// // // Un Car peut avoir plusieurs CarImages
// // Car.hasMany(CarImage);
  
// //   // Une CarImage appartient à un Car
// // CarImage.belongsTo(Car);
  
  





// // // Définition du port pour le serveur
// // const PORT = process.env.PORT || 8000


// // // Synchronisation des modèles avec la base de données
// // await connection.sync();
// // console.log('Synchro OK');

// // // Exportation des modèles pour utilisation dans d'autres parties de l'application
// // export {
// //     Car,
// //   CarImage,
// // // CarLocation,
// // // CarType,
// //    Payment,
// //     Reservation,
// //     User
// // };
