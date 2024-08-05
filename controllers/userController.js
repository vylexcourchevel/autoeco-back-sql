// Import des modules nécessaires
import bcrypt from 'bcrypt'; // Pour le hachage et la comparaison des mots de passe
import jwt from 'jsonwebtoken'; // Pour la création et la vérification des JSON Web Tokens
import { User } from '../models/index.js'; // Import du modèle User pour interagir avec la base de données
import dotenv from 'dotenv'; // Pour charger les variables d'environnement depuis un fichier .env

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

// Fonction pour gérer la connexion des utilisateurs
const login = async (req, res) => {
    try {
        // Affiche l'email de l'utilisateur pour le débogage
        console.log("Logging in user with email:", req.body.email);

        // Rechercher l'utilisateur dans la base de données en fonction de l'email
        const user = await User.findOne({ where: { email: req.body.email } });
        
        // Si l'utilisateur n'est pas trouvé, renvoyer une réponse avec un code d'erreur 404
        if (!user) {
            console.log("User not found");
            return res.status(404).json("User not found!");
        }

        // Comparer le mot de passe fourni avec le mot de passe haché stocké dans la base de données
        const comparePassword = await bcrypt.compare(req.body.password, user.password);
        
        // Si le mot de passe est incorrect, renvoyer une réponse avec un code d'erreur 400
        if (!comparePassword) {
            console.log("Wrong Credentials");
            return res.status(400).json("Wrong Credentials!");
        }

        // Générer un JSON Web Token (JWT) pour l'utilisateur
        const token = jwt.sign(
            { id: user.id }, // Les données à inclure dans le token (ici, l'ID de l'utilisateur)
            process.env.TOKEN, // La clé secrète pour signer le token, stockée dans les variables d'environnement
            { expiresIn: "24h" } // Durée de validité du token (24 heures)
        );

        // Afficher le token créé pour le débogage
        console.log("Token created:", token);

        // Envoyer le token au client dans un cookie HTTP Only, avec une réponse de succès (code 200)
        res.cookie("access_token", token, {
             httpOnly: true,
             secure: process.env.NODE_ENV === 'production', // En production, le cookie sera envoyé uniquement sur HTTPS }).status(200).json(user);
             sameSite: 'None' // Nécessaire pour les requêtes cross-origin (à ajuster selon les besoins)
            }).status(200).json(user);
    } catch (e) {
        // En cas d'erreur, afficher l'erreur et renvoyer une réponse avec un code d'erreur 500
        console.log("Error in login:", e);
        res.status(500).json({ error: e.message });
    }
};




const register = async (req, res, next) => {
    try {
      // Hashage du mot de passe avec bcrypt, "10" est le nombre de tours de salage
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
      // Création d'un nouvel utilisateur dans la base de données avec les informations reçues et le mot de passe haché
      await User.create({
        // '...req.body' est une syntaxe de décomposition (spread syntax).
        // Elle permet de créer une copie de toutes les propriétés de 'req.body' et de les ajouter à l'objet en cours de création.
        ...req.body,
        password: hashedPassword
      });
  
      // Envoi d'une réponse avec le statut 201 (créé) et un message de confirmation
      res.status(201).json("User has been created!");
    } catch (error) {
      // Si une erreur se produit, passez-la au prochain middleware pour la gestion des erreurs
      next(error);
    }
  };
// Fonction pour ajouter un utilisateur
const add = async (req, res) => {
    try {
        const auteur = await User.create(req.body);
        res.status(201).json(auteur);
    } catch (error) {
        console.log("Error in add:", error);
        res.status(500).json({ error: error.message });
    }
};

// Fonction pour récupérer tous les utilisateurs
const getAll = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.log("Error in getAll:", error);
        res.status(500).json({ error: error.message });
    }
};

// Fonction pour récupérer un utilisateur par son ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json("User not found!");
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getUserById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Fonction pour mettre à jour un utilisateur
const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json("User not found!");
        await user.update(req.body);
        res.status(200).json({
            message: "User updated",
            user
        });
    } catch (error) {
        console.log("Error in updateUser:", error);
        res.status(500).json({ error: error.message });
    }
};

// Fonction pour supprimer un utilisateur
const deleteUser = async (req, res) => {
    try {
        const userDeleted = await User.destroy({ where: { userID: req.params.id } });
        if (!userDeleted) return res.status(404).json("User not found!");
        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        console.log("Error in deleteUser:", error);
        res.status(500).json({ error: error.message });
    }
};

// Fonction pour s'inscrire


// Export des fonctions
export {
    login,
    register,
    add,
    getAll,
    getUserById,
    updateUser,
    deleteUser,
};



// // userController.js
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import {User} from '../models/index.js';
// import dotenv from 'dotenv';

// dotenv.config();

// // Fonction pour se connecter
// const login = async (req, res) => {
//     try {
//         console.log("Logging in user with email:", req.body.email);
//         const user = await User.findOne({ where: { email: req.body.email } });
//         if (!user) {
//             console.log("User not found");
//             return res.status(404).json("User not found!");
//         }

//         const comparePassword = await bcrypt.compare(req.body.password, user.password);
//         if (!comparePassword) {
//             console.log("Wrong Credentials");
//             return res.status(400).json("Wrong Credentials!");
//         }

//         const token = jwt.sign(
//             { id: user.id },
//             process.env.TOKEN,
//             { expiresIn: "24h" }
//         );

//         console.log("Token created:", token);
//         res.cookie("access_token", token, { httpOnly: true }).status(200).json(user);
//     } catch (e) {
//         console.log("Error in login:", e);
//         res.status(500).json({ error: e.message });
//     }
// };
