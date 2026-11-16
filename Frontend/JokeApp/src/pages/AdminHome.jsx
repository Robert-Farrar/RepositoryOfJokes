import { Link, useNavigate } from 'react-router-dom';
import React, { useRef, useEffect } from 'react';
import { clearAuth } from '../Models/Auth';
import {userService} from '../API/userClient';
import {adminService} from '../API/adminClient';

export function AdminHome() {
  const navigate = useNavigate();

  
  const tableBodyRef = useRef(null);
  const editCardRef = useRef(null);
  const addCardRef = useRef(null);
  
  const editIdRef = useRef(null);
  const editSetupRef = useRef(null);
  const editPunchlineRef = useRef(null);
  
  const newSetupRef = useRef(null);
  const newPunchlineRef = useRef(null);

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  
  useEffect(() => {
    loadJokes();
  }, []);

  const loadJokes = async () => {
    try {
      const response = await userService.getAllJokes();
      const jokes = response || [];

      console.log(jokes);
      
      if (tableBodyRef.current) {
        tableBodyRef.current.innerHTML = '';
        jokes.forEach((joke) => {
          const tr = document.createElement('tr');
          tr.style.borderBottom = '1px solid #27272a';
          tr.style.cursor = 'pointer';
          tr.onmouseover = () => tr.style.backgroundColor = '#27272a';
          tr.onmouseout = () => tr.style.backgroundColor = 'transparent';
          
          tr.onclick = () => openEditCard(joke);

          tr.innerHTML = `
            <td style="padding: 12px; color: #a1a1aa;">${joke.id}</td>
            <td style="padding: 12px; color: #f4f4f5; max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${joke.setup}</td>
            <td style="padding: 12px; color: #ef4444; max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${joke.punchline}</td>
          `;
          tableBodyRef.current.appendChild(tr);
        });
      }
    } catch (error) {
      console.error("Failed to load jokes:", error);
    }
  };

  const openEditCard = (joke) => {
    editIdRef.current = joke.id;
    if (editSetupRef.current) editSetupRef.current.value = joke.setup;
    if (editPunchlineRef.current) editPunchlineRef.current.value = joke.punchline;
    if (editCardRef.current) editCardRef.current.style.display = 'flex';
  };

  const closeEditCard = () => {
    if (editCardRef.current) editCardRef.current.style.display = 'none';
  };

  const handleUpdateJoke = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateJoke(editIdRef.current, {
        setup: editSetupRef.current.value,
        punchline: editPunchlineRef.current.value,
      });
      closeEditCard();
      loadJokes();
    } catch (error) {
      console.error("Failed to update joke:", error);
    }
  };

  const openAddCard = () => {
    if (newSetupRef.current) newSetupRef.current.value = '';
    if (newPunchlineRef.current) newPunchlineRef.current.value = '';
    if (addCardRef.current) addCardRef.current.style.display = 'flex';
  };

  const closeAddCard = () => {
    if (addCardRef.current) addCardRef.current.style.display = 'none';
  };

  const handleAddJoke = async (e) => {
    e.preventDefault();
    try {
      await adminService.addJoke({
        setup: newSetupRef.current.value,
        punchline: newPunchlineRef.current.value,
      });
      closeAddCard();
      loadJokes();
    } catch (error) {
      console.error("Failed to add joke:", error);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#18181b', 
      color: '#e4e4e7', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      padding: '24px', 
      fontFamily: 'system-ui, sans-serif', 
      border: '4px solid #ef4444', 
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#f4f4f5' }}>Admin Panel - Jokes Manager</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={openAddCard}
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
            + Add New Joke
          </button>
          <button 
            onClick={handleLogout}
            style={{ 
              background: 'transparent', 
              border: '1px solid #ef4444', 
              color: '#e4e4e7', 
              padding: '8px 16px', 
              borderRadius: '4px', 
              cursor: 'pointer', 
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ 
        flex: 1, 
        backgroundColor: '#27272a', 
        border: '2px solid #ef4444', 
        borderRadius: '8px', 
        overflow: 'hidden',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ef4444', backgroundColor: '#18181b' }}>
              <th style={{ padding: '12px', color: '#ef4444' }}>ID</th>
              <th style={{ padding: '12px', color: '#ef4444' }}>Setup</th>
              <th style={{ padding: '12px', color: '#ef4444' }}>Punchline</th>
            </tr>
          </thead>
          <tbody ref={tableBodyRef}>
          </tbody>
        </table>
      </div>

      <div 
        ref={editCardRef} 
        style={{ 
          display: 'none', 
          position: 'fixed', 
          top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0, 0, 0, 0.7)', 
          justifyContent: 'center', 
          alignItems: 'center',
          zIndex: 1000 
        }}
      >
        <div style={{ backgroundColor: '#27272a', border: '2px solid #ef4444', padding: '24px', borderRadius: '8px', width: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ margin: 0, color: '#f4f4f5' }}>Edit Joke</h3>
          <form onSubmit={handleUpdateJoke} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontSize: '0.9rem', color: '#a1a1aa' }}>Setup</label>
            <textarea ref={editSetupRef} style={{ background: '#18181b', color: '#e4e4e7', border: '1px solid #ef4444', padding: '8px', borderRadius: '4px', resize: 'vertical' }} rows="3" required />
            
            <label style={{ fontSize: '0.9rem', color: '#a1a1aa' }}>Punchline</label>
            <textarea ref={editPunchlineRef} style={{ background: '#18181b', color: '#e4e4e7', border: '1px solid #ef4444', padding: '8px', borderRadius: '4px', resize: 'vertical' }} rows="2" required />
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
              <button type="button" onClick={closeEditCard} style={{ background: 'transparent', border: '1px solid #a1a1aa', color: '#a1a1aa', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ background: '#ef4444', border: 'none', color: '#ffffff', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Save Changes</button>
            </div>
          </form>
        </div>
      </div>

      <div 
        ref={addCardRef} 
        style={{ 
          display: 'none', 
          position: 'fixed', 
          top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0, 0, 0, 0.7)', 
          justifyContent: 'center', 
          alignItems: 'center',
          zIndex: 1000 
        }}
      >
        <div style={{ backgroundColor: '#27272a', border: '2px solid #ef4444', padding: '24px', borderRadius: '8px', width: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ margin: 0, color: '#f4f4f5' }}>Add New Joke</h3>
          <form onSubmit={handleAddJoke} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontSize: '0.9rem', color: '#a1a1aa' }}>Setup</label>
            <textarea ref={newSetupRef} placeholder="Enter joke setup..." style={{ background: '#18181b', color: '#e4e4e7', border: '1px solid #ef4444', padding: '8px', borderRadius: '4px', resize: 'vertical' }} rows="3" required />
            
            <label style={{ fontSize: '0.9rem', color: '#a1a1aa' }}>Punchline</label>
            <textarea ref={newPunchlineRef} placeholder="Enter punchline..." style={{ background: '#18181b', color: '#e4e4e7', border: '1px solid #ef4444', padding: '8px', borderRadius: '4px', resize: 'vertical' }} rows="2" required />
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
              <button type="button" onClick={closeAddCard} style={{ background: 'transparent', border: '1px solid #a1a1aa', color: '#a1a1aa', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ background: '#ef4444', border: 'none', color: '#ffffff', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Create Joke</button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}