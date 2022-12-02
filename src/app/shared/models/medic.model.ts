import { Person } from "./person.model";

export class MedicSpecialty {
  id?: number;
  name?: string;
  status?: string;
}

export class Medic {
  id?: number;
  person?: Person;
  specialtyId?: number;
  ncfGroupId?: number;
  groupId?: number;
  level?: string;
  type?: string;
  exequatur?: string;
  ctasNum?: string;
  ctasRetention?: string;
  comment?: string;
  ncfPrefix?: string;
  rnc?: string;
  inteCode?: string;
  pagoCode?: string;
  prefix?: string;
  area?: string;
  created?: Date;
  updated?: Date;
  userId?: number;
  status?: boolean;
}