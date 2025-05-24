import { nanoid } from "nanoid";
import crypto from "node:crypto";
import dotenv from "dotenv";

dotenv.config();

class AES256GCM {
	public algorithm = "aes-256-gcm" as const;
	public encryption_key: string;
	public IV_LENGTH = 12;
	public TAG_LENGTH = 16;

	constructor() {
		// biome-ignore lint/style/noNonNullAssertion: is eh nd null (vertrau)
		this.encryption_key = process.env.ENCRYPTION_KEY!;
	}

	generateIV() {
		return Buffer.from(nanoid(this.IV_LENGTH), "utf-8");
	}

	generateSecret() {
		return nanoid(32);
	}

	encrypt(plaintext: string) {
		// Generate a secure IV and create a basic cipher.
		const iv = this.generateIV();
		const key = Buffer.from(this.encryption_key, "hex");

		const cipher = crypto.createCipheriv(this.algorithm, key, iv);

		const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
		const tag = cipher.getAuthTag();

		const payload = Buffer.concat([iv, encrypted, tag]).toString("base64");
		return payload;
	}

	decrypt(payload: string) {
		const rawData = Buffer.from(payload, "base64");
		const key = Buffer.from(this.encryption_key, "hex");

		const iv = rawData.subarray(0, this.IV_LENGTH);
		const encrypted = rawData.subarray(this.IV_LENGTH, rawData.length - this.TAG_LENGTH);
		const tag = rawData.subarray(rawData.length - this.TAG_LENGTH);

		const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
		decipher.setAuthTag(tag);

		const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
		return decrypted.toString("utf8");
	}
}

export const AES = new AES256GCM();
