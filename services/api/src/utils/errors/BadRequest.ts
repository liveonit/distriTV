import { ErrorCode, ErrorName } from "./types";
import { BaseError } from "../BaseClasses/BaseError";

export class BadRequest extends BaseError {
  constructor(message: string) {
    super({ name: ErrorName.BAD_REQUEST, message, code: ErrorCode.BAD_REQUEST });
  }
}
