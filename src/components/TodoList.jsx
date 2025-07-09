import React from 'react';
import TodoItem from './TodoItem';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

const TodoList = ({ 
  todos, 
  loading, 
  onToggleTodo, 
  onRemoveTodo, 
  onUpdateTodo,
  isEmpty 
}) => {
  if (loading && isEmpty) {
    return <LoadingSpinner />;
  }

  if (todos.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-2">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggleTodo}
          onRemove={onRemoveTodo}
          onUpdate={onUpdateTodo}
        />
      ))}
    </div>
  );
};

export default TodoList;