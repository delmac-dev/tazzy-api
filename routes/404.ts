import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

export default router;