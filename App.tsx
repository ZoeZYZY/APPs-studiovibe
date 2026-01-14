
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  Language, Gender, Player, ScoreRound, GameSession, UserProfile 
} from './types';
import { 
  COLORS, AVATARS, PRESET_GAMES, ICONS, APP_LOGO, BRANDING, MYSTIC_TRIALS 
} from './constants';
import { getMysticAnalysis } from './services/geminiService';

// --- Utility ---
const getLunarInfo = () => {
  const date = new Date();
  const year = date.getFullYear();
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const element = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水'];
  const stemIdx = (year - 4) % 10;
  const branchIdx = (year - 4) % 12;
  return {
    lunar: `${stems[stemIdx]}${branches[branchIdx]}年`,
    fiveElements: element[stemIdx],
    lucky: '利博弈，宜稳中求进',
    unlucky: '忌急躁，当定气神'
  };
};

const AvatarFallback: React.FC<{ name: string; size?: string }> = ({ name, size = "w-14 h-14" }) => (
  <div className={`${size} rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-amber-500 font-black shadow-inner overflow-hidden relative`}>
    <span className="text-[10px] uppercase z-10">{name.substring(0, 2)}</span>
    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent opacity-50"></div>
  </div>
);

const AvatarImage: React.FC<{ src: string; name: string; className?: string }> = ({ src, name, className = "w-14 h-14 rounded-full border-2 border-slate-700 shadow-md object-cover" }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const sizeClasses = className.split(' ').filter(c => c.startsWith('w-') || c.startsWith('h-')).join(' ');

  if (error) return <AvatarFallback name={name} size={sizeClasses} />;

  return (
    <div className={`relative ${sizeClasses}`}>
      {loading && (
        <div className={`absolute inset-0 rounded-full bg-slate-800 animate-pulse flex items-center justify-center`}>
          <div className="w-1/2 h-1/2 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
        </div>
      )}
      <img 
        src={src} 
        alt={name} 
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`} 
        onLoad={() => setLoading(false)}
        onError={() => setError(true)} 
      />
    </div>
  );
};

// --- Sub-Components ---

const GameView: React.FC<{
  session: GameSession;
  lang: Language;
  onAddRound: (scores: Record<string, number>) => void;
  onExit: () => void;
  mysticComment: string;
}> = ({ session, lang, onAddRound, onExit, mysticComment }) => {
  const [currentInput, setCurrentInput] = useState<Record<string, number>>({});
  const t = (zh: string, en: string) => lang === Language.ZH ? zh : en;

  const totals = useMemo(() => {
    const res: Record<string, number> = {};
    session.players.forEach(p => { 
      res[p.id] = session.rounds.reduce((acc, r) => acc + (Number(r.scores[p.id]) || 0), 0); 
    });
    return res;
  }, [session]);

  const handleStep = (id: string, step: number) => {
    setCurrentInput(prev => ({ ...prev, [id]: (Number(prev[id]) || 0) + step }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 animate-in fade-in duration-500">
      <header className="p-5 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 flex justify-between items-center border-b border-slate-800/50">
        <button onClick={onExit} className="p-2 bg-slate-800 rounded-xl"><ICONS.Back /></button>
        <div className="text-center">
          <span className="font-black text-amber-500 block text-xs tracking-widest uppercase truncate max-w-[150px]">{session.name}</span>
          <span className="text-[10px] text-slate-500 font-mono italic">ROUND {session.rounds.length + 1}</span>
        </div>
        <button onClick={onExit} className="p-2 text-red-500 hover:bg-red-950/20 rounded-xl transition-all"><ICONS.Trash /></button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 pb-72 space-y-4">
        {session.players.map(p => (
          <div key={p.id} className="bg-slate-900/80 p-5 rounded-[2.5rem] border border-slate-800 flex items-center gap-5 shadow-2xl">
            <div className="flex items-center gap-3 w-1/3">
              <AvatarImage src={p.avatar} name={p.name} />
              <div className="overflow-hidden">
                <p className="text-sm font-black text-slate-100 truncate">{p.name}</p>
                <p className="text-[9px] text-amber-500 font-mono italic uppercase">WARRIOR</p>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-end gap-3">
              <button onClick={() => handleStep(p.id, -1)} className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black">-</button>
              <input 
                type="number" 
                className="w-16 h-14 bg-slate-800/50 border-none rounded-3xl text-center text-xl font-black text-amber-400 outline-none focus:bg-slate-800"
                value={currentInput[p.id] ?? 0}
                onChange={e => setCurrentInput({...currentInput, [p.id]: parseInt(e.target.value) || 0})}
              />
              <button onClick={() => handleStep(p.id, 1)} className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black">+</button>
            </div>
          </div>
        ))}

        {mysticComment && (
          <div className="px-6 py-5 bg-amber-500/5 border border-amber-500/20 rounded-[2.5rem] animate-in slide-in-from-top-4 duration-700">
            <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.3em] mb-2">{t('乾坤洞见', 'Cosmic Insight')}</p>
            <p className="text-sm italic text-amber-100/90 leading-relaxed font-serif">“ {mysticComment} ”</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900/95 backdrop-blur-3xl border-t border-slate-800/50 p-6 pb-10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-6 rounded-t-[3.5rem] z-30">
        <div className="flex justify-around items-end px-2">
          {session.players.map(p => (
            <div key={p.id} className="flex flex-col items-center">
              <span className="text-slate-500 text-[9px] mb-1 font-black uppercase tracking-widest truncate w-16 text-center">{p.name}</span>
              <span className={`text-2xl font-black ${totals[p.id] >= 0 ? 'text-amber-500' : 'text-red-500'}`}>{totals[p.id]}</span>
            </div>
          ))}
        </div>
        <button onClick={() => { onAddRound(currentInput); setCurrentInput({}); }} className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-black py-4 rounded-[2rem] text-lg uppercase tracking-[0.3em] active:scale-95 transition-all shadow-xl">
          {t("封存此局", "Lock Round")}
        </button>
      </div>
    </div>
  );
};

const HistoryView: React.FC<{ history: GameSession[]; lang: Language; onBack: () => void; }> = ({ history, lang, onBack }) => {
  const t = (zh: string, en: string) => lang === Language.ZH ? zh : en;
  return (
    <div className="flex flex-col min-h-screen p-6 pb-24 bg-slate-950 animate-in fade-in duration-300">
      <div className="flex items-center gap-4 mb-8"><button onClick={onBack} className="p-2 bg-slate-800 rounded-full"><ICONS.Back /></button><h2 className="text-2xl font-bold uppercase">{t("战迹乾坤", "Records")}</h2></div>
      <div className="space-y-6 overflow-y-auto pr-1">
        {history.length === 0 ? <div className="text-center py-20 opacity-30 italic">{t("尚无战史...", "No records...")}</div> : history.map(session => (
          <div key={session.id} className="bg-slate-900/60 p-6 rounded-[3rem] border border-slate-800 shadow-xl space-y-4">
            <div className="flex justify-between items-start">
              <div><h3 className="font-black text-amber-500 uppercase tracking-widest text-sm">{session.name}</h3><p className="text-[9px] text-slate-500 font-mono">{new Date(session.startTime).toLocaleString()}</p></div>
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Rounds: {session.rounds.length}</p>
            </div>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={session.rounds.map((r, idx) => {
                  const p: any = { round: idx + 1 };
                  session.players.forEach(pl => p[pl.name] = session.rounds.slice(0, idx+1).reduce((acc, cur) => acc + (Number(cur.scores[pl.id]) || 0), 0));
                  return p;
                })}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" /><XAxis dataKey="round" hide /><YAxis stroke="#475569" fontSize={8} /><Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                  {session.players.map((p, i) => <Line key={p.id} type="monotone" dataKey={p.name} stroke={['#f59e0b', '#ef4444', '#3b82f6', '#10b981'][i%4]} strokeWidth={2} dot={{ r: 2 }} />)}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<'login' | 'home' | 'setup' | 'game' | 'history' | 'profile' | 'roster'>('login');
  const [lang, setLang] = useState<Language>(Language.ZH);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<GameSession | null>(null);
  const [history, setHistory] = useState<GameSession[]>(() => JSON.parse(localStorage.getItem('bq_history') || '[]'));
  const [roster, setRoster] = useState<Player[]>(() => JSON.parse(localStorage.getItem('bq_roster') || '[]'));
  const [mysticComment, setMysticComment] = useState<string>('');
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showAlarmSettings, setShowAlarmSettings] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [limitMinutes, setLimitMinutes] = useState<number>(0);
  const [limitRounds, setLimitRounds] = useState<number>(0);

  const [phoneInput, setPhoneInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [setupMode, setSetupMode] = useState<'custom' | 'preset'>('custom');
  const [selectedPresetId, setSelectedPresetId] = useState(PRESET_GAMES[0].id);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [shouldRollDice, setShouldRollDice] = useState(false);
  const [diceWinner, setDiceWinner] = useState<Player | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState(AVATARS[0]);

  useEffect(() => { localStorage.setItem('bq_history', JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem('bq_roster', JSON.stringify(roster)); }, [roster]);
  useEffect(() => { const t = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const t = (zh: string, en: string) => lang === Language.ZH ? zh : en;

  const handleLogin = () => {
    if (!phoneInput || !passInput) return;
    let u = roster.find(p => (p as UserProfile).phone === phoneInput) as UserProfile | undefined;
    if (!u) {
      u = { id: Math.random().toString(36).substr(2, 9), phone: phoneInput, password: passInput, name: t('新道友', 'New Traveler'), avatar: AVATARS[0], gender: Gender.MALE, badges: [], stats: { totalGames: 0, wins: 0, totalScore: 0, playTimeMinutes: 0, gameTypeCounts: {} } };
      setRoster(prev => [...prev, u!]);
    }
    setUser(u); setView('home');
  };

  const startNewGame = (ignoreDice = false) => {
    const players = roster.filter(p => selectedPlayerIds.includes(p.id));
    if (players.length < 2) return;
    if (shouldRollDice && !diceWinner && !ignoreDice) { handleDiceRoll(); return; }
    const p = PRESET_GAMES.find(g => g.id === selectedPresetId);
    setSession({ 
      id: Math.random().toString(36).substr(2, 9), 
      name: setupMode === 'custom' ? t('自定义计分', 'Custom Match') : t(p?.name_zh || '', p?.name_en || ''), 
      players, 
      rounds: [], 
      startTime: Date.now(), 
      type: setupMode, 
      presetId: setupMode === 'preset' ? selectedPresetId : undefined, 
      variantIndex: selectedVariantIdx,
      limitTime: limitMinutes > 0 ? limitMinutes : undefined,
      limitRounds: limitRounds > 0 ? limitRounds : undefined
    });
    setDiceWinner(null); setIsRolling(false); setView('game');
  };

  const handleDiceRoll = () => {
    setIsRolling(true);
    setTimeout(() => { const ps = roster.filter(p => selectedPlayerIds.includes(p.id)); setDiceWinner(ps[Math.floor(Math.random() * ps.length)]); setIsRolling(false); }, 1500);
  };

  const handleAddRound = (scores: Record<string, number>) => {
    if (!session) return;
    const ns = { ...session, rounds: [...session.rounds, { id: Math.random().toString(36).substr(2,9), timestamp: Date.now(), scores }] };
    setSession(ns); getMysticAnalysis(scores, lang).then(setMysticComment);
  };

  const finishGame = (save: boolean) => {
    if (save && session && session.rounds.length > 0) {
      setHistory([{ ...session, endTime: Date.now() }, ...history]);
      setRoster(roster.map(p => {
        const inG = session.players.find(sp => sp.id === p.id);
        if (!inG) return p;
        const s = session.rounds.reduce((acc, r) => acc + (Number(r.scores[p.id]) || 0), 0);
        return { ...p, stats: { ...p.stats, totalGames: p.stats.totalGames + 1, totalScore: p.stats.totalScore + s } };
      }));
    }
    setSession(null); setShowExitConfirm(false); setView('home');
  };

  const saveEdit = () => {
    if (!editingPlayerId) return;
    const updated = roster.map(p => p.id === editingPlayerId ? { ...p, name: editName, avatar: editAvatar } : p);
    setRoster(updated);
    if (user?.id === editingPlayerId) setUser({ ...user!, name: editName, avatar: editAvatar });
    setEditingPlayerId(null);
  };

  return (
    <div className="max-w-md mx-auto bg-slate-950 min-h-screen relative shadow-2xl overflow-x-hidden font-sans text-slate-200">
      {view === 'login' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <APP_LOGO className="w-20 h-20 mb-6" />
          <h1 className="text-4xl font-bold mb-2 text-red-600 uppercase tracking-widest">{t(BRANDING.name_zh, BRANDING.name_en)}</h1>
          <p className="text-amber-500 mb-8 italic text-sm">{t(BRANDING.tagline_zh, BRANDING.tagline_en)}</p>
          <div className="w-full max-sm:px-4 space-y-4 bg-slate-900/50 p-8 rounded-3xl border border-slate-800 shadow-xl">
            <input type="text" placeholder={t("手机号", "Phone")} value={phoneInput} onChange={e => setPhoneInput(e.target.value)} className="w-full bg-slate-800 px-4 py-3 rounded-2xl outline-none border border-slate-700 focus:border-amber-500 transition-all" />
            <input type="password" placeholder={t("密码", "Password")} value={passInput} onChange={e => setPassInput(e.target.value)} className="w-full bg-slate-800 px-4 py-3 rounded-2xl outline-none border border-slate-700 focus:border-amber-500 transition-all" />
            <button onClick={handleLogin} className="w-full bg-red-800 py-4 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all">{t("觉醒入谱", "Begin Journey")}</button>
          </div>
        </div>
      )}

      {view === 'home' && (
        <div className="flex flex-col min-h-screen pb-20">
          <div className="p-6 bg-gradient-to-b from-red-950/40 to-slate-950 pt-12 border-b border-red-900/20 flex justify-between items-center">
            <div><h2 className="text-2xl font-bold text-amber-500">{t("运势大盘", "Fortune")}</h2><p className="text-slate-400 text-[10px] mt-1 uppercase">{currentTime.toLocaleString()}</p></div>
            <button onClick={() => setShowAlarmSettings(true)} className="p-2.5 bg-slate-800 border border-amber-500 rounded-2xl text-amber-500 shadow-lg"><ICONS.Alarm /></button>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <button onClick={() => { setSetupMode('custom'); setView('setup'); }} className="h-40 bg-slate-900 border border-slate-800 rounded-[2rem] flex flex-col items-center justify-center active:scale-95 transition-all shadow-lg">
              <div className="text-3xl mb-3 text-red-600"><ICONS.Scoreboard /></div><span className="font-black text-[10px] uppercase tracking-widest">{t("自定义计分", "Custom")}</span>
            </button>
            <button onClick={() => { setSetupMode('preset'); setView('setup'); }} className="h-40 bg-slate-900 border border-slate-800 rounded-[2rem] flex flex-col items-center justify-center active:scale-95 transition-all shadow-lg">
              <div className="text-3xl mb-3">🃏</div><span className="font-black text-[10px] uppercase tracking-widest">{t("经典名局", "Classic")}</span>
            </button>
          </div>
          <div className="px-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><span className="w-1 h-5 bg-red-600 rounded-full"></span>{t("天命试炼", "Trials")}</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {MYSTIC_TRIALS.map(tr => (
                <div key={tr.id} className="flex-shrink-0 w-48 bg-slate-900/50 border border-slate-800 rounded-[2rem] p-5 shadow-lg">
                  <div className="text-amber-500 font-black text-[11px] mb-2 uppercase">{t(tr.title_zh, tr.title_en)}</div>
                  <p className="text-[10px] text-slate-400 h-8 overflow-hidden">{t(tr.description_zh, tr.description_en)}</p>
                  <button className="mt-3 text-[10px] text-amber-500 font-black uppercase underline" onClick={() => { setSetupMode('preset'); setView('setup'); }}>{t("接受", "Accept")}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === 'setup' && (
        <div className="flex flex-col min-h-screen bg-slate-950 pb-44">
          <div className="p-6 flex items-center gap-4 bg-slate-950 sticky top-0 z-10 border-b border-slate-800">
            <button onClick={() => setView('home')} className="p-1.5 bg-slate-800 rounded-full"><ICONS.Back /></button>
            <h2 className="text-xl font-bold uppercase">{setupMode === 'custom' ? t("准备", "Setup") : t("名局", "Preset")}</h2>
          </div>
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {setupMode === 'preset' && (
              <div className="space-y-6 animate-in slide-in-from-top-2">
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_GAMES.map(g => (
                    <button key={g.id} onClick={() => { setSelectedPresetId(g.id); setSelectedVariantIdx(0); }} className={`p-3 rounded-2xl border-2 text-left transition-all ${selectedPresetId === g.id ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-900'}`}>
                      <p className="font-black text-[10px] uppercase truncate">{t(g.name_zh, g.name_en)}</p>
                    </button>
                  ))}
                </div>
                {PRESET_GAMES.find(g => g.id === selectedPresetId) && (
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-[2rem] shadow-xl">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">{t('规则', 'Rules')}</p>
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <p className="text-[11px] italic text-slate-300 leading-relaxed">
                        {t(PRESET_GAMES.find(g=>g.id===selectedPresetId)?.variants[selectedVariantIdx].description_zh || '', PRESET_GAMES.find(g=>g.id===selectedPresetId)?.variants[selectedVariantIdx].description_en || '')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="bg-slate-900/80 p-6 rounded-[2.5rem] border border-slate-800 shadow-xl">
              <div className="flex justify-between items-center mb-5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t("参战玩家", "Players")}</label>
                <button onClick={() => setView('roster')} className="p-1.5 bg-slate-800 rounded-lg text-amber-500"><ICONS.Plus /></button>
              </div>
              <div className="flex flex-wrap gap-4">
                {roster.map(p => (
                  <button key={p.id} onClick={() => setSelectedPlayerIds(prev => prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id])} className="flex flex-col items-center group">
                    <AvatarImage src={p.avatar} name={p.name} className={`w-12 h-12 rounded-full border-2 transition-all ${selectedPlayerIds.includes(p.id) ? 'border-amber-500 scale-105 shadow-lg' : 'border-slate-700 grayscale opacity-40'}`} />
                    <span className={`text-[8px] mt-1 font-black uppercase truncate w-12 text-center ${selectedPlayerIds.includes(p.id) ? 'text-amber-500' : 'text-slate-500'}`}>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div onClick={() => setShouldRollDice(!shouldRollDice)} className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 flex justify-between items-center cursor-pointer active:scale-95 transition-all shadow-lg">
              <p className="font-black text-[10px] uppercase tracking-widest text-slate-200">{t("掷骰先手", "Roll Turn")}</p>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${shouldRollDice ? 'bg-amber-500' : 'bg-slate-700'}`}><div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${shouldRollDice ? 'left-5.5' : 'left-0.5'}`}></div></div>
            </div>
          </div>
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-40 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent pt-6 pointer-events-none">
            <button onClick={() => startNewGame()} disabled={selectedPlayerIds.length < 2} className={`pointer-events-auto w-full py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-lg shadow-2xl transition-all ${selectedPlayerIds.length < 2 ? 'bg-slate-800 text-slate-600' : 'bg-red-800 text-white active:scale-95'}`}>{t("大显乾坤", "Start")}</button>
          </div>
        </div>
      )}

      {view === 'roster' && (
        <div className="flex flex-col min-h-screen p-6 pb-24">
          <div className="flex items-center gap-4 mb-8"><button onClick={() => setView('home')} className="p-2 bg-slate-800 rounded-full"><ICONS.Back /></button><h2 className="text-2xl font-bold uppercase">{t("名录", "Roster")}</h2></div>
          <div className="flex-1 overflow-y-auto space-y-4">
            {roster.map(p => (
              <div key={p.id} className="bg-slate-900/40 p-4 rounded-[2rem] border border-slate-800 flex items-center gap-4 shadow-md">
                <AvatarImage src={p.avatar} name={p.name} className="w-12 h-12 rounded-full border border-slate-700" />
                <div className="flex-1 overflow-hidden"><p className="font-black text-slate-100 truncate text-sm">{p.name}</p></div>
                <button onClick={() => { setEditingPlayerId(p.id); setEditName(p.name); setEditAvatar(p.avatar); }} className="p-2 bg-slate-800 rounded-xl text-amber-500"><ICONS.Edit /></button>
              </div>
            ))}
            <button onClick={() => { const n = roster.length + 1; setRoster([...roster, { id: Math.random().toString(36).substr(2, 9), name: `${t('道友', 'W')} ${n}`, avatar: AVATARS[n % 36], gender: Gender.MALE, badges: [], stats: { totalGames: 0, wins: 0, totalScore: 0, playTimeMinutes: 0, gameTypeCounts: {} } }]); }} className="w-full py-4 border-2 border-dashed border-slate-800 rounded-[2rem] flex items-center justify-center gap-2 text-slate-500 font-black uppercase text-xs">{t("新增道友", "Add Player")}</button>
          </div>
        </div>
      )}

      {view === 'history' && <HistoryView history={history} lang={lang} onBack={() => setView('home')} />}
      {view === 'game' && session && <GameView session={session} lang={lang} onAddRound={handleAddRound} onExit={() => setShowExitConfirm(true)} mysticComment={mysticComment} />}
      
      {view === 'profile' && (
        <div className="flex flex-col min-h-screen p-6 pb-24 text-center">
          <div className="flex items-center gap-4 mb-6"><button onClick={() => setView('home')} className="p-2 bg-slate-800 rounded-full"><ICONS.Back /></button><h2 className="text-xl font-bold uppercase">{t("档案", "Profile")}</h2></div>
          <div className="bg-slate-900/50 p-8 rounded-[3rem] border border-slate-800 shadow-2xl relative mb-8 overflow-hidden">
            <button onClick={() => { if(user) { setEditingPlayerId(user.id); setEditName(user.name); setEditAvatar(user.avatar); } }} className="absolute top-6 right-6 p-2 bg-slate-800 rounded-xl text-amber-500 z-10 shadow-lg"><ICONS.Edit /></button>
            <AvatarImage src={user?.avatar || ''} name={user?.name || ''} className="w-24 h-24 rounded-full border-4 border-amber-500 mx-auto mb-4 bg-slate-800 shadow-xl" />
            <h3 className="text-2xl font-black text-amber-500 uppercase tracking-widest">{user?.name}</h3>
            <p className="text-slate-500 mt-1 font-mono text-[10px]">{user?.phone}</p>
          </div>
          <button onClick={() => setLang(lang === Language.ZH ? Language.EN : Language.ZH)} className="w-full bg-slate-900/80 p-5 rounded-[2rem] border border-slate-800 flex justify-between font-black uppercase text-xs shadow-md active:scale-95 transition-all"><span>{t("语言", "Language")}</span><span className="text-amber-500">{lang}</span></button>
          <button onClick={() => { setUser(null); setView('login'); }} className="w-full bg-red-950/20 border border-red-900/40 p-5 rounded-[2rem] text-red-500 font-black uppercase mt-10 shadow-xl active:scale-95 transition-all text-xs tracking-widest">{t("归隐山林", "Sign Out")}</button>
        </div>
      )}

      {/* Global Modals */}
      
      {editingPlayerId && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in">
           <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] w-full max-w-sm shadow-2xl space-y-6">
              <h3 className="text-lg font-black text-amber-500 text-center uppercase tracking-widest">{t('修缮信息', 'Edit')}</h3>
              <div className="grid grid-cols-4 gap-3 max-h-56 overflow-y-auto pb-2 scrollbar-hide">
                {AVATARS.map(a => (
                  <div key={a} onClick={() => setEditAvatar(a)} className={`relative w-full aspect-square rounded-xl border-2 transition-all cursor-pointer bg-slate-800 overflow-hidden ${editAvatar === a ? 'border-amber-500 scale-105 shadow-md' : 'border-slate-800 opacity-60'}`}>
                    <AvatarImage src={a} name="Avatar" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <input type="text" className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-3 outline-none text-white font-black text-sm focus:border-amber-500 transition-all" value={editName} onChange={e => setEditName(e.target.value)} />
              <div className="flex gap-4"><button onClick={saveEdit} className="flex-1 bg-amber-500 text-slate-950 font-black py-3 rounded-2xl active:scale-95 transition-all text-xs uppercase">{t('锁定', 'Save')}</button><button onClick={() => setEditingPlayerId(null)} className="flex-1 bg-slate-800 text-slate-400 font-bold py-3 rounded-2xl text-xs uppercase">{t('取消', 'Cancel')}</button></div>
           </div>
        </div>
      )}

      {showAlarmSettings && (
        <div className="fixed inset-0 z-[900] flex items-center justify-center p-8 bg-slate-950/95 backdrop-blur-xl animate-in fade-in">
           <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] w-full max-w-sm space-y-6 shadow-2xl">
              <h3 className="text-xl font-black text-amber-500 text-center uppercase tracking-widest">{t('计时', 'Timer')}</h3>
              <div className="space-y-4">
                 <div><label className="text-[9px] font-black text-slate-500 uppercase">{t('分钟限制', 'Min')}</label><input type="number" value={limitMinutes} onChange={e => setLimitMinutes(parseInt(e.target.value) || 0)} className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-3 mt-1 text-white font-black focus:border-amber-500"/></div>
                 <div><label className="text-[9px] font-black text-slate-500 uppercase">{t('局数限制', 'Rounds')}</label><input type="number" value={limitRounds} onChange={e => setLimitRounds(parseInt(e.target.value) || 0)} className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-3 mt-1 text-white font-black focus:border-amber-500"/></div>
              </div>
              <button onClick={() => setShowAlarmSettings(false)} className="w-full bg-amber-500 text-slate-950 font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-xs uppercase">{t('确定', 'Confirm')}</button>
           </div>
        </div>
      )}

      {showExitConfirm && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-8 bg-slate-950/95 backdrop-blur-3xl animate-in zoom-in-95">
           <div className="bg-slate-900 border border-red-900/20 p-10 rounded-[3.5rem] w-full max-w-sm text-center space-y-8 shadow-2xl">
              <div className="text-4xl">🚩</div><h3 className="text-xl font-black text-red-500 uppercase tracking-widest">{t("结束对局？", "End Game?")}</h3>
              <div className="flex flex-col gap-3">
                 <button onClick={() => finishGame(true)} className="w-full bg-amber-500 text-slate-950 font-black py-4 rounded-2xl active:scale-95 transition-all uppercase tracking-widest text-xs">{t("保存并退出", "Save & Exit")}</button>
                 <button onClick={() => finishGame(false)} className="w-full border-2 border-red-900/50 text-red-500 font-black py-3 rounded-2xl active:scale-95 transition-all uppercase tracking-widest text-xs">{t("直接退出", "Abandon")}</button>
                 <button onClick={() => setShowExitConfirm(false)} className="w-full text-slate-500 text-[10px] font-black uppercase tracking-widest">{t("继续对战", "Continue")}</button>
              </div>
           </div>
        </div>
      )}

      {(isRolling || diceWinner) && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8 bg-slate-950/98 backdrop-blur-2xl animate-in fade-in">
           <div className="bg-slate-900 border-2 border-amber-900/30 p-10 rounded-[3.5rem] w-full max-w-sm text-center space-y-8 animate-in zoom-in-75">
              <h3 className="text-xl font-black text-amber-500 uppercase tracking-[0.2em]">{t("先手天命", "Destiny")}</h3>
              <div className="relative h-40 flex items-center justify-center">{isRolling ? <div className="text-8xl animate-bounce">🎲</div> : <div className="flex flex-col items-center"><AvatarImage src={diceWinner?.avatar || ''} name={diceWinner?.name || ''} className="w-20 h-20 rounded-full border-4 border-amber-500 shadow-xl mb-4 bg-slate-800 object-cover" /><p className="text-xl font-black text-white uppercase truncate w-40">{diceWinner?.name}</p><p className="text-[10px] text-amber-500 font-black mt-2 animate-pulse">{t("先手入局！", "Takes the Lead!")}</p></div>}</div>
              {!isRolling && <button onClick={() => startNewGame(true)} className="w-full bg-amber-500 text-slate-950 font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-widest text-xs">{t("领命", "Accept")}</button>}
           </div>
        </div>
      )}

      {view !== 'login' && view !== 'game' && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900/95 backdrop-blur-3xl border-t border-slate-800/50 h-20 flex items-center justify-around z-[400] rounded-t-[2.5rem] shadow-2xl px-4">
          <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1 transition-all ${view === 'home' ? 'text-amber-500 scale-105' : 'text-slate-600 opacity-60'}`}><ICONS.Home /><span className="text-[8px] font-black uppercase">{t("大厅", "Main")}</span></button>
          <button onClick={() => setView('roster')} className={`flex flex-col items-center gap-1 transition-all ${view === 'roster' ? 'text-amber-500 scale-105' : 'text-slate-600 opacity-60'}`}><ICONS.Roster /><span className="text-[8px] font-black uppercase">{t("名录", "Warriors")}</span></button>
          <button onClick={() => setView('history')} className={`flex flex-col items-center gap-1 transition-all ${view === 'history' ? 'text-amber-500 scale-105' : 'text-slate-600 opacity-60'}`}><ICONS.History /><span className="text-[8px] font-black uppercase">{t("战迹", "Record")}</span></button>
          <button onClick={() => setView('profile')} className={`flex flex-col items-center gap-1 transition-all ${view === 'profile' ? 'text-amber-500 scale-105' : 'text-slate-600 opacity-60'}`}><ICONS.Profile /><span className="text-[8px] font-black uppercase">{t("我的", "Self")}</span></button>
        </nav>
      )}
    </div>
  );
};

export default App;
