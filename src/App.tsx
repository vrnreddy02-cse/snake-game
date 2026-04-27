/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { DUMMY_TRACKS } from './constants';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(12800);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const onScoreUpdate = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) setHighScore(newScore);
  };

  return (
    <div className="h-screen flex flex-col bg-[#050506] overflow-hidden">
      {/* Header / HUD */}
      <header className="h-16 border-b border-cyan-500/20 flex items-center justify-between px-8 bg-[#0a0a0c] z-20">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-cyan-500 rounded-sm shadow-[0_0_15px_rgba(6,182,212,0.6)] flex items-center justify-center">
            <div className="w-4 h-4 bg-[#050506] rotate-45"></div>
          </div>
          <h1 className="text-xl font-bold tracking-widest text-cyan-400 uppercase">
            Synth-Snake <span className="text-pink-500">v2.0</span>
          </h1>
        </div>
        
        <div className="flex gap-12">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-tighter text-slate-500 font-semibold">Score</p>
            <p className="text-2xl font-mono text-cyan-400 leading-none">{score.toString().padStart(5, '0')}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-tighter text-slate-500 font-semibold">High Score</p>
            <p className="text-2xl font-mono text-pink-500 leading-none">{highScore.toString().padStart(5, '0')}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></div>
            <span className="text-xs font-mono uppercase text-green-500 hidden sm:inline">Network: Latency 14ms</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar: Music Library */}
        <aside className="w-72 bg-[#08080a] border-r border-white/5 p-6 flex flex-col hidden lg:flex">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Neuro-Library</h2>
          <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar">
            {DUMMY_TRACKS.map((track, idx) => (
              <div 
                key={track.id}
                onClick={() => setCurrentTrackIndex(idx)}
                className={`p-3 border rounded-lg flex items-center gap-3 transition-all cursor-pointer ${
                  currentTrackIndex === idx 
                  ? 'bg-cyan-500/10 border-cyan-500/30' 
                  : 'hover:bg-white/5 border-transparent'
                }`}
              >
                <div className={`w-10 h-10 rounded flex-shrink-0 shadow-lg bg-gradient-to-br ${
                  idx === 0 ? 'from-cyan-500 to-blue-600' : 
                  idx === 1 ? 'from-pink-500 to-purple-600' : 'from-orange-500 to-red-600'
                }`}></div>
                <div className="overflow-hidden">
                  <p className={`text-sm font-semibold truncate ${currentTrackIndex === idx ? 'text-cyan-100' : 'text-slate-300'}`}>
                    {track.title}
                  </p>
                  <p className={`text-[10px] truncate uppercase tracking-tighter ${currentTrackIndex === idx ? 'text-cyan-500/70' : 'text-slate-500'}`}>
                    AI Gen • {track.artist}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-auto p-4 border border-white/5 rounded-xl bg-black/20">
            <p className="text-[10px] text-slate-500 uppercase mb-2">System Stability</p>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></div>
            </div>
          </div>
        </aside>

        {/* Game Window */}
        <section className="flex-1 bg-[#050506] p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-500/5 font-mono text-[20vw] pointer-events-none select-none uppercase tracking-tighter">
            GRID_01
          </div>
          
          <div className="relative z-10">
            <SnakeGame onScoreUpdate={onScoreUpdate} />
          </div>

          <div className="mt-8 flex gap-4 text-slate-600 font-mono text-[10px] uppercase tracking-widest">
            <span className="px-2 py-1 border border-slate-800">Arrow Keys to Move</span>
            <span className="px-2 py-1 border border-slate-800">Space to Toggle Music</span>
          </div>
        </section>
      </main>

      {/* Player Bar */}
      <MusicPlayer currentTrackIndex={currentTrackIndex} setCurrentTrackIndex={setCurrentTrackIndex} />
    </div>
  );
}
