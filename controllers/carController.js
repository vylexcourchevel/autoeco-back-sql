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
const createCar = async (req, res) => {
  try {
    const carData = req.body;

    const car = await Car.create(carData);

    if (req.file) {
      const carImage = await car.createCarImage({
        imageURL: `/images/${req.file.filename}`,
      });
    }

    res.json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
