import mongoose from "mongoose";

const studyMaterialSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    pdfUrl: String,
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("StudyMaterial", studyMaterialSchema);
