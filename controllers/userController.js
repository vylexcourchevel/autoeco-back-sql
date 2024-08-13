

//controller/userController.js

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
        console.log(user);
        // Envoyer le token au client dans un cookie HTTP Only, avec une réponse de succès (code 200)
        res.cookie("access_token", token, {
             httpOnly: true,
             secure: process.env.NODE_ENV === 'production', // En production, le cookie sera envoyé uniquement sur HTTPS }).status(200).json(user);
             sameSite: 'Strict' // Nécessaire pour les requêtes cross-origin (à ajuster selon les besoins)
            }).status(200).json(user);
    } catch (e) {
        // En cas d'erreur, afficher l'erreur et renvoyer une réponse avec un code d'erreur 500
        console.log("Error in login:", e);
        res.status(500).json({ error: e.message });
    }
};


const register = async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
        const newUser = await User.create({
            ...req.body,
            password: hashedPassword
        });

        res.status(201).json({
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            isAdmin: newUser.isAdmin ? 'Oui' : 'Non', // Affichage de 'Oui' ou 'Non'
            createdAt: newUser.createdAt
        });
    } catch (error) {
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

// Fonction pour mettre à jour le statut d'administrateur  d'un utilisateur
const updateAdminStatus = async (req, res) => {
    try {
        // Récupérer l'ID de l'utilisateur et le nouveau statut à partir des paramètres de la requête
        const { id } = req.params;
        const { isAdmin } = req.body;

        // Trouver l'utilisateur dans la base de données
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json("User not found!");

        // Mettre à jour le statut d'admin de l'utilisateur
        await user.update({ isAdmin });

        // Renvoyer la réponse avec le message de succès et les détails de l'utilisateur mis à jour
        res.status(200).json({
            message: "User admin status updated",
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin ? 'Oui' : 'Non', // Transformation pour la réponse
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.log("Error in updateAdminStatus:", error);
        res.status(500).json({ error: error.message });
    }
};


// Fonction pour supprimer un utilisateur
async function deleteUser(req, res) {
    try {
        const userId = req.params.id;
        await User.destroy({
            where: { id: userId }  // Remplacez userID par id
        });
        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        console.error('Erreur dans deleteUser:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
    }
}

// const deleteUser = async (req, res) => {
//     try {
//         const userDeleted = await User.destroy({ where: { userID: req.params.id } });
//         if (!userDeleted) return res.status(404).json("User not found!");
//         res.status(200).json({ message: "User deleted" });
//     } catch (error) {
//         console.log("Error in deleteUser:", error);
//         res.status(500).json({ error: error.message });
//     }
// };

// Fonction pour s'inscrire

// Fonction pour recuperer l'utilisateur courant
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getCurrentUser:", error);
        res.status(500).json({ error: error.message });
    }
};

// Fonction pour gérer la déconnexion des utilisateurs
const logout = async (req, res) => {
    try {
        // Effacer le cookie contenant le token
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });

        // Réponse indiquant que l'utilisateur a été déconnecté avec succès
        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.log("Error in logout:", error);
        res.status(500).json({ error: error.message });
    }
};


// Export des fonctions
export {
    login,
    logout, 
    register,
    add,
    getAll,
    getUserById,
    updateUser,
    deleteUser,
    getCurrentUser,
    updateAdminStatus
};






// // Import des modules nécessaires
// import bcrypt from 'bcrypt'; // Pour le hachage et la comparaison des mots de passe
// import jwt from 'jsonwebtoken'; // Pour la création et la vérification des JSON Web Tokens
// import { User } from '../models/index.js'; // Import du modèle User pour interagir avec la base de données
// import dotenv from 'dotenv'; // Pour charger les variables d'environnement depuis un fichier .env

// // Charger les variables d'environnement depuis le fichier .env
// dotenv.config();

// // Fonction pour gérer la connexion des utilisateurs
// const login = async (req, res) => {
//     try {
//         // Affiche l'email de l'utilisateur pour le débogage
//         console.log("Logging in user with email:", req.body.email);

//         // Rechercher l'utilisateur dans la base de données en fonction de l'email
//         const user = await User.findOne({ where: { email: req.body.email } });
        
//         // Si l'utilisateur n'est pas trouvé, renvoyer une réponse avec un code d'erreur 404
//         if (!user) {
//             console.log("User not found");
//             return res.status(404).json("User not found!");
//         }

//         // Comparer le mot de passe fourni avec le mot de passe haché stocké dans la base de données
//         const comparePassword = await bcrypt.compare(req.body.password, user.password);
        
//         // Si le mot de passe est incorrect, renvoyer une réponse avec un code d'erreur 400
//         if (!comparePassword) {
//             console.log("Wrong Credentials");
//             return res.status(400).json("Wrong Credentials!");
//         }

//         // Générer un JSON Web Token (JWT) pour l'utilisateur
//         const token = jwt.sign(
//             { id: user.id }, // Les données à inclure dans le token (ici, l'ID de l'utilisateur)
//             process.env.TOKEN, // La clé secrète pour signer le token, stockée dans les variables d'environnement
//             { expiresIn: "24h" } // Durée de validité du token (24 heures)
//         );

//         // Afficher le token créé pour le débogage
//         console.log("Token created:", token);
//         console.log(user);
//         // Envoyer le token au client dans un cookie HTTP Only, avec une réponse de succès (code 200)
//         res.cookie("access_token", token, {
//              httpOnly: true,
//              secure: process.env.NODE_ENV === 'production', // En production, le cookie sera envoyé uniquement sur HTTPS }).status(200).json(user);
//              sameSite: 'Strict' // Nécessaire pour les requêtes cross-origin (à ajuster selon les besoins)
//             }).status(200).json(user);
//     } catch (e) {
//         // En cas d'erreur, afficher l'erreur et renvoyer une réponse avec un code d'erreur 500
//         console.log("Error in login:", e);
//         res.status(500).json({ error: e.message });
//     }
// };




// const register = async (req, res, next) => {
//     try {
//       // Hashage du mot de passe avec bcrypt, "10" est le nombre de tours de salage
//       const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
//       // Création d'un nouvel utilisateur dans la base de données avec les informations reçues et le mot de passe haché
//       await User.create({
//         // '...req.body' est une syntaxe de décomposition (spread syntax).
//         // Elle permet de créer une copie de toutes les propriétés de 'req.body' et de les ajouter à l'objet en cours de création.
//         ...req.body,
//         password: hashedPassword
//       });
  
//       // Envoi d'une réponse avec le statut 201 (créé) et un message de confirmation
//       res.status(201).json("User has been created!");
//     } catch (error) {
//       // Si une erreur se produit, passez-la au prochain middleware pour la gestion des erreurs
//       next(error);
//     }
//   };
// // Fonction pour ajouter un utilisateur
// const add = async (req, res) => {
//     try {
//         const auteur = await User.create(req.body);
//         res.status(201).json(auteur);
//     } catch (error) {
//         console.log("Error in add:", error);
//         res.status(500).json({ error: error.message });
//     }
// };

// // Fonction pour récupérer tous les utilisateurs
// const getAll = async (req, res) => {
//     try {
//         const users = await User.findAll();
//         res.status(200).json(users);
//     } catch (error) {
//         console.log("Error in getAll:", error);
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
//         console.log("Error in getUserById:", error);
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
//         console.log("Error in updateUser:", error);
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
//         console.log("Error in deleteUser:", error);
//         res.status(500).json({ error: error.message });
//     }
// };

// // Fonction pour s'inscrire

// // Fonction pour recuperer l'utilisateur courant
// const getCurrentUser = async (req, res) => {
//     try {
//         const user = await User.findByPk(req.user.id);
//         res.status(200).json(user);
//     } catch (error) {
//         console.log("Error in getCurrentUser:", error);
//         res.status(500).json({ error: error.message });
//     }
// };

// // Fonction pour gérer la déconnexion des utilisateurs
// const logout = async (req, res) => {
//     try {
//         // Effacer le cookie contenant le token
//         res.clearCookie("access_token", {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'Strict'
//         });

//         // Réponse indiquant que l'utilisateur a été déconnecté avec succès
//         return res.status(200).json({ message: "User logged out successfully" });
//     } catch (error) {
//         console.log("Error in logout:", error);
//         res.status(500).json({ error: error.message });
//     }
// };


// // Export des fonctions
// export {
//     login,
//     logout, 
//     register,
//     add,
//     getAll,
//     getUserById,
//     updateUser,
//     deleteUser,
//     getCurrentUser
// };


