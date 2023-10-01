import { ErrorCode, ErrorName } from "./types";
import { BaseError } from "../BaseClasses/BaseError";

export class OverlapSchedule extends BaseError {
  constructor(message: string) {
    super({ name: ErrorName.OVERLAP_SCHEDULE, message, code: ErrorCode.BAD_REQUEST });
  }
}
