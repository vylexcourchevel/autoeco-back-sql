// Importation des modèles Car et CarImage depuis le répertoire des modèles
import { Car, CarImage } from "../models/index.js";

// Obtenir toutes les voitures
const getAllCars = async (req, res) => {
  try {
    // Rechercher toutes les voitures dans la base de données
    const cars = await Car.findAll();
    // Répondre avec les voitures trouvées en format JSON avec un code de statut 200 (OK)
    res.status(200).json(cars);
  } catch (error) {
    // Répondre avec une erreur et un code de statut 500 (Erreur interne du serveur) en cas de problème
    res.status(500).json({ error: error.message });
  }
};

// Obtenir une voiture par son ID
const getCarById = async (req, res) => {
  try {
    // Rechercher une voiture par sa clé primaire (ID) fournie dans les paramètres de la requête
    const car = await Car.findByPk(req.params.id);
    // Si la voiture n'est pas trouvée, répondre avec un message et un code de statut 404 (Non trouvé)
    if (!car) return res.status(404).json("Car not found!");
    // Répondre avec la voiture trouvée en format JSON avec un code de statut 200 (OK)
    res.status(200).json(car);
  } catch (error) {
    // Répondre avec une erreur et un code de statut 500 (Erreur interne du serveur) en cas de problème
    res.status(500).json({ error: error.message });
  }
};

// Créer une nouvelle voiture
const createCar = async (req, res) => {
  try {
    // Récupérer les données de la voiture à partir du corps de la requête
    const carData = req.body;
    // Si un fichier est téléchargé, ajouter le chemin de l'image à carData
    if (req.file) {
      carData.image = `/public/images/${req.file.filename}`; // Ajouter le chemin de l'image téléchargée
    }
    // Créer une nouvelle voiture dans la base de données avec les données fournies
    const car = await Car.create(carData);

    // Créer une nouvelle entrée dans CarImage avec l'URL de l'image et l'ID de la voiture
    const carImage = await CarImage.create({
      imageURL: carData.image,
      carId: car.id
    });

    // Afficher carImage dans la console pour le débogage
    console.log(carImage);
    // Répondre avec la voiture créée en format JSON
    res.json(car);
  } catch (error) {
    // Répondre avec une erreur et un code de statut 500 (Erreur interne du serveur) en cas de problème
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour une voiture existante
const updateCar = async (req, res) => {
  try {
    // Rechercher une voiture par sa clé primaire (ID) fournie dans les paramètres de la requête
    const car = await Car.findByPk(req.params.id);
    // Si la voiture n'est pas trouvée, répondre avec un message et un code de statut 404 (Non trouvé)
    if (!car) return res.status(404).json("Car not found!");

    // Récupérer les données mises à jour de la voiture à partir du corps de la requête
    const carData = req.body;
    // Si un fichier est téléchargé, ajouter le chemin de l'image à carData
    if (req.file) {
      carData.image = `/public/images/${req.file.filename}`; // Ajouter le chemin de l'image téléchargée
    }

    // Mettre à jour la voiture dans la base de données avec les nouvelles données
    await car.update(carData);
    // Répondre avec un message de succès et la voiture mise à jour en format JSON
    res.status(200).json({
      message: "Car updated",
      car
    });
  } catch (error) {
    // Répondre avec une erreur et un code de statut 500 (Erreur interne du serveur) en cas de problème
    res.status(500).json({ error: error.message });
  }
};

// Supprimer une voiture
const deleteCar = async (req, res) => {
  try {
    // Supprimer une voiture de la base de données par son ID
    const carDeleted = await Car.destroy({ where: { id: req.params.id } });
    // Si la voiture n'est pas trouvée, répondre avec un message et un code de statut 404 (Non trouvé)
    if (!carDeleted) return res.status(404).json("Car not found!");
    // Répondre avec un message de succès si la voiture est supprimée
    res.status(200).json({ message: "Car deleted" });
  } catch (error) {
    // Répondre avec une erreur et un code de statut 500 (Erreur interne du serveur) en cas de problème
    res.status(500).json({ error: error.message });
  }
};

// Exporter les fonctions pour les utiliser dans d'autres parties de l'application
export { getAllCars, getCarById, createCar, updateCar, deleteCar };
