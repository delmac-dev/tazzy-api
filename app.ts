import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import errorHandler from './middlewares/error-handler';
import authHandler from './middlewares/auth-handler';
import bodyParser from "body-parser";
import aiRoute from './routes/ai';
import healthRoute from './routes/health';
import forbiddenRoute from './routes/404';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(authHandler);

app.use("/api/ai", aiRoute);
app.use("/api/health", healthRoute);
app.use('/{*splat}', forbiddenRoute);

app.use(errorHandler);

// Start server (for local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

export default app;