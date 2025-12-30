'use client'

import { motion } from 'framer-motion';
import { Check, Trash2, Edit2, Save, X } from 'lucide-react';
import { Todo } from '@/types/todo';
import { useState } from 'react';

interface TodoItemProps {
  todo: Todo;
  serialNumber: number;  // Add serial number prop
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, updatedTodo: Partial<Todo>) => void;
}

export const TodoItem = ({ todo, serialNumber, onToggle, onDelete, onEdit }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');

  const handleSave = () => {
    onEdit(todo.id, {
      title: editTitle,
      description: editDescription,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: 300, height: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 glass backdrop-blur-sm shadow-sm transition-all"
      >
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs font-mono bg-gray-200/50 dark:bg-gray-700/50 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
              #{serialNumber}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="p-1.5 text-green-600 hover:text-green-700 transition-colors rounded-md hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                <Save size={16} />
              </button>
              <button
                onClick={handleCancel}
                className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/20"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 300, height: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-xl border backdrop-blur-sm shadow-sm transition-all ${
        todo.completed
          ? 'border-green-200/50 dark:border-green-900/30 bg-green-50/30 dark:bg-green-900/10 glass'
          : 'border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 glass hover:bg-white/70 dark:hover:bg-gray-800/70'
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(todo.id)}
          className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center transition-colors flex-shrink-0 ${
            todo.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 glass bg-white/70 dark:bg-gray-700/70'
          }`}
        >
          {todo.completed && <Check size={12} />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-mono bg-gray-200/50 dark:bg-gray-700/50 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
              #{serialNumber}
            </span>
            <div className={`font-medium ${
              todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'
            }`}>
              {todo.title}
            </div>
          </div>
          {todo.description && (
            <div className={`mt-1 text-sm ${
              todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {todo.description}
            </div>
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-500 hover:text-blue-500 transition-colors rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 flex-shrink-0"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1 text-gray-500 hover:text-red-500 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};