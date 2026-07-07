import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { RefreshTokenStore } from "./auth.types.js";

export class EnvFileRefreshTokenStore implements RefreshTokenStore {
  public constructor(private readonly envFilePath = join(process.cwd(), ".env")) {}

  public async save(refreshToken: string): Promise<void> {
    const currentContent = await this.readCurrentContent();
    const nextContent = this.upsertRefreshToken(currentContent, refreshToken);

    await writeFile(this.envFilePath, nextContent, "utf8");
  }

  private async readCurrentContent(): Promise<string> {
    try {
      return await readFile(this.envFilePath, "utf8");
    } catch {
      return "";
    }
  }

  private upsertRefreshToken(currentContent: string, refreshToken: string): string {
    const tokenLine = `GOOGLE_REFRESH_TOKEN=${refreshToken}`;

    if (currentContent.includes("GOOGLE_REFRESH_TOKEN=")) {
      return currentContent.replace(/^GOOGLE_REFRESH_TOKEN=.*$/m, tokenLine);
    }

    const separator = currentContent.endsWith("\n") || currentContent.length === 0 ? "" : "\n";
    return `${currentContent}${separator}${tokenLine}\n`;
  }
}
