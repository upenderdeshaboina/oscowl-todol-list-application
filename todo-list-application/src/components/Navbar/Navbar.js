import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import { useHistory } from 'react-router-dom';
import EditUserPopup from '../Popups/EditUserPopup';
import './Navbar.css';

const Navbar = () => {
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('https://oscowl-assignment-backend.onrender.com/user-data', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserDetails(data.userData);
        } else {
          console.error('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    history.replace('/login');
  };

  return (
    <div className="navbar">
      <h1>{userDetails ? userDetails.username : 'User'}</h1>
      <div>
        <button onClick={() => setIsEditPopupOpen(true)}>Edit</button>
        <button onClick={logout}>Logout</button>
      </div>
      <Popup open={isEditPopupOpen} onClose={() => setIsEditPopupOpen(false)} closeOnDocumentClick>
        <EditUserPopup toggleEditPopup={() => setIsEditPopupOpen(false)} />
      </Popup>
    </div>
  );
};

export default Navbar;
