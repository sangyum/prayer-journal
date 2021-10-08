import { mock } from 'ts-mockito';
import { DataAccessLayer } from '../application/database';
import { PrayerTopic } from './entities';
import { PrayerTopicManager } from './prayerTopicManager';

describe('PrayerTopicManager', () => {

    let mockedDataAccessLayer: DataAccessLayer<PrayerTopic>;
    let manager: PrayerTopicManager;

    beforeEach(() => {
        mockedDataAccessLayer = mock<DataAccessLayer<PrayerTopic>>();
        manager = new PrayerTopicManager(mockedDataAccessLayer);
    });

    it('should add a prayer topic', async () => {

    })
})