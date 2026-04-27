/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { DUMMY_TRACKS } from '../constants';

interface MusicPlayerProps {
    currentTrackIndex: number;
    setCurrentTrackIndex: Dispatch<SetStateAction<number>>;
}

export default function MusicPlayer({ currentTrackIndex, setCurrentTrackIndex }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(40);
  const track = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + (100 / (track.duration * 10));
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, track, currentTrackIndex]);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <footer className="h-24 bg-[#0a0a0c] border-t border-cyan-500/20 px-8 flex items-center justify-between z-30 relative sm:fixed sm:bottom-0 sm:left-0 sm:right-0">
      <div className="flex items-center gap-4 w-1/4">
        <AnimatePresence mode="wait">
            <motion.div
                key={track.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-4"
            >
                <div className="relative w-14 h-14 flex-shrink-0 group">
                    <img 
                        src={track.coverUrl} 
                        className="w-full h-full object-cover rounded border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]" 
                        alt="Now Playing" 
                        referrerPolicy="no-referrer"
                    />
                    {isPlaying && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="flex gap-0.5">
                                {[1, 2, 3].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [4, 14, 4] }}
                                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                        className="w-1 bg-cyan-400 rounded-full"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="hidden md:block">
                    <h3 className="text-sm font-bold text-white tracking-tight">{track.title}</h3>
                    <p className="text-[10px] text-cyan-500 uppercase tracking-widest">{track.artist}</p>
                </div>
            </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center gap-2 w-1/2 max-w-xl">
        <div className="flex items-center gap-10">
          <button 
            onClick={handlePrev}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>

          <button 
            onClick={handleNext}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>

        <div className="w-full flex items-center gap-4 px-4">
          <span className="text-[10px] font-mono text-slate-500 min-w-[30px]">
             {Math.floor((progress * track.duration) / 6000)}:{(Math.floor((progress * track.duration) / 100) % 60).toString().padStart(2, '0')}
          </span>
          <div className="flex-1 h-1 bg-slate-800 rounded-full relative group cursor-pointer">
            <motion.div 
                className="absolute left-0 top-0 h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                animate={{ width: `${progress}%` }}
                transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
            />
            <motion.div 
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{ left: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-slate-500 min-w-[30px]">
            {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="w-1/4 hidden sm:flex justify-end items-center gap-4">
        <Volume2 className="w-5 h-5 text-slate-500" />
        <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="w-2/3 h-full bg-slate-400"></div>
        </div>
      </div>
    </footer>
  );
}
