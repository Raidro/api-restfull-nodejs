import express, { Request, Response } from "express";
import serverless from "serverless-http";
import { DynamoDB } from "aws-sdk";

const app = express();

app.use(express.json());

const dynamoDBClient = new DynamoDB.DocumentClient();

app.put("/tasks/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status } = req.body;

    const getItemParams = {
      TableName: process.env.TASK_TABLE || "Tasks",
      Key: { taskId },
    };
    const existingItem = await dynamoDBClient.get(getItemParams).promise();

    if (!existingItem.Item) {
      return res.status(404).json({ error: "Item não encontrado." });
    }

    const updateParams = {
      TableName: process.env.TASK_TABLE || "Tasks",
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

    const data = await dynamoDBClient.update(updateParams).promise();
    res.json(data.Attributes);
  } catch (error) {
    console.error("Erro ao atualizar a tarefa:", error);
    res.status(400).send("Erro ao atualizar a tarefa");
  }
});

export const handler = serverless(app);
