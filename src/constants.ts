/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  coverUrl: string;
}

export const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber Drift',
    artist: 'AI Echoes',
    duration: 180,
    coverUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&q=80',
  },
  {
    id: '2',
    title: 'Neon Pulse',
    artist: 'Synth Wave',
    duration: 215,
    coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&q=80',
  },
  {
    id: '3',
    title: 'Midnight Grid',
    artist: 'Digital Dreamer',
    duration: 145,
    coverUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&q=80',
  },
];

export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 11, y: 10 },
  { x: 12, y: 10 },
];

export const GRID_SIZE = 20;
export const GAME_SPEED = 120; // Slightly faster for synth-snake vibe
