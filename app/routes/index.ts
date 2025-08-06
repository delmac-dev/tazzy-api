import { type Request, type Response, Router } from "express";

const router = Router();

router.post("/", (req: Request, res: Response) => {

	res.status(201).json({ message: "Created the todo." });
});

router.get("/", (_req, res, _next) => {
	res.json({ message: "All Todos" });
});

router.get("/:id", (req, res) => {
	const { id } = req.params;

	res.json({message: `one todo: ${id}`});
});

router.put("/:id", (req, res) => {
	const { id } = req.params;

	res.json({message: `update todo: ${id}`});
});

router.delete("/:id", (req, res) => {
	const { id } = req.params;
	res.json({message: `delete todo: ${id}`});
});

router.patch("/:id", (req, res) => {
	const { id } = req.params;

	res.json({message: `patch todo: ${id}`});
});

export default router;
