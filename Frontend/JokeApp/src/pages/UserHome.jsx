import {Link, useNavigate, redirect} from 'react-router-dom';
import React, { useRef } from 'react';
import { clearAuth, getAuth } from '../Models/Auth';
import { userService } from '../API/userClient';

async function handleJokePull(){
    const response = await userService.countJokes();
    const count = response.result;
    const number = await generateNumber(count);
    const data = await userService.getOneJoke(number);
    return data;
}

async function generateNumber(max){
    const num = Math.floor(Math.random() * max);
    return num;
}

export function UserHome() {
  const navigate = useNavigate();
  const setupRef = useRef(null);
  const punchlineRef = useRef(null);

  let dialogueLines = [];

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  const handleBigButtonPress = async () => {
    try{
      const data = await handleJokePull();
      
      if(setupRef.current){
        setupRef.current.innerText = `"${data.setup}"`
      }

      if(punchlineRef.current){
        punchlineRef.current.innerText = `"${data.punchline}"`
      }

    }catch(error){
      console.error("Error fetching joke", error);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#18181b', 
      color: '#e4e4e7', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-between', 
      padding: '24px', 
      fontFamily: 'system-ui, sans-serif', 
      border: '4px solid #ef4444', 
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      
    
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        width: '100%' 
      }}>
        <Link 
          to='/About'
          className='btn btn-primary'
          style={{
            textDecoration: 'none',
            background: 'transparent', 
            border: '1px solid #ef4444', 
            color: '#e4e4e7', 
            padding: '8px 16px', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = '#27272a'}
          onMouseOut={(e) => e.target.style.background = 'transparent'}
        >
          About
        </Link>

        <button 
          onClick={handleLogout}
          style={{ 
            background: '#ef4444', 
            border: 'none', 
            color: '#ffffff', 
            padding: '8px 16px', 
            borderRadius: '4px', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
          }}
        >
          Logout
        </button>
      </div>

      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flex: 1,
        gap: '40px',
        textAlign: 'center'
      }}>
        
        <button 
          onClick={handleBigButtonPress}
          style={{ 
            backgroundColor: '#ef4444', 
            color: '#ffffff', 
            border: '4px solid #fca5a5', 
            padding: '28px 64px', 
            fontSize: '1.5rem', 
            borderRadius: '16px', 
            cursor: 'pointer', 
            fontWeight: '800',
            letterSpacing: '1px',
            boxShadow: '0 10px 25px rgba(239, 68, 68, 0.5), inset 0 4px 6px rgba(255, 255, 255, 0.3)',
            transition: 'transform 0.1s ease, box-shadow 0.1s ease',
            outline: 'none'
          }}
          onMouseDown={(e) => {
            e.target.style.transform = 'scale(0.96)';
            e.target.style.boxShadow = '0 4px 10px rgba(239, 68, 68, 0.4), inset 0 2px 4px rgba(0, 0, 0, 0.2)';
          }}
          onMouseUp={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 10px 25px rgba(239, 68, 68, 0.5), inset 0 4px 6px rgba(255, 255, 255, 0.3)';
          }}
        >
          PRESS ME
        </button>

        {/* Dialogue Area */}
        <div style={{ 
          maxWidth: '500px', 
          width: '100%', 
          backgroundColor: '#27272a', 
          border: '2px solid #ef4444', 
          borderRadius: '8px', 
          padding: '24px', 
          minHeight: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)'
        }}>
         <p 
            ref={setupRef}
            style={{ 
              margin: 0, 
              fontSize: '1.1rem', 
              lineHeight: '1.5', 
              color: '#f4f4f5',
              fontStyle: 'italic'
            }}
          >
            "Press the button to hear a joke!"
          </p>
          
          {/* Punchline paragraph tied to punchlineRef */}
          <p 
            ref={punchlineRef}
            style={{ 
              margin: 0, 
              fontSize: '1.1rem', 
              lineHeight: '1.5', 
              color: '#ef4444', 
              fontWeight: 'bold' 
            }}
          >
            {/* Starts blank */}
          </p>
        </div>

      </div>

      {/* Bottom Footer Text */}
      <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#71717a' }}>
        You Got Jokes? V-1.0
      </div>

    </div>
  );
}

export default UserHome;