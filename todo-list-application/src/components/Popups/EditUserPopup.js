import React, { useState } from 'react';
import './EditUserPopup.css'; 

const EditUserPopup = ({ toggleEditPopup }) => {
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);

  const updateUser = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://oscowl-assignment-backend.onrender.com/update-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, oldPassword, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update user details.');
        return;
      }

      setError(null);
      toggleEditPopup();  
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred while updating user details.');
    }
  };

  return (
    <div className="edit-user-popup">
      <h2 className="edit-user-heading">Edit User</h2>
      {error && <p className="edit-user-error-message">{error}</p>}
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="edit-user-input"
      />
      <div className="edit-user-input-container">
        <input
          placeholder="Old Password"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="edit-user-input"
        />
        <input
          placeholder="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="edit-user-input"
        />
      </div>
      <div className="edit-user-button-container">
        <button onClick={updateUser} className="edit-user-button edit-user-button-save">
          Save
        </button>
        <button onClick={toggleEditPopup} className="edit-user-button edit-user-button-cancel">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditUserPopup;
