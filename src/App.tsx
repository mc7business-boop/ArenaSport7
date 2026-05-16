/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useStickers } from './hooks/useStickers.ts';
import { useAuth } from './hooks/useAuth.ts';
import { TabBar } from './components/TabBar.tsx';
import { StatsOverview } from './components/StatsOverview.tsx';
import { StickerItem } from './components/StickerItem.tsx';
import { QuickAddModal } from './components/QuickAddModal.tsx';
import { TEAMS } from './constants.ts';
import { NewsSection } from './components/NewsSection.tsx';
import { 
  Search, 
  MessageCircle, 
  Share2, 
  Download, 
  Trash2, 
  Github, 
  Repeat, 
  Trophy, 
  LogIn, 
  LogOut, 
  User as UserIcon,
  Camera,
  LayoutGrid,
  Filter,
  CheckCircle2,
  Zap,
  Star,
  Award,
  TrendingUp,
  ShoppingBag,
  Info,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { XP_VALUES, MOCK_ACHIEVEMENTS } from './constants.ts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils.ts';

export default function App() {
  const { user, login, logout, loading: authLoading } = useAuth();
  const { stickers, stats, toggleOwned, addQuantity, parseAndAdd } = useStickers(user?.uid);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTradeCardOpen, setIsTradeCardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const [albumFilter, setAlbumFilter] = useState('main');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showLocation, setShowLocation] = useState(true);

  // Filtering Logic
  const filteredStickers = useMemo(() => {
    return stickers.filter(s => {
      const matchesSearch = s.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.player.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAlbum = albumFilter === 'all' || s.albumId === albumFilter;
      const matchesTeam = teamFilter === 'all' || s.teamId === teamFilter;
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'owned' && s.owned) || 
                           (statusFilter === 'missing' && !s.owned) || 
                           (statusFilter === 'repeated' && (s.quantity ?? 0) > 1);
      return matchesSearch && matchesTeam && matchesStatus && matchesAlbum;
    });
  }, [stickers, searchQuery, teamFilter, statusFilter, albumFilter]);

  // WhatsApp Share Logic
  const handleWhatsAppShare = () => {
    const list = stickers.filter(s => (s.quantity ?? 0) > 1).map(s => s.id).join(', ');
    const missing = stickers.filter(s => !s.owned).slice(0, 20).map(s => s.id).join(', ');
    
    const message = `*Copa Sticker Manager 2026*\n\n🔄 *Tenho repetidas:*\n${list || 'Nenhuma'}\n\n🎯 *Preciso de:*\n${missing}${stickers.filter(s => !s.owned).length > 20 ? '... e outras' : ''}\n\n*Quer trocar?*`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (authLoading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-[#06080F] text-white">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
        <p className="mt-4 font-bold text-slate-500 italic">CARREGANDO ÁLBUM...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06080F] pb-32 text-slate-100 transition-colors selection:bg-yellow-500 selection:text-black">
      <Toaster position="top-right" />
      
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600 blur-[120px] rounded-full"></div>
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-yellow-600 blur-[120px] rounded-full"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#06080F]/60 px-6 py-4 backdrop-blur-2xl border-b border-slate-800/50">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 text-black shadow-lg shadow-amber-900/40">
              <Trophy size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter text-white uppercase italic leading-none">MUNDIAL ECO</h1>
              <div className="flex items-center gap-1.5 mt-1">
                 <div className="px-1.5 py-0.5 rounded-md bg-yellow-400 text-[7px] font-black text-black uppercase tracking-widest leading-none">PREMIUM</div>
                 <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">LVL 24</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!user ? (
              <button 
                onClick={login}
                className="flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-black text-black transition-all hover:bg-yellow-400 active:scale-95"
              >
                <LogIn size={14} />
                <span>ENTRAR</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 rounded-full bg-slate-800/80 border border-slate-700/50 p-1 pr-3">
                <img src={user.photoURL || ''} alt="" className="h-6 w-6 rounded-full border border-slate-600" />
                <span className="text-[10px] font-bold text-slate-300 max-w-[60px] truncate uppercase">{user.displayName?.split(' ')[0]}</span>
                <button onClick={logout} className="text-slate-500 hover:text-red-400 transition-colors">
                  <LogOut size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg p-6 space-y-8 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <StatsOverview stats={stats} />

              {/* Progress Summary Widget */}
              <div className="rounded-3xl bg-slate-900/60 p-6 border border-slate-800/50 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">STATUS DO ÁLBUM</span>
                  </div>
                  <span className="text-[10px] font-black text-white">{(stats.owned / 980 * 100).toFixed(1)}%</span>
                </div>
                <h4 className="text-sm font-black text-white uppercase italic">VOCÊ PRECISA DE <span className="text-yellow-500">{stats.missing}</span> PARA COMPLETAR</h4>
                <div className="h-2 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${(stats.owned / 980 * 100)}%` }}></div>
                </div>
              </div>
              
              {/* Daily Streak Card */}
              <div className="flex items-center justify-between rounded-[2rem] bg-gradient-to-r from-orange-500/20 to-yellow-500/10 p-6 border border-orange-500/20">
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-900/30">
                       <Zap size={24} fill="currentColor" />
                    </div>
                    <div>
                       <h4 className="text-sm font-black uppercase italic text-white leading-none">STREAK DE 4 DIAS</h4>
                       <p className="text-[9px] font-bold text-orange-200/60 uppercase tracking-widest mt-1">Colete hoje para ganhar +{XP_VALUES.STRIKE_DAILY} XP</p>
                    </div>
                 </div>
                 <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={cn("h-1 w-4 rounded-full", i <= 4 ? "bg-orange-500" : "bg-slate-800")}></div>
                    ))}
                 </div>
              </div>

              <section className="space-y-5">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                  <TrendingUp size={14} />
                  RARE STICKER RADAR
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {[
                    { id: 'LEG-01', rarity: 'Mythical', name: 'Pelé', color: 'bg-purple-500/10 border-purple-500/30' },
                    { id: 'LEG-05', rarity: 'Mythical', name: 'Zidane', color: 'bg-purple-500/10 border-purple-500/30' },
                    { id: 'BRA-10', rarity: 'Rare', name: 'Neymar Jr', color: 'bg-yellow-500/10 border-yellow-500/30' },
                    { id: 'ARG-10', rarity: 'Rare', name: 'Lionel Messi', color: 'bg-yellow-500/10 border-yellow-500/30' }
                  ].map(rare => (
                    <div key={rare.id} className={cn("flex-none w-32 rounded-3xl border p-4 text-center space-y-2", rare.color)}>
                      <div className="text-[8px] font-black uppercase tracking-widest text-slate-500">{rare.rarity}</div>
                      <div className="text-lg font-black text-white italic leading-none">{rare.id}</div>
                      <div className="text-[7px] font-bold text-slate-400 uppercase truncate">{rare.name}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-5">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                  <LayoutGrid size={14} />
                  ACELERAR COLEÇÃO
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setIsScannerOpen(true)}
                    className="flex flex-col items-start justify-between rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-700 p-6 text-white shadow-xl shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-95 group relative overflow-hidden"
                  >
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform">
                      <Camera size={120} />
                    </div>
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md mb-4">
                      <Camera size={24} />
                    </div>
                    <div className="text-left">
                      <span className="block text-sm font-black uppercase italic leading-none">SCAN IA</span>
                      <span className="text-[10px] font-medium opacity-70">Identificar figurinha</span>
                    </div>
                  </button>

                  <button 
                    onClick={handleWhatsAppShare}
                    className="flex flex-col items-start justify-between rounded-3xl bg-slate-800/80 border border-slate-700/50 p-6 text-white transition-all hover:bg-slate-800 active:scale-95 group relative overflow-hidden"
                  >
                    <div className="bg-green-500/20 p-2 rounded-xl mb-4 text-green-400">
                      <MessageCircle size={24} />
                    </div>
                    <div className="text-left">
                      <span className="block text-sm font-black uppercase italic leading-none">TROCAR</span>
                      <span className="text-[10px] font-medium opacity-50">Lista via WhatsApp</span>
                    </div>
                  </button>
                </div>
              </section>

              <section className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                    <Trophy size={14} />
                    ELITE DO FUTEBOL
                  </h3>
                </div>
                <div className="space-y-4">
                  {TEAMS.slice(1, 4).map(team => {
                    const teamStickers = stickers.filter(s => s.teamId === team.id);
                    const teamOwned = teamStickers.filter(s => s.owned).length;
                    const teamPercent = Math.round((teamOwned / teamStickers.length) * 100);
                    return (
                      <div key={team.id} className="group relative flex items-center space-x-4 rounded-[2rem] bg-slate-800/40 p-5 border border-slate-800/50 hover:border-slate-700 transition-all">
                          <span className="text-3xl drop-shadow-lg transform group-hover:scale-110 transition-transform">{team.flag}</span>
                          <div className="flex-1">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-xs font-black uppercase tracking-widest text-slate-200">{team.name}</span>
                              <span className="text-[10px] font-bold text-slate-500">{teamOwned} / {teamStickers.length}</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-900">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${teamPercent}%` }}
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
                              />
                            </div>
                          </div>
                      </div>
                    );
                  })}
                </div>
                <button 
                  onClick={() => setActiveTab('album')}
                  className="w-full rounded-2xl bg-white/[0.03] border border-slate-800/50 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 transition-all hover:bg-white/[0.05] hover:text-slate-300"
                >
                  VER TODAS AS 48 SELEÇÕES
                </button>
              </section>
            </motion.div>
          )}

          {activeTab === 'news' && (
            <motion.div
              key="news"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <NewsSection />
            </motion.div>
          )}

          {activeTab === 'album' && (
            <motion.div
              key="album"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">COLEÇÃO 2026</h2>
                
                {/* Horizontal Album Selector */}
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {[
                    { id: 'main', label: 'OFFICIAL' },
                    { id: 'coca-cola', label: 'PROMO' },
                    { id: 'specials', label: 'SPECIALS' },
                    { id: 'legends', label: 'LEGENDS' },
                    { id: 'all', label: 'VIEW ALL' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setAlbumFilter(tab.id)}
                      className={cn(
                        "whitespace-nowrap px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                        albumFilter === tab.id 
                          ? "bg-yellow-500 text-black shadow-lg shadow-yellow-900/40" 
                          : "bg-slate-900/50 text-slate-500 border border-slate-800"
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-yellow-500" size={18} />
                    <input 
                      type="text"
                      placeholder="SEARCH BY NAME OR ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-[2rem] border-none bg-slate-900/60 p-5 pl-14 text-xs font-bold uppercase tracking-widest shadow-2xl ring-1 ring-slate-800/50 transition-all focus:bg-slate-900 focus:ring-2 focus:ring-yellow-500/50 placeholder:text-slate-600"
                    />
                  </div>
                  
                  <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                    <div className="relative">
                      <select 
                        value={teamFilter}
                        onChange={(e) => setTeamFilter(e.target.value)}
                        className="appearance-none rounded-2xl bg-slate-900/80 border border-slate-800 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-300 shadow-lg pr-12"
                      >
                        <option value="all">ALL NATIONS</option>
                        {TEAMS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                      <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={12} />
                    </div>
                    
                    <div className="relative">
                      <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="appearance-none rounded-2xl bg-slate-900/80 border border-slate-800 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-300 shadow-lg pr-12"
                      >
                        <option value="all">STATUS: ANY</option>
                        <option value="owned">COLLECTED</option>
                        <option value="missing">MISSING</option>
                        <option value="repeated">DUPLICATES</option>
                      </select>
                      <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={12} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 md:grid-cols-4">
                {filteredStickers.slice(0, 100).map(s => (
                  <StickerItem key={s.id} sticker={s} onToggle={toggleOwned} onAddQuantity={addQuantity} />
                ))}
              </div>
              
              {filteredStickers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-slate-900 flex items-center justify-center text-slate-700">
                    <Search size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black italic uppercase text-slate-500">NO STICKERS FOUND</h3>
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-2">TRY ADJUSTING YOUR FILTERS</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'trades' && (
            <motion.div
              key="trades"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10 pb-10"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">TRADE HUB</h2>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                   <Repeat size={20} />
                </div>
              </div>

              {/* Trade Builder Card */}
              <div className="rounded-[2.5rem] bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 p-8 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute -top-10 -right-10 h-40 w-40 bg-white/5 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                 
                 <div className="space-y-6">
                    <div>
                       <h3 className="text-2xl font-black italic leading-none uppercase">Matchmaker AI</h3>
                       <p className="text-[10px] text-indigo-200 uppercase tracking-[0.2em] font-bold mt-2">ENCONTRE TROCAS PERFEITAS PRÓXIMAS A VOCÊ</p>
                    </div>

                    <div className="flex gap-4">
                       <div className="flex-1 bg-white/10 rounded-2xl p-4 backdrop-blur-md">
                          <span className="text-[8px] font-black opacity-50 uppercase block mb-1">VOCÊ TEM</span>
                          <span className="text-lg font-black">{stats.repeated} <span className="text-[10px] opacity-70">REPETIDAS</span></span>
                       </div>
                       <div className="flex-1 bg-white/10 rounded-2xl p-4 backdrop-blur-md">
                          <span className="text-[8px] font-black opacity-50 uppercase block mb-1">VOCÊ PRECISA</span>
                          <span className="text-lg font-black">{stats.missing} <span className="text-[10px] opacity-70">FALTANDO</span></span>
                       </div>
                    </div>

                    <button 
                      onClick={handleWhatsAppShare} 
                      className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-4 font-black text-indigo-900 transition-all hover:bg-yellow-400 active:scale-95 shadow-xl group"
                    >
                      <Share2 size={18} className="group-hover:rotate-12 transition-transform" />
                      <span className="text-xs tracking-widest uppercase">EXPORTAR LISTA DE TROCAS</span>
                    </button>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                       <div>
                          <p className="text-[9px] font-black text-indigo-200 uppercase tracking-widest">MINHA TRADE CARD QR</p>
                          <p className="text-[7px] text-white/50 uppercase mt-1">Gere um QR Code para trocas presenciais</p>
                       </div>
                       <button 
                         onClick={() => setIsTradeCardOpen(true)}
                         className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-indigo-900 border-4 border-indigo-500/50 hover:scale-110 transition-transform active:scale-95"
                       >
                          <Share2 size={24} />
                       </button>
                    </div>
                 </div>
              </div>

              {/* Premium Placeholder Ad */}
              <div className="rounded-3xl bg-slate-900/40 p-4 border border-slate-800/50 border-dashed text-center">
                 <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">ADVERTISEMENT / PROMOÇÃO</p>
                 <div className="h-20 flex items-center justify-center mt-2 group cursor-pointer">
                    <span className="text-xs font-black text-slate-700 group-hover:text-yellow-500 transition-colors uppercase italic">COMPRE PACOTES OFICIAIS PANINI</span>
                 </div>
              </div>

              {/* Nearby Collectors Simulation */}
              <div className="space-y-5">
                 <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">COLECIONADORES PRÓXIMOS</h3>
                    <button onClick={() => setIsPrivacyModalOpen(true)} className="text-slate-500 hover:text-blue-500 transition-colors">
                       <Info size={14} />
                    </button>
                 </div>
                 
                 <div className="flex items-center justify-between rounded-2xl bg-slate-900 shadow-lg p-4 border border-slate-800">
                    <div className="flex items-center gap-3">
                       <ShieldCheck size={16} className="text-blue-500" />
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">VISIBILIDADE PÚBLICA</span>
                    </div>
                    <button 
                      onClick={() => setShowLocation(!showLocation)}
                      className={cn(
                        "relative h-6 w-11 rounded-full transition-colors",
                        showLocation ? "bg-blue-600" : "bg-slate-700"
                      )}
                    >
                       <div className={cn(
                         "absolute top-1 h-4 w-4 rounded-full bg-white transition-all shadow-sm",
                         showLocation ? "left-6" : "left-1"
                       )} />
                    </button>
                 </div>

                 {showLocation ? (
                   [
                     { name: 'Ricardo G.', dist: '0.4km', has: 12, needs: 5 },
                     { name: 'Carla Silva', dist: '1.2km', has: 8, needs: 14 },
                     { name: 'Marcos P.', dist: '2.5km', has: 45, needs: 2 }
                   ].map((player, idx) => (
                     <motion.div 
                       key={player.name}
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ delay: idx * 0.1 }}
                       className="flex items-center gap-4 rounded-3xl bg-slate-900/40 border border-slate-800/50 p-5 hover:bg-slate-800/60 transition-all cursor-pointer"
                     >
                       <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-800 flex items-center justify-center text-white font-black italic">
                          {player.name[0]}
                       </div>
                       <div className="flex-1">
                          <div className="flex items-center justify-between">
                             <h4 className="text-sm font-black uppercase tracking-tight text-slate-200">{player.name}</h4>
                             <span className="text-[9px] font-bold text-slate-500 italic uppercase">{player.dist}</span>
                          </div>
                          <div className="mt-2 flex gap-3">
                             <span className="text-[9px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded-md uppercase">TEM {player.has}</span>
                             <span className="text-[9px] font-black text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md uppercase">QUER {player.needs}</span>
                          </div>
                       </div>
                       <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                          <MessageCircle size={18} />
                       </div>
                     </motion.div>
                   ))
                 ) : (
                   <div className="py-10 text-center space-y-4 rounded-3xl border border-dashed border-slate-800">
                      <ShieldCheck size={40} className="mx-auto text-slate-700" />
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-10">Sua localização está oculta. Ative para descobrir outros colecionadores.</p>
                   </div>
                 )}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" className="space-y-8 pb-10">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">PERFIL DO COLECIONADOR</h2>
              
              <div className="flex flex-col items-center bg-slate-900/40 p-10 rounded-[3rem] border border-slate-800/80 shadow-2xl space-y-6">
                 <div className="relative">
                    <img src={user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="" className="h-28 w-28 rounded-full border-4 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]" />
                    <div className="absolute -bottom-2 -right-2 bg-yellow-500 p-2 rounded-xl text-black">
                       <Award size={16} />
                    </div>
                 </div>
                 <div className="text-center">
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">{user?.displayName || 'USER_NAME'}</h3>
                    <div className="flex items-center justify-center gap-2 mt-1">
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">RANK #1,240 GLOBAL 🌍</span>
                       <span className="h-1 w-1 rounded-full bg-slate-700"></span>
                       <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">MASTER COLLECTOR</span>
                    </div>
                 </div>

                 {/* XP Progress Bar */}
                 <div className="w-full space-y-2">
                    <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">
                       <span>LEVEL 24</span>
                       <span>850 / 1200 XP</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-yellow-500 w-[70%]"></div>
                    </div>
                 </div>
                 
                 <div className="flex gap-8 w-full pt-4 border-t border-slate-800/50">
                    <div className="flex-1 text-center">
                       <div className="text-xl font-black text-yellow-500">{stats.owned}</div>
                       <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">OBTIDAS</div>
                    </div>
                    <div className="flex-1 text-center border-x border-slate-800/50">
                       <div className="text-xl font-black text-blue-500">{stats.repeated}</div>
                       <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">REPETIDAS</div>
                    </div>
                    <div className="flex-1 text-center">
                       <div className="text-xl font-black text-red-500">{stats.missing}</div>
                       <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">FALTAM</div>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4">CONQUISTAS RECENTES</h4>
                 <div className="grid grid-cols-2 gap-3">
                    {MOCK_ACHIEVEMENTS.map(ach => (
                      <div key={ach.id} className={cn(
                        "p-4 rounded-[2rem] border transition-all",
                        ach.isUnlocked ? "bg-slate-900 border-yellow-500/30" : "bg-slate-900/40 border-slate-800/80 grayscale opacity-50"
                      )}>
                         <div className="text-2xl mb-2">{ach.icon}</div>
                         <h5 className="text-[10px] font-black uppercase tracking-tight text-white">{ach.title}</h5>
                         <p className="text-[8px] font-bold text-slate-500 uppercase mt-1 leading-tight">{ach.description}</p>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4">MARKETPLACE & TOOLS</h4>
                 <div className="divide-y divide-slate-800/50 rounded-[2.5rem] bg-slate-900/40 border border-slate-800/80 overflow-hidden shadow-2xl">
                    <button className="flex w-full items-center justify-between p-7 transition-colors hover:bg-white/[0.03]">
                      <div className="flex items-center space-x-4">
                        <div className="bg-yellow-500/10 p-3 rounded-2xl text-yellow-500"><ShoppingBag size={20} /></div>
                        <span className="font-black text-xs uppercase tracking-tight">PEDIR ÁLBUM FÍSICO (AFFILIATE)</span>
                      </div>
                    </button>
                    <button className="flex w-full items-center justify-between p-7 transition-colors hover:bg-white/[0.03]">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-500"><TrendingUp size={20} /></div>
                        <span className="font-black text-xs uppercase tracking-tight">MARKET INSIGHTS (PREMIUM)</span>
                      </div>
                    </button>
                    <button onClick={() => toast.success('Exportando para PDF...')} className="flex w-full items-center justify-between p-7 transition-colors hover:bg-white/[0.03]">
                      <div className="flex items-center space-x-4">
                        <div className="bg-red-500/10 p-3 rounded-2xl text-red-400"><Download size={20} /></div>
                        <span className="font-black text-xs uppercase tracking-tight">EXPORTAR PDF (CHECKLIST)</span>
                      </div>
                    </button>
                    <button onClick={() => toast.success('Exportando Excel...')} className="flex w-full items-center justify-between p-7 transition-colors hover:bg-white/[0.03]">
                      <div className="flex items-center space-x-4">
                        <div className="bg-green-500/10 p-3 rounded-2xl text-green-400"><Download size={20} /></div>
                        <span className="font-black text-xs uppercase tracking-tight">EXPORTAR EXCEL (.XLSX)</span>
                      </div>
                    </button>
                    <button className="flex w-full items-center justify-between p-7 transition-colors hover:bg-white/[0.03]">
                      <div className="flex items-center space-x-4">
                        <div className="bg-slate-700/20 p-3 rounded-2xl text-slate-400"><Github size={20} /></div>
                        <span className="font-black text-xs uppercase tracking-tight">IMPORTAR BACKUP</span>
                      </div>
                    </button>
                    {user && (
                      <button onClick={logout} className="flex w-full items-center justify-between p-7 transition-colors hover:bg-red-500/5">
                        <div className="flex items-center space-x-4">
                          <div className="bg-red-900/20 p-3 rounded-2xl text-red-500"><LogOut size={20} /></div>
                          <span className="font-black text-xs uppercase tracking-tight text-red-500">SAIR DA CONTA</span>
                        </div>
                      </button>
                    )}
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed right-6 bottom-32 flex flex-col gap-3 z-30">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsScannerOpen(true)} className="h-14 w-14 rounded-full bg-blue-600 text-white shadow-2xl shadow-blue-900/40 flex items-center justify-center border-4 border-[#06080F]">
          <Camera size={24} />
        </motion.button>
      </div>

      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} onQuickAdd={() => setIsQuickAddOpen(true)} />
      <QuickAddModal isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} onAdd={parseAndAdd} />
      
      <AnimatePresence>
        {isScannerOpen && (
          <ScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onDetected={(id: string) => parseAndAdd(id)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPrivacyModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPrivacyModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm rounded-[2.5rem] bg-slate-900 p-8 border border-slate-800 shadow-2xl">
              <div className="text-center space-y-6">
                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black italic uppercase">PRIVACIDADE E SEGURANÇA</h3>
                  <div className="text-xs text-slate-400 font-medium text-left space-y-4 mt-6 leading-relaxed">
                    <p>• Colecionadores próximos são identificados apenas pela região aproximada.</p>
                    <p>• Seu endereço exato nunca é compartilhado ou exibido para outros usuários.</p>
                    <p>• Você tem controle total sobre sua visibilidade no Trade Hub.</p>
                    <p>• Suas informações pessoais e dados de contato são protegidos e criptografados.</p>
                  </div>
                </div>
                <button onClick={() => setIsPrivacyModalOpen(false)} className="w-full rounded-2xl bg-blue-600 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg active:scale-95 transition-all">ENTENDI</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isTradeCardOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsTradeCardOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative w-full max-w-sm rounded-[3rem] bg-gradient-to-br from-indigo-600 to-indigo-900 p-8 border-4 border-white/10 shadow-[0_0_100px_rgba(79,70,229,0.5)] overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Trophy size={160} />
              </div>
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="h-20 w-20 rounded-full border-4 border-white overflow-hidden shadow-xl">
                   <img src={user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="" className="h-full w-full object-cover" />
                </div>
                <div>
                   <h3 className="text-2xl font-black italic uppercase text-white leading-none">{user?.displayName || 'COLLECTOR'}</h3>
                   <span className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.3em] mt-2 block">OFFICIAL TRADE PASS</span>
                </div>

                <div className="w-full bg-white rounded-[2rem] p-8 mt-4 shadow-2xl flex flex-col items-center gap-6">
                   <div className="h-48 w-48 bg-slate-100 rounded-2xl flex items-center justify-center border-4 border-slate-200 shadow-inner">
                      <div className="flex flex-col items-center text-slate-300">
                         <LayoutGrid size={80} strokeWidth={1} />
                         <span className="text-[8px] font-black uppercase tracking-widest mt-2">QR GENERATED</span>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4 w-full">
                      <div className="text-center">
                         <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">TENHO</p>
                         <p className="text-xl font-black text-indigo-600">{stats.repeated}</p>
                      </div>
                      <div className="text-center">
                         <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">QUERO</p>
                         <p className="text-xl font-black text-indigo-600">{stats.missing}</p>
                      </div>
                   </div>
                </div>

                <button onClick={() => setIsTradeCardOpen(false)} className="w-full rounded-2xl bg-white/10 border border-white/20 py-4 text-xs font-black uppercase tracking-widest text-white active:scale-95 transition-all">CONCLUÍDO</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const ScannerModal = ({ isOpen, onClose, onDetected }: any) => {
  const [scanning, setScanning] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = async (file: File) => {
    setScanning(true);
    setConfidence(0);
    setError(null);

    // Simulate identification progress
    const timer = setInterval(() => {
      setConfidence(prev => (prev < 95 ? prev + 5 : prev));
    }, 150);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const response = await fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 })
        });
        const data = await response.json();
        clearInterval(timer);
        setConfidence(100);
        
        setTimeout(() => {
          if (data.stickerId) {
            onDetected(data.stickerId);
            toast.success(`Figurinha ${data.stickerId} identificada!`, { 
              icon: '🎯',
              style: { background: '#1E293B', color: '#fff', fontWeight: 'bold' }
            });
            onClose();
          } else {
            setError("Não foi possível identificar. Tente outra foto.");
          }
          setScanning(false);
        }, 500);
      } catch (err) {
        clearInterval(timer);
        setError("Erro no servidor de IA.");
        setScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#06080F]/95 backdrop-blur-2xl" />
      <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="relative w-full h-full max-w-lg flex flex-col items-center justify-center p-8">
        
        {/* Scanner Overlay UI */}
        <div className="relative w-full aspect-square max-w-xs overflow-hidden rounded-[3rem] border-2 border-slate-700/50 bg-slate-900 shadow-2xl">
           <div className="absolute inset-0 border-[40px] border-[#06080F]/40 pointer-events-none"></div>
           
           {/* Corner Borders */}
           <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-yellow-500 rounded-tl-2xl"></div>
           <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-yellow-500 rounded-tr-2xl"></div>
           <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-yellow-500 rounded-bl-2xl"></div>
           <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-yellow-500 rounded-br-2xl"></div>

           {/* Scan Line */}
           {scanning && (
             <motion.div 
               animate={{ top: ['0%', '100%', '0%'] }}
               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
               className="absolute left-0 right-0 h-1 bg-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.8)] z-10"
             />
           )}

           <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              {!scanning && !error ? (
                <>
                  <Camera className="text-yellow-500 mb-4" size={48} strokeWidth={1.5} />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">POSICIONE A FIGURINHA</p>
                </>
              ) : scanning ? (
                <div className="space-y-4">
                   <div className="text-5xl font-black italic text-white tracking-tighter">{confidence}%</div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-yellow-500">IA ANALISANDO...</p>
                </div>
              ) : (
                <div className="space-y-4 px-6 text-red-500">
                   <div className="mx-auto h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                      <RefreshCw size={24} />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest leading-loose">{error}</p>
                </div>
              )}
           </div>

           <input type="file" accept="image/*" capture="environment" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload} disabled={scanning} />
        </div>

        <div className="mt-12 text-center space-y-6">
           <h3 className="text-2xl font-black italic uppercase italic tracking-tighter text-white">IA VISION SCANNER</h3>
           <p className="text-xs text-slate-500 font-bold max-w-xs mx-auto">
             Nossa rede neural identifica automaticamente o número, seleção e raridade da figurinha em milissegundos.
           </p>
           
           <div className="flex gap-4 justify-center">
              <button onClick={onClose} className="px-8 h-12 rounded-full bg-white text-black font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">FECHAR SCANNER</button>
              {error && (
                <button className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500 text-black shadow-lg shadow-yellow-900/40 relative">
                  <RefreshCw size={20} />
                  <input type="file" accept="image/*" capture="environment" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload} />
                </button>
              )}
           </div>
        </div>
      </motion.div>
    </div>
  );
};
