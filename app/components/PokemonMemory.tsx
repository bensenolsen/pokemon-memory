'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

// Pokémon-Datenbank mit echten Bildern von PokéAPI
const POKEMON_DATA = [
  { id: 25, name: 'Pikachu', color: '#FFD700', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' },
  { id: 4, name: 'Glumanda', color: '#FF6347', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png' },
  { id: 7, name: 'Schiggy', color: '#4682B4', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png' },
  { id: 1, name: 'Bisasam', color: '#90EE90', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png' },
  { id: 133, name: 'Evoli', color: '#D2B48C', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png' },
  { id: 39, name: 'Pummeluff', color: '#FFB6C1', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png' },
  { id: 143, name: 'Relaxo', color: '#708090', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png' },
  { id: 94, name: 'Gengar', color: '#9370DB', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png' },
  { id: 149, name: 'Dragoran', color: '#FFA500', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png' },
  { id: 150, name: 'Mewtu', color: '#E6E6FA', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png' },
  { id: 6, name: 'Glurak', color: '#FF4500', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png' },
  { id: 9, name: 'Turtok', color: '#4169E1', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png' },
  { id: 54, name: 'Enton', color: '#FFD700', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png' },
  { id: 16, name: 'Taubsi', color: '#DEB887', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/16.png' },
  { id: 12, name: 'Smettbo', color: '#DA70D6', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/12.png' },
  { id: 10, name: 'Raupy', color: '#9ACD32', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10.png' },
  { id: 81, name: 'Magnetilo', color: '#C0C0C0', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/81.png' },
  { id: 88, name: 'Sleima', color: '#9932CC', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/88.png' },
];

interface Pokemon {
  id: number;
  name: string;
  color: string;
  image: string;
}

interface Card {
  id: string;
  pokemonId: number;
  pokemon: Pokemon;
  isFlipped: boolean;
  isMatched: boolean;
}

// Hilfsfunktionen
const shuffle = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const selectRandomPokemon = (count: number) => {
  const shuffled = shuffle(POKEMON_DATA);
  return shuffled.slice(0, count);
};

const createCardPairs = (pokemon: Pokemon[]): Card[] => {
  const cards: Card[] = [];
  pokemon.forEach((p, index) => {
    cards.push({
      id: `${p.id}-1-${index}`,
      pokemonId: p.id,
      pokemon: p,
      isFlipped: false,
      isMatched: false,
    });
    cards.push({
      id: `${p.id}-2-${index}`,
      pokemonId: p.id,
      pokemon: p,
      isFlipped: false,
      isMatched: false,
    });
  });
  return shuffle(cards);
};

// Konfetti-Komponente
const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute text-2xl animate-fall"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        >
          {['🎉', '⭐', '✨', '🎊', '⚡', '🔥', '💧', '🌿'][Math.floor(Math.random() * 8)]}
        </div>
      ))}
    </div>
  );
};

// Karten-Komponente
interface CardProps {
  card: Card;
  onClick: (card: Card) => void;
  disabled: boolean;
  cardSize: { width: number; height: number };
}

const Card: React.FC<CardProps> = ({ card, onClick, disabled, cardSize }) => {
  const handleClick = () => {
    if (!disabled && !card.isFlipped && !card.isMatched) {
      onClick(card);
    }
  };

  return (
    <div
      className={`relative cursor-pointer transition-all duration-300 ${
        !card.isFlipped && !card.isMatched ? 'hover:scale-105 hover:shadow-2xl' : ''
      } ${card.isMatched ? 'opacity-75' : ''}`}
      onClick={handleClick}
      style={{
        perspective: '1000px',
        width: `${cardSize.width}px`,
        height: `${cardSize.height}px`
      }}
    >
      <div
        className={`relative w-full h-full transition-all duration-600 ${
          card.isFlipped || card.isMatched ? 'rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Rückseite (Pokéball) */}
        <div
          className="absolute w-full h-full bg-white rounded-xl flex items-center justify-center shadow-lg border-4"
          style={{
            backfaceVisibility: 'hidden',
            borderColor: '#FF9933'
          }}
        >
          <div className="relative" style={{ width: '60%', height: '60%' }}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="48" fill="white" stroke="#333" strokeWidth="2"/>
              <path d="M 2 50 L 98 50" stroke="#333" strokeWidth="3" fill="none"/>
              <path d="M 2 50 A 48 48 0 0 1 98 50" fill="#DC0A2D"/>
              <circle cx="50" cy="50" r="12" fill="white" stroke="#333" strokeWidth="2"/>
              <circle cx="50" cy="50" r="8" fill="white" stroke="#333" strokeWidth="3"/>
            </svg>
          </div>
        </div>

        {/* Vorderseite (Pokémon) */}
        <div
          className={`absolute w-full h-full rounded-xl shadow-lg flex flex-col items-center justify-center p-1 border-4 ${
            card.isMatched ? 'ring-4 ring-green-400 ring-offset-2' : ''
          }`}
          style={{
            backgroundColor: 'white',
            borderColor: card.pokemon.color,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <img
            src={card.pokemon.image}
            alt={card.pokemon.name}
            className="w-full h-auto object-contain"
            style={{ maxHeight: '75%' }}
          />
          <span className="font-bold text-gray-800 text-center" style={{ fontSize: `${cardSize.width * 0.1}px` }}>
            {card.pokemon.name}
          </span>
        </div>
      </div>
    </div>
  );
};

// Victory Modal
interface VictoryModalProps {
  moves: number;
  time: string;
  onRestart: () => void;
  gameMode: string;
  player1Score: number;
  player2Score: number;
}

const VictoryModal: React.FC<VictoryModalProps> = ({ moves, time, onRestart, gameMode, player1Score, player2Score }) => {
  let winner = null;
  let winnerText = '';

  if (gameMode === 'multiplayer') {
    if (player1Score > player2Score) {
      winner = 1;
      winnerText = '🎉 Spieler 1 gewinnt!';
    } else if (player2Score > player1Score) {
      winner = 2;
      winnerText = '🎉 Spieler 2 gewinnt!';
    } else {
      winnerText = '🤝 Unentschieden!';
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 animate-fadeIn">
      <div className="bg-white rounded-3xl p-8 md:p-12 max-w-md mx-4 text-center shadow-2xl animate-slideInTop">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">Spiel vorbei!</h2>

        {gameMode === 'multiplayer' ? (
          <>
            <p className="text-2xl md:text-3xl font-bold mb-6">{winnerText}</p>
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-6 mb-6">
              <div className="text-lg font-bold text-gray-800 mb-2">📊 Endergebnis:</div>
              <div className={`text-2xl font-bold ${winner === 1 ? 'text-green-700' : 'text-gray-900'}`}>
                👤 Spieler 1: {player1Score} Paare
              </div>
              <div className={`text-2xl font-bold ${winner === 2 ? 'text-green-700' : 'text-gray-900'}`}>
                👤 Spieler 2: {player2Score} Paare
              </div>
              <div className="text-xl font-bold text-gray-800 mt-2">🎯 Züge: {moves}</div>
            </div>
          </>
        ) : (
          <>
            <p className="text-xl md:text-2xl font-bold mb-6">Alle Pokémon gefunden!</p>
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-6 mb-6">
              <div className="text-lg font-bold text-gray-800 mb-2">📊 Deine Statistiken:</div>
              <div className="text-2xl font-bold text-gray-900">⏱️ Zeit: {time}</div>
              <div className="text-2xl font-bold text-gray-900">🎯 Züge: {moves}</div>
            </div>
          </>
        )}

        <button
          onClick={onRestart}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-xl px-8 py-4 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105"
        >
          🔄 Nochmal spielen!
        </button>
      </div>
    </div>
  );
};

export default function PokemonMemory() {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [gameMode, setGameMode] = useState<'single' | 'multiplayer'>('single');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  const pairCounts = {
    easy: 6,
    medium: 12,
    hard: 18,
  };

  const gridConfig = {
    easy: { cols: 4, rows: 3, className: 'grid-cols-4' },
    medium: { cols: 6, rows: 4, className: 'grid-cols-6' },
    hard: { cols: 6, rows: 6, className: 'grid-cols-6' },
  };

  const calculateCardSize = (diff?: 'easy' | 'medium' | 'hard') => {
    const currentDifficulty = diff || difficulty;
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    const isMobile = vw < 768;
    const headerHeight = isMobile ? 180 : 200; // Mehr Platz für Margin unten
    const availableHeight = vh - headerHeight;
    const availableWidth = vw - (isMobile ? 20 : 40);

    const config = gridConfig[currentDifficulty];
    const cols = config.cols;
    const rows = config.rows;

    const gap = 8;
    const totalGapWidth = gap * (cols - 1);
    const totalGapHeight = gap * (rows - 1);

    const maxCardWidth = (availableWidth - totalGapWidth) / cols;
    const maxCardHeight = (availableHeight - totalGapHeight) / rows;

    let width, height;

    if (maxCardWidth / maxCardHeight < 0.75) {
      width = maxCardWidth;
      height = width * 1.33;
    } else {
      height = maxCardHeight;
      width = height * 0.75;
    }

    let maxWidth, maxHeight, minWidth, minHeight;

    if (currentDifficulty === 'easy') {
      maxWidth = isMobile ? 150 : 220;
      maxHeight = isMobile ? 200 : 290;
      minWidth = isMobile ? 60 : 80;
      minHeight = isMobile ? 80 : 100;
    } else if (currentDifficulty === 'medium') {
      maxWidth = isMobile ? 110 : 160;
      maxHeight = isMobile ? 145 : 210;
      minWidth = isMobile ? 50 : 65;
      minHeight = isMobile ? 65 : 85;
    } else {
      maxWidth = isMobile ? 90 : 130;
      maxHeight = isMobile ? 120 : 175;
      minWidth = isMobile ? 40 : 55;
      minHeight = isMobile ? 55 : 75;
    }

    width = Math.min(width, maxWidth);
    height = Math.min(height, maxHeight);
    width = Math.max(width, minWidth);
    height = Math.max(height, minHeight);

    return { width: Math.floor(width), height: Math.floor(height) };
  };

  const [cardSize, setCardSize] = useState({ width: 100, height: 133 });

  useEffect(() => {
    setCardSize(calculateCardSize(difficulty));
  }, [difficulty]);

  useEffect(() => {
    const handleResize = () => {
      setCardSize(calculateCardSize(difficulty));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [difficulty]);

  const playSound = useCallback((type: 'flip' | 'match' | 'win') => {
    if (!isSoundOn) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      switch (type) {
        case 'flip':
          oscillator.frequency.value = 400;
          gainNode.gain.value = 0.1;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.1);
          break;
        case 'match':
          oscillator.frequency.value = 600;
          gainNode.gain.value = 0.2;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.2);
          break;
        case 'win':
          [523, 659, 784].forEach((freq, i) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = freq;
            gain.gain.value = 0.2;
            osc.start(audioContext.currentTime + i * 0.2);
            osc.stop(audioContext.currentTime + i * 0.2 + 0.3);
          });
          break;
      }
    } catch (error) {
      console.log('Audio nicht verfügbar');
    }
  }, [isSoundOn]);

  const startTimer = useCallback(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - start) / 1000);
      setElapsedTime(elapsed);
    }, 1000);
    setTimerInterval(interval);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  }, [timerInterval]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const initializeGame = useCallback((diff: 'easy' | 'medium' | 'hard') => {
    const pairCount = pairCounts[diff];
    const selectedPokemon = selectRandomPokemon(pairCount);
    const newCards = createCardPairs(selectedPokemon);
    setCards(newCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameStarted(false);
    setGameWon(false);
    setElapsedTime(0);
    setIsProcessing(false);
    setCurrentPlayer(1);
    setPlayer1Score(0);
    setPlayer2Score(0);
    stopTimer();
  }, [stopTimer]);

  const handleCardClick = useCallback((card: Card) => {
    if (isProcessing || flippedCards.length >= 2) return;

    if (!gameStarted) {
      setGameStarted(true);
      startTimer();
    }

    playSound('flip');

    setCards((prevCards) =>
      prevCards.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c))
    );

    setFlippedCards((prev) => [...prev, card]);
  }, [gameStarted, flippedCards.length, isProcessing, playSound, startTimer]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsProcessing(true);
      const [card1, card2] = flippedCards;

      setTimeout(() => {
        const isMatch = card1.pokemonId === card2.pokemonId;

        if (isMatch) {
          playSound('match');
          setCards((prevCards) =>
            prevCards.map((c) =>
              c.id === card1.id || c.id === card2.id ? { ...c, isMatched: true } : c
            )
          );
          setMatchedPairs((prev) => prev + 1);

          if (gameMode === 'multiplayer') {
            if (currentPlayer === 1) {
              setPlayer1Score((prev) => prev + 1);
            } else {
              setPlayer2Score((prev) => prev + 1);
            }
          }
        } else {
          setCards((prevCards) =>
            prevCards.map((c) =>
              c.id === card1.id || c.id === card2.id ? { ...c, isFlipped: false } : c
            )
          );

          if (gameMode === 'multiplayer') {
            setCurrentPlayer((prev) => prev === 1 ? 2 : 1);
          }
        }

        setMoves((prev) => prev + 1);
        setFlippedCards([]);
        setIsProcessing(false);
      }, 1000);
    }
  }, [flippedCards, playSound, gameMode, currentPlayer]);

  useEffect(() => {
    const totalPairs = pairCounts[difficulty];
    if (matchedPairs > 0 && matchedPairs === totalPairs && gameStarted) {
      setTimeout(() => {
        setGameWon(true);
        stopTimer();
        playSound('win');
      }, 500);
    }
  }, [matchedPairs, difficulty, gameStarted, stopTimer, playSound]);

  useEffect(() => {
    initializeGame(difficulty);
  }, []);

  const handleDifficultyChange = (newDifficulty: 'easy' | 'medium' | 'hard') => {
    if (!gameStarted) {
      setDifficulty(newDifficulty);
      setTimeout(() => {
        setCardSize(calculateCardSize(newDifficulty));
        initializeGame(newDifficulty);
      }, 0);
    }
  };

  const handleRestart = () => {
    initializeGame(difficulty);
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-red-600 to-red-700 flex flex-col">
      <div className="flex-1 flex flex-col px-4 py-2">
        <div className="text-center mb-1">
          <Image src="/logo.webp" alt="Pokémon" width={250} height={100} className="h-8 sm:h-12 mx-auto" style={{ maxWidth: '250px', height: 'auto' }} />
          <h2 className="text-lg sm:text-2xl font-black text-white lowercase mb-0" style={{ marginTop: '-4px', letterSpacing: '0.1em', textShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}>
            memory
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-1 mb-2">
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={() => setGameMode('single')}
              disabled={gameStarted}
              className={`px-2 py-1 rounded font-bold text-xs sm:text-sm ${
                gameMode === 'single' ? 'bg-blue-400 text-white' : 'bg-white text-gray-700'
              } ${gameStarted ? 'opacity-50' : ''}`}
            >
              👤 1 Spieler
            </button>
            <button
              onClick={() => setGameMode('multiplayer')}
              disabled={gameStarted}
              className={`px-2 py-1 rounded font-bold text-xs sm:text-sm ${
                gameMode === 'multiplayer' ? 'bg-blue-400 text-white' : 'bg-white text-gray-700'
              } ${gameStarted ? 'opacity-50' : ''}`}
            >
              👥 2 Spieler
            </button>
          </div>

          <div className="flex gap-1 sm:gap-2">
            {(['easy', 'medium', 'hard'] as const).map((key) => (
              <button
                key={key}
                onClick={() => handleDifficultyChange(key)}
                disabled={gameStarted}
                className={`px-2 sm:px-3 py-1 rounded-lg font-bold text-xs sm:text-sm transition-all ${
                  difficulty === key
                    ? 'bg-yellow-400 text-gray-900 shadow-lg'
                    : 'bg-white text-gray-700'
                } ${gameStarted ? 'opacity-50' : ''}`}
              >
                {key === 'easy' ? '6' : key === 'medium' ? '12' : '18'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center gap-1 mb-2">
          {gameMode === 'multiplayer' ? (
            <div className="flex gap-1 text-xs sm:text-sm">
              <div className={`px-2 py-1 rounded font-bold ${
                currentPlayer === 1 ? 'bg-green-500 text-white ring-2 ring-white' : 'bg-gray-300 text-gray-700'
              }`}>
                👤 S1: {player1Score}
              </div>
              <div className={`px-2 py-1 rounded font-bold ${
                currentPlayer === 2 ? 'bg-green-500 text-white ring-2 ring-white' : 'bg-gray-300 text-gray-700'
              }`}>
                👤 S2: {player2Score}
              </div>
            </div>
          ) : (
            <div className="bg-blue-500 text-white px-2 py-1 rounded font-bold text-xs sm:text-sm">
              ⏱️ {formatTime(elapsedTime)}
            </div>
          )}

          <div className="flex gap-1 items-center text-xs sm:text-sm">
            <div className="bg-purple-500 text-white px-2 py-1 rounded font-bold">
              🎯 {moves}
            </div>
            <div className="bg-green-500 text-white px-2 py-1 rounded font-bold">
              ✅ {matchedPairs}/{pairCounts[difficulty]}
            </div>
            <button
              onClick={() => setIsSoundOn(!isSoundOn)}
              className="bg-gray-500 text-white px-2 py-1 rounded font-bold"
            >
              {isSoundOn ? '🔊' : '🔇'}
            </button>
            <button
              onClick={handleRestart}
              className="bg-yellow-400 text-gray-900 font-bold px-2 py-1 rounded"
            >
              🔄
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center overflow-hidden pb-6" style={{ marginBottom: '30px' }}>
          <div className={`grid ${gridConfig[difficulty].className} gap-2 justify-center items-center`}>
            {cards.map((card) => (
              <Card key={card.id} card={card} onClick={handleCardClick} disabled={isProcessing} cardSize={cardSize} />
            ))}
          </div>
        </div>

        {gameWon && (
          <>
            <Confetti />
            <VictoryModal
              moves={moves}
              time={formatTime(elapsedTime)}
              onRestart={handleRestart}
              gameMode={gameMode}
              player1Score={player1Score}
              player2Score={player2Score}
            />
          </>
        )}
      </div>
    </div>
  );
}
