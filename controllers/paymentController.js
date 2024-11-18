// Importation des modèles Payment et Reservation depuis le dossier des modèles
import { Payment, Reservation } from "../models/index.js";

// Fonction pour créer un paiement
export const createPayment = async (req, res) => {
  try {
    // Création d'une nouvelle instance de paiement dans la base de données avec les données du corps de la requête
    const payment = await Payment.create(req.body);
    // Envoi d'une réponse avec un statut 201 (créé) contenant le paiement nouvellement créé
    res.status(201).json(payment);
  } catch (error) {
    // En cas d'erreur, réponse avec un statut 500 (erreur serveur) et le message d'erreur
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour obtenir tous les paiements
export const getAllPayments = async (req, res) => {
  try {
    // Récupération de tous les paiements en incluant les informations de réservation associées
    const payments = await Payment.findAll({
      include: [Reservation]
    });
    // Envoi de la liste de paiements avec un statut 200 (succès)
    res.status(200).json(payments);
  } catch (error) {
    // En cas d'erreur, réponse avec un statut 500 (erreur serveur) et le message d'erreur
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour mettre à jour un paiement existant
export const updatePayment = async (req, res) => {
  try {
    // Recherche du paiement par son identifiant (ID) dans la requête
    const payment = await Payment.findByPk(req.params.id);
    // Si le paiement n'est pas trouvé, renvoie une erreur 404 (non trouvé)
    if (!payment) return res.status(404).json("Payment not found!");
    // Mise à jour des informations du paiement avec les nouvelles données de la requête
    await payment.update(req.body);
    // Envoi d'une réponse avec un statut 200 (succès) et un message indiquant la mise à jour réussie
    res.status(200).json({
      message: "Payment updated",
      payment
    });
  } catch (error) {
    // En cas d'erreur, réponse avec un statut 500 (erreur serveur) et le message d'erreur
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour supprimer un paiement
export const deletePayment = async (req, res) => {
  try {
    // Suppression du paiement dans la base de données basé sur l'ID donné dans la requête
    const paymentDeleted = await Payment.destroy({ where: { paymendID: req.params.id } });
    // Si le paiement n'est pas trouvé, renvoie une erreur 404 (non trouvé)
    if (!paymentDeleted) return res.status(404).json("Payment not found!");
    // Envoi d'une réponse avec un statut 200 (succès) indiquant que le paiement a été supprimé
    res.status(200).json({ message: "Payment deleted" });
  } catch (error) {
    // En cas d'erreur, réponse avec un statut 500 (erreur serveur) et le message d'erreur
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour obtenir un paiement par son identifiant (ID)
export const getPaymentById = async (req, res) => {
  try {
    // Recherche d'un paiement par son ID, incluant les informations de réservation associées
    const payment = await Payment.findByPk(req.params.id, {
      include: [Reservation]
    });
    // Si le paiement n'est pas trouvé, renvoie une erreur 404 (non trouvé)
    if (!payment) return res.status(404).json("Payment not found!");
    // Envoi de la réponse avec un statut 200 (succès) et le paiement trouvé
    res.status(200).json(payment);
  } catch (error) {
    // En cas d'erreur, réponse avec un statut 500 (erreur serveur) et le message d'erreur
    res.status(500).json({ error: error.message });
  }
};
