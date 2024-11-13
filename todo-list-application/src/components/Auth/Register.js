import React, { useState } from 'react';
import './Login.css'
import { Redirect } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passType,setType]=useState(false)
    const history=useHistory()

    const handleRegister = async (event) => {
        event.preventDefault()
        const credentials={ username, password };
        const options={
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify(credentials)
        }
        try {
            const response=await fetch('https://oscowl-assignment-backend.onrender.com/register',options)
            const data=await response.json()
            if (response.ok){
                alert(data.msg)
                history.push('/login')

            }else{
                alert(data.msg)
            }
            setUsername('')
            setPassword('')
        } catch (error) {
            
        }
        
    };


    const onClickShow=()=>{
        setType(!passType)
    }

    if(localStorage.getItem('token')){
        return <Redirect to='/'/>
    }


    return (
        <div className='login-container'>
            <div className='form-container'>

            <form className='' onSubmit={handleRegister}>
                <h1>Register</h1>
                <div className='input-container'>
                    <input className='input' type='text' id='username' placeholder='Enter your username' value={username} onChange={(e)=>setUsername(e.target.value)}/>
                    <i className='bx bxs-user'></i>
                </div>
                <div className='input-container'>
                    <input className='input' type={!passType?'password':'text'} id='password' placeholder='Enter your password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    {passType?<i className='bx bxs-low-vision' onClick={onClickShow}></i>:
                    <i className='bx bx-show' onClick={onClickShow}></i>}
                </div>
                <button type='submit' className='login-btn'>Register</button>
                <div className='register-container'>
                    <div className=''>
                        <p>Already have an account? <a href='/login' className='register'>Login</a></p>
                    </div>
                </div>
            </form>
            </div>
        </div>
    );
};

export default Register;
