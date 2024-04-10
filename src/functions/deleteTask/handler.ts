import express, { Request, Response } from "express";
import serverless from "serverless-http";
import { DynamoDB } from "aws-sdk";

const app = express();

app.use(express.json());

const dynamoDBClient = new DynamoDB.DocumentClient();

app.delete("/:taskId", async (req: Request, res: Response) => {
  const { taskId } = req.params;

  const params = {
    TableName: process.env.TASK_TABLE || "Tasks",
    Key: { taskId },
  };

  try {
    const data = await dynamoDBClient.get(params).promise();

    if (!data.Item) {
      return res.status(404).send("Item não encontrado.");
    }

    await dynamoDBClient.delete(params).promise();
    res.send("Tarefa excluída com sucesso");
  } catch (error) {
    console.error("Erro ao excluir a tarefa:", error);
    res.status(400).send("Erro ao excluir a tarefa");
  }
});

export const handler = serverless(app);
