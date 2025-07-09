import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const TodoForm = ({ onAddTodo, loading }) => {
  const [newTodo, setNewTodo] = useState('');

  const handleSubmit = () => {
    if (newTodo.trim()) {
      onAddTodo(newTodo);
      setNewTodo('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2 mb-6">
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Add a new todo..."
        disabled={loading}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50"
      >
        <Plus size={20} />
        {loading ? 'Adding...' : 'Add'}
      </button>
    </div>
  );
};

export default TodoForm;