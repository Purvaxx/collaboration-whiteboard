
export type Tool = 'select' | 'pen' | 'rect' | 'circle' | 'arrow' | 'text' | 'sticky' | 'eraser';

export interface Point {
  x: number;
  y: number;
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

export interface RoomState {
  elements: Element[];
  users: Record<string, { name: string; color: string; cursor: Point }>;
}

export interface ServerToClientEvents {
  'init-state': (elements: Element[]) => void;
  'element-update': (elements: Element[]) => void;
  'cursor-update': (userId: string, cursor: Point) => void;
  'user-joined': (userId: string, name: string) => void;
  'user-left': (userId: string) => void;
}

export interface ClientToServerEvents {
  'join-room': (roomId: string, user: { name: string; color: string }) => void;
  'elements-broadcast': (roomId: string, elements: Element[]) => void;
  'cursor-broadcast': (roomId: string, cursor: Point) => void;
  'sticky-note-create': (roomId: string, element: Element) => void;
  'sticky-note-move': (roomId: string, noteId: string, position: Point) => void;
  'sticky-note-update-text': (roomId: string, noteId: string, text: string) => void;
}
