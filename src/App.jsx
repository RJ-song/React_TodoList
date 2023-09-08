import { Routes, Route } from 'react-router-dom';
import SignIn from './signIn.jsx'
import SignUp from './signUp.jsx'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;