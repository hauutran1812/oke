import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { VocabWord } from '../types';
import { playKoreanSpeech } from '../utils/audio';
import { gameAudio } from '../utils/gameAudio';
import {
  Pickaxe,
  Trophy,
  Users,
  Sparkles,
  Share2,
  Copy,
  Check,
  Flame,
  Volume2,
  RotateCcw,
  Zap,
  Bomb,
  ShoppingBag,
  ArrowRight,
  Clock,
  Coins,
  Crown,
  BookmarkPlus,
  Play,
  VolumeX,
  Target,
  ExternalLink,
} from 'lucide-react';

// Miner Item Types
type MinerItemType = 'gold_small' | 'gold_med' | 'gold_big' | 'diamond' | 'rock' | 'bag' | 'tnt';

interface MineItem {
  id: string;
  type: MinerItemType;
  x: number;
  y: number;
  radius: number;
  value: number;
  mass: number; // Higher mass = pulls slower
  word?: VocabWord;
  color: string;
  icon?: string;
  isBlownUp?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
}

export const VocabGame: React.FC = () => {
  const { words, userProfile, updateUserProfile, openSaveWordModal, openPronounceModal } = useApp();

  // Topik level selection for mining vocabulary
  const [selectedTopikLevel, setSelectedTopikLevel] = useState<string>('all');
  
  // Game mode: 'single' (vượt ải theo màn) or 'duel' (thách đấu điểm số với bạn bè)
  const [gameMode, setGameMode] = useState<'single' | 'duel'>('single');
  
  // Sound mute toggle
  const [isMuted, setIsMuted] = useState(false);

  // Multiplayer Room State
  const [roomCode, setRoomCode] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlRoom = params.get('gameRoom') || params.get('room');
      if (urlRoom) return urlRoom.toUpperCase();
    }
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `GOLD-${rand}`;
  });
  const [inputJoinCode, setInputJoinCode] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Game Flow States: 'lobby' | 'playing' | 'shop' | 'gameover' | 'victory'
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'shop' | 'gameover' | 'victory'>('lobby');

  // Progression & Stats
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentGold, setCurrentGold] = useState(0);
  const [levelTargetGold, setLevelTargetGold] = useState(650);
  const [timeLeft, setTimeLeft] = useState(60);
  const [comboStreak, setComboStreak] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [minedWords, setMinedWords] = useState<VocabWord[]>([]);
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState(0);
  const [totalQuestionsCorrect, setTotalQuestionsCorrect] = useState(0);

  // Power-up Inventory
  const [dynamiteCount, setDynamiteCount] = useState(2);
  const [hasPowerDrink, setHasPowerDrink] = useState(false);
  const [hasDiamondPolish, setHasDiamondPolish] = useState(false);
  const [hasLuckyClover, setHasLuckyClover] = useState(false);

  // Rival Score in Duel Mode
  const [rivalScore, setRivalScore] = useState(0);
  const [rivalName] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      return p.get('inviter') || 'Bạn bè thách đấu';
    }
    return 'Bạn bè thách đấu';
  });

  // Active Vocab Question Challenge (when pulling an item)
  const [activeVocabChallenge, setActiveVocabChallenge] = useState<{
    item: MineItem;
    question: {
      word: VocabWord;
      options: string[];
      correctAnswer: string;
    };
  } | null>(null);
  const [answeredFeedback, setAnsweredFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Canvas Refs & Game Engine
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);

  // Filter available words pool based on selected TOPIK level
  const wordsPool = useMemo(() => {
    if (selectedTopikLevel === 'all') return words.length > 0 ? words : [];
    const lvlNum = parseInt(selectedTopikLevel, 10);
    const filtered = words.filter((w) => {
      if (w.topikLevel === lvlNum) return true;
      if (w.level === `TOPIK ${lvlNum}`) return true;
      if (lvlNum === 1 && w.level === 'Sơ cấp 1') return true;
      if (lvlNum === 2 && w.level === 'Sơ cấp 2') return true;
      if (lvlNum >= 3 && lvlNum <= 4 && w.level === 'Trung cấp') return true;
      if (lvlNum >= 5 && w.level === 'Cao cấp') return true;
      return false;
    });
    return filtered.length > 0 ? filtered : words;
  }, [words, selectedTopikLevel]);

  // Compact Friends Leaderboard data (Tuần này)
  const friendsLeaderboard = useMemo(() => {
    const userBestGold = Math.max(currentGold, (userProfile.streakDays || 1) * 350 + 2400);
    const initialList = [
      { id: 'f1', name: 'Nguyễn Thu Hà', score: 15400, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', level: 'TOPIK 5' },
      { id: 'f2', name: 'Đặng Hoàng Nam', score: 13200, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80', level: 'TOPIK 4' },
      { id: 'f3', name: 'Lê Minh Quân', score: 10800, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', level: 'TOPIK 3' },
      { id: 'f4', name: 'Vũ Ánh Tuyết', score: 8650, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', level: 'TOPIK 2' },
      { id: 'f-me', name: `${userProfile.name || 'Bạn'} (Tôi)`, score: userBestGold, avatar: userProfile.avatarUrl, level: userProfile.levelGoal || 'TOPIK 1', isMe: true },
    ];
    return initialList.sort((a, b) => b.score - a.score).map((item, idx) => ({
      ...item,
      rank: idx + 1,
      rankIcon: idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`
    }));
  }, [currentGold, userProfile]);

  // Hook Physics State Ref (to avoid React rerender jitter in 60fps canvas loop)
  const hookRef = useRef({
    originX: 400,
    originY: 55,
    angle: 0,
    angleDirection: 1, // 1 for right, -1 for left
    angleSpeed: 0.025,
    maxAngle: Math.PI * 0.38, // ~68 degrees
    length: 50,
    minLength: 50,
    maxLength: 540,
    shootSpeed: 10,
    basePullSpeed: 8,
    state: 'swinging' as 'swinging' | 'shooting' | 'pulling',
    attachedItem: null as MineItem | null,
  });

  const itemsRef = useRef<MineItem[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  // Toggle Sound
  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    gameAudio.setMuted(next);
  };

  // Helper to generate a vocab question from wordsPool
  const generateQuestionForWord = useCallback((word: VocabWord) => {
    const otherWords = wordsPool.filter((w) => w.id !== word.id);
    const shuffledOthers = [...otherWords].sort(() => 0.5 - Math.random());
    const distractors = shuffledOthers.slice(0, 3).map((w) => w.vietnamese);
    
    // Fallback if not enough words
    while (distractors.length < 3) {
      distractors.push('Nghĩa khác ' + (distractors.length + 1));
    }

    const options = [word.vietnamese, ...distractors].sort(() => 0.5 - Math.random());
    return {
      word,
      options,
      correctAnswer: word.vietnamese,
    };
  }, [wordsPool]);

  // Spawn Items for Level
  const spawnLevelItems = useCallback((levelNum: number) => {
    const items: MineItem[] = [];
    const pool = wordsPool.length > 0 ? wordsPool : words;
    let wordIdx = 0;

    const getRandomWord = () => {
      if (pool.length === 0) return undefined;
      const w = pool[wordIdx % pool.length];
      wordIdx++;
      return w;
    };

    // 1. Diamonds (1-3)
    const diamondCount = Math.min(3, 1 + Math.floor(levelNum / 2));
    for (let i = 0; i < diamondCount; i++) {
      items.push({
        id: `dia_${i}`,
        type: 'diamond',
        x: 120 + Math.random() * 560,
        y: 220 + Math.random() * 240,
        radius: 14,
        value: hasDiamondPolish ? 800 : 600,
        mass: 1.2,
        word: getRandomWord(),
        color: '#38BDF8',
      });
    }

    // 2. Small Gold Nuggets (3-5)
    for (let i = 0; i < 4; i++) {
      items.push({
        id: `g_s_${i}`,
        type: 'gold_small',
        x: 80 + Math.random() * 640,
        y: 160 + Math.random() * 260,
        radius: 18,
        value: 120,
        mass: 2.0,
        word: getRandomWord(),
        color: '#FBBF24',
      });
    }

    // 3. Medium Gold Nuggets (2-4)
    for (let i = 0; i < 3; i++) {
      items.push({
        id: `g_m_${i}`,
        type: 'gold_med',
        x: 100 + Math.random() * 600,
        y: 200 + Math.random() * 240,
        radius: 28,
        value: 280,
        mass: 3.8,
        word: getRandomWord(),
        color: '#F59E0B',
      });
    }

    // 4. Big Gold Nuggets (1-2)
    for (let i = 0; i < (levelNum > 2 ? 2 : 1); i++) {
      items.push({
        id: `g_b_${i}`,
        type: 'gold_big',
        x: 140 + Math.random() * 520,
        y: 280 + Math.random() * 180,
        radius: 40,
        value: 550,
        mass: 6.5,
        word: getRandomWord(),
        color: '#D97706',
      });
    }

    // 5. Mystery Bags (1-2)
    for (let i = 0; i < 2; i++) {
      items.push({
        id: `bag_${i}`,
        type: 'bag',
        x: 150 + Math.random() * 500,
        y: 190 + Math.random() * 250,
        radius: 22,
        value: hasLuckyClover ? 650 : Math.floor(80 + Math.random() * 450),
        mass: 2.5,
        word: getRandomWord(),
        color: '#EC4899',
      });
    }

    // 6. Heavy Rocks (3-4)
    for (let i = 0; i < 3; i++) {
      items.push({
        id: `rock_${i}`,
        type: 'rock',
        x: 90 + Math.random() * 620,
        y: 180 + Math.random() * 260,
        radius: 26 + Math.random() * 12,
        value: 20,
        mass: 8.5,
        color: '#78716C',
      });
    }

    // 7. TNT Barrel (1)
    if (levelNum >= 2) {
      items.push({
        id: `tnt_0`,
        type: 'tnt',
        x: 200 + Math.random() * 400,
        y: 250 + Math.random() * 180,
        radius: 20,
        value: 10,
        mass: 1.0,
        color: '#EF4444',
      });
    }

    itemsRef.current = items;
  }, [wordsPool, words, hasDiamondPolish, hasLuckyClover]);

  // Start a new game / level
  const startGame = useCallback((lvl: number = 1, resetScore: boolean = true) => {
    setCurrentLevel(lvl);
    if (resetScore) {
      setCurrentGold(0);
      setComboStreak(0);
      setMaxCombo(0);
      setMinedWords([]);
      setTotalQuestionsAnswered(0);
      setTotalQuestionsCorrect(0);
      setDynamiteCount(2);
      setHasPowerDrink(false);
      setHasDiamondPolish(false);
      setHasLuckyClover(false);
      setRivalScore(0);
    }
    
    // Target gold grows per level
    const target = 650 + (lvl - 1) * 750;
    setLevelTargetGold(target);
    setTimeLeft(60);
    setActiveVocabChallenge(null);
    setAnsweredFeedback(null);

    // Reset hook
    hookRef.current.angle = 0;
    hookRef.current.length = hookRef.current.minLength;
    hookRef.current.state = 'swinging';
    hookRef.current.attachedItem = null;

    spawnLevelItems(lvl);
    setGameState('playing');
  }, [spawnLevelItems]);

  // Shoot Hook Action (Triggered by button, Spacebar, or Canvas tap)
  const shootHook = useCallback(() => {
    if (gameState !== 'playing' || activeVocabChallenge !== null) return;
    if (hookRef.current.state === 'swinging') {
      hookRef.current.state = 'shooting';
      gameAudio.playShoot();
    }
  }, [gameState, activeVocabChallenge]);

  // Use Dynamite to blow up heavy rock
  const useDynamite = useCallback(() => {
    if (dynamiteCount <= 0 || hookRef.current.state !== 'pulling') return;
    const attached = hookRef.current.attachedItem;
    if (!attached) return;

    setDynamiteCount((prev) => prev - 1);
    gameAudio.playExplosion();

    // Spawn explosion particles
    for (let i = 0; i < 25; i++) {
      particlesRef.current.push({
        x: attached.x,
        y: attached.y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        radius: 3 + Math.random() * 5,
        color: ['#EF4444', '#F59E0B', '#FBBF24', '#78716C'][Math.floor(Math.random() * 4)],
        alpha: 1,
        decay: 0.04 + Math.random() * 0.04,
      });
    }

    // Detach and snap hook back
    hookRef.current.attachedItem = null;
    hookRef.current.length = hookRef.current.minLength;
    hookRef.current.state = 'swinging';
  }, [dynamiteCount]);

  // Keyboard shortcut listener: Space to shoot, W / D to dynamite
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      if (e.code === 'Space') {
        e.preventDefault();
        shootHook();
      } else if (e.code === 'KeyW' || e.code === 'KeyD') {
        useDynamite();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, shootHook, useDynamite]);

  // Countdown timer & Rival AI in Duel mode
  useEffect(() => {
    if (gameState !== 'playing' || activeVocabChallenge !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Level end check
          if (currentGold >= levelTargetGold) {
            gameAudio.playLevelWin();
            setGameState(currentLevel >= 6 ? 'victory' : 'shop');
          } else {
            setGameState('gameover');
          }
          return 0;
        }

        // Rival in Duel Mode simulates gradual mining
        if (gameMode === 'duel' && Math.random() < 0.25) {
          setRivalScore((r) => r + Math.floor(80 + Math.random() * 180));
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, activeVocabChallenge, currentGold, levelTargetGold, currentLevel, gameMode]);

  // Handle Vocab Question Answer
  const handleAnswerVocab = (chosen: string) => {
    if (!activeVocabChallenge || answeredFeedback !== null) return;

    const isCorrect = chosen === activeVocabChallenge.question.correctAnswer;
    setTotalQuestionsAnswered((n) => n + 1);

    if (isCorrect) {
      gameAudio.playCorrect();
      gameAudio.playGoldCollect();
      setAnsweredFeedback('correct');
      setTotalQuestionsCorrect((n) => n + 1);

      const newCombo = comboStreak + 1;
      setComboStreak(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      // Gold multiplier with combo bonus
      const comboMultiplier = 1 + Math.min(newCombo * 0.15, 1.5); // up to 2.5x
      const finalGold = Math.round(activeVocabChallenge.item.value * comboMultiplier);
      setCurrentGold((g) => g + finalGold);

      // Add to mined vocabulary list
      const word = activeVocabChallenge.question.word;
      setMinedWords((prev) => {
        if (!prev.some((w) => w.id === word.id)) {
          return [word, ...prev];
        }
        return prev;
      });

      // Pronounce speech
      playKoreanSpeech(word.korean);
    } else {
      gameAudio.playWrong();
      setAnsweredFeedback('wrong');
      setComboStreak(0);
      // Half gold penalty on wrong answer
      const halfGold = Math.round(activeVocabChallenge.item.value * 0.5);
      setCurrentGold((g) => g + halfGold);
    }

    // Auto close question after short feedback
    setTimeout(() => {
      setActiveVocabChallenge(null);
      setAnsweredFeedback(null);
      hookRef.current.state = 'swinging';
      hookRef.current.attachedItem = null;
    }, 1100);
  };

  // Main Canvas Render and Animation Loop (60 FPS)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const hook = hookRef.current;

      // 1. Draw Underground Mine Background
      // Sky/Surface area (top 70px)
      const surfaceGrad = ctx.createLinearGradient(0, 0, 0, 70);
      surfaceGrad.addColorStop(0, '#78350F');
      surfaceGrad.addColorStop(0.5, '#92400E');
      surfaceGrad.addColorStop(1, '#B45309');
      ctx.fillStyle = surfaceGrad;
      ctx.fillRect(0, 0, width, 70);

      // Mine ground with layered earthy gradient
      const mineGrad = ctx.createLinearGradient(0, 70, 0, height);
      mineGrad.addColorStop(0, '#291807');
      mineGrad.addColorStop(0.3, '#1E1205');
      mineGrad.addColorStop(0.7, '#170E04');
      mineGrad.addColorStop(1, '#0C0702');
      ctx.fillStyle = mineGrad;
      ctx.fillRect(0, 70, width, height - 70);

      // Decorative mine dirt layers and stone flecks
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      for (let i = 0; i < 40; i++) {
        const speckX = (i * 97) % width;
        const speckY = 80 + ((i * 137) % (height - 90));
        ctx.beginPath();
        ctx.arc(speckX, speckY, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Wooden mine support beams at top
      ctx.fillStyle = '#451A03';
      ctx.fillRect(0, 64, width, 8);
      ctx.fillStyle = '#78350F';
      ctx.fillRect(0, 66, width, 4);

      // 2. Draw Winch & Miner Character at Top Center
      const winchX = hook.originX;
      const winchY = hook.originY;

      // Winch wheel / pully
      ctx.save();
      ctx.beginPath();
      ctx.arc(winchX, winchY - 8, 16, 0, Math.PI * 2);
      ctx.fillStyle = '#B45309';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#FDE68A';
      ctx.stroke();

      // Miner Helmet & Face
      ctx.beginPath();
      ctx.arc(winchX, winchY - 26, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#FBBF24'; // Yellow safety helmet
      ctx.fill();
      // Headlamp on helmet
      ctx.beginPath();
      ctx.arc(winchX + (hook.angle > 0 ? 8 : -8), winchY - 28, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FEF08A';
      ctx.fill();
      // Beam light from helmet
      const lightGrad = ctx.createRadialGradient(winchX, winchY - 28, 4, winchX, winchY - 28, 90);
      lightGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
      lightGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = lightGrad;
      ctx.beginPath();
      ctx.arc(winchX, winchY - 28, 90, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Update Hook Movement Physics (if playing and not paused by question)
      if (gameState === 'playing' && activeVocabChallenge === null) {
        if (hook.state === 'swinging') {
          // Swing pendulum back and forth
          hook.angle += hook.angleDirection * hook.angleSpeed;
          if (hook.angle > hook.maxAngle) {
            hook.angle = hook.maxAngle;
            hook.angleDirection = -1;
          } else if (hook.angle < -hook.maxAngle) {
            hook.angle = -hook.maxAngle;
            hook.angleDirection = 1;
          }
        } else if (hook.state === 'shooting') {
          // Extend hook along current angle
          hook.length += hook.shootSpeed;
          const tipX = hook.originX + Math.sin(hook.angle) * hook.length;
          const tipY = hook.originY + Math.cos(hook.angle) * hook.length;

          // Check boundary limits
          if (tipX <= 15 || tipX >= width - 15 || tipY >= height - 15 || hook.length >= hook.maxLength) {
            hook.state = 'pulling';
          }

          // Check collisions with underground items
          const items = itemsRef.current;
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.isBlownUp) continue;

            const dx = tipX - item.x;
            const dy = tipY - item.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist <= item.radius + 10) {
              // Hit item!
              gameAudio.playHit(item.type === 'rock');
              hook.attachedItem = item;
              hook.state = 'pulling';
              // Remove item from ground so it attaches to hook tip
              items.splice(i, 1);

              // If TNT barrel: immediate explosion
              if (item.type === 'tnt') {
                gameAudio.playExplosion();
                hook.attachedItem = null;
                hook.state = 'pulling';
                // Destroy nearby items
                items.forEach((other) => {
                  const d = Math.sqrt((other.x - item.x) ** 2 + (other.y - item.y) ** 2);
                  if (d < 160) {
                    other.isBlownUp = true;
                  }
                });
              }
              break;
            }
          }
        } else if (hook.state === 'pulling') {
          // Retract hook
          const attached = hook.attachedItem;
          let pullSpeed = hook.basePullSpeed;

          if (attached) {
            pullSpeed = Math.max(1.6, hook.basePullSpeed / attached.mass);
            if (hasPowerDrink) pullSpeed *= 2.0; // Power Drink boosts pull speed
          }

          hook.length -= pullSpeed;

          // Update position of attached item to stay on the hook
          if (attached) {
            attached.x = hook.originX + Math.sin(hook.angle) * hook.length;
            attached.y = hook.originY + Math.cos(hook.angle) * hook.length;
          }

          // Reached winch!
          if (hook.length <= hook.minLength) {
            hook.length = hook.minLength;

            if (attached) {
              // If item has an attached vocabulary word: trigger Vocab Challenge!
              if (attached.word) {
                const q = generateQuestionForWord(attached.word);
                setActiveVocabChallenge({
                  item: attached,
                  question: q,
                });
                // Pauses pull until question answered
              } else {
                // Rock or generic item without word
                if (attached.type === 'rock') {
                  setCurrentGold((g) => g + attached.value);
                  gameAudio.playHit(true);
                }
                hook.attachedItem = null;
                hook.state = 'swinging';
              }
            } else {
              hook.state = 'swinging';
            }
          }
        }
      }

      // 4. Draw Hook Cable and Claw
      const tipX = hook.originX + Math.sin(hook.angle) * hook.length;
      const tipY = hook.originY + Math.cos(hook.angle) * hook.length;

      // Steel cable line
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(winchX, winchY);
      ctx.lineTo(tipX, tipY);
      ctx.strokeStyle = '#D1D5DB';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Mechanical claw at tip
      ctx.translate(tipX, tipY);
      ctx.rotate(-hook.angle);

      // Claw base ring
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#4B5563';
      ctx.fill();

      // Left claw prong
      ctx.beginPath();
      ctx.moveTo(-3, 0);
      ctx.quadraticCurveTo(-14, 12, -8, 20);
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = '#F3F4F6';
      ctx.stroke();

      // Right claw prong
      ctx.beginPath();
      ctx.moveTo(3, 0);
      ctx.quadraticCurveTo(14, 12, 8, 20);
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = '#F3F4F6';
      ctx.stroke();
      ctx.restore();

      // 5. Draw Underground Items (Gold, Diamond, Rock, Bags, TNT)
      const allItems = [...itemsRef.current];
      if (hook.attachedItem) allItems.push(hook.attachedItem);

      allItems.forEach((item) => {
        if (item.isBlownUp) return;
        ctx.save();
        ctx.translate(item.x, item.y);

        if (item.type === 'diamond') {
          // Sparkling Diamond polygon
          ctx.beginPath();
          ctx.moveTo(0, -item.radius);
          ctx.lineTo(item.radius * 0.9, -item.radius * 0.3);
          ctx.lineTo(item.radius * 0.6, item.radius);
          ctx.lineTo(-item.radius * 0.6, item.radius);
          ctx.lineTo(-item.radius * 0.9, -item.radius * 0.3);
          ctx.closePath();

          const diaGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, item.radius);
          diaGrad.addColorStop(0, '#E0F2FE');
          diaGrad.addColorStop(0.5, '#38BDF8');
          diaGrad.addColorStop(1, '#0284C7');
          ctx.fillStyle = diaGrad;
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Sparkle glint
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(-2, -4, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.type === 'rock') {
          // Rough rock polygon
          ctx.beginPath();
          ctx.moveTo(-item.radius * 0.8, -item.radius * 0.5);
          ctx.lineTo(item.radius * 0.4, -item.radius * 0.9);
          ctx.lineTo(item.radius * 0.9, -item.radius * 0.2);
          ctx.lineTo(item.radius * 0.7, item.radius * 0.8);
          ctx.lineTo(-item.radius * 0.6, item.radius * 0.9);
          ctx.closePath();
          ctx.fillStyle = '#57534E';
          ctx.fill();
          ctx.strokeStyle = '#292524';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (item.type === 'bag') {
          // Mystery Bag
          ctx.beginPath();
          ctx.arc(0, 2, item.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#BE185D';
          ctx.fill();
          ctx.strokeStyle = '#F472B6';
          ctx.lineWidth = 2;
          ctx.stroke();
          // Ribbon tie
          ctx.fillStyle = '#FDE047';
          ctx.fillRect(-6, -item.radius - 3, 12, 5);
          // Question mark
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 13px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('?', 0, 2);
        } else if (item.type === 'tnt') {
          // TNT Red Barrel
          ctx.fillStyle = '#DC2626';
          ctx.fillRect(-item.radius, -item.radius, item.radius * 2, item.radius * 2);
          ctx.strokeStyle = '#991B1B';
          ctx.lineWidth = 2;
          ctx.strokeRect(-item.radius, -item.radius, item.radius * 2, item.radius * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'black 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('TNT', 0, 0);
        } else {
          // Gold Nuggets (Small, Medium, Big)
          ctx.beginPath();
          ctx.ellipse(0, 0, item.radius, item.radius * 0.85, 0.2, 0, Math.PI * 2);
          const goldGrad = ctx.createRadialGradient(-item.radius * 0.3, -item.radius * 0.3, 2, 0, 0, item.radius);
          goldGrad.addColorStop(0, '#FEF08A');
          goldGrad.addColorStop(0.35, '#F59E0B');
          goldGrad.addColorStop(1, '#B45309');
          ctx.fillStyle = goldGrad;
          ctx.fill();
          ctx.strokeStyle = '#78350F';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Specular gold shine
          ctx.beginPath();
          ctx.ellipse(-item.radius * 0.35, -item.radius * 0.3, item.radius * 0.3, item.radius * 0.18, -0.4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
          ctx.fill();
        }

        // Draw Attached Korean Vocab Word Tag on item (if any)
        if (item.word && item.type !== 'rock') {
          ctx.font = `bold ${Math.max(10, Math.min(13, item.radius * 0.6))}px 'Pretendard', sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          // Dark background pill for readable text
          const textWidth = ctx.measureText(item.word.korean).width + 8;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
          ctx.beginPath();
          ctx.roundRect(-textWidth / 2, item.radius + 3, textWidth, 16, 4);
          ctx.fill();
          ctx.fillStyle = '#FDE68A';
          ctx.fillText(item.word.korean, 0, item.radius + 11);
        }

        ctx.restore();
      });

      // 6. Draw Explosion and Dust Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, activeVocabChallenge, hasPowerDrink, generateQuestionForWord]);

  // Buy item in Shop between levels
  const handleBuyShopItem = (itemType: 'dynamite' | 'powerDrink' | 'diamondPolish' | 'luckyClover' | 'extraTime') => {
    const prices = {
      dynamite: 150,
      powerDrink: 200,
      diamondPolish: 180,
      luckyClover: 120,
      extraTime: 160,
    };

    const cost = prices[itemType];
    if (currentGold < cost) return;

    setCurrentGold((g) => g - cost);
    gameAudio.playGoldCollect();

    if (itemType === 'dynamite') setDynamiteCount((n) => n + 1);
    if (itemType === 'powerDrink') setHasPowerDrink(true);
    if (itemType === 'diamondPolish') setHasDiamondPolish(true);
    if (itemType === 'luckyClover') setHasLuckyClover(true);
    if (itemType === 'extraTime') setTimeLeft((t) => t + 15);
  };

  // Share game room link for friend duel / viral marketing
  const handleCopyInviteLink = () => {
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}${window.location.pathname}?tab=game&gameRoom=${roomCode}&inviter=${encodeURIComponent(
      userProfile.name || 'Người bạn TOPIK'
    )}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareZalo = () => {
    if (typeof window === 'undefined') return;
    const inviteUrl = `${window.location.origin}${window.location.pathname}?tab=game&gameRoom=${roomCode}`;
    const text = `⛏️ Thách đấu bạn bè chơi ĐÀO VÀNG TIẾNG HÀN TOPIK! Mình vừa đạt ${currentGold} Vàng, cùng vào đào vàng và luyện từ vựng tiếng Hàn với mình nhé: ${inviteUrl}`;
    window.open(`https://zalo.me/share?url=${encodeURIComponent(inviteUrl)}&title=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareFacebook = () => {
    if (typeof window === 'undefined') return;
    const inviteUrl = `${window.location.origin}${window.location.pathname}?tab=game&gameRoom=${roomCode}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteUrl)}`, '_blank');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* ========================================================
          TOP HEADER: GAME TITLE & CONTROLS (Mobile Optimized)
         ======================================================== */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8E2D9] p-3.5 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center space-x-2.5 sm:space-x-3.5 w-full md:w-auto">
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-white shadow-sm shadow-amber-500/20 shrink-0">
            <Pickaxe className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <h2 className="text-base sm:text-2xl font-black text-neutral-900 tracking-tight truncate">
                Đào Vàng Tiếng Hàn TOPIK
              </h2>
              <span className="bg-amber-100 text-amber-800 text-[10px] sm:text-[11px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full border border-amber-300 shrink-0">
                Gold Miner
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-neutral-500 truncate sm:line-clamp-none">
              Thả móc gom vàng & kim cương, giải mã từ vựng TOPIK để chinh phục mỏ vàng!
            </p>
          </div>
        </div>

        {/* Top Controls: Sound & Topik Level filter */}
        <div className="flex items-center justify-between w-full md:w-auto gap-2">
          {/* TOPIK Level selector */}
          <div className="flex items-center bg-neutral-100 p-0.5 sm:p-1 rounded-xl text-[11px] sm:text-xs font-bold overflow-x-auto">
            <span className="px-1.5 text-neutral-400 shrink-0 hidden xs:inline">Cấp độ:</span>
            {['all', '1', '2', '3', '4', '5', '6'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedTopikLevel(lvl)}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer shrink-0 ${
                  selectedTopikLevel === lvl
                    ? 'bg-amber-400 text-neutral-950 font-black shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {lvl === 'all' ? 'Tất cả' : `T${lvl}`}
              </button>
            ))}
          </div>

          <button
            onClick={toggleSound}
            className="p-2 sm:p-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition-colors cursor-pointer shrink-0"
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-teal-600" />}
          </button>
        </div>
      </div>

      {/* ========================================================
          LOBBY VIEW (Chọn chế độ, Thách đấu bạn bè)
         ======================================================== */}
      {gameState === 'lobby' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Play Mode Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#291807] via-[#1E1205] to-[#120B03] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-amber-900/40 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black border border-amber-400/30">
                <Coins className="w-3.5 h-3.5" />
                <span>CHẾ ĐỘ THỢ MỎ KINH ĐIỂN</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-amber-200">
                Chinh Phục Mỏ Vàng & Ghi Nhớ Từ Vựng TOPIK
              </h3>

              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                Đu đưa chiếc móc ngoàm, căn chuẩn góc và nhấn <strong>BẮN MÓC</strong> hoặc phím <strong>CÁCH (Space)</strong> để kéo vàng, kim cương và túi bí ẩn. Mỗi báu vật sẽ chứa 1 từ vựng TOPIK tiếng Hàn — trả lời đúng để nhận x2 Vàng và tích lũy chuỗi Combo rực lửa!
              </p>

              {/* Game Feature Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-white/10 p-3 rounded-2xl border border-white/10 flex items-center space-x-2">
                  <Pickaxe className="w-4 h-4 text-amber-400" />
                  <span>Vật lý móc mỏ chuẩn</span>
                </div>
                <div className="bg-white/10 p-3 rounded-2xl border border-white/10 flex items-center space-x-2">
                  <Bomb className="w-4 h-4 text-rose-400" />
                  <span>Thuốc nổ phá đá</span>
                </div>
                <div className="bg-white/10 p-3 rounded-2xl border border-white/10 flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>Combo thưởng x2.5</span>
                </div>
              </div>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10">
              <button
                onClick={() => {
                  setGameMode('single');
                  startGame(1, true);
                }}
                className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-neutral-900 font-black text-base shadow-lg shadow-amber-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5 fill-neutral-900" />
                <span>Bắt Đầu Đào Vàng (Màn 1)</span>
              </button>

              <button
                onClick={() => {
                  setGameMode('duel');
                  startGame(1, true);
                }}
                className="py-4 px-6 rounded-2xl bg-white/15 hover:bg-white/20 text-white font-extrabold text-sm border border-white/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <Users className="w-4 h-4 text-cyan-300" />
                <span>Chế độ Đua Điểm 1v1</span>
              </button>
            </div>
          </div>

          {/* Invite Friends & Viral Promotion Card */}
          <div className="bg-white rounded-3xl border border-[#E8E2D9] p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-teal-800 font-extrabold text-sm">
                <Users className="w-4 h-4 text-teal-600" />
                <span>MỜI BẠN BÈ THÁCH ĐẤU ĐÀO VÀNG</span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Tạo phòng riêng và gửi link mời bạn bè cùng vào thi xem ai kiếm được nhiều vàng và nhớ từ vựng tiếng Hàn nhanh hơn!
              </p>

              {/* Room Code Box */}
              <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E8E2D9] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase block">Mã Phòng Thách Đấu</span>
                  <span className="text-xl font-black text-teal-900 tracking-wider font-mono">{roomCode}</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(roomCode);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer flex items-center space-x-1"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Đã chép' : 'Chép mã'}</span>
                </button>
              </div>

              {/* Direct Share Buttons: Zalo, Facebook, Copy link */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleCopyInviteLink}
                  className="w-full py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs border border-teal-200 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-teal-700" /> : <Share2 className="w-4 h-4" />}
                  <span>{copiedLink ? 'Đã sao chép link mời!' : 'Sao chép link mời thách đấu'}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleShareZalo}
                    className="py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Gửi qua Zalo</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <button
                    onClick={handleShareFacebook}
                    className="py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Chia sẻ Facebook</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Join an existing room */}
            <div className="pt-4 border-t border-neutral-100 space-y-2">
              <span className="text-xs font-bold text-neutral-600 block">Tham gia phòng có sẵn:</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputJoinCode}
                  onChange={(e) => setInputJoinCode(e.target.value.toUpperCase())}
                  placeholder="Ví dụ: GOLD-8842"
                  className="flex-1 px-3 py-2 text-xs font-mono font-bold bg-[#FAF8F5] border border-neutral-200 rounded-xl focus:outline-none focus:border-teal-500"
                />
                <button
                  onClick={() => {
                    if (inputJoinCode.trim()) {
                      setRoomCode(inputJoinCode.trim());
                      setGameMode('duel');
                      startGame(1, true);
                    }
                  }}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Vào
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          PLAYING SCREEN (Canvas + Dashboard + Question Modal)
         ======================================================== */}
      {gameState === 'playing' && (
        <div className="space-y-3 sm:space-y-4">
          {/* Dashboard Bar: Compact Mobile-Friendly HUD */}
          <div className="bg-neutral-900 text-white rounded-2xl p-3 sm:p-4 shadow-md flex items-center justify-between gap-2 border border-neutral-800">
            {/* Gold Mined vs Target */}
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-400 text-neutral-900 flex items-center justify-center font-black shrink-0">
                <Coins className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="truncate">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block leading-tight">
                  Vàng Đào
                </span>
                <div className="flex items-baseline space-x-1 sm:space-x-1.5">
                  <span className="text-lg sm:text-2xl font-black text-amber-300 font-mono leading-none">
                    {currentGold.toLocaleString()}
                  </span>
                  <span className="text-[10px] sm:text-xs text-neutral-400">/{levelTargetGold.toLocaleString()}G</span>
                </div>
              </div>
            </div>

            {/* Duel Rival Score (if in Duel mode) */}
            {gameMode === 'duel' && (
              <div className="bg-neutral-800 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-neutral-700 text-[10px] sm:text-xs hidden xs:block">
                <span className="text-neutral-400 block truncate max-w-[80px]">{rivalName}:</span>
                <span className="text-rose-400 font-bold font-mono">{rivalScore.toLocaleString()}G</span>
              </div>
            )}

            {/* Level, Time & Combo */}
            <div className="flex items-center space-x-3 sm:space-x-5 shrink-0">
              <div className="text-center">
                <span className="text-[9px] sm:text-[10px] text-neutral-400 font-bold block uppercase leading-none">Màn</span>
                <span className="text-sm sm:text-lg font-black text-white">{currentLevel}/6</span>
              </div>

              <div className="text-center">
                <span className="text-[9px] sm:text-[10px] text-neutral-400 font-bold block uppercase leading-none">Giờ</span>
                <span
                  className={`text-sm sm:text-lg font-black font-mono ${
                    timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-white'
                  }`}
                >
                  {timeLeft}s
                </span>
              </div>

              {/* Combo Flame */}
              {comboStreak > 1 && (
                <div className="flex items-center space-x-1 bg-rose-500/20 text-rose-400 px-2 py-1 rounded-lg border border-rose-500/30 text-[10px] font-black animate-bounce">
                  <Flame className="w-3 h-3 fill-rose-400 shrink-0" />
                  <span>x{comboStreak}</span>
                </div>
              )}
            </div>

            {/* Quick TNT Button in HUD */}
            <button
              onClick={useDynamite}
              disabled={dynamiteCount <= 0 || hookRef.current.state !== 'pulling'}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                dynamiteCount > 0 && hookRef.current.state === 'pulling'
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md animate-pulse'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700 opacity-60'
              }`}
              title="Kích nổ hòn đá nặng đang kéo"
            >
              <Bomb className="w-3.5 h-3.5" />
              <span>({dynamiteCount})</span>
            </button>
          </div>

          {/* Interactive Mine Canvas Container - Mobile Scaled Height */}
          <div
            onClick={shootHook}
            className="relative w-full h-[330px] xs:h-[360px] sm:h-[420px] md:h-[480px] bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 sm:border-4 border-amber-950 cursor-pointer select-none"
          >
            <canvas ref={canvasRef} width={800} height={520} className="w-full h-full block object-contain" />

            {/* Click to shoot hint */}
            <div className="absolute bottom-2.5 left-3 text-[10px] sm:text-[11px] text-amber-200/80 font-semibold pointer-events-none bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-xs">
              💡 Chạm màn hình hoặc nút dưới để bắn móc
            </div>

            {/* ========================================================
                VOCABULARY CHALLENGE POPUP (When an item is reeled in)
                Mobile-Optimized Compact 2x2 Layout
               ======================================================== */}
            {activeVocabChallenge && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute inset-0 bg-black/85 backdrop-blur-xs z-30 flex items-center justify-center p-2.5 sm:p-4 animate-in fade-in zoom-in-95 duration-150 overflow-y-auto"
              >
                <div className="w-full max-w-sm bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl border-2 border-amber-400 space-y-2 sm:space-y-3 text-neutral-900 text-center my-auto">
                  {/* Header Bar: Bonus Gold & Pronounce Audio */}
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-1.5">
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>+{activeVocabChallenge.item.value}G Thưởng</span>
                    </span>

                    <button
                      onClick={() => playKoreanSpeech(activeVocabChallenge.question.word.korean)}
                      className="p-1 px-2 rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                      <span className="text-[10px] sm:text-[11px]">Nghe phát âm</span>
                    </button>
                  </div>

                  {/* Word Display */}
                  <div className="space-y-0.5">
                    <span className="text-[9px] sm:text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                      Chọn nghĩa tiếng Việt của từ:
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight leading-tight">
                      {activeVocabChallenge.question.word.korean}
                    </h3>
                    <div className="flex items-center justify-center space-x-1.5 text-[11px] sm:text-xs text-teal-700 font-mono font-bold pt-0.5">
                      <span>[{activeVocabChallenge.question.word.pronunciation.replace(/[\[\]]/g, '')}]</span>
                      <span className="px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600 font-sans text-[9px] sm:text-[10px]">
                        {activeVocabChallenge.question.word.partOfSpeech}
                      </span>
                    </div>
                  </div>

                  {/* 4 Options: 2x2 Grid fits all phones without scrolling or clipping */}
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-0.5">
                    {activeVocabChallenge.question.options.map((opt, idx) => {
                      const isCorrect = opt === activeVocabChallenge.question.correctAnswer;
                      const isChosen = answeredFeedback !== null;

                      let btnStyle = 'bg-neutral-50 hover:bg-teal-50 hover:border-teal-400 border-neutral-200 text-neutral-800 active:scale-[0.98]';
                      if (isChosen) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-500 border-emerald-600 text-white font-black shadow-sm';
                        } else {
                          btnStyle = 'bg-neutral-100 border-neutral-200 text-neutral-400 opacity-40';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={answeredFeedback !== null}
                          onClick={() => handleAnswerVocab(opt)}
                          className={`min-h-[42px] sm:min-h-[46px] p-1.5 sm:p-2 rounded-xl border-2 text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center ${btnStyle}`}
                        >
                          <span className="line-clamp-2 leading-tight">{opt}</span>
                          {isChosen && isCorrect && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Flash */}
                  {answeredFeedback && (
                    <div
                      className={`py-1 px-2.5 rounded-lg text-[10px] sm:text-xs font-black animate-in fade-in duration-150 ${
                        answeredFeedback === 'correct'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {answeredFeedback === 'correct'
                        ? '🎉 Đúng rồi! Nhận đủ vàng & tăng Combo!'
                        : '💡 Chưa đúng! Nhận 50% số vàng.'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Ergonomic Mobile Thumb Action Bar */}
          <div className="flex items-center gap-2 pt-1">
            {dynamiteCount > 0 && hookRef.current.state === 'pulling' && (
              <button
                onClick={useDynamite}
                className="px-4 py-3 rounded-xl sm:rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md animate-pulse shrink-0 flex items-center space-x-1.5 cursor-pointer"
              >
                <Bomb className="w-4 h-4" />
                <span>NỔ ĐÁ ({dynamiteCount})</span>
              </button>
            )}

            <button
              onClick={shootHook}
              className="flex-1 py-3.5 sm:py-4 px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-neutral-950 font-black text-sm sm:text-base shadow-md active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Pickaxe className="w-5 h-5 text-neutral-900 shrink-0" />
              <span>BẮN MÓC ĐÀO VÀNG (Space / Chạm)</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          SHOP SCREEN (Giữa các Màn chơi)
         ======================================================== */}
      {gameState === 'shop' && (
        <div className="bg-gradient-to-b from-[#FAF8F5] to-white rounded-3xl border border-[#E8E2D9] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                <Check className="w-3.5 h-3.5" />
                <span>VƯỢT MÀN {currentLevel} THÀNH CÔNG!</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 mt-2">
                Cửa Hàng Dụng Cụ Thợ Mỏ
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500">
                Dùng vàng kiếm được để trang bị thuốc nổ, nước tăng lực và bùa may mắn trước khi vào Màn {currentLevel + 1}!
              </p>
            </div>

            <div className="bg-amber-100 px-5 py-3 rounded-2xl border border-amber-300 text-amber-900 flex items-center space-x-3">
              <Coins className="w-6 h-6 text-amber-600" />
              <div>
                <span className="text-[10px] font-bold uppercase block text-amber-700">Túi Tiền Hiện Có</span>
                <span className="text-2xl font-black font-mono">{currentGold.toLocaleString()} G</span>
              </div>
            </div>
          </div>

          {/* Shop Item Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Dynamite */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 hover:border-amber-400 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Bomb className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-neutral-900">Thuốc Nổ TNT (+1)</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Bấm nổ ngay khi lỡ kéo phải đá nặng để phá hủy đá và thu hồi móc ngay lập tức!
                </p>
              </div>
              <button
                onClick={() => handleBuyShopItem('dynamite')}
                disabled={currentGold < 150}
                className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 text-white font-extrabold text-xs transition-colors cursor-pointer flex items-center justify-center space-x-1"
              >
                <span>Mua: 150 Vàng (Có: {dynamiteCount})</span>
              </button>
            </div>

            {/* Power Drink */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 hover:border-amber-400 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-neutral-900">Nước Tăng Lực Siêu Tốc</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Tăng 200% tốc độ kéo mọi vật phẩm nặng trong suốt cả màn tiếp theo!
                </p>
              </div>
              <button
                onClick={() => handleBuyShopItem('powerDrink')}
                disabled={currentGold < 200 || hasPowerDrink}
                className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 text-white font-extrabold text-xs transition-colors cursor-pointer flex items-center justify-center space-x-1"
              >
                <span>{hasPowerDrink ? 'Đã sở hữu' : 'Mua: 200 Vàng'}</span>
              </button>
            </div>

            {/* Diamond Polish */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 hover:border-amber-400 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-neutral-900">Đánh Bóng Kim Cương</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Tăng giá trị của mỗi viên kim cương đào được thêm +200 Vàng (600G → 800G)!
                </p>
              </div>
              <button
                onClick={() => handleBuyShopItem('diamondPolish')}
                disabled={currentGold < 180 || hasDiamondPolish}
                className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 text-white font-extrabold text-xs transition-colors cursor-pointer flex items-center justify-center space-x-1"
              >
                <span>{hasDiamondPolish ? 'Đã sở hữu' : 'Mua: 180 Vàng'}</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => startGame(currentLevel + 1, false)}
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center space-x-2"
            >
              <span>Vào Màn {currentLevel + 1} Tiếp Theo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          VICTORY & GAMEOVER RESULT CARD (Khoe chiến tích & Chia sẻ)
         ======================================================== */}
      {(gameState === 'gameover' || gameState === 'victory') && (
        <div className="bg-white rounded-3xl border border-[#E8E2D9] p-6 sm:p-10 shadow-xl space-y-8 text-center max-w-2xl mx-auto">
          <div className="space-y-3">
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-lg bg-gradient-to-tr from-amber-400 to-yellow-500 text-white">
              {gameState === 'victory' ? <Crown className="w-10 h-10" /> : <Trophy className="w-10 h-10" />}
            </div>

            <h3 className="text-3xl sm:text-4xl font-black text-neutral-900">
              {gameState === 'victory' ? '🏆 Chúc Mừng Vua Thợ Mỏ TOPIK!' : 'Kết Thúc Lượt Đào Vàng'}
            </h3>

            <p className="text-sm text-neutral-500 max-w-md mx-auto">
              {gameState === 'victory'
                ? 'Bạn đã xuất sắc chinh phục tất cả các màn và ghi nhớ vô số từ vựng tiếng Hàn quan trọng!'
                : `Bạn đã dừng chân tại Màn ${currentLevel}. Hãy luyện tập thêm để phá vỡ kỷ lục số vàng!`}
            </p>
          </div>

          {/* Result Scoreboard Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E2D9]">
            <div>
              <span className="text-[11px] text-neutral-400 font-bold uppercase block">Tổng Vàng</span>
              <span className="text-2xl font-black text-amber-600 font-mono">{currentGold.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[11px] text-neutral-400 font-bold uppercase block">Màn Cao Nhất</span>
              <span className="text-2xl font-black text-neutral-900">Màn {currentLevel}</span>
            </div>
            <div>
              <span className="text-[11px] text-neutral-400 font-bold uppercase block">Từ Đã Nhớ</span>
              <span className="text-2xl font-black text-teal-700">{minedWords.length}</span>
            </div>
            <div>
              <span className="text-[11px] text-neutral-400 font-bold uppercase block">Combo Max</span>
              <span className="text-2xl font-black text-rose-600">x{maxCombo}</span>
            </div>
          </div>

          {/* List of Words Mined with Listen & Save actions */}
          {minedWords.length > 0 && (
            <div className="space-y-3 text-left">
              <span className="text-xs font-black text-neutral-600 uppercase tracking-wider block">
                💎 Túi Báu Vật Từ Vựng Đã Đào Được ({minedWords.length} từ)
              </span>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {minedWords.map((w) => (
                  <div
                    key={w.id}
                    className="p-3 rounded-xl bg-white border border-neutral-200 flex items-center justify-between hover:border-teal-400 transition-colors"
                  >
                    <div>
                      <span className="font-extrabold text-neutral-900 text-sm">{w.korean}</span>
                      <span className="text-xs text-neutral-400 font-mono ml-2">[{w.pronunciation}]</span>
                      <span className="text-xs text-neutral-600 ml-2">→ {w.vietnamese}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => playKoreanSpeech(w.korean)}
                        className="p-1.5 rounded-lg text-teal-700 hover:bg-teal-50 transition-colors cursor-pointer"
                        title="Nghe phát âm"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openSaveWordModal(w)}
                        className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                        title="Lưu vào sổ tay"
                      >
                        <BookmarkPlus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions: Play Again and Share to Promote App */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => startGame(1, true)}
                className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-amber-400 hover:bg-amber-300 text-neutral-900 font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi Lại Từ Màn 1</span>
              </button>

              <button
                onClick={handleCopyInviteLink}
                className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? 'Đã sao chép link!' : 'Rủ Bạn Bè Thách Đấu Lại'}</span>
              </button>
            </div>

            {/* Direct Zalo / Facebook Share */}
            <div className="flex items-center justify-center gap-2 pt-2 text-xs font-bold">
              <button
                onClick={handleShareZalo}
                className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
              >
                Khoe thành tích qua Zalo
              </button>
              <button
                onClick={handleShareFacebook}
                className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
              >
                Khoe lên Facebook
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          COMPACT FRIENDS LEADERBOARD (Xếp hạng bạn bè ở dưới nhỏ nha)
         ======================================================== */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8E2D9] p-3 sm:p-4 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-neutral-900 flex items-center gap-1.5">
                <span>Bảng Xếp Hạng Bạn Bè</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Tuần này
                </span>
              </h4>
            </div>
          </div>

          <button
            onClick={handleCopyInviteLink}
            className="text-[11px] font-bold text-teal-700 hover:text-teal-900 flex items-center space-x-1 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Đã sao chép link!' : '+ Mời bạn'}</span>
          </button>
        </div>

        {/* Compact List of Friends */}
        <div className="space-y-1">
          {friendsLeaderboard.map((friend) => (
            <div
              key={friend.id}
              className={`px-2.5 py-1.5 rounded-xl flex items-center justify-between text-xs transition-colors ${
                friend.isMe
                  ? 'bg-amber-50/90 border border-amber-200/90 font-bold'
                  : 'bg-neutral-50/60 hover:bg-neutral-100/70'
              }`}
            >
              <div className="flex items-center space-x-2 min-w-0">
                <span className="w-5 text-center font-black text-neutral-600 text-xs shrink-0">
                  {friend.rankIcon}
                </span>
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-6 h-6 rounded-full object-cover shrink-0 border border-white shadow-2xs"
                />
                <span
                  className={`truncate text-xs ${
                    friend.isMe ? 'text-amber-950 font-black' : 'text-neutral-800 font-medium'
                  }`}
                >
                  {friend.name}
                </span>
              </div>

              <div className="flex items-center space-x-2 shrink-0 ml-2">
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-neutral-200/60 text-neutral-600">
                  {friend.level}
                </span>
                <span className="font-black font-mono text-amber-600 text-xs">
                  {friend.score.toLocaleString()} G
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
