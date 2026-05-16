/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Team, StickerCategory, Sticker } from './types.ts';

export const TEAMS: Team[] = [
  { id: 'FWC', name: 'FIFA World Cup', flag: '🏆' },
  // CONCACAF (Hosts + others)
  { id: 'USA', name: 'EUA', flag: '🇺🇸', group: 'A' },
  { id: 'MEX', name: 'México', flag: '🇲🇽', group: 'B' },
  { id: 'CAN', name: 'Canadá', flag: '🇨🇦', group: 'C' },
  { id: 'CRC', name: 'Costa Rica', flag: '🇨🇷' },
  { id: 'PAN', name: 'Panamá', flag: '🇵🇦' },
  { id: 'JAM', name: 'Jamaica', flag: '🇯🇲' },
  // CONMEBOL
  { id: 'ARG', name: 'Argentina', flag: '🇦🇷' },
  { id: 'BRA', name: 'Brasil', flag: '🇧🇷' },
  { id: 'URU', name: 'Uruguai', flag: '🇺🇾' },
  { id: 'COL', name: 'Colômbia', flag: '🇨🇴' },
  { id: 'ECU', name: 'Equador', flag: '🇪🇨' },
  { id: 'PAR', name: 'Paraguai', flag: '🇵🇾' },
  { id: 'CHI', name: 'Chile', flag: '🇨🇱' },
  // UEFA
  { id: 'FRA', name: 'França', flag: '🇫🇷' },
  { id: 'ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'ESP', name: 'Espanha', flag: '🇪🇸' },
  { id: 'GER', name: 'Alemanha', flag: '🇩🇪' },
  { id: 'ITA', name: 'Itália', flag: '🇮🇹' },
  { id: 'POR', name: 'Portugal', flag: '🇵🇹' },
  { id: 'NED', name: 'Holanda', flag: '🇳🇱' },
  { id: 'BEL', name: 'Bélgica', flag: '🇧🇪' },
  { id: 'CRO', name: 'Croácia', flag: '🇭🇷' },
  { id: 'SUI', name: 'Suíça', flag: '🇨🇭' },
  { id: 'DEN', name: 'Dinamarca', flag: '🇩🇰' },
  { id: 'SRB', name: 'Sérvia', flag: '🇷🇸' },
  { id: 'POL', name: 'Polônia', flag: '🇵🇱' },
  // CAF
  { id: 'MAR', name: 'Marrocos', flag: '🇲🇦' },
  { id: 'SEN', name: 'Senegal', flag: '🇸🇳' },
  { id: 'NGA', name: 'Nigéria', flag: '🇳🇬' },
  { id: 'EGY', name: 'Egito', flag: '🇪🇬' },
  { id: 'TUN', name: 'Tunísia', flag: '🇹🇳' },
  { id: 'CMR', name: 'Camarões', flag: '🇨🇲' },
  { id: 'GHA', name: 'Gana', flag: '🇬🇭' },
  { id: 'ALG', name: 'Argélia', flag: '🇩🇿' },
  // AFC
  { id: 'JPN', name: 'Japão', flag: '🇯🇵' },
  { id: 'KOR', name: 'Coreia do Sul', flag: '🇰🇷' },
  { id: 'AUS', name: 'Austrália', flag: '🇦🇺' },
  { id: 'KSA', name: 'Arábia Saudita', flag: '🇸🇦' },
  { id: 'IRN', name: 'Irã', flag: '🇮🇷' },
  { id: 'IRQ', name: 'Iraque', flag: '🇮🇶' },
  { id: 'UZB', name: 'Uzbequistão', flag: '🇺🇿' },
  // OFC
  { id: 'NZL', name: 'Nova Zelândia', flag: '🇳🇿' },
  // Extras for expansion/special
  { id: 'STA', name: 'Estádios', flag: '🏟️' },
  { id: 'MUS', name: 'Museu FIFA', flag: '🏛️' },
].slice(0, 48); // Ensure exactly 48 for the demo context

export const CATEGORIES = Object.values(StickerCategory);

export const TOTAL_STICKERS_COUNT = 980;

export const generateInitialAlbum = (): Sticker[] => {
  const stickers: Sticker[] = [];
  
  // 1. MAIN ALBUM (Teams) - 48 teams * 19 stickers each = 912
  TEAMS.forEach(team => {
    const stickersPerTeam = 19;
    for (let i = 1; i <= stickersPerTeam; i++) {
       const category = i === 1 ? StickerCategory.SHINY : StickerCategory.NORMAL;
       const rarity = i === 1 ? 'Rare' : 'Common';
      stickers.push({
        id: `${team.id}-${i}`,
        slug: `stickers/${team.id}-${i}`,
        number: i,
        teamId: team.id,
        player: i === 1 ? 'Shield' : i === 2 ? 'Team Photo' : `Star Player ${i}`,
        category,
        rarity: rarity as any,
        albumId: 'main',
        sportId: 'soccer',
        owned: false,
        quantity: 0,
      });
    }
  });

  // 2. COCA-COLA EXCLUSIVE - 8 stickers
  for (let i = 1; i <= 8; i++) {
    stickers.push({
      id: `CC-${i}`,
      slug: `stickers/CC-${i}`,
      number: i,
      teamId: 'FWC',
      player: `Coca-Cola Fan ${i}`,
      category: StickerCategory.COCA_COLA,
      rarity: 'Legendary',
      albumId: 'coca-cola',
      sportId: 'soccer',
      owned: false,
      quantity: 0,
    });
  }

  // 3. SPECIALS (Stadiums & Museum) - 30 stickers
  for (let i = 1; i <= 30; i++) {
    stickers.push({
      id: `SP-${i}`,
      slug: `stickers/SP-${i}`,
      number: i,
      teamId: i <= 15 ? 'STA' : 'MUS',
      player: i <= 15 ? `Stadium ${i}` : `History Item ${i}`,
      category: i <= 15 ? StickerCategory.STADIUM : StickerCategory.MUSEUM,
      rarity: 'Rare',
      albumId: 'specials',
      sportId: 'soccer',
      owned: false,
      quantity: 0,
    });
  }

  // 4. LEGENDS / MYTHICALS - 30 stickers
  for (let i = 1; i <= 30; i++) {
    stickers.push({
      id: `LEG-${i}`,
      slug: `stickers/LEG-${i}`,
      number: i,
      teamId: 'FWC',
      player: `World Cup Legend ${i}`,
      category: StickerCategory.LEGEND,
      rarity: 'Mythical',
      albumId: 'legends',
      sportId: 'soccer',
      owned: false,
      quantity: 0,
    });
  }

  return stickers;
};

export const XP_VALUES = {
  STRIKE_DAILY: 100,
  SCAN_STICKER: 50,
  TRADE_COMPLETED: 200,
  ALBUM_COMPLETED: 5000,
  SECTION_COMPLETED: 500,
  RARITY_STREAK: 300,
};

export const MOCK_ACHIEVEMENTS = [
  { id: '1', title: 'Primeiros Passos', description: 'Obtenha suas primeiras 10 figurinhas', icon: '🐣', xpReward: 100, isUnlocked: true },
  { id: '2', title: 'Mestre dos Shields', description: 'Complete todos os escudos de uma seção', icon: '🛡️', xpReward: 500, isUnlocked: false },
  { id: '3', title: 'Scanner de Elite', description: 'Escaneie 50 figurinhas com IA', icon: '📸', xpReward: 300, isUnlocked: true },
  { id: '4', title: 'Lendário', description: 'Encontre sua primeira figurinha Mythical', icon: '✨', xpReward: 1000, isUnlocked: false },
];

export const MOCK_NEWS = [
  {
    id: '1',
    title: 'Panini anuncia novas figurinhas Black Parallel para 2026',
    summary: 'A coleção de 2026 trará uma raridade inédita: as Black Parallels numbering individual.',
    content: 'A Panini confirmou que as figurinhas Black Parallel estarão disponíveis em pacotes selecionados em todo o mundo. Diferente das edições anteriores, cada figurinha terá um número de série único, tornando-as os itens mais cobiçados por colecionadores.',
    image: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=2070&auto=format&fit=crop',
    category: 'Panini',
    author: 'Marco Silva',
    publishedAt: new Date().toISOString(),
    featured: true
  },
  {
    id: '2',
    title: 'Brasil inicia preparação na Granja Comary',
    summary: 'A seleção brasileira começou os treinos focada na estreia contra a Croácia.',
    content: 'Com o elenco completo, Dorival Júnior comandou o primeiro treino tático. Neymar treinou normalmente e parece recuperado 100% para o torneio.',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop',
    category: 'Brazil',
    author: 'Ana Costa',
    publishedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Evento de trocas gigante em São Paulo neste domingo',
    summary: 'Milhares de colecionadores se reunirão no Estádio do Pacaembu para trocas.',
    content: 'O evento oficial chancelado pela FIFA promete reunir mais de 5.000 pessoas. Haverá áreas divididas por raridade de figurinhas para facilitar as trocas.',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2105&auto=format&fit=crop',
    category: 'Market',
    author: 'Luís Henrique',
    publishedAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Mbappé: "Queremos levar a taça de volta para Paris"',
    summary: 'O capitão da França falou sobre as expectativas para o Mundial 2026.',
    content: 'Em entrevista coletiva, Kylian Mbappé destacou a união do grupo francês e o desejo de conquistar o tricampeonato mundial após o vice em 2022.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070&auto=format&fit=crop',
    category: 'World Cup',
    author: 'Jean Dupont',
    publishedAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Guia de Raridades: Como identificar uma Legend Mythical',
    summary: 'Dicas práticas para não ser enganado em trocas de figurinhas raras.',
    content: 'As figurinhas Mythical possuem um holograma prismático exclusivo que muda de cor dependendo do ângulo. Verifique sempre o verso para autenticidade.',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2070&auto=format&fit=crop',
    category: 'Rare',
    author: 'Sticker Master',
    publishedAt: new Date().toISOString()
  }
];
