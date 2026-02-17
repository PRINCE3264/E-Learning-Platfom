import StudyMaterial from "../models/StudyMaterial.js";

/* CREATE */
export const uploadMaterial = async (req, res) => {
    try {
        const material = await StudyMaterial.create({
            title: req.body.title,
            description: req.body.description,
            pdfUrl: `/uploads/materials/${req.file.filename}`
        });

        res.status(201).json(material);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* READ */
export const getAllMaterials = async (req, res) => {
    try {
        const materials = await StudyMaterial.find().sort({ uploadedAt: -1 });
        res.json(materials);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* UPDATE */
export const updateMaterial = async (req, res) => {
    try {
        const material = await StudyMaterial.findById(req.params.id);

        if (!material) return res.status(404).json({ message: "Not found" });

        material.title = req.body.title || material.title;
        material.description = req.body.description || material.description;

        if (req.file) {
            material.pdfUrl = `/uploads/materials/${req.file.filename}`;
        }

        await material.save();
        res.json(material);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* DELETE */
export const deleteMaterial = async (req, res) => {
    try {
        await StudyMaterial.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
