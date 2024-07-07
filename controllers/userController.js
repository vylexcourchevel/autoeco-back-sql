// Importation de User depuis models/index.js
import { User } from "../models/index.js";

// Fonction pour ajouter un utilisateur
const add = async (req, res) => {
    try {
        const auteur = await User.create(req.body);
        res.status(201).json(auteur);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
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
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json("User not found!");
        await user.update(req.body);
        res.status(200).json({
            message: "User updated",
            user
        });
    } catch (error) {
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
        res.status(500).json({ error: error.message });
    }
};

// Export des fonctions
export {
    add,
    getAll,
    getUserById,
    updateUser,
    deleteUser
};
