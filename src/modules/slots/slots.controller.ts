import { Request, Response } from 'express';
import { slotsService } from './slots.service';
import { SlotDto } from './slots.dto';
import { Slot } from './slots.types';
import { User } from '../users/users.types';
import { getUser } from '../users/users.helpers';
import type { AuthenticatedRequest } from '../auth/auth.request.types';

export const slotsController = {
  async getSlots(req: Request, res: Response): Promise<void> {
    const slots: SlotDto[] = await slotsService.getSlots();
    res.status(200).json({ slots: slots });
  },
  async createSlot(req: AuthenticatedRequest, res: Response): Promise<void> {
    const actor: User = getUser(req);
    const slot: Slot = await slotsService.createSlot(actor, req.body);
    res.status(201).json({ slot: slot });
  },
  async deleteSlot(req: AuthenticatedRequest, res: Response): Promise<void> {
    const actor: User = getUser(req);
    const slotId: string = Array.isArray(req.params.slotId) ? req.params.slotId[0] : req.params.slotId;
    await slotsService.deleteSlot(actor, slotId);
    res.status(204).send();
  },
};
