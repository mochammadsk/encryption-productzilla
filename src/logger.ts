import * as fs from "fs/promises";
import * as path from "path";

const logDir = path.join(__dirname, "../logs");

async function logActivity(message: string): Promise<void> {
  try {
    const date = new Date();
    const timestamp = `${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}_${
      date.getMonth() + 1
    }_${date.getDate()}_${date.getFullYear()}`;
    const logFilePath = path.join(logDir, `${timestamp}.log`);

    await fs.mkdir(logDir, { recursive: true }); // Buat direktori jika belum ada
    await fs.appendFile(
      logFilePath,
      `${new Date().toISOString()} - ${message}\n`
    );
  } catch (error) {
    const err = error as Error;
    console.error("Error ketika mencatat log:", err.message);
  }
}

export { logActivity };
