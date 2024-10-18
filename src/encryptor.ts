import * as crypto from "crypto";
import * as fs from "fs/promises";
import * as path from "path";
import { logActivity } from "./logger";

const algorithm = "aes-256-cbc";
const iv = crypto.randomBytes(16); // Inisialisasi vektor acak (IV)

async function encryptFile(filePath: string, password: string): Promise<void> {
  try {
    logActivity(`Mulai mengenkripsi file ${filePath}`);
    const key = crypto.scryptSync(password, "salt", 32); // Buat kunci enkripsi dari password
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    const fileData = await fs.readFile(filePath);
    const encryptedData = Buffer.concat([
      cipher.update(fileData),
      cipher.final(),
    ]);
    const encryptedFilePath = path.join(
      path.dirname(filePath),
      path.basename(filePath, path.extname(filePath)) + "_encrypted.txt"
    );

    await fs.writeFile(encryptedFilePath, Buffer.concat([iv, encryptedData]));
    logActivity(
      `Berhasil mengenkripsi file ${filePath} menjadi ${encryptedFilePath}`
    );
    console.log(
      `File '${filePath}' berhasil dienkripsi menjadi '${encryptedFilePath}'`
    );
  } catch (error) {
    const err = error as Error;
    logActivity(`Error ketika mengenkripsi file: ${err.message}`);
    console.error(`Error: ${err.message}`);
  }
}

async function decryptFile(filePath: string, password: string): Promise<void> {
  try {
    logActivity(`Mulai mendekripsi file ${filePath}`);
    const key = crypto.scryptSync(password, "salt", 32);
    const fileData = await fs.readFile(filePath);

    const iv = fileData.slice(0, 16); // Ambil IV dari file yang terenkripsi
    const encryptedData = fileData.slice(16); // Ambil data yang terenkripsi

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    const decryptedData = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);
    const originalFilePath = path.join(
      path.dirname(filePath),
      path.basename(filePath, "_encrypted.txt") + "_decrypted.txt"
    );

    await fs.writeFile(originalFilePath, decryptedData);
    logActivity(
      `Berhasil mendekripsi file ${filePath} menjadi ${originalFilePath}`
    );
    console.log(
      `File '${filePath}' berhasil didekripsi menjadi '${originalFilePath}'`
    );
  } catch (error) {
    const err = error as Error;
    logActivity(`Error ketika mendekripsi file: ${err.message}`);
    console.error(`Error: ${err.message}`);
  }
}

export { encryptFile, decryptFile };
