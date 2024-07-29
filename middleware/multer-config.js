// // Importation de multer, un middleware pour la gestion des fichiers en Node.js
// //import multer from 'multer';

// // Définition d'un objet MIME_TYPES pour associer les types MIME des images aux extensions de fichier
// const MIME_TYPES = {
//   'image/jpg': 'jpg',
//   'image/jpeg': 'jpg',
//   'image/png': 'png'
// };

// // Configuration du stockage des fichiers avec multer
// const storage = multer.diskStorage({
//   // Définition du dossier de destination pour les fichiers téléchargés
//   destination: (req, file, callback) => {
//     // Enregistre les fichiers dans le dossier 'public/images/'
//     callback(null, 'public/images/');
//   },
//   // Définition du nom des fichiers téléchargés
//   filename: (req, file, callback) => {
//     // Remplace les espaces dans le nom original du fichier par des underscores
//     const name = file.originalname.split(' ').join('_');
//     // Récupère l'extension de fichier appropriée à partir du type MIME du fichier
//     const extension = MIME_TYPES[file.mimetype];
//     // Concatène le nom, la date actuelle (pour rendre le nom unique) et l'extension pour créer le nom final du fichier
//     callback(null, name + Date.now() + '.' + extension);
//   }
// });

// // Exportation de la configuration multer en tant que middleware pour un fichier unique avec le champ 'image'
// module.exports = multer({storage}).single('image');
