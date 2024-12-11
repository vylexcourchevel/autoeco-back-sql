

import jwt from 'jsonwebtoken';
import { env } from '../config.js';
import { createError } from '../error.js';

export const verifyToken = (req, res, next) => {
    // Vérification du token dans les cookies
    let token = req.cookies.access_token;

    // Si le token n'est pas dans les cookies, on le cherche dans l'en-tête Authorization
    if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(createError(401, "Accès refusé, token manquant"));
    }

    // Vérification du token
    jwt.verify(token, env.token, (err, user) => {
        if (err) {
            console.error("Erreur de vérification du token :", err.message);
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

            console.log("Utilisateur connecté :", req.user);

            if (req.user.role !== role) {
                return next(createError(403, "Accès interdit pour ce rôle !"));
            }
            next();
        });
    };
};

