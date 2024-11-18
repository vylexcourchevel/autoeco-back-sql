
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

// //src/middleware/auth.js

// import jwt from 'jsonwebtoken'
// import { env } from '../config.js'
// import { createError } from '../error.js'

// export const verifyToken = (req, res, next) => {
//   // Récupère le jeton (token) JWT à partir des cookies de la requête
//   const token = req.cookies.access_token;
//   console.log(req.cookies.access_token);

//   // Si le jeton (token) n'est pas présent, 
//   // renvoie une erreur 401 (accès refusé)
//   if (!token) return next(createError(401, "Acces Denied"))

//   // Vérifier la validité du jeton en utilisant jwt.verify
//   jwt.verify(token, env.token, (err, user) => {
//     // si une erreur se produit lors de la vérification du jeton
//     if (err) {
//       // Renvoie une erreur 403 (interdit) 
//       // car le jeton (token) n'est pas valide
//       return next(createError(403, { message: "Token non valide !", error: err.message }))
//     }
//     // si la vérification réussit, 
//     // ajoute les information de l'utilisateur
//     // dans l'objet req
//     req.user = user

//     next();
//   })
// }
// console.log(verifyToken)