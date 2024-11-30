
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;

// Fonction pour générer le token de réinitialisation
const generateResetToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Fonction pour la demande de réinitialisation de mot de passe
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

        const resetToken = generateResetToken(user.id);

        // Débogage : Décodage du token généré pour voir son contenu
        const decoded = jwt.decode(resetToken);

        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: GMAIL_USER,
                pass: GMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: GMAIL_USER,
            to: user.email,
            subject: 'Réinitialisation de votre mot de passe',
            html: `<p>Cliquez sur ce lien pour réinitialiser votre mot de passe : <a href="${resetUrl}">${resetUrl}</a></p>`,
        });

        res.status(200).json({ message: 'Un email de réinitialisation a été envoyé.' });
    } catch (err) {
        res.status(500).json({ message: 'Une erreur est survenue.' });
    }
};

// Vérifier la validité du token de réinitialisation
const verifyResetToken = async (req, res) => {

    const { token } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("verifyResetToken - Erreur lors de la vérification du token:", error);
        res.status(400).json({ success: false, message: 'Token invalide ou expiré' });
    }
};

// Fonction pour la réinitialisation du mot de passe
const resetPassword = async (req, res) => {

    const { token, newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({ message: 'Le mot de passe est requis.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
    } catch (err) {
        console.error("resetPassword - Erreur:", err);
        res.status(400).json({ message: 'Le token est invalide ou expiré.' });
    }
};


// Fonction pour gérer la connexion des utilisateurs
const login = async (req, res) => {

    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) {
            return res.status(404).json("User not found!");
        }

        const comparePassword = await bcrypt.compare(req.body.password, user.password);
        if (!comparePassword) {
            return res.status(400).json("Wrong Credentials!");
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.TOKEN || process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );


        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        }).status(200).json(user);

    } catch (e) {
        console.error("login - Erreur lors de la connexion:", e);
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
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Debug: Afficher les données reçues

        // Si un mot de passe est fourni, le hacher
        let hashedPassword = user.password; // Garder l'ancien mot de passe par défaut
        if (password) {
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

        // Sauvegarder les modifications
        await user.save();

        res.status(200).json(user);
    } catch (error) {
        // Debug: Afficher l'erreur
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
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
