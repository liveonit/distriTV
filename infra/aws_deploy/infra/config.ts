import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const config = {
  projectName: process.env.PROJECT_NAME as string,
  environment: process.env.ENVIRONMENT as string,
  region: process.env.AWS_REGION as string,
  account: process.env.AWS_ACCOUNT as string,
  dbHost: process.env.DB_HOST as string,
  dbPort: parseInt(process.env.DB_PORT || "5432"),
  dbName: process.env.DB_NAME as string,
  dbUser: process.env.DB_USER as string,
  apiPort: parseInt(process.env.API_PORT || "4000")
};

export const envConfig = Object.entries(process.env).reduce((prev, [k, v]) => {
  if (v) prev[k] = v;
  return prev;
}, {} as { [k: string]: string });
