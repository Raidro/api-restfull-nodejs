import express from "express";
import serverless from "serverless-http";
import { DynamoDB } from "aws-sdk";

const app = express();

app.use(express.json());

const dynamoDBClient = new DynamoDB.DocumentClient();

app.delete("/tasks/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;

    const getItemParams = {
      TableName: process.env.TASK_TABLE || "Tasks",
      Key: { taskId },
    };
    const existingItem = await dynamoDBClient.get(getItemParams).promise();

    if (!existingItem.Item) {
      return res.status(404).json({ error: "Item não encontrado." });
    }

    const deleteParams = {
      TableName: process.env.TASK_TABLE || "Tasks",
      Key: { taskId },
    };

    await dynamoDBClient.delete(deleteParams).promise();
    res.send("Tarefa excluída com sucesso");
  } catch (error) {
    console.error("Erro ao excluir a tarefa:", error);
    res.status(400).send("Erro ao excluir a tarefa");
  }
});

export const handler = serverless(app);
