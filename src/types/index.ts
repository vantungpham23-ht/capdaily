export type Category = 'nails' | 'hair' | 'restaurant' | 'eyelash';
export type Language = 'sk' | 'en';

export interface Caption {
  id: string;
  category: Category;
  language: Language;
  content: string;
  icon: string;
  hashtags: string[];
  createdAt: string;
}

export interface CategoryConfig {
  id: Category;
  name: string;
  nameSK: string;
  icon: string;
  color: string;
}
