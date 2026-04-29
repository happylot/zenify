import { readdir, rm } from "node:fs/promises";
import path from "node:path";

const nextDir = path.join(process.cwd(), ".next");

async function removeDsStoreFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch((error) => {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return [];
    }

    throw error;
  });

  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await removeDsStoreFiles(entryPath);
        return;
      }

      if (entry.isFile() && entry.name === ".DS_Store") {
        await rm(entryPath, { force: true });
      }
    }),
  );
}

await removeDsStoreFiles(nextDir);
