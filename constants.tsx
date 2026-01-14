
import React from 'react';
import { MysticTrial, GameSession } from './types';

export const COLORS = {
  primary: '#991b1b', 
  accent: '#fbbf24',  
  dark: '#0f172a',    
};

export const BRANDING = {
  name_zh: '博弈乾坤',
  name_en: 'Cosmic Stakes',
  tagline_zh: '天命所归，博弈无界',
  tagline_en: 'Destiny Defined, Strategy Refined'
};

export const AVATARS = Array.from({ length: 36 }, (_, i) => `input_file_${i}.png`);

export const MYSTIC_TRIALS: MysticTrial[] = [
  {
    id: 'streak_3',
    title_zh: '三阳开泰',
    title_en: 'Solar Triple',
    description_zh: '连续三局获得最高分。',
    description_en: 'Win the highest points in 3 consecutive rounds.',
    goal: (s: GameSession) => s.rounds.length >= 3 
  },
  {
    id: 'perfect_round',
    title_zh: '圆满之局',
    title_en: 'Perfect Cycle',
    description_zh: '单局得分超过30分且无扣分。',
    description_en: 'Score over 30 points in a single round with no penalties.',
    goal: (s: GameSession) => s.rounds.some(r => Object.values(r.scores).some(v => (v as number) >= 30))
  }
];

export const PRESET_GAMES = [
  { 
    id: 'doudizhu', 
    name_zh: '斗地主', 
    name_en: 'Fight Landlord', 
    players: 3, 
    decks: 1,
    variants: [
      {
        name_zh: '经典规则',
        name_en: 'Classic',
        description_zh: '【发牌】一副牌54张，每人17张，底牌3张。由叫分最高者当地主。【牌型】单张、对子、顺子(5张起)、连对(3对起)、三带一/二、飞机(连3头)、四带二、炸弹(4张)、王炸。【结算】地主出完则地主胜，反之农民胜。炸弹使倍数翻倍。',
        description_en: '54 cards. Landlord has 20 cards. Peasants have 17. High bidder becomes Landlord. Bombs double points.'
      }
    ]
  },
  { 
    id: 'shengji', 
    name_zh: '升级/拖拉机', 
    name_en: 'Upgrade', 
    players: 4, 
    decks: 2,
    variants: [
      {
        name_zh: '两副牌经典',
        name_en: 'Double Deck',
        description_zh: '【组队】2对2。目标：抢得分牌(5, 10, K)。K/10算10分，5算5分。满80分庄家换边。【级牌】从2打到A。当前级别点数为级牌，与主花色构成主牌序列。【规则】亮主抢权，底牌翻倍，拖拉机(同色对子连对)压制力强。',
        description_en: 'Teams of two. Goal: Capture 5/10/K. Reach 80 points to rotate dealers.'
      }
    ]
  },
  { 
    id: 'gandengyan', 
    name_zh: '干瞪眼', 
    name_en: 'Stare in Vain', 
    players: 4, 
    decks: 1,
    variants: [
      {
        name_zh: '标准玩法',
        name_en: 'Standard',
        description_zh: '【发牌】每人5张。只能打比上家大1点的牌。如上家出5，你只能出6。2是通天牌，可压任何单。3张相同构成炸弹。无牌出时需补牌。先出完手中牌者赢。',
        description_en: '5 cards each. Play exactly 1 point higher. 2 is wild. Bombs are 3 matching ranks.'
      }
    ]
  },
  { 
    id: 'paodekuai', 
    name_zh: '跑得快', 
    name_en: 'Run Fast', 
    players: 3, 
    decks: 1,
    variants: [
      {
        name_zh: '16张经典',
        name_en: '16 Cards',
        description_zh: '【规则】去大小王及3张2和1张A，每人16张。黑桃3必先出。有牌必打。报单必须出大。剩几张扣几分，剩全手或被炸则翻倍。',
        description_en: '16 cards each. Must play if possible. Spades 3 starts.'
      }
    ]
  },
  { 
    id: 'bie7', 
    name_zh: '憋7', 
    name_en: 'Seven-tan', 
    players: 4, 
    decks: 1,
    variants: [
      {
        name_zh: '四人接龙',
        name_en: 'Classic 7',
        description_zh: '【规则】黑桃7首发。只能接已出花色的相邻点数。无牌可接必须选一张扣下。结束比扣牌总点数，最小者胜。全手打出者有大奖。',
        description_en: 'Start with 7s. Build suit sequences. Discard if blocked. Lowest discard sum wins.'
      }
    ]
  },
  { 
    id: 'tianji', 
    name_zh: '田忌赛马', 
    name_en: 'Tian Ji', 
    players: 2, 
    decks: 1,
    variants: [
      {
        name_zh: '策略扑克',
        name_en: 'Strategy',
        description_zh: '【选牌】每人选三张。双方同时揭牌，点数大者胜。核心在于利用最小牌消耗对方最大牌，争取另外两局获胜。三局两胜。',
        description_en: 'Choose 3 cards. Reveal simultaneously. Best of 3. Use clever sacrifice strategy.'
      }
    ]
  },
  { 
    id: 'diepai', 
    name_zh: '叠牌', 
    name_en: 'Stacking', 
    players: 4, 
    decks: 2,
    variants: [
      {
        name_zh: '抢牌战',
        name_en: 'Capture',
        description_zh: '【规则】轮流出一张牌叠放。当你出的牌与顶端牌点数相同，收走全部。收牌张数多者获胜。',
        description_en: 'Stack cards. Match the top card to sweep the stack. Most cards win.'
      }
    ]
  },
  {
    id: 'blackjack',
    name_zh: '21点',
    name_en: 'Blackjack',
    players: 5,
    decks: 4,
    variants: [
      {
        name_zh: '标准规则',
        name_en: 'Standard',
        description_zh: '【点数】2-10原值，JQK=10，A=1或11。最接近21点者胜。闲家可要牌、停牌、双倍或分牌。庄家17点必须停牌。',
        description_en: 'Closest to 21 wins. Dealer stands on 17. JQK=10, A=1/11.'
      }
    ]
  }
];

export const ICONS = {
  Home: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>,
  History: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
  Profile: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>,
  Roster: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0a5.995 5.995 0 0 0-4.058-3.006L12 12.5l-.001.031a6.002 6.002 0 0 0-4.057 3.006m0 0a5.971 5.971 0 0 0-.941 3.197m0 0A5.995 5.995 0 0 0 12 12.5a5.995 5.995 0 0 0 5.058 2.907M12 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6-3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0ZM6 2.25a.75.75 0 0 1 .75.75 2.25 2.25 0 1 1-4.5 0 .75.75 0 0 1 .75-.75Z" /></svg>,
  Back: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>,
  Alarm: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM8.25 21h8.25M6 4.5l-1.5-1.5m15 0-1.5 1.5" /></svg>,
  Edit: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>,
  Scoreboard: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" /></svg>,
  Sword: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10 14L21 3m0 0l-1 4m1-4l-4 1m-4 10a2 2 0 11-4-4 2 2 0 014 4zM7 17l-4 4" /></svg>
};

export const APP_LOGO = ({ className }: { className?: string }) => (
  <div className={`relative flex items-center justify-center bg-gradient-to-br from-amber-200 via-amber-500 to-amber-700 rounded-2xl p-4 shadow-xl ${className || ''}`}>
     <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950">
        <rect x="20" y="10" width="60" height="80" rx="8" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M40 35 L60 35 L50 55 Z" fill="currentColor" /> 
        <circle cx="35" cy="65" r="8" fill="currentColor" />
        <circle cx="65" cy="65" r="8" fill="currentColor" />
     </svg>
  </div>
);
