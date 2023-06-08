import { ErrorCode, ErrorName } from "./types";
import { BaseError } from "../BaseClasses/BaseError";

export class InternalServer extends BaseError {
  constructor(message: string) {
    super({ name: ErrorName.INTERNAL_SERVER, message, code: ErrorCode.INTERNAL_SERVER });
  }
}
