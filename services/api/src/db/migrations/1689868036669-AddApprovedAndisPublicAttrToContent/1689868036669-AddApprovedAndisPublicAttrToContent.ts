import path from "path";
import { TypeOrmMigrationFromFile } from "@lib/dbMigrations/TypeOrmMigrationFromFile";

export class AddApprovedAndisPublicAttrToContent1689868036669 extends TypeOrmMigrationFromFile {
  constructor() {
    super(path.resolve(__dirname, 'up.sql'), path.resolve(__dirname, 'down.sql'))
  }
}