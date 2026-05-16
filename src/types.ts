/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum StickerCategory {
  NORMAL = 'Normal',
  SHINY = 'Brilhante',
  RARE = 'Rara',
  LEGEND = 'Legend',
  COCA_COLA = 'Coca-Cola',
  STADIUM = 'Estádio',
  MUSEUM = 'Museu',
}

export interface Sticker {
  id: string; // e.g., "BRA-10"
  slug: string; // unique across album, e.g., "stickers/BRA-10"
  number: number;
  teamId: string;
  player: string;
  category: StickerCategory;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary' | 'Mythical';
  albumId: string; // "main", "coca-cola", "parallels"
  sportId: string; // "soccer", "nba", "pokemon"
  owned?: boolean;
  quantity?: number;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: any;
  lastLoginAt?: any;
  level: number;
  xp: number;
  isPremium: boolean;
  totalOwned: number;
  totalRepeated: number;
  rank?: number;
  badges: string[];
  bio?: string;
  location?: {
    lat: number;
    lng: number;
    city: string;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  isUnlocked: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: 'World Cup' | 'Brazil' | 'Transfers' | 'Panini' | 'Rare' | 'Community' | 'Market';
  author: string;
  publishedAt: any;
  featured?: boolean;
  readCount?: number;
}

export interface UserSticker {
  stickerId: string;
  quantity: number;
  updatedAt: any;
}

export interface Team {
  id: string;
  name: string;
  flag: string;
  group?: string;
  color?: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: any;
  totalOwned: number;
  totalRepeated: number;
}
