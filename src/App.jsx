import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Edit2, Save, Database, Wifi, WifiOff } from 'lucide-react';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(true);
  const [error, setError] = useState(null);

  // Supabase configuration from environment variables
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const API_BASE = `${SUPABASE_URL}/rest/v1`;

  // Headers for Supabase API calls
  const getHeaders = () => ({
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  });

  // Check if Supabase is configured
  const isConfigured = SUPABASE_URL && SUPABASE_ANON_KEY;

  // API functions
  const fetchTodos = async () => {
    if (!isConfigured) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}/todos?select=*&order=created_at.desc`, {
        headers: getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTodos(data);
      setConnected(true);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Failed to load todos');
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (todo) => {
    if (!isConfigured) return null;
    
    try {
      const response = await fetch(`${API_BASE}/todos`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(todo)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data[0];
    } catch (error) {
      console.error('Error creating todo:', error);
      setError('Failed to create todo');
      throw error;
    }
  };

  const updateTodo = async (id, updates) => {
    if (!isConfigured) return null;
    
    try {
      const response = await fetch(`${API_BASE}/todos?id=eq.${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data[0];
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Failed to update todo');
      throw error;
    }
  };

  const deleteTodoAPI = async (id) => {
    if (!isConfigured) return;
    
    try {
      const response = await fetch(`${API_BASE}/todos?id=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Failed to delete todo');
      throw error;
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    
    if (!isConfigured) {
      // Fallback to local storage if not configured
      const todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        created_at: new Date().toISOString()
      };
      setTodos([todo, ...todos]);
      setNewTodo('');
      return;
    }

    try {
      setLoading(true);
      const todo = {
        text: newTodo.trim(),
        completed: false,
        created_at: new Date().toISOString()
      };
      
      const newTodoData = await createTodo(todo);
      setTodos([newTodoData, ...todos]);
      setNewTodo('');
      setConnected(true);
    } catch (error) {
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    // Optimistic update
    const updatedTodos = todos.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTodos(updatedTodos);

    if (isConfigured) {
      try {
        await updateTodo(id, { completed: !todo.completed });
        setConnected(true);
      } catch (error) {
        // Revert on error
        setTodos(todos);
        setConnected(false);
      }
    }
  };

  const removeTodo = async (id) => {
    // Optimistic update
    const filteredTodos = todos.filter(t => t.id !== id);
    setTodos(filteredTodos);

    if (isConfigured) {
      try {
        await deleteTodoAPI(id);
        setConnected(true);
      } catch (error) {
        // Revert on error
        setTodos(todos);
        setConnected(false);
      }
    }
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = async () => {
    if (!editText.trim()) return;

    const updatedTodos = todos.map(t => 
      t.id === editingId ? { ...t, text: editText.trim() } : t
    );
    setTodos(updatedTodos);

    if (isConfigured) {
      try {
        await updateTodo(editingId, { text: editText.trim() });
        setConnected(true);
      } catch (error) {
        setConnected(false);
      }
    }

    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Todo List
            </h1>
            <div className="flex items-center gap-2">
              {connected ? (
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <Wifi size={16} />
                  <span>Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <WifiOff size={16} />
                  <span>Offline</span>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          {/* Add Todo */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && addTodo()}
              placeholder="Add a new todo..."
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
            <button
              onClick={addTodo}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Plus size={20} />
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
            {['all', 'active', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  filter === f 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
            <span>{activeCount} active</span>
            <span>{completedCount} completed</span>
            <span>{todos.length} total</span>
          </div>

          {/* Todo List */}
          <div className="space-y-2">
            {loading && todos.length === 0 ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading todos...</p>
              </div>
            ) : filteredTodos.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-lg">No todos yet</p>
                <p className="text-sm">Add one above to get started!</p>
              </div>
            ) : (
              filteredTodos.map(todo => (
                <div
                  key={todo.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                    todo.completed 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-white border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      todo.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {todo.completed && <Check size={16} />}
                  </button>
                  
                  {editingId === todo.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={saveEdit}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={cancelEdit}
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
                        onClick={() => startEdit(todo.id, todo.text)}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => removeTodo(todo.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              Developed by - <a href="https://hanumantjain.com" target='_blank' className="text-blue-600 hover:underline">Hanumant Jain</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;