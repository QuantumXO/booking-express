import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { slotsService } from './slots.service';
import { ContractorSlotListDto, SlotDto, SlotListDto } from './slots.dto';
import { User } from '../users/users.types';
import { getUser } from '../users/users.helpers';
import type { AuthenticatedRequest } from '../auth/auth.request.types';
import { CreateSlotDto, GetSlotsQueryDto, PatchSlotDto } from './slots.validation';
import { Slot } from './slots.models';

export const slotsController = {
  async getSlots(req: Request<ParamsDictionary, unknown, unknown, GetSlotsQueryDto>, res: Response): Promise<void> {
    const filters: GetSlotsQueryDto = req.query;
    const response: SlotListDto = await slotsService.getSlots(filters);
    res.status(200).json(response);
  },
  async getSlotsByContractorId(
    req: Request<{ contractorId: string }, unknown, unknown, GetSlotsQueryDto>,
    res: Response,
  ): Promise<void> {
    const contractorId: string = req.params.contractorId;
    const filters: GetSlotsQueryDto = req.query;
    const response: ContractorSlotListDto = await slotsService.getSlotsByContractorId({
      ...filters,
      contractorId,
    });
    res.status(200).json(response);
  },
  async createSlot(req: AuthenticatedRequest<unknown, unknown, CreateSlotDto>, res: Response): Promise<void> {
    const actor: User = getUser(req);
    const slot: Slot = await slotsService.createSlot(actor, req.body);
    res.status(201).json({ slot });
  },
  async deleteSlot(req: AuthenticatedRequest<{ slotId: string }>, res: Response): Promise<void> {
    const actor: User = getUser(req);
    const slotId: string = req.params.slotId;
    await slotsService.deleteSlot(actor, slotId);
    res.status(204).send();
  },
  async patchSlot(
    req: AuthenticatedRequest<{ slotId: string }, unknown, PatchSlotDto>,
    res: Response,
  ): Promise<void> {
    const actor: User = getUser(req);
    const slotId: string = req.params.slotId;
    const slot: SlotDto = await slotsService.patchSlot(actor, slotId, req.body);
    res.status(200).json({ slot });
  },
  async getContractorSlots(req: AuthenticatedRequest, res: Response): Promise<void> {
    const user: User = getUser(req);
    const slots: SlotDto[] = await slotsService.getContractorSlots(user.id);
    res.status(200).json({ slots });
  },
};
