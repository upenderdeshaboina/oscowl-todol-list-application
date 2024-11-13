import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import Navbar from '../Navbar/Navbar';
import { useHistory } from 'react-router-dom';
import './Home.css'

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [editTodo, setEditTodo] = useState(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoStatus, setNewTodoStatus] = useState('pending');
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const history=useHistory()

  const fetchTodos = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('https://oscowl-assignment-backend.onrender.com/todos', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setTodos(data.todos || []);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const toggleAddPopup = () => {
    setIsAddPopupOpen(!isAddPopupOpen);
    setNewTodoTitle('');  
    setNewTodoStatus('pending');
  };

  const toggleEditPopup = (todo) => {
    setEditTodo(todo);
    setIsEditPopupOpen(!isEditPopupOpen);
  };

  const handleAddTodo = async () => {
    const token = localStorage.getItem('token');
    await fetch('https://oscowl-assignment-backend.onrender.com/add-todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTodoTitle, status: newTodoStatus }),
    });
    fetchTodos();
    toggleAddPopup(); 
  };

  const handleUpdateTodo = async () => {
    const token = localStorage.getItem('token');
    await fetch(`https://oscowl-assignment-backend.onrender.com/update-todo/${editTodo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: editTodo.title, status: editTodo.status }),
    });
    fetchTodos();
    toggleEditPopup(null); 
  };

  const deleteTodo = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`https://oscowl-assignment-backend.onrender.com/delete-todo/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTodos();
  };

  if(!localStorage.getItem('token')){
    return history.replace('/login')
  }

  return (
    <>

    <Navbar/>
    <div className="home">
      <h1>Todos Application</h1>
      <button onClick={toggleAddPopup}>Add Todo</button>
      <ul className='list-container'>
          {todos.map(todo => (
          <li key={todo.id} className="todo">
            <h3>{todo.title}</h3>
            <p>Status: {todo.status}</p>
            <button onClick={() => toggleEditPopup(todo)} className='edit'>Edit</button>
            <button onClick={() => deleteTodo(todo.id)} className='delete'>Delete</button>
          </li>
        ))}
      </ul>
      

      <Popup open={isAddPopupOpen} closeOnDocumentClick onClose={toggleAddPopup}>
        <div className="popup">
          <h2>Add Todo</h2>
          <input 
            type="text" 
            placeholder="Title" 
            value={newTodoTitle} 
            onChange={(e) => setNewTodoTitle(e.target.value)} 
          />
          <select 
            value={newTodoStatus} 
            onChange={(e) => setNewTodoStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="done">Done</option>
            <option value="completed">Completed</option>
            <option value="in progress">In Progress</option>
          </select>
          <button onClick={handleAddTodo}>Add</button>
          <button onClick={toggleAddPopup}>Cancel</button>
        </div>
      </Popup>

      {/* Edit Todo Popup */}
      <Popup open={isEditPopupOpen} closeOnDocumentClick onClose={() => toggleEditPopup(null)}>
        <div className="popup">
          <h2>Edit Todo</h2>
          <input 
            type="text" 
            value={editTodo?.title || ''} 
            onChange={(e) => setEditTodo({ ...editTodo, title: e.target.value })} 
          />
          <select 
            value={editTodo?.status || 'pending'} 
            onChange={(e) => setEditTodo({ ...editTodo, status: e.target.value })}
          >
            <option value="pending">Pending</option>
            <option value="done">Done</option>
            <option value="completed">Completed</option>
            <option value="in progress">In Progress</option>
          </select>
          <button onClick={handleUpdateTodo}>Update</button>
          <button onClick={() => toggleEditPopup(null)}>Cancel</button>
        </div>
      </Popup>
    </div>
  </>
  )
};

export default Home;
