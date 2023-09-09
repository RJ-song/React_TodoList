import { Routes, Route } from 'react-router-dom';
import SignIn from './signIn.jsx'
import SignUp from './signUp.jsx'
import TodoListPage from './TodoListPage.jsx';
import NotFound from './NotFound.jsx'
import { TokenProvider } from './TokenContext';

function App() {
  return (
    <div>
      <TokenProvider>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/Todo' element={<TodoListPage />} />
        <Route path="*" element={ <NotFound/>} />
      </Routes>
      </TokenProvider>
    </div>
  );
}

export default App;