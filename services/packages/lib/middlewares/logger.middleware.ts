import morgan from "morgan";
import { logger } from "../Logger";

const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf("\n")));
  },
};

export const loggerMiddleware = (config: {ENVIRONMENT: string}) => morgan("combined", { stream, skip: () => config.ENVIRONMENT !== "production" });
