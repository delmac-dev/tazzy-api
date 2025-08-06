import bodyParser from "body-parser";
import cors from "cors";
import express, {Response} from "express";

import errorHandler from "../middlewares/error-handler";
import todoRoutes from "./routes";

export const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(errorHandler);

app.get("/", (_req, res: Response) => {
	res.send("Hello");
});

app.get("/api", (_req, res: Response) => {
	res.setHeader("Content-Type", "application/json");
	res.json({ name: "Hello world" });
});

app.use("/api/todo", todoRoutes);
