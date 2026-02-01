
import React from 'react';
import { 
  MousePointer2, 
  Pencil, 
  Square, 
  Circle, 
  ArrowRight, 
  Type, 
  StickyNote, 
  Eraser,
  Undo2,
  Redo2,
  Minus,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Tool } from '../types';

interface ToolbarProps {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  activeTool, 
  setActiveTool, 
  selectedColor, 
  setSelectedColor,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}) => {
  const tools: { id: Tool; icon: any; label: string; activeColor: string }[] = [
    { id: 'select', icon: MousePointer2, label: 'Select', activeColor: 'bg-white text-black' },
    { id: 'pen', icon: Pencil, label: 'Pen', activeColor: 'bg-[#FF7EB3] text-white' },
    { id: 'rect', icon: Square, label: 'Rect', activeColor: 'bg-[#84E1BC] text-black' },
    { id: 'circle', icon: Circle, label: 'Circle', activeColor: 'bg-[#FFD541] text-black' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow', activeColor: 'bg-[#7A5AF8] text-white' },
    { id: 'text', icon: Type, label: 'Text', activeColor: 'bg-white text-black' },
    { id: 'sticky', icon: StickyNote, label: 'Note', activeColor: 'bg-[#FFD541] text-black' },
    { id: 'eraser', icon: Eraser, label: 'Erase', activeColor: 'bg-red-500 text-white' },
  ];

  const colors = ['#FFFFFF', '#FFD541', '#FF7EB3', '#84E1BC', '#7A5AF8', '#FF4C4C'];

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute left-1/2 -translate-x-1/2 bottom-12 z-40"
    >
      <div className="glass-dark p-3 rounded-[32px] shadow-2xl flex items-center gap-3">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full mr-2">
          <button 
            disabled={!canUndo} 
            onClick={onUndo}
            className={`p-3 rounded-full transition-all ${canUndo ? 'hover:bg-white/10 text-white' : 'text-white/20'}`}
          >
            <Undo2 className="w-5 h-5" />
          </button>
          <button 
            disabled={!canRedo} 
            onClick={onRedo}
            className={`p-3 rounded-full transition-all ${canRedo ? 'hover:bg-white/10 text-white' : 'text-white/20'}`}
          >
            <Redo2 className="w-5 h-5" />
          </button>
        </div>

        {/* Tools */}
        <div className="flex items-center gap-2">
          {tools.map((tool) => (
            <motion.button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                activeTool === tool.id 
                  ? tool.activeColor 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <tool.icon className="w-5 h-5" />
            </motion.button>
          ))}
        </div>
        
        <div className="w-px h-8 bg-white/10 mx-2" />
        
        {/* Color Palette */}
        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-full">
          {colors.map((color) => (
            <motion.div 
              key={color}
              onClick={() => setSelectedColor(color)}
              whileHover={{ scale: 1.2 }}
              className={`w-8 h-8 rounded-full cursor-pointer border-2 transition-all ${
                selectedColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Toolbar;
