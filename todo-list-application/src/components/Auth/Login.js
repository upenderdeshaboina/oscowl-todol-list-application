import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passType, setType] = useState(false);
    const history = useHistory();

    const handleLogin = async (event) => {
        event.preventDefault();
        const credentials = { username, password };
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        };

        try {
            const response = await fetch('https://oscowl-assignment-backend.onrender.com/login', options);
            const data = await response.json();

            if (response.ok) {
                console.log(data);
                localStorage.setItem('token', data.token);
                history.push('/');
            } else {
                console.log(data);
                alert(data.msg);
            }
        } catch (error) {
            console.log(error);
            alert('An error occurred while trying to log in. Please try again.');
        }
    };

    const onClickShow = () => {
        setType(!passType);
    };

    return (
        <div className='login-container'>
            <div className='form-container'>
                <form onSubmit={handleLogin} className='form-'>
                    <h1>Login</h1>
                    <div className='input-container'>
                        <input
                            className='input'
                            type='text'
                            id='username'
                            placeholder='Enter your username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <i className='bx bxs-user'></i>
                    </div>
                    <div className='input-container'>
                        <input
                            className='input'
                            type={passType ? 'text' : 'password'}
                            id='password'
                            placeholder='Enter your password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {passType ? (
                            <i className='bx bxs-low-vision' onClick={onClickShow}></i>
                        ) : (
                            <i className='bx bx-show' onClick={onClickShow}></i>
                        )}
                    </div>
                    <button type='submit' className='login-btn'>Login</button>
                    <div className='register-container'>
                        <p>
                            Don't have an account?{' '}
                            <Link to='/register' className='register'>Register</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
