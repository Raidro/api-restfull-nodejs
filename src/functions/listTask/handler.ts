import express, { Request, Response } from "express";
import serverless from "serverless-http";
import { DynamoDB } from "aws-sdk";
import { authenticateToken } from "../../middleware/middleware";

const app = express();

app.use(express.json());

app.use(authenticateToken);

const dynamoDBClient = new DynamoDB.DocumentClient();

app.get("/", async (req: Request, res: Response) => {
  const { status } = req.query;

  let params: AWS.DynamoDB.DocumentClient.ScanInput = {
    TableName: process.env.TASK_TABLE || "Tasks",
  };

  if (status) {
    params = {
      ...params,
      FilterExpression: "#s = :status",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: { ":status": status },
    };
  }

  try {
    const data = await dynamoDBClient.scan(params).promise();
    res.json(data.Items);
  } catch (error) {
    console.error("Erro ao buscar as tarefas:", error);
    res.status(400).send("Erro ao buscar as tarefas");
  }
});

export const handler = serverless(app);
