import { create } from 'zustand';

export interface Game {
  title: string;
  img: string;
  price?: string;
  newPrice?: string;
  oldPrice?: string;
  discount?: string;
  subtitle?: string;
  desc?: string;
  status?: string;
  bg?: string;
  name?: string;
}

export interface GameListCategory {
  title: string;
  items: Game[];
}

interface GameStore {
  selectedGame: Game | null;
  isModalOpen: boolean;
  openModal: (game: Game) => void;
  closeModal: () => void;

  carouselGames: Game[];
  isCarouselLoading: boolean;
  fetchCarouselGames: () => Promise<void>;

  freeGames: Game[];
  isFreeLoading: boolean;
  fetchFreeGames: () => Promise<void>;

  highlights: Game[];
  isHighlightsLoading: boolean;
  fetchHighlights: () => Promise<void>;

  gameLists: GameListCategory[];
  isListsLoading: boolean;
  fetchGameLists: () => Promise<void>;
}

export const useGameStore = create<GameStore>((set, get) => ({
  selectedGame: null,
  isModalOpen: false,
  openModal: (game) => set({ selectedGame: game, isModalOpen: true }),
  closeModal: () => set({ selectedGame: null, isModalOpen: false }),

  carouselGames: [],
  isCarouselLoading: true,
  fetchCarouselGames: async () => {
    if (get().carouselGames.length > 0) return;
    set({ isCarouselLoading: true });
    try {
      const res = await fetch('/api/games?type=carousel');
      const data = await res.json();
      set({ carouselGames: data, isCarouselLoading: false });
    } catch {
      set({ isCarouselLoading: false });
    }
  },

  freeGames: [],
  isFreeLoading: true,
  fetchFreeGames: async () => {
    if (get().freeGames.length > 0) return;
    set({ isFreeLoading: true });
    try {
      const res = await fetch('/api/games?type=free');
      const data = await res.json();
      set({ freeGames: data, isFreeLoading: false });
    } catch {
      set({ isFreeLoading: false });
    }
  },

  highlights: [],
  isHighlightsLoading: true,
  fetchHighlights: async () => {
    if (get().highlights.length > 0) return;
    set({ isHighlightsLoading: true });
    try {
      const res = await fetch('/api/games?type=highlights');
      const data = await res.json();
      set({ highlights: data, isHighlightsLoading: false });
    } catch {
      set({ isHighlightsLoading: false });
    }
  },

  gameLists: [],
  isListsLoading: true,
  fetchGameLists: async () => {
    if (get().gameLists.length > 0) return;
    set({ isListsLoading: true });
    try {
      const res = await fetch('/api/games?type=lists');
      const data = await res.json();
      set({ gameLists: data, isListsLoading: false });
    } catch {
      set({ isListsLoading: false });
    }
  },
}));
