

// import jwt from 'jsonwebtoken';
// import { env } from '../config.js'; // Configuration (contient probablement la clé secrète JWT)
// import { createError } from '../error.js'; // Utilitaire pour créer des erreurs personnalisées

// /**
//  * Middleware pour vérifier la présence et la validité d'un token JWT.
//  * @param {Object} req - Objet de requête Express
//  * @param {Object} res - Objet de réponse Express
//  * @param {Function} next - Fonction pour passer au middleware suivant
//  */
// export const verifyToken = (req, res, next) => {
//     console.log("=== Début de verifyToken ===");

//     // Récupération du token dans les cookies
//     const token = req.cookies.access_token;
//     console.log("Token reçu :", token);

//     // Vérification de la présence du token
//     if (!token) {
//         console.error("Erreur : Token manquant");
//         return next(createError(401, "Accès refusé, token manquant"));
//     }

//     // Validation du token avec jwt.verify
//     jwt.verify(token, env.token, (err, user) => {
//         if (err) {
//             if (err.name === 'TokenExpiredError') {
//                 console.error("Erreur : Token expiré");
//                 return next(createError(401, "Le token a expiré"));
//             }
//             console.error("Erreur : Token non valide", err);
//             return next(createError(403, "Token non valide"));
//         }

//         // Si le token est valide, extraire les informations utilisateur
//         console.log("Token valide. Utilisateur extrait :", user);

//         // Ajouter les informations utilisateur à req pour les middlewares suivants
//         req.user = user;
//         console.log("req.user ajouté :", req.user);

//         next(); // Passer au middleware suivant
//     });
// };

// /**
//  * Middleware pour vérifier un rôle utilisateur spécifique.
//  * @param {string} role - Rôle requis pour accéder à la ressource
//  * @returns {Function} Middleware Express
//  */
// export const verifyRole = (role) => {
//     return (req, res, next) => {
//         console.log("=== Début de verifyRole ===");
//         console.log("Rôle requis :", role);

//         // Vérification du token
//         verifyToken(req, res, (err) => {
//             if (err) {
//                 console.error("Erreur lors de verifyToken dans verifyRole :", err);
//                 return next(err);
//             }

//             console.log("Utilisateur après vérification du token :", req.user);

//             // Vérifier si l'utilisateur a le rôle requis
//             if (req.user.role !== role) {
//                 console.error("Erreur : Rôle utilisateur insuffisant");
//                 return next(createError(403, "Accès interdit pour ce rôle !"));
//             }

//             console.log("Accès autorisé pour le rôle :", role);
//             next(); // Passer au middleware suivant
//         });
//     };
// };


import jwt from 'jsonwebtoken';
import { env } from '../config.js';
import { createError } from '../error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return next(createError(401, "Accès refusé, token manquant"));
    }

    jwt.verify(token, env.token, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return next(createError(401, "Le token a expiré"));
            }
            return next(createError(403, "Token non valide"));
        }

        req.user = user; // Ajout des informations utilisateur dans req
        next();
    });
};

// Middleware pour vérifier un rôle spécifique
export const verifyRole = (role) => {
    return (req, res, next) => {
        verifyToken(req, res, (err) => {
            if (err) return next(err);

            if (req.user.role !== role) {
                return next(createError(403, "Accès interdit pour ce rôle !"));
            }
            next();
        });
    };
};
// // auth.js
// import jwt from 'jsonwebtoken';
// import { env } from '../config.js';
// import { createError } from '../error.js';

// export const verifyToken = (req, res, next) => {
//     const token = req.cookies.access_token;

//     if (!token) {
//         return next(createError(401, "Accès refusé, token manquant"));
//     }

//     jwt.verify(token, env.token, (err, user) => {
//         if (err) {
//             if (err.name === 'TokenExpiredError') {
//                 return next(createError(401, "Le token a expiré"));
//             }
//             return next(createError(403, "Token non valide"));
//         }

//         req.user = user; // Ajout des informations utilisateur dans req
//         next();
//     });
// };

// // Middleware pour vérifier un rôle spécifique
// export const verifyRole = (role) => {
//     return (req, res, next) => {
//         verifyToken(req, res, (err) => {
//             if (err) return next(err);

//             if (req.user.role !== role) {
//                 return next(createError(403, "Accès interdit pour ce rôle !"));
//             }
//             next();
//         });
//     };
// };