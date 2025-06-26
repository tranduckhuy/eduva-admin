import { Status } from '../../../shared/models/common/entity-status';

export interface CreditPack {
  id: number;
  name: string;
  price: number;
  credits: number;
  bonusCredits: number;
  status: Status;
}
