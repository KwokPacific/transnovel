import { Book, Chapter, GlossaryTerm, Character, CharacterRelation } from '../types';
import { mockBooks, mockChapters, mockGlossary, mockCharacters, mockRelations } from '../data/mockData';
import { saveData, loadData, AppData } from './storage';

// Initialize state from localStorage or mock data
const initialData: AppData = loadData() || {
  books: [...mockBooks],
  chapters: [...mockChapters],
  glossary: [...mockGlossary],
  characters: [...mockCharacters],
  relations: [...mockRelations],
};

let books: Book[] = initialData.books;
let chapters: Chapter[] = initialData.chapters;
let glossary: GlossaryTerm[] = initialData.glossary;
let characters: Character[] = initialData.characters;
let relations: CharacterRelation[] = initialData.relations;

// Helper to persist current state to localStorage
const persist = () => {
  saveData({ books, chapters, glossary, characters, relations });
};

// Helper to generate a unique ID
const generateId = () => new Date().getTime().toString() + Math.random().toString(36).substr(2, 9);

// Book functions
export const getBooks = (): Book[] => books;

export const getBook = (id: string): Book | undefined => books.find(b => b.id === id);

export const addBook = (bookData: Omit<Book, 'id' | 'coverUrl'>): Book => {
  const newBook: Book = {
    ...bookData,
    id: generateId(),
    coverUrl: `https://picsum.photos/seed/${generateId()}/300/400`
  };
  books.push(newBook);
  persist();
  return newBook;
};

export const updateBook = (updatedBook: Book): Book => {
  books = books.map(b => b.id === updatedBook.id ? updatedBook : b);
  persist();
  return updatedBook;
};

export const deleteBook = (id: string): void => {
  books = books.filter(b => b.id !== id);
  // Also delete related data
  chapters = chapters.filter(c => c.bookId !== id);
  glossary = glossary.filter(g => g.bookId !== id);
  persist();
};

// Chapter functions
export const getChapters = (bookId: string): Chapter[] => chapters.filter(c => c.bookId === bookId);

export const getChapter = (bookId: string, chapterId: string): Chapter | undefined => 
  chapters.find(c => c.bookId === bookId && c.id === chapterId);

export const addChapter = (chapterData: Omit<Chapter, 'id'>): Chapter => {
    const newChapter: Chapter = {
        ...chapterData,
        id: generateId(),
    };
    chapters.push(newChapter);
    persist();
    return newChapter;
};

export const updateChapter = (updatedChapter: Chapter): Chapter => {
    chapters = chapters.map(c => c.id === updatedChapter.id ? updatedChapter : c);
    persist();
    return updatedChapter;
};


// Glossary functions
export const getGlossary = (): GlossaryTerm[] => glossary.sort((a,b) => a.original.localeCompare(b.original));

export const getGlossaryForBook = (bookId: string): GlossaryTerm[] => {
    return getGlossary().filter(term => term.bookId === bookId);
};

// FIX: Corrected typo in function name from addGlossoryTerm to addGlossaryTerm.
export const addGlossaryTerm = (termData: Omit<GlossaryTerm, 'id'>): GlossaryTerm => {
    const newTerm: GlossaryTerm = {
        ...termData,
        id: generateId(),
    };
    glossary.push(newTerm);
    persist();
    return newTerm;
};

export const updateGlossaryTerm = (updatedTerm: GlossaryTerm): GlossaryTerm => {
    glossary = glossary.map(g => g.id === updatedTerm.id ? updatedTerm : g);
    persist();
    return updatedTerm;
};

export const deleteGlossaryTerm = (id: string): void => {
    glossary = glossary.filter(g => g.id !== id);
    persist();
};


// Character functions
export const getCharacters = (): Character[] => characters;

export const getCharactersForBook = (bookId?: string): Character[] => {
    // In a real app, characters would be linked to books. Here we return all for simplicity.
    return characters;
};

export const addCharacter = (charData: Omit<Character, 'id'>): Character => {
    const newChar: Character = {
        ...charData,
        id: generateId(),
    };
    characters.push(newChar);
    persist();
    return newChar;
};

export const updateCharacter = (updatedChar: Character): Character => {
    characters = characters.map(c => c.id === updatedChar.id ? updatedChar : c);
    persist();
    return updatedChar;
};

export const deleteCharacter = (id: string): void => {
    characters = characters.filter(c => c.id !== id);
    // Also delete relations involving this character
    relations = relations.filter(r => r.from !== id && r.to !== id);
    persist();
};

// Relation functions
export const getRelations = (): CharacterRelation[] => relations;

export const getRelationsForBook = (bookId?: string): CharacterRelation[] => {
    // In a real app, relations would be linked to books. Here we return all for simplicity.
    return relations;
}

export const addRelation = (relationData: Omit<CharacterRelation, 'id'>): CharacterRelation => {
    const newRelation: CharacterRelation = {
        ...relationData,
        id: generateId(),
    };
    relations.push(newRelation);
    persist();
    return newRelation;
};