
// userController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {User} from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

// Fonction pour se connecter
const login = async (req, res) => {
    try {
        console.log("Logging in user with email:", req.body.email);
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) {
            console.log("User not found");
            return res.status(404).json("User not found!");
        }

        const comparePassword = await bcrypt.compare(req.body.password, user.password);
        if (!comparePassword) {
            console.log("Wrong Credentials");
            return res.status(400).json("Wrong Credentials!");
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.TOKEN,
            { expiresIn: "24h" }
        );

        console.log("Token created:", token);
        res.cookie("access_token", token, { httpOnly: true }).status(200).json(user);
    } catch (e) {
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



// // Importation de User depuis models/index.js
// import jwt from "jsonwebtoken";
// import { User } from "../models/index.js";
// import {env} from "../config.js";
// import bcrypt from "bcrypt";







// const login = async (req, res) => {
//     try {
//         // Recherche l'user dans la base de données par son email
//         const user = await User.findOne({
//             where:
//                 { email: req.body.email }
//         });
//         // Si l'user n'est pas trouvé, renvoie une erreur 404
//         if (!user) return res.status(404).json("User not found !");

//         /* 
//           Compare le mot de passe fourni dans la requête
//           avec le mot de passe de l'utilisateur (qui est dans la bdd)
//         */
//         const comparePassword = await bcrypt.compare(
//             req.body.password,
//             user.password
//         );
//         /* 
//           Si le mot de passe est incorrect, renvoie une erreur 400.
//         */
//         if (!comparePassword) return res.status(400).json("Wrong Credentials ! ");

//         // Crée un jeton JWT pour l'utilisateur avec son ID,
//         // expire après 24 heures
//         const token = jwt.sign(
//             // Le premier argument est la charge utile du token.
//             // Ici, nous incluons l'ID de l'utilisateur
//             { id: user.id },
//             // Le deuxième argument est la clé secrète,
//             // qui est utilisée pour signer le token.
//             // Nous la récupérons à partir
//             // des variables d'environnement
//             env.token,
//             // Le troisième argument est un objet
//             // contenant les options du token.
//             // Ici, nous définissons une durée
//             // d'expiration de 24 heures pour le token
//             { expiresIn: "24h" }
//         );

//         // envoi le jeton (token) JWT sous forme de cookie HTTPOnly
//         res
//             .cookie("access_token", token, { httpOnly: true })
//             .status(200)
//             .json(user);
//     } catch (e) {
//         console.log(e);
//     }
// }

// const register = async (req, res, next) => {
//     // Début du bloc try pour la gestion des erreurs
//     try {
//         // Hashage du mot de passe avec bcrypt,
//         // "10" est le nombre de tours de salage
//         const hashedPassword = await bcrypt.hash(req.body.password, 10);

//         // Création d'un nouvel utilisateur dans la base de données
//         // avec les informations reçues et le mot de passe haché
//         await User.create({
//             // '...req.body' est une syntaxe de
//             // décomposition (spread syntax).
//             // Elle permet de créer une copie
//             // de toutes les propriétés
//             // de 'req.body' et de les ajouter à l'objet
//             // en cours de création.
//             ...req.body,
//             password: hashedPassword,
//         });

//         // Envoi d'une réponse avec le statut 201 (créé)
//         // et un message de confirmation
//         res.status(201).json("User has been created!");
//     } catch (error) {
//         // Si une erreur se produit, passez-la au prochain
//         // middleware pour la gestion des erreurs
//         console.log(error);
//         next(error);
//     }
// }

// // Fonction pour ajouter un utilisateur
// const add = async (req, res) => {
//     try {
//         const auteur = await User.create(req.body);
//         res.status(201).json(auteur);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: error.message });
//     }
// };

// // Fonction pour récupérer tous les utilisateurs
// const getAll = async (req, res) => {
//     try {
//         const users = await User.findAll();
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Fonction pour récupérer un utilisateur par son ID
// const getUserById = async (req, res) => {
//     try {
//         const user = await User.findByPk(req.params.id);
//         if (!user) return res.status(404).json("User not found!");
//         res.status(200).json(user);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Fonction pour mettre à jour un utilisateur
// const updateUser = async (req, res) => {
//     try {
//         const user = await User.findByPk(req.params.id);
//         if (!user) return res.status(404).json("User not found!");
//         await user.update(req.body);
//         res.status(200).json({
//             message: "User updated",
//             user
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Fonction pour supprimer un utilisateur
// const deleteUser = async (req, res) => {
//     try {
//         const userDeleted = await User.destroy({ where: { userID: req.params.id } });
//         if (!userDeleted) return res.status(404).json("User not found!");
//         res.status(200).json({ message: "User deleted" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Export des fonctions
// export {
//     login,
//     register,
//     add,
//     getAll,
//     getUserById,
//     updateUser,
//     deleteUser
// };
