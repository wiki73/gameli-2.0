import 'dotenv/config';
import { PrismaClient } from './client/index.js'; // Импорт из созданной папки client
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Для Prisma Postgres используем accelerateUrl
const prisma = new PrismaClient({
  accelerateUrl: "postgresql://postgres:e3ofg9knnY9ovcAh@localhost:5432/gameli",
});
async function main() {
  // 1. Находим файл CSV в корне проекта
  const filePath = path.resolve(process.cwd(), 'categories.csv');

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Ошибка: Файл не найден по пути: ${filePath}`);
    console.log(
      'Убедись, что файл categories.csv лежит в главной папке проекта.',
    );
    return;
  }

  // 2. Читаем и парсим файл
  const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
  const records = parse(fileContent, {
    columns: true, // берет заголовки (id, name и т.д.) из первой строки CSV
    skip_empty_lines: true,
  });

  console.log(
    `🚀 Найдено записей в CSV: ${records.length}. Начинаю перенос в таблицу Category...`,
  );

  // 3. Цикл переноса
  for (const record of records) {
    try {
      await prisma.category.upsert({
        // Проверь, чтобы в CSV колонка называлась именно "id" (или замени на record.ID)
        where: { id: record.id },
        update: {
          name: record.name, // Здесь подставь свои названия колонок из CSV
        },
        create: {
          id: record.id,
          name: record.name,
        },
      });
      console.log(`✅ Обработана категория: ${record.name || record.id}`);
    } catch (error) {
      console.error(
        `❌ Ошибка при вставке записи ${JSON.stringify(record)}:`,
        error,
      );
    }
  }

  console.log('✨ Перенос данных успешно завершен!');
}

main()
  .catch(e => {
    console.error('💀 Критическая ошибка скрипта:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
