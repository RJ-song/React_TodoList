import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import SignIn from './signIn.jsx'
import SignUp from './SignUp.jsx'
import TodoListPage from './TodoListPage.jsx'
import './index.css'
import { HashRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
    <App />
    </HashRouter>
    
  </React.StrictMode>,
)
