import React, { useState, useEffect } from 'react';

const TodoPopup = ({ todo, togglePopup, fetchTodos }) => {
  const [title, setTitle] = useState(todo?.title || '');
  const [status, setStatus] = useState(todo?.status || 'pending');

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setStatus(todo.status);
    } else {
      setTitle('');
      setStatus('pending');
    }
  }, [todo]);

  const saveTodo = async () => {
    const token = localStorage.getItem('token');
    const method = todo ? 'PUT' : 'POST';  // Use PUT if editing, POST if adding
    const endpoint = todo ? `https://oscowl-assignment-backend.onrender.com/update-todo/${todo.id}` : 'https://oscowl-assignment-backend.onrender.com/add-todo';

    await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, status }),
    });

    fetchTodos();
    togglePopup();
  };

  return (
    <div className="popup">
      <h2>{todo ? 'Edit Todo' : 'Add Todo'}</h2>
      <input 
        placeholder="Title" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        className='input'
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="pending">Pending</option>
        <option value="done">Done</option>
        <option value="completed">Completed</option>
        <option value="in progress">In Progress</option>
      </select>
      <button onClick={saveTodo}>{todo ? 'Update' : 'Add'}</button>
      <button onClick={togglePopup}>Cancel</button>
    </div>
  );
};

export default TodoPopup;
