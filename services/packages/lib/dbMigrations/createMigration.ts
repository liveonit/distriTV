import * as fs from 'fs';
import path from 'path';

export const createMigration = (db: any, migrationName: string, type: string) => {
  const migrationType = `${type}s`;
  const currentTime = Date.now()
  const directory = path.resolve(
    ((db.config.migrations as string[])?.find((m) => m.includes(`${migrationType}`)) as string)
      .split(`${migrationType}/`)[0]
      .concat(`${migrationType}`),
    `${currentTime}-${migrationName}`,
  );

  const migrationFileContent = `import path from "path";
import { TypeOrmMigrationFromFile } from "lib/dbMigrations/TypeOrmMigrationFromFile";

export class ${migrationName}${currentTime} extends TypeOrmMigrationFromFile {
  constructor() {
    super(path.resolve(__dirname, 'up.sql'), path.resolve(__dirname, 'down.sql'))
  }
}`;

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  const migrationFilePath = path.resolve(directory, `${currentTime}-${migrationName}.ts`);
  const migrationUpFilePath = path.resolve(directory, `up.sql`);
  const migrationDownFilePath = path.resolve(directory, `down.sql`);

  if (!fs.existsSync(migrationFilePath)) {
    fs.writeFileSync(migrationFilePath, migrationFileContent);
  }

  if (!fs.existsSync(migrationUpFilePath)) {
    fs.writeFileSync(migrationUpFilePath, '');
  }

  if (!fs.existsSync(migrationDownFilePath)) {
    fs.writeFileSync(migrationDownFilePath, '');
  }
};
