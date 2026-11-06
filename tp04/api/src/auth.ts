import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { NextFunction, Request, Response } from "express";

const scrypt = promisify(scryptCallback);
const secret = process.env.AUTH_SECRET || "change-this-secret-in-production";

export interface AuthUser {
  id: number;
  username: string;
}

export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
};

export const verifyPassword = async (password: string, storedHash: string): Promise<boolean> => {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) return false;
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  const expectedKey = Buffer.from(key, "hex");
  return expectedKey.length === derivedKey.length && timingSafeEqual(expectedKey, derivedKey);
};

export const createToken = (user: AuthUser): string => {
  const payload = Buffer.from(JSON.stringify({
    ...user,
    exp: Date.now() + 8 * 60 * 60 * 1000
  })).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
};

const readToken = (token: string): AuthUser | null => {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expectedSignature = createHmac("sha256", secret).update(payload).digest("base64url");
  if (signature.length !== expectedSignature.length ||
      !timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AuthUser & { exp: number };
    if (!parsed.id || !parsed.username || parsed.exp < Date.now()) return null;
    return { id: parsed.id, username: parsed.username };
  } catch {
    return null;
  }
};

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authorization = req.header("Authorization");
  const user = authorization?.startsWith("Bearer ")
    ? readToken(authorization.slice(7))
    : null;
  if (!user) {
    res.status(401).json({ message: "Authentification requise." });
    return;
  }
  res.locals.user = user;
  next();
};
