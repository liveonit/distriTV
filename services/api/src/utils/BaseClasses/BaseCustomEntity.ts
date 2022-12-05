import { BaseEntity } from "typeorm";

export abstract class BaseCustomEntity extends BaseEntity {
  abstract id: number | string;
}
