import { Sequelize } from "sequelize";
 import carModel from "./car.js";
// import carImageModel from "./carImage.js";
// import carLocationModel from "./carLocation.js";
// import carTypeModel from "./carType.js";
import paymentModel from "./payment.js";
import reservationModel from "./reservation.js";
import userModel from "./user.js";

// Nouvelle connexion à la base de données
const connection = new Sequelize(
    'autoeco', // Nom de la base de données
    'root', // Identifiant MySQL
    '', // Mot de passe MySQL
    {
        host: 'localhost', // URL de MySQL
        dialect: 'mysql' // Type de base de données
    }
);

// Authentification et connexion à la base de données
try {
    await connection.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

// Création des connexions aux tables via les modèles
 carModel(connection, Sequelize);
// carImageModel(connection, Sequelize);
// carLocationModel(connection, Sequelize);
// carTypeModel(connection, Sequelize);
 paymentModel(connection, Sequelize);
reservationModel(connection, Sequelize);
userModel(connection, Sequelize);

// Récupération des modèles créés
const {
     Car,
     Payment,
     Reservation,
     User
      // CarImage,
 // CarLocation,
 // CarType,
} = connection.models;

// Définition des relations entre les modèles

User.hasMany(Reservation);
Reservation.belongsTo(User);

Reservation.hasMany(Payment);
Payment.belongsTo(Reservation);

Payment.belongsTo(User);
User.hasMany(Payment);





// Définition du port pour le serveur
const PORT = process.env.PORT || 8000


// Synchronisation des modèles avec la base de données
await connection.sync();
console.log('Synchro OK');

// Exportation des modèles pour utilisation dans d'autres parties de l'application
export {
    Car,
// CarImage,
// CarLocation,
// CarType,
   Payment,
    Reservation,
    User
};
