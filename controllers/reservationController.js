// test console.log
// Importation des modèles nécessaires pour les réservations, voitures, utilisateurs, et images de voiture
import { Reservation, Car, User, CarImage } from "../models/index.js";
// Importation du service d'envoi d'email pour envoyer la confirmation après la création de la réservation
import { sendConfirmationEmail } from '../services/emailService.js';

// Fonction pour créer une nouvelle réservation
const createReservation = async (req, res) => {
  try {
    // Récupération de l'ID de l'utilisateur connecté (dérivé du token ou session)
    const userId = req.user.id;
    console.log("User ID:", userId);  // Vérifie l'ID de l'utilisateur connecté

    // Récupération des données de la réservation à partir de la requête
    const data = {
      startDate: req.body.startDate,  // Date de début de la réservation
      endDate: req.body.endDate,      // Date de fin de la réservation
      totalPrice: req.body.totalPrice, // Prix total de la réservation
      UserId: userId,                // L'ID de l'utilisateur qui fait la réservation
      CarId: req.body.CarId          // ID de la voiture réservée
    };
    console.log("Reservation Data:", data); // Vérifie les données de la réservation reçues

    // Création d'une nouvelle réservation dans la base de données
    const reservation = await Reservation.create(data);
    console.log("Reservation Created:", reservation); // Vérifie si la réservation a été créée

    // Récupération des détails de la voiture à partir de la base de données
    const car = await Car.findByPk(req.body.CarId, {
      include: [CarImage]  // Inclut les images associées à la voiture
    });
    console.log("Car Details:", car); // Vérifie si les détails de la voiture sont récupérés correctement

    // Vérification que la voiture existe dans la base de données
    if (!car) {
      console.log("Car not found for reservation");
      return res.status(404).json({ error: "Car not found for reservation" });
    }

    // Détails du client et de la voiture pour l'email de confirmation
    const client = await User.findByPk(req.user.id);
    console.log("Client Details:", client); // Vérifie les informations de l'utilisateur

    const clientEmail = client.email;  // L'email de l'utilisateur connecté
    const carDetails = {
      brand: car.brand,          // Marque de la voiture
      model: car.model,          // Modèle de la voiture
      years: car.years,          // Année de fabrication de la voiture
      pricePerDay: car.pricePerDay,  // Prix par jour de location
      imageURL: car.CarImages.length > 0 ? `https://react-autoeco-vighen.onrender.com${car.CarImages[0].imageURL}` : null // URL de l'image de la voiture
    };
    console.log("Car Details for Email:", carDetails); // Vérifie les détails envoyés dans l'email

    // Appel de la fonction d'envoi d'email
    await sendConfirmationEmail(clientEmail, {
      carDetails,
      startDate: data.startDate,
      endDate: data.endDate,
      totalPrice: data.totalPrice
    });
    console.log("Confirmation Email Sent"); // Vérifie si l'email a été envoyé

    // Réponse avec un statut 201 (créé) contenant la réservation nouvellement créée
    res.status(201).json(reservation);
  } catch (error) {
    // En cas d'erreur, on renvoie un statut 500 (erreur serveur) et le message d'erreur
    console.error("Error in createReservation:", error); // Affiche l'erreur si elle se produit
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour récupérer toutes les réservations existantes
const getAllReservations = async (req, res) => {
  try {
    // Récupération de toutes les réservations avec les détails des voitures et des utilisateurs associés
    const reservations = await Reservation.findAll({
      include: [
        { model: Car, include: CarImage }, // Inclut les images de la voiture associée à chaque réservation
        User // Inclut les informations de l'utilisateur associé à chaque réservation
      ]
    });
    console.log("All Reservations:", reservations); // Vérifie la liste des réservations récupérées
    // Réponse avec un statut 200 (succès) et la liste des réservations
    res.status(200).json(reservations);
  } catch (error) {
    // En cas d'erreur, on renvoie un statut 500 (erreur serveur) et le message d'erreur
    console.error("Error in getAllReservations:", error); // Affiche l'erreur si elle se produit
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour récupérer une réservation spécifique par son ID
const getReservationById = async (req, res) => {
  try {
    // Recherche de la réservation par son ID dans la requête
    const reservation = await Reservation.findByPk(req.params.id, {
      include: [Car, User] // Inclut les détails de la voiture et de l'utilisateur associés
    });
    console.log("Reservation by ID:", reservation); // Vérifie la réservation spécifique récupérée
    // Si la réservation n'est pas trouvée, renvoie une erreur 404
    if (!reservation) return res.status(404).json("Reservation not found!");
    // Réponse avec un statut 200 (succès) et les détails de la réservation
    res.status(200).json(reservation);
  } catch (error) {
    // En cas d'erreur, on renvoie un statut 500 (erreur serveur) et le message d'erreur
    console.error("Error in getReservationById:", error); // Affiche l'erreur si elle se produit
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour mettre à jour une réservation existante
const updateReservation = async (req, res) => {
  try {
    // Recherche de la réservation par son ID
    const reservation = await Reservation.findByPk(req.params.id);
    console.log("Reservation to Update:", reservation); // Vérifie la réservation à mettre à jour
    // Si la réservation n'existe pas, renvoie une erreur 404
    if (!reservation) return res.status(404).json("Reservation not found!");
    // Mise à jour de la réservation avec les nouvelles données de la requête
    await reservation.update(req.body);
    console.log("Updated Reservation:", reservation); // Vérifie la réservation mise à jour
    // Réponse avec un statut 200 (succès) et un message de confirmation
    res.status(200).json({
      message: "Reservation updated",
      reservation
    });
  } catch (error) {
    // En cas d'erreur, on renvoie un statut 500 (erreur serveur) et le message d'erreur
    console.error("Error in updateReservation:", error); // Affiche l'erreur si elle se produit
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour supprimer une réservation
const deleteReservation = async (req, res) => {
  try {
    // Suppression de la réservation en fonction de son ID
    const reservationDeleted = await Reservation.destroy({ where: { reservationID: req.params.id } });
    console.log("Reservation Deleted:", reservationDeleted); // Vérifie si la réservation a été supprimée
    // Si la réservation n'est pas trouvée, renvoie une erreur 404
    if (!reservationDeleted) return res.status(404).json("Reservation not found!");
    // Réponse avec un statut 200 (succès) et un message confirmant la suppression
    res.status(200).json({ message: "Reservation deleted" });
  } catch (error) {
    // En cas d'erreur, on renvoie un statut 500 (erreur serveur) et le message d'erreur
    console.error("Error in deleteReservation:", error); // Affiche l'erreur si elle se produit
    res.status(500).json({ error: error.message });
  }
};

// Exportation des différentes fonctions pour les rendre disponibles dans d'autres fichiers
export {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation
};


// // Importation des modèles nécessaires pour les réservations, voitures, utilisateurs, et images de voiture
// import { Reservation, Car, User, CarImage } from "../models/index.js";
// // Importation du service d'envoi d'email pour envoyer la confirmation après la création de la réservation
// import { sendConfirmationEmail } from '../services/emailService.js';

// // Fonction pour créer une nouvelle réservation
// const createReservation = async (req, res) => {
//   try {
//     // Récupération de l'ID de l'utilisateur connecté (dérivé du token ou session)
//     const userId = req.user.id;

//     // Récupération des données de la réservation à partir de la requête
//     const data = {
//       startDate: req.body.startDate,  // Date de début de la réservation
//       endDate: req.body.endDate,      // Date de fin de la réservation
//       totalPrice: req.body.totalPrice, // Prix total de la réservation
//       UserId: userId,                // L'ID de l'utilisateur qui fait la réservation
//       CarId: req.body.CarId          // ID de la voiture réservée
//     };

//     // Création d'une nouvelle réservation dans la base de données
//     const reservation = await Reservation.create(data);

//     // Récupération des détails de la voiture à partir de la base de données
//     const car = await Car.findByPk(req.body.CarId, {
//       include: [CarImage]  // Inclut les images associées à la voiture
//     });

//     // Vérification que la voiture existe dans la base de données
//     if (!car) {
//       return res.status(404).json({ error: "Car not found for reservation" });
//     }

//     // Détails du client et de la voiture pour l'email de confirmation
//     const client = await User.findByPk(req.user.id);
//     const clientEmail = client.email;  // L'email de l'utilisateur connecté
//     const carDetails = {
//       brand: car.brand,          // Marque de la voiture
//       model: car.model,          // Modèle de la voiture
//       years: car.years,          // Année de fabrication de la voiture
//       pricePerDay: car.pricePerDay,  // Prix par jour de location
//       imageURL: car.CarImages.length > 0 ? `https://react-autoeco-vighen.onrender.com${car.CarImages[0].imageURL}` : null // URL de l'image de la voiture
//     };

//     // Appel de la fonction d'envoi d'email
//     await sendConfirmationEmail(clientEmail, {
//       carDetails,
//       startDate: data.startDate,
//       endDate: data.endDate,
//       totalPrice: data.totalPrice
//     });
//     // Réponse avec un statut 201 (créé) contenant la réservation nouvellement créée
//     res.status(201).json(reservation);
//   } catch (error) {
//     // En cas d'erreur, on renvoie un statut 500 (erreur serveur) et le message d'erreur
//     res.status(500).json({ error: error.message });
//   }
// };

// // Fonction pour récupérer toutes les réservations existantes
// const getAllReservations = async (req, res) => {
//   try {
//     // Récupération de toutes les réservations avec les détails des voitures et des utilisateurs associés
//     const reservations = await Reservation.findAll({
//       include: [
//         { model: Car, include: CarImage }, // Inclut les images de la voiture associée à chaque réservation
//         User // Inclut les informations de l'utilisateur associé à chaque réservation
//       ]
//     });
//     // Réponse avec un statut 200 (succès) et la liste des réservations
//     res.status(200).json(reservations);
//   } catch (error) {
//     // En cas d'erreur, on renvoie un statut 500 (erreur serveur) et le message d'erreur
//     res.status(500).json({ error: error.message });
//   }
// };

// // Fonction pour récupérer une réservation spécifique par son ID
// const getReservationById = async (req, res) => {
//   try {
//     // Recherche de la réservation par son ID dans la requête
//     const reservation = await Reservation.findByPk(req.params.id, {
//       include: [Car, User] // Inclut les détails de la voiture et de l'utilisateur associés
//     });
//     // Si la réservation n'est pas trouvée, renvoie une erreur 404
//     if (!reservation) return res.status(404).json("Reservation not found!");
//     // Réponse avec un statut 200 (succès) et les détails de la réservation
//     res.status(200).json(reservation);
//   } catch (error) {
//     // En cas d'erreur, on renvoie un statut 500 (erreur serveur) et le message d'erreur
//     res.status(500).json({ error: error.message });
//   }
// };

// // Fonction pour mettre à jour une réservation existante
// const updateReservation = async (req, res) => {
//   try {
//     // Recherche de la réservation par son ID
//     const reservation = await Reservation.findByPk(req.params.id);
//     // Si la réservation n'existe pas, renvoie une erreur 404
//     if (!reservation) return res.status(404).json("Reservation not found!");
//     // Mise à jour de la réservation avec les nouvelles données de la requête
//     await reservation.update(req.body);
//     // Réponse avec un statut 200 (succès) et un message de confirmation
//     res.status(200).json({
//       message: "Reservation updated",
//       reservation
//     });
//   } catch (error) {
//     // En cas d'erreur, on renvoie un statut 500 (erreur serveur) et le message d'erreur
//     res.status(500).json({ error: error.message });
//   }
// };

// // Fonction pour supprimer une réservation
// const deleteReservation = async (req, res) => {
//   try {
//     // Suppression de la réservation en fonction de son ID
//     const reservationDeleted = await Reservation.destroy({ where: { reservationID: req.params.id } });
//     // Si la réservation n'est pas trouvée, renvoie une erreur 404
//     if (!reservationDeleted) return res.status(404).json("Reservation not found!");
//     // Réponse avec un statut 200 (succès) et un message confirmant la suppression
//     res.status(200).json({ message: "Reservation deleted" });
//   } catch (error) {
//     // En cas d'erreur, on renvoie un statut 500 (erreur serveur) et le message d'erreur
//     res.status(500).json({ error: error.message });
//   }
// };

// // Exportation des différentes fonctions pour les rendre disponibles dans d'autres fichiers
// export {
//   getAllReservations,
//   getReservationById,
//   createReservation,
//   updateReservation,
//   deleteReservation
// };

