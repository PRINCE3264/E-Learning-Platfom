
import express from "express";
import { isAuth, isAdmin } from "../middlewares/isAuth.js";
import { getAdminAnalytics, getUserAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/analytics/admin", isAuth, isAdmin, getAdminAnalytics);
router.get("/analytics/user", isAuth, getUserAnalytics);

export default router;
