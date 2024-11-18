

 //controller/userController.js VERSION TEST  ajout une fonctionalité de recuperation des mots de passe 

 import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; 
import { User } from '../models/index.js'; 
import dotenv from 'dotenv'; 
import nodemailer from 'nodemailer'; 

dotenv.config(); 

// Fonction pour générer le token de réinitialisation
//fonction génere un JWT qui permet de réinitialiser le mot de passe avec userID
const generateResetToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Utilisation du secret du .env
};

// Vérifier la validité du token de réinitialisation
/// Cette fonction vérifie si le token de réinitialisation est valide
//le token est extrait du corps de la larequete  (req.body.token).
//jwt.verify() : Vérifie la validité du token en utilisant le secret
const verifyResetToken = async (req, res) => {
    const { token } = req.body;
  
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Utilisation du secret du .env
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Token invalide ou expiré' });
    }
};

// Fonction pour la demande de réinitialisation de mot de passe
//Elle prend l'email de l'utilisateur à partir du corps de la requête.
//Recherche de l'utilisateur dans la base de données avec cet email.
//Si l'utilisateur est trouvé, un token de réinitialisation est généré.
//Un lien de réinitialisation est créé avec ce token et envoyé à l'utilisateur par email via Nodemailer.
//L'email est envoyé à l'adresse user.email.
const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'L\'email est requis.' });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Générer le token de réinitialisation
        const resetToken = generateResetToken(user.id);
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: 'vighen.agopoff@gmail.com',
            to: user.email,
            subject: 'Réinitialisation de votre mot de passe',
            html: `<p>Cliquez sur ce lien pour réinitialiser votre mot de passe : <a href="${resetUrl}">${resetUrl}</a></p>`,
        });

        return res.status(200).json({ message: 'Un email de réinitialisation a été envoyé.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Une erreur est survenue.' });
    }
};

// Fonction pour la réinitialisation du mot de passe
//Le token et le nouveau mot de passe sont extraits du corps de la requête.
//Le token est vérifié pour extraire l'ID de l'utilisateur.
//L'utilisateur est recherché par son ID. Si l'utilisateur n'existe pas, une erreur est renvoyée.
//Le mot de passe de l'utilisateur est mis à jour avec le nouveau mot de passe.
//Important : Le mot de passe doit être haché avant de l'enregistrer en base de données, ce qui ne se fait pas ici. 
//Vous devez utiliser bcrypt pour hacher le mot de passe avant de l'enregistrer.
//Enfin, l'utilisateur est sauvegardé, et un message de succès est renvoyé.

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    // Log des données reçues dans la requête
    console.log('Réinitialisation du mot de passe - Token reçu:', token);
    console.log('Nouveau mot de passe reçu:', newPassword);

    // Vérification que le mot de passe a bien été fourni
    if (!newPassword) {
        console.log('Erreur : le mot de passe est requis.');
        return res.status(400).json({ message: 'Le mot de passe est requis.' });
    }

    try {
        // Vérification du token
        console.log('Vérification du token...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        console.log('Token vérifié, userId:', userId);

        // Recherche de l'utilisateur dans la base de données
        const user = await User.findByPk(userId);  // Utilisation de `findByPk` pour Sequelize
        if (!user) {
            console.log('Erreur : utilisateur non trouvé');
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Hachage du mot de passe
        console.log('Hachage du mot de passe...');
        const hashedPassword = await bcrypt.hash(newPassword, 10); // Hachage du nouveau mot de passe
        user.password = hashedPassword;

        // Sauvegarde de l'utilisateur avec le nouveau mot de passe
        await user.save();
        console.log('Mot de passe réinitialisé avec succès pour l\'utilisateur:', user.email);

        return res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
    } catch (err) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', err);
        return res.status(400).json({ message: 'Le token est invalide ou expiré.' });
    }
};

// Fonction pour gérer la connexion des utilisateurs
//L'email et le mot de passe de l'utilisateur sont extraits du corps de la requête.
//Recherche de l'utilisateur dans la base de données en fonction de l'email.
//Si l'utilisateur existe, son mot de passe est comparé au mot de passe haché en base de données.
//Si le mot de passe est correct, un token JWT est généré et envoyé au client.
//Le token est stocké dans un cookie HTTP Only, ce qui le rend plus sécurisé.
//Si une erreur survient, un message d'erreur est renvoyé.

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
//TEST VIGHEN Générer un token JWT pour l'utilisateur
        const token = jwt.sign(
            { id: user.id },
            process.env.TOKEN  || process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        console.log("Token created:", token);
        console.log(user);

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        }).status(200).json(user);
    } catch (e) {
        console.log("Error in login:", e);
        res.status(500).json({ error: e.message });
    }
};

// const login = async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
//     }

//     try {
//         const user = await User.findOne({ where: { email } });

//         if (!user) {
//             return res.status(404).json({ message: 'Utilisateur non trouvé' });
//         }

//         const comparePassword = await bcrypt.compare(password, user.password);

//         if (!comparePassword) {
//             return res.status(400).json({ message: 'Identifiants incorrects' });
//         }

//         const token = jwt.sign(
//             { id: user.id },
//             process.env.JWT_SECRET, // Utilisation du secret du .env
//             { expiresIn: '24h' }
//         );

//         res.cookie("access_token", token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production', 
//             sameSite: 'Strict' 
//         }).status(200).json({ user, token });
//     } catch (err) {
//         console.log("Error in login:", err);
//         res.status(500).json({ error: err.message });
//     }
// };


// // Import des modules nécessaires
// import bcrypt from 'bcrypt'; // Pour le hachage et la comparaison des mots de passe
// import jwt from 'jsonwebtoken'; // Pour la création et la vérification des JSON Web Tokens
// import { User } from '../models/index.js'; // Import du modèle User pour interagir avec la base de données
// import dotenv from 'dotenv'; // Pour charger les variables d'environnement depuis un fichier .env
// import nodemailer from 'nodemailer'; // Pour envoyer des emails

// // Charger les variables d'environnement depuis le fichier .env

// dotenv.config();

// // Fonction pour réinitialiser le mot de passe RAJOUT TEST 
// // Fonction pour demander la réinitialisation du mot de passe

// // Fonction pour générer le token

// const generateResetToken = (userId) => {
//     return jwt.sign({ userId }, 'votreSecret', { expiresIn: '1h' }); // Expiration du token 1 heure
// };

// /// Vérifier la validité du token de réinitialisation
// const verifyResetToken = async (req, res) => {
//     const { token } = req.body;
  
//     try {
//       const decoded = jwt.verify(token, 'votreSecret'); // Vérification du token avec le secret
//       res.status(200).json({ success: true }); // Si le token est valide
//     } catch (error) {
//       res.status(400).json({ success: false, message: 'Token invalide ou expiré' });
//     }
//   };



// // Fonction pour la demande de réinitialisation de mot de passe (c'est le 'forgot-password' route)
//  const requestPasswordReset = async (req, res) => {
//     const { email } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: 'Utilisateur non trouvé' });
//         }

//         // Générer le token de réinitialisation
//         const resetToken = generateResetToken(user.id);
//         const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

//         // Configurer Nodemailer pour envoyer l'email
//         const transporter = nodemailer.createTransport({
//             service: 'gmail', // Utilisez un autre service si nécessaire
//             auth: {
//                 user: process.env.GMAIL_USER,
//                 pass: process.env.GMAIL_PASS,
//             },
//         });

//         // Envoyer l'email avec le lien de réinitialisation
//         await transporter.sendMail({
//             from: 'vighen.agopoff@gmail.com',
//             to: user.email,
//             subject: 'Réinitialisation de votre mot de passe',
//             html: `<p>Cliquez sur ce lien pour réinitialiser votre mot de passe : <a href="${resetUrl}">${resetUrl}</a></p>`,
//         });

//         return res.status(200).json({
//             message: 'Un email de réinitialisation a été envoyé.',
//         });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Une erreur est survenue.' });
//     }
// };

// // Fonction pour la réinitialisation du mot de passe (c'est le 'reset-password' route)
//  const resetPassword = async (req, res) => {
//     const { token, newPassword } = req.body;

//     try {
//         const decoded = jwt.verify(token, 'votreSecret');
//         const userId = decoded.userId;

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'Utilisateur non trouvé' });
//         }

//         user.password = newPassword; // Vous devrez probablement hacher le mot de passe ici
//         await user.save();

//         return res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
//     } catch (err) {
//         return res.status(400).json({ message: 'Le token est invalide ou expiré.' });
//     }
// };
// /////

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

// //////


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



// Fonction pour ajouter un nouvel utilisateur
const add = async (req, res) => {
    try {
        const { firstName, lastName, email, password, address, phoneNumber, isAdmin } = req.body;

        // Vérifier si le mot de passe est fourni
        if (!password || password.length === 0) {
            return res.status(400).json({ message: "Le mot de passe est requis" });
        }

        // Générer un sel et crypter le mot de passe
        const salt = await bcrypt.genSalt(10); // Générer un sel
        const hashedPassword = await bcrypt.hash(password, salt); // Crypter le mot de passe

        // Créer un nouvel utilisateur avec le mot de passe crypté
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword, // Utiliser le mot de passe crypté
            address,
            phoneNumber,
            isAdmin
        });

        // Sauvegarder l'utilisateur dans la base de données
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout de l'utilisateur" });
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
   
    const { id } = req.params;
    const { firstName, lastName, email, password, address, phoneNumber, isAdmin } = req.body;

    try {
        // Trouver l'utilisateur par ID
        const user = await User.findByPk(id);
        console.log(user)
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Debug: Afficher les données reçues
        console.log('Données reçues:', req.body);

        // Si un mot de passe est fourni, le hacher
        let hashedPassword = user.password; // Garder l'ancien mot de passe par défaut
        if (password) {
            console.log('Hachage du mot de passe...');
            hashedPassword = await bcrypt.hash(password, 10); // Hachage du nouveau mot de passe
        }

        // Mettre à jour les champs de l'utilisateur
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.password = hashedPassword;
        user.address = address || user.address;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.isAdmin = isAdmin !== undefined ? isAdmin : user.isAdmin;

        // Debug: Afficher les données de l'utilisateur après mise à jour
        console.log('Données de l\'utilisateur après mise à jour:', user);

        // Sauvegarder les modifications
        await user.save();

        res.status(200).json(user);
    } catch (error) {
        // Debug: Afficher l'erreur
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
    }
};

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
    updateAdminStatus,
    requestPasswordReset, // Nouvelle fonction
    resetPassword, // Nouvelle fonction
    verifyResetToken//Nouvelle fonction
};




// //controller/userController.js DERNIERE BONNNE VERSION !!!!!!!!!!!!!!!!!!!!!!!

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
//         const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
//         const newUser = await User.create({
//             ...req.body,
//             password: hashedPassword
//         });

//         res.status(201).json({
//             id: newUser.id,
//             firstName: newUser.firstName,
//             lastName: newUser.lastName,
//             email: newUser.email,
//             isAdmin: newUser.isAdmin ? 'Oui' : 'Non', // Affichage de 'Oui' ou 'Non'
//             createdAt: newUser.createdAt
//         });
//     } catch (error) {
//         next(error);
//     }
// };


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

// // Fonction pour mettre à jour le statut d'administrateur  d'un utilisateur
// const updateAdminStatus = async (req, res) => {
//     try {
//         // Récupérer l'ID de l'utilisateur et le nouveau statut à partir des paramètres de la requête
//         const { id } = req.params;
//         const { isAdmin } = req.body;

//         // Trouver l'utilisateur dans la base de données
//         const user = await User.findByPk(id);
//         if (!user) return res.status(404).json("User not found!");

//         // Mettre à jour le statut d'admin de l'utilisateur
//         await user.update({ isAdmin });

//         // Renvoyer la réponse avec le message de succès et les détails de l'utilisateur mis à jour
//         res.status(200).json({
//             message: "User admin status updated",
//             user: {
//                 id: user.id,
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//                 email: user.email,
//                 isAdmin: user.isAdmin ? 'Oui' : 'Non', // Transformation pour la réponse
//                 createdAt: user.createdAt
//             }
//         });
//     } catch (error) {
//         console.log("Error in updateAdminStatus:", error);
//         res.status(500).json({ error: error.message });
//     }
// };


// // Fonction pour supprimer un utilisateur
// async function deleteUser(req, res) {
//     try {
//         const userId = req.params.id;
//         await User.destroy({
//             where: { id: userId }  // Remplacez userID par id
//         });
//         res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
//     } catch (error) {
//         console.error('Erreur dans deleteUser:', error);
//         res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
//     }
// }

// // const deleteUser = async (req, res) => {
// //     try {
// //         const userDeleted = await User.destroy({ where: { userID: req.params.id } });
// //         if (!userDeleted) return res.status(404).json("User not found!");
// //         res.status(200).json({ message: "User deleted" });
// //     } catch (error) {
// //         console.log("Error in deleteUser:", error);
// //         res.status(500).json({ error: error.message });
// //     }
// // };

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
//     getCurrentUser,
//     updateAdminStatus
// };



