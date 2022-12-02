import { Person } from "./person.model";

export class Employee {
    id: number = 0;
    name?: string;
    location?: string;
    phoneNo?: string;
    person?: Person;
    created?: Date;
    updated?: Date;
    userId?: number;
    status?: boolean;
}
