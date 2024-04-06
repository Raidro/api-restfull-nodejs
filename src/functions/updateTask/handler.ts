import express, { Request, Response } from "express";
import serverless from "serverless-http";
import { DynamoDB } from "aws-sdk";
import { authenticateToken } from "../../middleware/middleware";

const app = express();

app.use(express.json());

app.use(authenticateToken);

const dynamoDBClient = new DynamoDB.DocumentClient();

app.put("/:taskId", async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { title, description, status } = req.body;

  const params = {
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

  try {
    const data = await dynamoDBClient.update(params).promise();
    res.json(data.Attributes);
  } catch (error) {
    console.error("Erro ao atualizar a tarefa:", error);
    res.status(400).send("Erro ao atualizar a tarefa");
  }
});

export const handler = serverless(app);
