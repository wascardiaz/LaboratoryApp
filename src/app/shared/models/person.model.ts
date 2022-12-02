import { Address } from "./address.model";
import { Title } from "./title.model";
import { User } from "./user.model";

export class PersonDocuType {
  id?: number;
  name?: string;
  status?: string;
}

export class PersonGender {
  id?: number;
  name?: string;
  status?: string;
}

export class Profession {
  id?: number;
  name?: string;
  status?: string;
}

export class CivilState {
  id?: number;
  name?: string;
  status?: string;
}

export class Person {
  id?: number;
  documentTypeId?: number;
  document?: string;
  nickname?: string;
  genderId?: number;
  professionId?: number;
  civilStateId?: number;
  foto?: string;
  documentType?: PersonDocuType;
  title?: Title;
  email?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: PersonGender;
  phoneNo?: string;
  profesion?: Profession;
  civilState?: CivilState;
  address?: Address;
  addresses?: Address[];
  userId?: number;
  created?: string;
  updated?: string;
  createdBy?: User;
  status?: string;
}