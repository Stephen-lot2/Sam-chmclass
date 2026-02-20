// SIMPLE VERSION - Test if React is working
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        color: '#333',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <h1 style={{ fontSize: '48px', margin: '0 0 20px 0' }}>🧪</h1>
        <h2 style={{ margin: '0 0 10px 0', color: '#667eea' }}>Samuel ChemLab</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>React is working! ✅</p>
        
        <div style={{ 
          background: '#f0f0f0', 
          padding: '20px', 
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
            Counter Test:
          </p>
          <p style={{ fontSize: '36px', fontWeight: 'bold', margin: '10px 0', color: '#667eea' }}>
            {count}
          </p>
          <button 
            onClick={() => setCount(count + 1)}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Increase
          </button>
          <button 
            onClick={() => setCount(0)}
            style={{
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
        </div>

        <div style={{ 
          background: '#e8f5e9', 
          padding: '15px', 
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'left'
        }}>
          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#2e7d32' }}>
            ✅ Working Components:
          </p>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#555' }}>
            <li>React rendering</li>
            <li>State management (useState)</li>
            <li>Event handlers (onClick)</li>
            <li>Vite dev server</li>
          </ul>
        </div>

        <div style={{ 
          background: '#fff3cd', 
          padding: '15px', 
          borderRadius: '8px',
          textAlign: 'left',
          fontSize: '14px'
        }}>
          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#856404' }}>
            📝 Next Steps:
          </p>
          <ol style={{ margin: 0, paddingLeft: '20px', color: '#856404' }}>
            <li>If you see this, React is working!</li>
            <li>To use the full app, rename App.jsx.backup to App.jsx</li>
            <li>Restart the dev server</li>
          </ol>
        </div>
      </div>

      <p style={{ marginTop: '20px', opacity: 0.8, fontSize: '14px' }}>
        Press F12 to open Developer Console
      </p>
    </div>
  )
}

export default App
