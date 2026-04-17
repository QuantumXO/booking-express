import { Request, Response } from 'express';
import { slotsService } from './slots.service';
import { SlotDto } from './slots.dto';

export const slotsController = {
  async getSlots(req: Request, res: Response): Promise<void> {
    const slots: SlotDto[] = await slotsService.getSlots();
    res.status(200).json({ slots: slots });
  },
};
