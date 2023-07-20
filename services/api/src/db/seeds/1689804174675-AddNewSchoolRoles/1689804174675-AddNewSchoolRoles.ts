import path from "path";
import { TypeOrmMigrationFromFile } from "@lib/dbMigrations/TypeOrmMigrationFromFile";

export class AddNewSchoolRoles1689804174675 extends TypeOrmMigrationFromFile {
  constructor() {
    super(path.resolve(__dirname, 'up.sql'), path.resolve(__dirname, 'down.sql'))
  }
}