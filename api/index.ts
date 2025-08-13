require('dotenv').config();
import express from "express";
import errorHandler from "../middlewares/error-handler";
import aiRoutes from "./routes/ai-routes";
import testRoutes from "./routes/test";
import bodyParser from "body-parser";
import authHandler from "../middlewares/auth-handler";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(errorHandler);
app.use(authHandler);

app.use("/api/", aiRoutes);
app.use("/api/", testRoutes);

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});

module.exports = app;
