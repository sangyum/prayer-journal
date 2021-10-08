import { BaseEntity, User } from "../../domain/entities";

export interface DataAccessLayer<Type extends BaseEntity> {
    getAll: (owner: User) => Promise<Type[]>;
    getById: (id: string) => Promise<Type | undefined>;
    search: (field: string, operator: string, value: any) => Promise<Type[]>;
    add: (document: Type) => Promise<void>;
    addMultiple: (documents: Type[]) => Promise<void>;
    update: (document: Type) => Promise<void>;
    remove: (id: string) => Promise<void>;
};