
export type Tool = 'select' | 'pen' | 'rect' | 'circle' | 'arrow' | 'text' | 'sticky' | 'eraser';

export interface Point {
  x: number;
  y: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Element {
  id: string;
  type: Tool;
  points?: Point[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  text?: string;
  color: string;
  strokeWidth: number;
  opacity: number;
}

export interface UserPresence {
  id: string;
  name: string;
  color: string;
  cursor: Point;
  lastActive: number;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  type: 'frontend' | 'backend' | 'ai' | 'database' | 'integration';
  description: string;
}

export interface ScheduledSession {
  id: string;
  title: string;
  startTime: string; // ISO String
  duration: number; // minutes
  roomId: string;
  attendees: string[]; // Avatar seeds
  status: 'upcoming' | 'live' | 'finished';
  description: string;
}
