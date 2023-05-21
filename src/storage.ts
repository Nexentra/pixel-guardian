import { NsfwSpy } from '@nsfwspy/browser';

type IStorage = {
    count: number;
    // nsfwSpy: NsfwSpy;
};

const defaultStorage: IStorage = {
    count: 0,
    // nsfwSpy: new NsfwSpy("./model/model.json")
};

export const storage = {
    get: (): Promise<IStorage> =>
        chrome.storage.sync.get(defaultStorage) as Promise<IStorage>,
    set: (value: IStorage): Promise<void> => chrome.storage.sync.set(value),
};