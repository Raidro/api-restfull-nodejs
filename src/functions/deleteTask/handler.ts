import express, { Request, Response } from "express";
import serverless from "serverless-http";
import { DynamoDB } from "aws-sdk";
import { authenticateToken } from "../../middleware/middleware";

const app = express();

app.use(authenticateToken);

const dynamoDBClient = new DynamoDB.DocumentClient();

app.delete("/:taskId", async (req: Request, res: Response) => {
  const { taskId } = req.params;

  const params = {
    TableName: process.env.TASK_TABLE || "Tasks",
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

export const handler = serverless(app);
