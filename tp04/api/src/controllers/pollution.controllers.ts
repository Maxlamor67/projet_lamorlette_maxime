import { Request, Response } from "express";
import db from "../models";

const Pollutions = db.pollutions;
interface PollutionPayload {
  ville: string;
  valeur: number;
  polluant: string;
  date: string;
  description?: string | null;
}

const getId = (req: Request): number | null => {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const parsePayload = (body: unknown): PollutionPayload | string => {
  if (!body || typeof body !== "object") {
    return "Le corps de la requête est invalide.";
  }

  const payload = body as Record<string, unknown>;
  if (typeof payload.ville !== "string" || payload.ville.trim() === "") {
    return "La ville est obligatoire.";
  }
  if (typeof payload.polluant !== "string" || payload.polluant.trim() === "") {
    return "Le polluant est obligatoire.";
  }
  if (typeof payload.valeur !== "number" || !Number.isFinite(payload.valeur)) {
    return "La valeur doit être un nombre.";
  }
  if (typeof payload.date !== "string" || payload.date.trim() === "") {
    return "La date est obligatoire.";
  }
  if (payload.description !== undefined && payload.description !== null && typeof payload.description !== "string") {
    return "La description doit être une chaîne de caractères.";
  }
  return {
    ville: payload.ville,
    valeur: payload.valeur,
    polluant: payload.polluant,
    date: payload.date,
    description: payload.description
  };
};

const pickPayload = (body: PollutionPayload): PollutionPayload => ({
  ville: body.ville.trim(),
  valeur: body.valeur,
  polluant: body.polluant.trim(),
  date: body.date,
  description: body.description?.trim() || null
});

/**
 * Récupère la liste de toutes les mesures de pollution depuis la base PostgreSQL.
 */
export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await Pollutions.findAll({
      order: [["id", "ASC"]]
    });
    res.status(200).json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: "Erreur lors de la récupération des données de pollution: " + message
    });
  }
};

/**
 * Récupère une mesure de pollution par son identifiant.
 */
export const getById = async (req: Request, res: Response): Promise<void> => {
  const id = getId(req);
  if (id === null) {
    res.status(400).json({ message: "L'identifiant doit être un entier positif." });
    return;
  }
  try {
    const data = await Pollutions.findByPk(id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({
        message: `Aucune pollution trouvée avec l'id=${id}.`
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: `Erreur lors de la récupération de la pollution id=${id}: ` + message
    });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const parsedPayload = parsePayload(req.body);
  if (typeof parsedPayload === "string") {
    res.status(400).json({ message: parsedPayload });
    return;
  }

  try {
    const pollution = await Pollutions.create(pickPayload(parsedPayload));
    res.status(201).json(pollution);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: "Erreur lors de la création de la pollution: " + message });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const id = getId(req);
  if (id === null) {
    res.status(400).json({ message: "L'identifiant doit être un entier positif." });
    return;
  }
  const parsedPayload = parsePayload(req.body);
  if (typeof parsedPayload === "string") {
    res.status(400).json({ message: parsedPayload });
    return;
  }

  try {
    const pollution = await Pollutions.findByPk(id);
    if (!pollution) {
      res.status(404).json({ message: `Aucune pollution trouvée avec l'id=${id}.` });
      return;
    }
    await pollution.update(pickPayload(parsedPayload));
    res.status(200).json(pollution);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: "Erreur lors de la modification de la pollution: " + message });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const id = getId(req);
  if (id === null) {
    res.status(400).json({ message: "L'identifiant doit être un entier positif." });
    return;
  }

  try {
    const deleted = await Pollutions.destroy({ where: { id } });
    if (deleted === 0) {
      res.status(404).json({ message: `Aucune pollution trouvée avec l'id=${id}.` });
      return;
    }
    res.status(204).send();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: "Erreur lors de la suppression de la pollution: " + message });
  }
};

export default { getAll, getById, create, update, remove };
