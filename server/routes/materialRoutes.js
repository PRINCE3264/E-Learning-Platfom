
import express from "express";
import upload from "../middlewares/upload.js";



import {
    uploadMaterial,
    getAllMaterials,
    updateMaterial,
    deleteMaterial
} from "../controllers/materialController.js";

const router = express.Router();

router.post("/upload", upload.single("pdf"), uploadMaterial);
router.get("/", getAllMaterials);
router.put("/:id", upload.single("pdf"), updateMaterial);
router.delete("/:id", deleteMaterial);

export default router;   // ✅ THIS LINE FIXES ERROR
