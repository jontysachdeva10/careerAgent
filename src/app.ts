import express, { Application } from "express";
import cors from 'cors';
import chatRoutes from './routes/chat.route';
import authRoutes from './routes/auth.route';
import deleteRoutes from './routes/delete.route';
import { requireAuth } from "./middleware/auth";

export const app: Application = express();
app.use(cors());
app.use(express.json());

app.use('/api/chat', requireAuth, chatRoutes);
app.use('/auth', authRoutes);
app.use('/delete', deleteRoutes);