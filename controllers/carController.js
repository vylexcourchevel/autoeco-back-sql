//controllers/carController.js VERSION OK TOUT FONCTIONNE 
// controllers/carController.js
// Importation des modèles Car et CarImage depuis le répertoire des modèles
import { Car, CarImage } from "../models/index.js";

// Obtenir toutes les voitures
const getAllCars = async (req, res) => {
  try {
    const cars = await Car.findAll({ include: CarImage });
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir une voiture par son ID
const getCarById = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id, { include: CarImage });
    if (!car) return res.status(404).json("Car not found!");
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Créer une nouvelle voiture
// conconst createCar = async (req, res) => {
  const createCar = async (req, res) => {
    try {
      const available = req.body.available ? parseInt(req.body.available, 10) : 0;
  
      // Créer la voiture dans la base de données
      const newCar = await Car.create({
        brand: req.body.brand,
        model: req.body.model,
        registrationPlate: req.body.registrationPlate,
        years: parseInt(req.body.years, 10),
        pricePerDay: parseFloat(req.body.pricePerDay),
        available,
      });
  
      // Vérifier si des fichiers d'image sont envoyés avec la requête
      if (req.files && req.files.length > 0) {
        const imagePromises = req.files.map(file => {
          // Créer une image associée à la voiture
          return CarImage.create({
            imageURL: `/images/${file.filename}`, // L'URL de l'image
            CarId: newCar.id, // Lier l'image à la voiture nouvellement créée
          });
        });
  
        // Attendre que toutes les images soient ajoutées
        await Promise.all(imagePromises);
      }
  
      // Répondre avec les données de la voiture créée
      res.status(201).json({
        message: "Car created successfully",
        car: newCar,
        images: req.files ? req.files.map(file => `/images/${file.filename}`) : [],
      });
    } catch (error) {
      console.error('Error during car creation:', error);
      res.status(500).json({ error: 'An error occurred while creating the car.' });
    }
  };

// Mettre à jour une voiture existante
const updateCar = async (req, res) => {
  try {
    const carData = req.body;

    // Rechercher la voiture à mettre à jour
    const car = await Car.findByPk(req.params.id);
    if (!car) return res.status(404).json("Car not found!");

    // Mettre à jour les données du véhicule
    await car.update(carData);

    // Gérer la mise à jour de l'image
    if (req.file) {
      const imageURL = `/images/${req.file.filename}`;

      // Trouver ou créer l'image associée à la voiture
      let carImage = await CarImage.findOne({ where: { CarId: car.id } });
      if (carImage) {
        // Mettre à jour l'image existante
        carImage.imageURL = imageURL;
        await carImage.save();
      } else {
        // Créer une nouvelle image associée à la voiture
        carImage = await CarImage.create({
          imageURL: imageURL,
          CarId: car.id
        });
      }
    }

    // Rechercher les données mises à jour pour confirmer
    const updatedCar = await Car.findByPk(req.params.id, { include: CarImage });

    res.status(200).json({
      message: "Car updated",
      car: updatedCar // Retourne la version actualisée de la voiture avec l'image
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer une voiture
const deleteCar = async (req, res) => {
  try {
    const carDeleted = await Car.destroy({ where: { id: req.params.id } });
    if (!carDeleted) return res.status(404).json("Car not found!");
    res.status(200).json({ message: "Car deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Exporter les fonctions pour les utiliser dans d'autres parties de l'application
export { getAllCars, getCarById, createCar, updateCar, deleteCar };
