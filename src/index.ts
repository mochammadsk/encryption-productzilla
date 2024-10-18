import { encryptFile, decryptFile } from "./encryptor";

async function main() {
  const [, , action, filePath, password] = process.argv;

  if (!action || !filePath || !password) {
    console.log(
      "Penggunaan: ts-node index.ts <encrypt|decrypt> <filePath> <password>"
    );
    process.exit(1);
  }

  if (action === "encrypt") {
    await encryptFile(filePath, password);
  } else if (action === "decrypt") {
    await decryptFile(filePath, password);
  } else {
    console.log('Aksi tidak dikenal. Gunakan "encrypt" atau "decrypt".');
  }
}

main();
