
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Tool, Element, UserPresence, Point } from '../types';

interface BoardProps {
  activeTool: Tool;
  elements: Element[];
  onLiveChange: (elements: Element[]) => void;
  onCommit: (elements: Element[]) => void;
  remoteUsers: UserPresence[];
  currentColor: string;
  onCursorMove?: (point: Point) => void;
}

const Board: React.FC<BoardProps> = ({ 
  activeTool, 
  elements, 
  onLiveChange, 
  onCommit, 
  remoteUsers, 
  currentColor,
  onCursorMove 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [currentElement, setCurrentElement] = useState<Element | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempText, setTempText] = useState('');
  
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale] = useState(1);
  const [isSpaceDown, setIsSpaceDown] = useState(false);

  // Global hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') setIsSpaceDown(true);
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId && !editingId) {
        onCommit(elements.filter(el => el.id !== selectedId));
        setSelectedId(null);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') setIsSpaceDown(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedId, editingId, elements, onCommit]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 1. Dark Grid
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const gridSize = 40 * scale;
    const ox = offset.x % gridSize;
    const oy = offset.y % gridSize;
    ctx.beginPath();
    for (let x = ox; x < canvas.width; x += gridSize) {
      ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);
    }
    for (let y = oy; y < canvas.height; y += gridSize) {
      ctx.moveTo(0, y); ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();
    ctx.restore();

    const allElements = [...elements, ...(currentElement ? [currentElement] : [])];
    
    allElements.forEach(el => {
      const isCurrentlyEditing = el.id === editingId;

      ctx.save();
      ctx.strokeStyle = el.color;
      ctx.fillStyle = el.color;
      ctx.lineWidth = el.strokeWidth * scale;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = el.opacity;

      const tx = (val: number) => val * scale + offset.x;
      const ty = (val: number) => val * scale + offset.y;

      // Selection Highlight
      if (el.id === selectedId && activeTool === 'select' && !editingId) {
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        const p = 12;
        if (el.type === 'rect' || el.type === 'sticky') {
          ctx.strokeRect(tx(el.x!) - p, ty(el.y!) - p, (el.width! * scale) + p * 2, (el.height! * scale) + p * 2);
        } else if (el.type === 'text') {
          ctx.strokeRect(tx(el.x!) - p, ty(el.y!) - 26 * scale - p, (el.width! * scale) + p * 2, 34 * scale + p * 2);
        } else if (el.type === 'circle') {
          ctx.beginPath();
          ctx.arc(tx(el.x!), ty(el.y!), (Math.abs(el.width!) * scale) + p, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Drawing
      if (el.type === 'pen' && el.points) {
        ctx.beginPath();
        el.points.forEach((p, i) => {
          if (i === 0) ctx.moveTo(tx(p.x), ty(p.y));
          else ctx.lineTo(tx(p.x), ty(p.y));
        });
        ctx.stroke();
      } else if (el.type === 'rect' && el.x !== undefined) {
        ctx.strokeRect(tx(el.x), ty(el.y!), el.width! * scale, el.height! * scale);
      } else if (el.type === 'circle' && el.x !== undefined) {
        ctx.beginPath();
        ctx.arc(tx(el.x), ty(el.y!), Math.abs(el.width!) * scale, 0, Math.PI * 2);
        ctx.stroke();
      } else if (el.type === 'arrow' && el.x !== undefined) {
        const x1 = tx(el.x), y1 = ty(el.y!), x2 = x1 + el.width! * scale, y2 = y1 + el.height! * scale;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        const angle = Math.atan2(y2 - y1, x2 - x1);
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - 15 * scale * Math.cos(angle - Math.PI/6), y2 - 15 * scale * Math.sin(angle - Math.PI/6));
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - 15 * scale * Math.cos(angle + Math.PI/6), y2 - 15 * scale * Math.sin(angle + Math.PI/6));
        ctx.stroke();
      } else if (el.type === 'sticky') {
        // Rounded Sticky
        const radius = 24 * scale;
        const sx = tx(el.x!), sy = ty(el.y!), sw = el.width! * scale, sh = el.height! * scale;
        ctx.beginPath();
        ctx.moveTo(sx + radius, sy);
        ctx.lineTo(sx + sw - radius, sy);
        ctx.quadraticCurveTo(sx + sw, sy, sx + sw, sy + radius);
        ctx.lineTo(sx + sw, sy + sh - radius);
        ctx.quadraticCurveTo(sx + sw, sy + sh, sx + sw - radius, sy + sh);
        ctx.lineTo(sx + radius, sy + sh);
        ctx.quadraticCurveTo(sx, sy + sh, sx, sy + sh - radius);
        ctx.lineTo(sx, sy + radius);
        ctx.quadraticCurveTo(sx, sy, sx + radius, sy);
        ctx.closePath();
        
        ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 30; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 15;
        ctx.fill();
        ctx.shadowColor = 'transparent';
        
        // Sticky Text
        if (!isCurrentlyEditing) {
          ctx.fillStyle = '#000000'; 
          ctx.font = `700 ${14 * scale}px 'Inter', sans-serif`;
          const lines = (el.text || '').split('\n');
          lines.forEach((line, i) => {
             ctx.fillText(line, tx(el.x!) + 24 * scale, ty(el.y!) + 44 * scale + (i * 20 * scale));
          });
        }
      } else if (el.type === 'text') {
        if (!isCurrentlyEditing) {
          ctx.font = `800 ${24 * scale}px 'Inter', sans-serif`; 
          ctx.fillStyle = el.color;
          ctx.fillText(el.text || '', tx(el.x!), ty(el.y!));
        }
      }
      ctx.restore();
    });
  }, [elements, currentElement, offset, scale, selectedId, activeTool, editingId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
  }, [elements, scale, offset, currentElement, selectedId, activeTool, editingId, render]);

  const startEditing = (el: Element) => {
    setEditingId(el.id);
    setTempText(el.text || '');
    setTimeout(() => {
      textAreaRef.current?.focus();
      textAreaRef.current?.select();
    }, 50);
  };

  const finishEditing = () => {
    if (editingId) {
      const updatedElements = elements.map(el => {
        if (el.id === editingId) {
          const tempCtx = canvasRef.current?.getContext('2d');
          let newWidth = el.width || 0;
          if (tempCtx && el.type === 'text') {
            tempCtx.font = `800 24px 'Inter', sans-serif`;
            newWidth = Math.max(50, tempCtx.measureText(tempText).width);
          }
          return { ...el, text: tempText, width: newWidth };
        }
        return el;
      });
      onCommit(updatedElements);
      setEditingId(null);
      setTempText('');
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (editingId) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;

    if (isSpaceDown || (activeTool === 'select' && e.button === 1)) {
      setIsPanning(true);
      setDragOffset({ x: e.clientX, y: e.clientY });
      return;
    }

    if (activeTool === 'select') {
      const clicked = [...elements].reverse().find(el => {
        const tx = el.x!; const ty = el.y!; const tw = el.width || 0; const th = el.height || 0;
        if (el.type === 'rect' || el.type === 'sticky') return x >= tx && x <= tx + tw && y >= ty && y <= ty + th;
        if (el.type === 'text') return x >= tx && x <= tx + tw && y >= ty - 24 && y <= ty + 4;
        if (el.type === 'circle') return Math.sqrt((x - tx)**2 + (y - ty)**2) <= Math.abs(tw);
        if (el.type === 'pen' && el.points) return el.points.some(p => Math.sqrt((x - p.x)**2 + (y - p.y)**2) < 12);
        return false;
      });

      if (clicked) {
        setSelectedId(clicked.id);
        setIsDragging(true);
        setDragOffset({ x: x - clicked.x!, y: y - clicked.y! });
      } else {
        setSelectedId(null);
      }
      return;
    }

    if (activeTool === 'eraser') {
      const remaining = elements.filter(el => {
        const tx = el.x!; const ty = el.y!; const tw = el.width || 0; const th = el.height || 0;
        if (el.type === 'rect' || el.type === 'sticky') return !(x >= tx && x <= tx + tw && y >= ty && y <= ty + th);
        if (el.type === 'text') return !(x >= tx && x <= tx + tw && y >= ty - 24 && y <= ty + 4);
        if (el.type === 'circle') return Math.sqrt((x - tx)**2 + (y - ty)**2) > Math.abs(tw);
        if (el.type === 'pen' && el.points) return !el.points.some(p => Math.sqrt((x - p.x)**2 + (y - p.y)**2) < 15);
        return true;
      });
      if (remaining.length !== elements.length) onCommit(remaining);
      return;
    }

    if (activeTool === 'text' || activeTool === 'sticky') {
      const newEl: Element = {
        id: Math.random().toString(36).substr(2, 9),
        type: activeTool,
        x, y,
        width: activeTool === 'sticky' ? 220 : 120,
        height: activeTool === 'sticky' ? 220 : 32,
        color: activeTool === 'sticky' ? '#FFD541' : currentColor,
        strokeWidth: 3, opacity: 1,
        text: activeTool === 'sticky' ? 'New idea' : 'Type here'
      };
      onCommit([...elements, newEl]);
      setTimeout(() => startEditing(newEl), 60);
      return;
    }

    setIsDrawing(true);
    setCurrentElement({
      id: Math.random().toString(36).substr(2, 9),
      type: activeTool, x, y, width: 0, height: 0,
      points: [{ x, y }], color: currentColor, strokeWidth: 3, opacity: 1, text: ''
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Broadcast cursor position
    if (onCursorMove) {
      onCursorMove({ x: e.clientX, y: e.clientY });
    }

    if (isPanning) {
      setOffset({ x: offset.x + (e.clientX - dragOffset.x), y: offset.y + (e.clientY - dragOffset.y) });
      setDragOffset({ x: e.clientX, y: e.clientY });
      return;
    }
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;
    if (isDragging && selectedId) {
      onLiveChange(elements.map(el => el.id === selectedId ? { ...el, x: x - dragOffset.x, y: y - dragOffset.y } : el));
      return;
    }
    if (isDrawing && currentElement) {
      setCurrentElement(prev => {
        if (!prev) return null;
        if (prev.type === 'pen') return { ...prev, points: [...(prev.points || []), { x, y }] };
        return { ...prev, width: x - prev.x!, height: y - prev.y! };
      });
    }
  };

  const handleMouseUp = () => {
    if (isPanning) { setIsPanning(false); return; }
    if (isDragging) { setIsDragging(false); onCommit(elements); return; }
    if (isDrawing && currentElement) { onCommit([...elements, currentElement]); }
    setIsDrawing(false); setCurrentElement(null);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;
    const target = elements.find(el => {
      if (el.type === 'sticky') return x >= el.x! && x <= el.x! + (el.width || 220) && y >= el.y! && y <= el.y! + (el.height || 220);
      if (el.type === 'text') return x >= el.x! && x <= el.x! + (el.width || 100) && y >= el.y! - 26 && y <= el.y! + 4;
      return false;
    });
    if (target) startEditing(target);
  };

  const editingElement = elements.find(el => el.id === editingId);
  const getEditorStyle = (): React.CSSProperties => {
    if (!editingElement) return { display: 'none' };
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { display: 'none' };
    const screenX = (editingElement.x! * scale) + offset.x + rect.left;
    const screenY = (editingElement.y! * scale) + offset.y + rect.top;

    if (editingElement.type === 'sticky') {
      return {
        position: 'absolute',
        left: screenX + 24 * scale,
        top: screenY + 24 * scale,
        width: (editingElement.width! - 48) * scale,
        height: (editingElement.height! - 48) * scale,
        background: 'transparent',
        border: 'none',
        outline: 'none',
        resize: 'none',
        fontFamily: "'Inter', sans-serif",
        fontWeight: 700,
        fontSize: `${14 * scale}px`,
        color: '#000000',
        zIndex: 100,
        lineHeight: `${20 * scale}px`,
      };
    } else {
      return {
        position: 'absolute',
        left: screenX,
        top: screenY - (28 * scale),
        width: Math.max(300, editingElement.width! * scale + 100),
        height: 40 * scale,
        background: 'transparent',
        border: 'none',
        outline: 'none',
        resize: 'none',
        fontFamily: "'Inter', sans-serif",
        fontWeight: 800,
        fontSize: `${24 * scale}px`,
        color: editingElement.color,
        zIndex: 100,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      };
    }
  };

  return (
    <div className="relative w-full h-full bg-[#151515] overflow-hidden">
      <canvas
        ref={canvasRef}
        style={{ cursor: isPanning || isSpaceDown ? 'grabbing' : activeTool === 'select' ? (isDragging ? 'grabbing' : 'pointer') : activeTool === 'text' ? 'text' : 'crosshair' }}
        className="w-full h-full touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onContextMenu={(e) => e.preventDefault()}
      />
      {editingId && (
        <textarea
          ref={textAreaRef}
          style={getEditorStyle()}
          value={tempText}
          onChange={(e) => setTempText(e.target.value)}
          onBlur={finishEditing}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && editingElement?.type === 'text') {
              e.preventDefault();
              finishEditing();
            }
            if (e.key === 'Escape') {
              setEditingId(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default Board;
