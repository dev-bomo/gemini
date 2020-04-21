import { Form } from "./Form";

export interface ChangeSet {
    name: string;
    isDeleted: boolean;
    entityName: string;
    forms: Form[]
}