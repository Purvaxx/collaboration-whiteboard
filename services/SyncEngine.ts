
import { io, Socket } from 'socket.io-client';
import { Element, Point } from '../types';

/**
 * NexusSyncEngine: Updated to use professional WebSockets via Socket.io.
 * This connects to the backend server we just built.
 */
class SyncEngine {
  private socket: Socket;
  private currentRoom: string = 'global-lobby';
  private onUpdateCallback?: (elements: Element[]) => void;
  private onCursorCallback?: (userId: string, cursor: Point) => void;

  constructor() {
    // Connect to the Node.js backend
    this.socket = io('http://localhost:5000');

    this.socket.on('connect', () => {
      console.log('Connected to Nexus Backend');
    });

    this.socket.on('init-state', (elements: Element[]) => {
      if (this.onUpdateCallback) this.onUpdateCallback(elements);
    });

    this.socket.on('element-update', (elements: Element[]) => {
      if (this.onUpdateCallback) this.onUpdateCallback(elements);
    });

    this.socket.on('cursor-update', (userId: string, cursor: Point) => {
      if (this.onCursorCallback) this.onCursorCallback(userId, cursor);
    });
  }

  public joinRoom(roomId: string, userName: string, userColor: string) {
    this.currentRoom = roomId;
    this.socket.emit('join-room', roomId, { name: userName, color: userColor });
  }

  public broadcastElements(elements: Element[]) {
    this.socket.emit('elements-broadcast', this.currentRoom, elements);
  }

  public broadcastCursor(cursor: Point) {
    this.socket.emit('cursor-broadcast', this.currentRoom, cursor);
  }

  // Sticky Note Specific APIs
  public createSticky(element: Element) {
    this.socket.emit('sticky-note-create', this.currentRoom, element);
  }

  public moveSticky(noteId: string, position: Point) {
    this.socket.emit('sticky-note-move', this.currentRoom, noteId, position);
  }

  public updateStickyText(noteId: string, text: string) {
    this.socket.emit('sticky-note-update-text', this.currentRoom, noteId, text);
  }

  public onElementsUpdate(callback: (elements: Element[]) => void) {
    this.onUpdateCallback = callback;
  }

  public onCursorUpdate(callback: (userId: string, cursor: Point) => void) {
    this.onCursorCallback = callback;
  }
}

export const syncEngine = new SyncEngine();
