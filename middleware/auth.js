
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