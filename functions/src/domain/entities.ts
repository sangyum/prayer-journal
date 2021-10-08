export interface User {
    name: string;
    email: string;
}

export interface Update {
    description: string;
    createdAt: Date;
}

export interface BaseEntity {
    id: string
}

export interface PrayerTopic extends BaseEntity {
    description: string;
    updates: Array<Update>;
    tags: string[]
    createdBy: User,
    createdAt: Date;
    updatedBy?: User,
    updatedAt?: Date;
    answeredAt?: Date;
    isAnswered: boolean;
    answer?: string;
}

