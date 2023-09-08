import { Routes, Route } from 'react-router-dom';
import SignIn from './signIn.jsx'
import SignUp from './signUp.jsx'
import TodoListPage from './TodoListPage.jsx';
import NotFound from './NotFound.jsx'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/Todo' element={<TodoListPage />} />
        <Route path="*" element={ <NotFound/>} />
      </Routes>
    </div>
  );
}

export default App;