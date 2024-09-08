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
    console.log(req.file);
    
    const car = await Car.create(carData);
    console.log(car);

    if (req.file) {
      const carImage = await car.createCarImage({
        imageURL: `/images/${req.file.filename}`,
      });
      console.log('Image saved:', carImage);
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
    console.log('Données reçues pour mise à jour:', carData);

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
      console.log('Image mise à jour:', carImage);
    }

    // Rechercher les données mises à jour pour confirmer
    const updatedCar = await Car.findByPk(req.params.id, { include: CarImage });
    console.log('Voiture après mise à jour:', updatedCar);

    res.status(200).json({
      message: "Car updated",
      car: updatedCar // Retourne la version actualisée de la voiture avec l'image
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
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



//controllers/carController.js VERSION TEST
// // controllers/carController.js
// // Importation des modèles Car et CarImage depuis le répertoire des modèles
// import { Car, CarImage } from "../models/index.js";

// // Obtenir toutes les voitures
// const getAllCars = async (req, res) => {
//   try {
//     const cars = await Car.findAll({ include: CarImage });
//     res.status(200).json(cars);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Obtenir une voiture par son ID
// const getCarById = async (req, res) => {
//   try {
//     const car = await Car.findByPk(req.params.id, { include: CarImage });
//     if (!car) return res.status(404).json("Car not found!");
//     res.status(200).json(car);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Créer une nouvelle voiture
// const createCar = async (req, res) => {
//   try {
//     const carData = req.body;
//     console.log(req.file);
    
//     const car = await Car.create(carData);
//     console.log(car);

//     if (req.file) {
//       const carImage = await car.createCarImage({
//         imageURL: `/images/${req.file.filename}`,
//       });
//       console.log('Image saved:', carImage);
//     }

//     res.json(car);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Mettre à jour une voiture existante

// const updateCar = async (req, res) => {
 
//   try {
//     const carData = req.body;
//     console.log('Données reçues pour mise à jour:', carData);
 
    
//     if (req.file) {
//       carData.image = `/public/images/${req.file.filename}`;
//     }

//     // Utilisation de update avec la clause where
//     const [updated] = await Car.update(carData, {
//       where: { id: req.params.id }
//     });

//     if (!updated) return res.status(404).json("Car not found!");

//     // Récupérer les données mises à jour pour confirmer
//     const updatedCar = await Car.findByPk(req.params.id);
//     console.log('Voiture après mise à jour:', updatedCar);

//     res.status(200).json({
//       message: "Car updated",
//       car: updatedCar // Retourne la version actualisée de la voiture
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// // Supprimer une voiture
// const deleteCar = async (req, res) => {
//   try {
//     const carDeleted = await Car.destroy({ where: { id: req.params.id } });
//     if (!carDeleted) return res.status(404).json("Car not found!");
//     res.status(200).json({ message: "Car deleted" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Exporter les fonctions pour les utiliser dans d'autres parties de l'application
// export { getAllCars, getCarById, createCar, updateCar, deleteCar };




// //controllers/carController.js VERSION TEST
// // controllers/carController.js
// // Importation des modèles Car et CarImage depuis le répertoire des modèles
// import { Car, CarImage } from "../models/index.js";

// // Obtenir toutes les voitures
// const getAllCars = async (req, res) => {
//   try {
//     const cars = await Car.findAll({ include: CarImage });
//     res.status(200).json(cars);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Obtenir une voiture par son ID
// const getCarById = async (req, res) => {
//   try {
//     const car = await Car.findByPk(req.params.id, { include: CarImage });
//     if (!car) return res.status(404).json("Car not found!");
//     res.status(200).json(car);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Créer une nouvelle voiture
// const createCar = async (req, res) => {
//   try {
//     const carData = req.body;
//     console.log(req.file);
    
//     const car = await Car.create(carData);
//     console.log(car);

//     if (req.file) {
//       const carImage = await car.createCarImage({
//         imageURL: `/images/${req.file.filename}`,
//       });
//       console.log('Image saved:', carImage);
//     }

//     res.json(car);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Mettre à jour une voiture existante

// const updateCar = async (req, res) => {
 
//   try {
//     const carData = req.body;
//     console.log('Données reçues pour mise à jour:', carData);
 
    
//     if (req.file) {
//       carData.image = `/public/images/${req.file.filename}`;
//     }

//     // Utilisation de update avec la clause where
//     const [updated] = await Car.update(carData, {
//       where: { id: req.params.id }
//     });

//     if (!updated) return res.status(404).json("Car not found!");

//     // Récupérer les données mises à jour pour confirmer
//     const updatedCar = await Car.findByPk(req.params.id);
//     console.log('Voiture après mise à jour:', updatedCar);

//     res.status(200).json({
//       message: "Car updated",
//       car: updatedCar // Retourne la version actualisée de la voiture
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// // Supprimer une voiture
// const deleteCar = async (req, res) => {
//   try {
//     const carDeleted = await Car.destroy({ where: { id: req.params.id } });
//     if (!carDeleted) return res.status(404).json("Car not found!");
//     res.status(200).json({ message: "Car deleted" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Exporter les fonctions pour les utiliser dans d'autres parties de l'application
// export { getAllCars, getCarById, createCar, updateCar, deleteCar };





// //controllers/carController.js VERSION OK !!!
// // Importation des modèles Car et CarImage depuis le répertoire des modèles VERSION OK !!! 
// import { Car, CarImage } from "../models/index.js";

// // Obtenir toutes les voitures
// const getAllCars = async (req, res) => {
//   try {
//     // Rechercher toutes les voitures dans la base de données
//     const cars = await Car.findAll({include: CarImage});
//     // Répondre avec les voitures trouvées en format JSON avec un code de statut 200 (OK)
//     res.status(200).json(cars);
//   } catch (error) {
//     // Répondre avec une erreur et un code de statut 500 (Erreur interne du serveur) en cas de problème
//     res.status(500).json({ error: error.message });
//   }
// };

// // Obtenir une voiture par son ID
// const getCarById = async (req, res) => {
//   try {
//     // Rechercher une voiture par sa clé primaire (ID) fournie dans les paramètres de la requête
//     const car = await Car.findByPk(req.params.id, {include: CarImage});
//     // Si la voiture n'est pas trouvée, répondre avec un message et un code de statut 404 (Non trouvé)
//     if (!car) return res.status(404).json("Car not found!");
//     // Répondre avec la voiture trouvée en format JSON avec un code de statut 200 (OK)
//     res.status(200).json(car);
//   } catch (error) {
//     // Répondre avec une erreur et un code de statut 500 (Erreur interne du serveur) en cas de problème
//     res.status(500).json({ error: error.message });
//   }
// };

// // Créer une nouvelle voiture
// const createCar = async (req, res) => {
//   console.log('test');
//   try {
//     // Récupérer les données de la voiture à partir du corps de la requête
//     const carData = req.body;
//     console.log(req.file);
//     // Si un fichier est téléchargé, ajouter le chemin de l'image à carData
//     // if (req.file) {
//       // carData.image = `/public/images/${req.file.filename}`; // Ajouter le chemin de l'image téléchargée
//     // }
//     console.log(carData)
//     // Créer une nouvelle voiture dans la base de données avec les données fournies
//     const car = await Car.create(carData);
//     console.log(car);

//     const carImage = await car.createCarImage({
//       imageURL: `/images/${req.file.filename}`,
//     });
//     // Créer une nouvelle entrée dans CarImage avec l'URL de l'image et l'ID de la voiture
   
//     console.log('post saved carImage');

//     // Afficher carImage dans la console pour le débogage
//     // Répondre avec la voiture créée en format JSON
//     res.json(car);
//   } catch (error) {
//     // Répondre avec une erreur et un code de statut 500 (Erreur interne du serveur) en cas de problème
//     res.status(500).json({ error: error.message });
//   }
// };

// // Mettre à jour une voiture existante
// const updateCar = async (req, res) => {
//   try {
//     // Rechercher une voiture par sa clé primaire (ID) fournie dans les paramètres de la requête
//     const car = await Car.findByPk(req.params.id);
//     // Si la voiture n'est pas trouvée, répondre avec un message et un code de statut 404 (Non trouvé)
//     if (!car) return res.status(404).json("Car not found!");

//     // Récupérer les données mises à jour de la voiture à partir du corps de la requête
//     const carData = req.body;
//     // Si un fichier est téléchargé, ajouter le chemin de l'image à carData
//     if (req.file) {
//       carData.image = `/public/images/${req.file.filename}`; // Ajouter le chemin de l'image téléchargée
//     }

//     // Mettre à jour la voiture dans la base de données avec les nouvelles données
//     await car.update(carData);
//     // Répondre avec un message de succès et la voiture mise à jour en format JSON
//     res.status(200).json({
//       message: "Car updated",
//       car
//     });
//   } catch (error) {
//     // Répondre avec une erreur et un code de statut 500 (Erreur interne du serveur) en cas de problème
//     res.status(500).json({ error: error.message });
//   }
// };

// // Supprimer une voiture
// const deleteCar = async (req, res) => {
//   console.log('test');
//   try {
//     // Supprimer une voiture de la base de données par son ID
//     const carDeleted = await Car.destroy({ where: { id: req.params.id } });
//     // Si la voiture n'est pas trouvée, répondre avec un message et un code de statut 404 (Non trouvé)
//     if (!carDeleted) return res.status(404).json("Car not found!");
//     // Répondre avec un message de succès si la voiture est supprimée
//     res.status(200).json({ message: "Car deleted" });
//   } catch (error) {
//     // Répondre avec une erreur et un code de statut 500 (Erreur interne du serveur) en cas de problème
//     res.status(500).json({ error: error.message });
//   }
// };

// // Exporter les fonctions pour les utiliser dans d'autres parties de l'application
// export { getAllCars, getCarById, createCar, updateCar, deleteCar };
