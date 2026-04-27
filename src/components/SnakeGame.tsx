/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw } from 'lucide-react';
import { INITIAL_SNAKE, GRID_SIZE, GAME_SPEED } from '../constants';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
}

export default function SnakeGame({ onScoreUpdate }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const getRandomPoint = useCallback((): Point => ({
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  }), []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(getRandomPoint());
    setDirection({ x: 0, y: -1 });
    setIsGameOver(false);
    setScore(0);
    onScoreUpdate(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isGameOver) return;

    const moveSnake = () => {
      const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y,
      };

      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return;
      }

      if (snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return;
      }

      const newSnake = [newHead, ...snake];

      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 50;
        setScore(newScore);
        onScoreUpdate(newScore);
        setFood(getRandomPoint());
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [snake, direction, food, isGameOver, score, getRandomPoint, onScoreUpdate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = canvas.width / GRID_SIZE;

    // Deep Dark Surface
    ctx.fillStyle = '#0c0c0e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Precise Grid System
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * scale, 0);
        ctx.lineTo(i * scale, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * scale);
        ctx.lineTo(canvas.width, i * scale);
        ctx.stroke();
    }

    // High Contrast Food
    ctx.fillStyle = '#ec4899'; // pink-500
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ec4899';
    ctx.beginPath();
    ctx.roundRect(
        food.x * scale + 2, 
        food.y * scale + 2, 
        scale - 4, 
        scale - 4, 
        4
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Cyan Snake Body
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#22d3ee' : '#0891b2';
      
      if (isHead) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#22d3ee';
      } else {
          ctx.shadowBlur = 0;
      }
      
      const padding = 1;
      ctx.fillRect(
        segment.x * scale + padding,
        segment.y * scale + padding,
        scale - padding * 2,
        scale - padding * 2
      );
      
      // Eyes for the head
      if (isHead) {
        ctx.fillStyle = '#000';
        ctx.shadowBlur = 0;
        const eyeSize = 2;
        const offset = scale / 4;
        
        // Simple directional eyes
        if (direction.x !== 0) {
            ctx.fillRect(segment.x * scale + scale/2 + direction.x*offset, segment.y * scale + scale/2 - offset, eyeSize, eyeSize);
            ctx.fillRect(segment.x * scale + scale/2 + direction.x*offset, segment.y * scale + scale/2 + offset, eyeSize, eyeSize);
        } else {
            ctx.fillRect(segment.x * scale + scale/2 - offset, segment.y * scale + scale/2 + direction.y*offset, eyeSize, eyeSize);
            ctx.fillRect(segment.x * scale + scale/2 + offset, segment.y * scale + scale/2 + direction.y*offset, eyeSize, eyeSize);
        }
      }
    });
  }, [snake, food, direction]);

  return (
    <div className="relative group">
      {/* HUD Border Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
      
      <div className="relative border-4 border-slate-800 bg-[#0c0c0e] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="block w-full max-w-full aspect-square"
          id="snake-canvas"
        />

        <AnimatePresence>
          {isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md"
            >
              <h2 className="text-5xl font-black text-white mb-2 tracking-[0.2em] uppercase italic">MALFUNCTION</h2>
              <p className="text-pink-500 mb-8 font-mono tracking-widest text-sm uppercase">Connection Terminated // Final Score: {score}</p>
              <button
                onClick={resetGame}
                className="group relative px-8 py-4 bg-transparent border border-cyan-500 flex items-center gap-3 overflow-hidden transition-all hover:bg-cyan-500 hover:text-black"
              >
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400 group-hover:border-black"></div>
                <RefreshCw className="w-5 h-5 animate-spin-slow" />
                <span className="font-bold tracking-[0.2em] uppercase text-sm">Synchronize System</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
