import express, { Request, Response } from "express";
import serverless from "serverless-http";
import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const app = express();

app.use(express.json());

const dynamoDBClient = new DynamoDB.DocumentClient();

app.post("/tasks", async (req: Request, res: Response) => {
  const { title, description } = req.body;

  const newTask = {
    taskId: uuidv4(),
    title,
    description,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const params = {
    TableName: process.env.TASK_TABLE || "Tasks",
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

export const handler = serverless(app);
