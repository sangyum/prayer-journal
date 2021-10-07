import { User } from "../../domain/entities";

export interface DataAccessLayer<Type> {
    getAll: (owner: User) => Promise<Type[]>;
    getById: (id: string) => Promise<Type>;
    search: (field: string, operator: string, value: any) => Promise<Type[]>;
    add: (document: Type) => Promise<void>;
    addMultiple: (documents: Type[]) => Promise<Type>;
    update: (document: any) => Promise<void>;
    remove: (document: any) => Promise<void>;
}