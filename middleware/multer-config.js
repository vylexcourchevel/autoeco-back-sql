

// Importation du module multer pour gérer les téléchargements de fichiers
import multer from 'multer';

// Déclaration des types MIME et leurs extensions de fichiers correspondantes
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/png': 'png'
};

// Configuration du stockage pour multer
const storage = multer.diskStorage({
  // Définition du dossier de destination pour les fichiers téléchargés
  destination: (req, file, callback) => {
    console.log("saving image")

    // Enregistre les fichiers dans le dossier 'public/images/'
    callback(null, 'public/images/');
  },
  // Définition du nom des fichiers téléchargés
  filename: (req, file, callback) => {
    // Remplacement des espaces par des underscores dans le nom du fichier original
    const name = file.originalname.split(' ').join('_');
    // Récupération de l'extension de fichier appropriée à partir du type MIME
    callback(null, name);
  }
});

// Création de l'instance d'upload avec multer et la configuration de stockage
const upload = multer({ storage });

// Exportation de la configuration multer pour utilisation dans d'autres parties de l'application
export default upload;
