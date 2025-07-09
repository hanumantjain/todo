import React, { useState } from 'react';
import { Check, X, Edit2, Save } from 'lucide-react';

const TodoItem = ({ todo, onToggle, onRemove, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onUpdate(todo.id, editText);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    }
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
        todo.completed 
          ? 'bg-gray-50 border-gray-200' 
          : 'bg-white border-gray-300 hover:border-blue-300'
      }`}
    >
      <button
        onClick={() => onToggle(todo.id)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          todo.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 hover:border-green-400'
        }`}
      >
        {todo.completed && <Check size={16} />}
      </button>
      
      {isEditing ? (
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            onClick={handleSaveEdit}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            <Save size={16} />
          </button>
          <button
            onClick={handleCancelEdit}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <>
          <span
            className={`flex-1 ${
              todo.completed
                ? 'line-through text-gray-500'
                : 'text-gray-800'
            }`}
          >
            {todo.text}
          </span>
          <button
            onClick={handleStartEdit}
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onRemove(todo.id)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={16} />
          </button>
        </>
      )}
    </div>
  );
};

export default TodoItem;