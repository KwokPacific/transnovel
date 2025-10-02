export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverUrl: string;
}

export interface Chapter {
  id: string;
  bookId: string;
  title: string;
  originalContent: string;
  translatedContent: string;
}

export interface GlossaryTerm {
    id: string;
    original: string;
    translation: string;
    bookId: string;
}

export interface Character {
    id: string;
    name_cn: string;
    name_vi: string;
    alias: string;
    notes?: string;
    address_3rd?: string;
}

export interface CharacterRelation {
    id: string;
    from: string; // Character ID
    to: string; // Character ID
    address: string;
}