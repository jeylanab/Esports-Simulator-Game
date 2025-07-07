import React from 'react'
import ReactDOM from 'react-dom/client'
import { GameProvider } from './Components/Game/GameContext';

import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
   <GameProvider>
    <App />
  </GameProvider>,
)
