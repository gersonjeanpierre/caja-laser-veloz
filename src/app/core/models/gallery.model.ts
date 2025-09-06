import { Stand } from "./stand.model";

export interface Gallery {
  id?: string;
  name: string;
  address: string;
  isActive?: boolean;
  stands?: Stand[];
}