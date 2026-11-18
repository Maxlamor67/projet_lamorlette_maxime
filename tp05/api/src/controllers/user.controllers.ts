import { Request, Response } from "express";
import db from "../models";
import { createToken, hashPassword, verifyPassword } from "../auth";

const Users = db.users;

const getId = (req: Request): number | null => {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const parseUsername = (body: unknown): string | null => {
  if (!body || typeof body !== "object") return null;
  const username = (body as Record<string, unknown>).username;
  if (typeof username !== "string" || username.trim() === "") return null;
  return username.trim();
};

const parsePassword = (body: unknown): string | null => {
  if (!body || typeof body !== "object") return null;
  const password = (body as Record<string, unknown>).password;
  return typeof password === "string" && password.length >= 6 ? password : null;
};

const isStrongPassword = (password: string): boolean =>
  password.length >= 8 && /[A-Z]/.test(password) && /[^A-Za-z0-9]/.test(password);

const passwordsMatch = (body: unknown): boolean => {
  if (!body || typeof body !== "object") return false;
  const payload = body as Record<string, unknown>;
  return payload.password === payload.passwordConfirmation;
};

const publicUser = (user: InstanceType<typeof Users>): { id: number; username: string } => ({
  id: user.id,
  username: user.username
});

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await Users.findAll({ order: [["id", "ASC"]] });
    res.status(200).json(users.map(publicUser));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs: " + message });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const id = getId(req);
  if (id === null) {
    res.status(400).json({ message: "L'identifiant doit être un entier positif." });
    return;
  }
  try {
    const user = await Users.findByPk(id);
    if (!user) {
      res.status(404).json({ message: `Aucun utilisateur trouvé avec l'id=${id}.` });
      return;
    }
    res.status(200).json(publicUser(user));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur: " + message });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const username = parseUsername(req.body);
  const password = parsePassword(req.body);
  if (!username) {
    res.status(400).json({ message: "Le nom d'utilisateur est obligatoire." });
    return;
  }
  if (!password || !isStrongPassword(password)) {
    res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un caractère spécial." });
    return;
  }
  if (!passwordsMatch(req.body)) {
    res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
    return;
  }
  try {
    const user = await Users.create({ username, passwordHash: await hashPassword(password) });
    res.status(201).json(publicUser(user));
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "SequelizeUniqueConstraintError") {
      res.status(409).json({ message: "Ce nom d'utilisateur existe déjà." });
      return;
    }
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: "Erreur lors de la création de l'utilisateur: " + message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const username = parseUsername(req.body);
  const password = parsePassword(req.body);
  if (!username || !password) {
    res.status(400).json({ message: "Le nom d'utilisateur et un mot de passe d'au moins 6 caractères sont obligatoires." });
    return;
  }
  try {
    const user = await Users.findOne({ where: { username } });
    if (!user || !user.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
      res.status(401).json({ message: "Identifiants invalides." });
      return;
    }
    res.status(200).json({ user: publicUser(user), token: createToken(publicUser(user)) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: "Erreur lors de la connexion: " + message });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const id = getId(req);
  const username = parseUsername(req.body);
  const password = parsePassword(req.body);
  if (id === null) {
    res.status(400).json({ message: "L'identifiant doit être un entier positif." });
    return;
  }
  if (!username || !password) {
    res.status(400).json({ message: "Le nom d'utilisateur et un mot de passe d'au moins 6 caractères sont obligatoires." });
    return;
  }
  try {
    const user = await Users.findByPk(id);
    if (!user) {
      res.status(404).json({ message: `Aucun utilisateur trouvé avec l'id=${id}.` });
      return;
    }
    await user.update({ username, passwordHash: await hashPassword(password) });
    res.status(200).json(publicUser(user));
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "SequelizeUniqueConstraintError") {
      res.status(409).json({ message: "Ce nom d'utilisateur existe déjà." });
      return;
    }
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: "Erreur lors de la modification de l'utilisateur: " + message });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const id = getId(req);
  if (id === null) {
    res.status(400).json({ message: "L'identifiant doit être un entier positif." });
    return;
  }
  try {
    const deleted = await Users.destroy({ where: { id } });
    if (deleted === 0) {
      res.status(404).json({ message: `Aucun utilisateur trouvé avec l'id=${id}.` });
      return;
    }
    res.status(204).send();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur: " + message });
  }
};

export default { getAll, getById, create, login, update, remove };
