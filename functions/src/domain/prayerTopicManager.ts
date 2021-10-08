import { v4 } from "uuid";
import { PrayerTopic, User } from "./entities";
import { DataAccessLayer } from "../application/database";

export interface PrayerTopicManagerInterface {
    get: (id: string) => Promise<PrayerTopic | undefined>;
    getAll: (owner: User) => Promise<PrayerTopic[]>;
    add: (createdBy: User, description: string, tags: string[]) => Promise<PrayerTopic>;
    update: (updatedBy: User, id: string, description: string) => Promise<void>;
    tags: (updatedBy: User, id: string, tags: string[]) => Promise<void>;
    answer: (updatedBy: User, id: string, answer: string) => Promise<void>;
}

export class PrayerTopicManager implements PrayerTopicManagerInterface {
    
    constructor(
        private dataAccessLayer: DataAccessLayer<PrayerTopic>
    ) {

    }

    public async get(id: string): Promise<PrayerTopic | undefined> {
        return await this.dataAccessLayer.getById(id);
    }

    public async getAll(owner: User): Promise<PrayerTopic[]> {
        return await this.dataAccessLayer.getAll(owner);
    }

    public async add(createdBy: User, description: string, tags: string[]): Promise<PrayerTopic> {
        const prayerTopic: PrayerTopic = {
            id: v4(),
            description,
            updates: [],
            tags,
            isAnswered: false,
            createdBy,
            createdAt: new Date()
        };

        await this.dataAccessLayer.add(prayerTopic);

        return prayerTopic;
    };

    public async update(updatedBy: User, id: string, description: string): Promise<void> {
        const prayerTopic = await this.get(id);

        if (prayerTopic) {
            await this.dataAccessLayer.update({
                ...prayerTopic,
                updatedBy,
                updatedAt: new Date(),
                description
            });
        } else {
            throw Error(`Prayer Topic ${id} not found`)
        }
    };

    public async tags(updatedBy: User, id: string, tags: string[]): Promise<void> {
        const prayerTopic = await this.get(id);

        if (prayerTopic) {
            await this.dataAccessLayer.update({
                ...prayerTopic,
                updatedBy,
                updatedAt: new Date(),
                tags
            });
        } else {
            throw Error(`Prayer Topic ${id} not found`)
        }

    };

    public async answer(updatedBy: User, id: string, answer: string): Promise<void> {
        const prayerTopic = await this.get(id);

        if (prayerTopic) {
            await this.dataAccessLayer.update({
                ...prayerTopic,
                isAnswered: true,
                answer,
                answeredAt: new Date(),
                updatedBy
            });
        } else {
            throw Error(`Pryaer Topic ${id} not found`)
        }
    }

}