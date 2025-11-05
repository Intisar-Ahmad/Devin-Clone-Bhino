import { Router } from "express";
// import { authUserMiddleware } from "../middleware/auth.middleware.js";
import { generateResultController } from "../controllers/gemini.controller.js";

const router = Router();

router.get("/get-result" ,generateResultController);





export default router;