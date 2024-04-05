import AWS, { DynamoDB } from "aws-sdk";

AWS.config.update({ region: process.env.AWS_REGION });

const dynamoDBClient = new DynamoDB.DocumentClient();

export default dynamoDBClient;
