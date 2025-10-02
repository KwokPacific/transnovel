import { Book, Chapter, GlossaryTerm, Character, CharacterRelation } from '../types';

const STORAGE_KEY = 'novelTranslatorData';

export interface AppData {
  books: Book[];
  chapters: Chapter[];
  glossary: GlossaryTerm[];
  characters: Character[];
  relations: CharacterRelation[];
}

export const saveData = (data: AppData): void => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serializedData);
  } catch (error) {
    console.error("Error saving data to localStorage", error);
  }
};

export const loadData = (): AppData | null => {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (serializedData === null) {
      return null;
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.error("Error loading data from localStorage", error);
    return null;
  }
};
