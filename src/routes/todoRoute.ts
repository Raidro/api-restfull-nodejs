import express, { Request, Response } from "express";
import dynamoDBClient from "../db/DBConnection";
import { v4 as uuidv4 } from "uuid";
import { Task } from "../models/Task";
import authenticateToken from "../middleware/middleware";

const router = express.Router();

router.use(authenticateToken);

router.post("/", async (req: Request, res: Response) => {
  const { title, description } = req.body;

  const newTask: Task = {
    taskId: uuidv4(),
    title,
    description,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const params = {
    TableName: "Tasks",
    Item: newTask,
  };

  try {
    await dynamoDBClient.put(params).promise();
    res.status(201).send("Tarefa criada com sucesso");
  } catch (error) {
    console.error("Erro ao criar a tarefa:", error);
    res.status(400).send("Erro ao criar a tarefa");
  }
});

router.get("/", async (req: Request, res: Response) => {
  const params = {
    TableName: "Tasks",
  };

  try {
    const data = await dynamoDBClient.scan(params).promise();
    res.json(data.Items);
  } catch (error) {
    console.error("Erro ao buscar as tarefas:", error);
    res.status(400).send("Erro ao buscar as tarefas");
  }
});

router.put("/:taskId", async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { title, description, status } = req.body;

  const params = {
    TableName: "Tasks",
    Key: { taskId },
    UpdateExpression:
      "SET title = :title, description = :description, #s = :status",
    ExpressionAttributeNames: { "#s": "status" },
    ExpressionAttributeValues: {
      ":title": title,
      ":description": description,
      ":status": status,
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const data = await dynamoDBClient.update(params).promise();
    res.json(data.Attributes);
  } catch (error) {
    console.error("Erro ao atualizar a tarefa:", error);
    res.status(400).send("Erro ao atualizar a tarefa");
  }
});

router.delete("/:taskId", async (req: Request, res: Response) => {
  const { taskId } = req.params;

  const params = {
    TableName: "Tasks",
    Key: { taskId },
  };

  try {
    await dynamoDBClient.delete(params).promise();
    res.send("Tarefa excluída com sucesso");
  } catch (error) {
    console.error("Erro ao excluir a tarefa:", error);
    res.status(400).send("Erro ao excluir a tarefa");
  }
});

export default router;
