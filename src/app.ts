import express from "express";
import dotenv from "dotenv";
import todoRoutes from "./routes/todoRoute";
import authRouter from "./routes/authRoute";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/auth", authRouter);
app.use("/tasks", todoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor Express em execução na porta ${PORT}`);
});
