import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  res.json({ message: "Tool route is working!" });
});

export default router;