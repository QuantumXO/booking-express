import { SlotDocument } from './slots.models';
import { PublicUserDto } from '../users/users.dto';

export type SlotDto = Omit<SlotDocument, '_id' | 'contractorId'> & {
  id: string;
  contractor: PublicUserDto;
};
