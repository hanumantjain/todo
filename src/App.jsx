import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import TodoForm from './components/TodoForm';
import TodoFilters from './components/TodoFilters';
import TodoStats from './components/TodoStats';
import TodoList from './components/TodoList';
import ErrorMessage from './components/ErrorMessage';
import { todoAPI } from './services/todoAPI';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    if (!todoAPI.isConfigured()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await todoAPI.fetchTodos();
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

  const addTodo = async (text) => {
    if (!text.trim()) return;
    
    if (!todoAPI.isConfigured()) {
      // Fallback to local storage if not configured
      const todo = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        created_at: new Date().toISOString()
      };
      setTodos([todo, ...todos]);
      return;
    }

    try {
      setLoading(true);
      const todo = {
        text: text.trim(),
        completed: false,
        created_at: new Date().toISOString()
      };
      
      const newTodoData = await todoAPI.createTodo(todo);
      setTodos([newTodoData, ...todos]);
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

    if (todoAPI.isConfigured()) {
      try {
        await todoAPI.updateTodo(id, { completed: !todo.completed });
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

    if (todoAPI.isConfigured()) {
      try {
        await todoAPI.deleteTodo(id);
        setConnected(true);
      } catch (error) {
        // Revert on error
        setTodos(todos);
        setConnected(false);
      }
    }
  };

  const updateTodo = async (id, text) => {
    const updatedTodos = todos.map(t => 
      t.id === id ? { ...t, text: text.trim() } : t
    );
    setTodos(updatedTodos);

    if (todoAPI.isConfigured()) {
      try {
        await todoAPI.updateTodo(id, { text: text.trim() });
        setConnected(true);
      } catch (error) {
        setConnected(false);
      }
    }
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

          <ErrorMessage error={error} />
          
          <TodoForm onAddTodo={addTodo} loading={loading} />
          
          <TodoFilters 
            filter={filter} 
            onFilterChange={setFilter} 
          />
          
          <TodoStats 
            activeCount={activeCount}
            completedCount={completedCount}
            totalCount={todos.length}
          />
          
          <TodoList 
            todos={filteredTodos}
            loading={loading}
            onToggleTodo={toggleTodo}
            onRemoveTodo={removeTodo}
            onUpdateTodo={updateTodo}
            isEmpty={todos.length === 0}
          />

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