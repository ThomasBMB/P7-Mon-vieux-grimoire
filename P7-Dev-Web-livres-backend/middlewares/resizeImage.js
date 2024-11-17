const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// Middleware pour réduire la taille de l'image
const resizeImage = async (req, res, next) => {
    if (!req.file) {
        return next(); // Pas de fichier
    }

    const filePath = req.file.path;
    const resizedFilePath = filePath.replace(/(\.\w+)$/, "-resized$1"); // Crée un nouveau nom pour l'image redimensionnée

    try {
        // Redimensionner avec une limite sur la taille et la qualité
        await sharp(filePath)
            .resize({
                width: 1920, // Limite maximale de largeur
                height: 1080, // Limite maximale de hauteur
                fit: "inside", // Respecte les proportions
            })
            .toFormat("jpeg", { quality: 80 }) // Réduit la qualité
            .toFile(resizedFilePath);

        // Remplacer le fichier original par l'image redimensionnée
        fs.unlinkSync(filePath); // Supprime le fichier original
        fs.renameSync(resizedFilePath, filePath); // Renomme le fichier redimensionné

        next();
    } catch (err) {
        console.error("Erreur lors du redimensionnement de l'image :", err);
        next(err); // Passe l'erreur au middleware suivant
    }
};


module.exports = resizeImage;
