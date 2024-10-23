import * as fs from 'node:fs';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bcrypt from 'bcrypt';
import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function bootstrap() {

  // Cargamos las configuraciones iniciales del sistema
  try {
    if (!fs.existsSync("./app.db")){
      const sql: string = `
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS users(id TEXT, created_at TEXT, update_at TEXT, role TEXT,  name TEXT, email TEXT, password TEXT);
      CREATE TABLE IF NOT EXISTS users_tokens(id TEXT, created_at TEXT, user_id TEXT, type TEXT, hostname TEXT, ip TEXT, device TEXT, platform TEXT, exp TEXT, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
      CREATE TABLE IF NOT EXISTS apps(id TEXT, created_at TEXT, update_at TEXT, deploy_at TEXT, domain TEXT, name TEXT, process_name TEXT UNIQUE, version TEXT, location TEXT, startup_file TEXT, framework TEXT, running_on TEXT, runtime_environment TEXT, url TEXT, repository TEXT, env TEXT, ignore TEXT, observation TEXT, UNIQUE(domain, name, version));
      CREATE TABLE IF NOT EXISTS apps_log(id TEXT, created_at TEXT, app_id TEXT, user_id TEXT, type TEXT, detail TEXT, data TEXT, FOREIGN KEY (app_id) REFERENCES apps(id), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
      CREATE TABLE IF NOT EXISTS apps_users(app_id TEXT, user_id TEXT, permissions TEXT, FOREIGN KEY (app_id) REFERENCES apps(id), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, UNIQUE(app_id, user_id));
      
      INSERT INTO users VALUES('${crypto.randomUUID()}', '${(new Date()).toISOString()}', '${(new Date()).toISOString()}', 'admin', 'Administrado', 'admin', 'admin@admin.com', '${bcrypt.hashSync("admin", 15)}');
      `;

      const db = await open({ filename: "./app.db", driver: sqlite3.Database});
      await db.exec(sql);
      db.close();
    }
  } catch (error) {
    console.log("[Error] no de pudo cargar la configuración inicial");
    console.log(`[Error] ${error.message}`);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  console.log(`[App] running in port ${3000}`);
}
bootstrap();
