import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

const site = 'https://todolist-api.hexschool.io'


function SignUp(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [nickname,setNickname] = useState('');
  const [message,setMessage] = useState('');

  const handleSignUp = async() => {
    try{
      const response = await axios.post(`${site}/users/sign_up`,{
        email,
        password,
        nickname,
      });
      setMessage("註冊成功 UID:" + response.data.uid)
    }
    catch(e){
      setMessage("註冊失敗" + e.message)
    }
  };
    return(
      <div>
      <h2>註冊</h2>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='Email'
        type='email'
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='Password'
        type='password'
      />
      <input
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder='Nickname'
        type='text'
      />
      <button onClick={handleSignUp}>Sign Up</button>
      <p>{message}</p>
    </div>
    );
  }

function SignIn(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [token,setToken] = useState('');

  const handleSignIn = async() =>{
    try{
      const response = await axios.post(`${site}/users/sign_in`,{
        email: email,
        password: password,
      })
      setToken(response.data.token);
    }
    catch(e){
      setToken('登入失敗:' + e.message);
    }
  };
  return(
    <div>
    <h2>登入</h2>
    <input
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder='Email'
      type='email'
    />
    <input
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder='Password'
      type='password'
    />
    <button onClick={handleSignIn}>Sign In</button>
    <p><h2>Token:</h2> {token}</p>
  </div>
  );
}

function CheckOut({token,setToken}){
  const [message,setMessage] = useState('');
  const handleCheckOut = async() =>{
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.cookie = `hexschoolTodo=${token}; expires=${tomorrow.toUTCString()}`;
    console.log(
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('hexschoolTodo')),
    );
    try{
      const response = await axios.get(`${site}/users/checkout`,{
        headers:{
          Authorization: token,
        }
      });
      setMessage('驗證成功 UID:' + response.data.uid);
    }
    catch(e){
      setMessage('驗證失敗:' + e.message);
    }};
    return(
      <div>
      <h2>驗證</h2>
      <input
        value={token}
        onChange={(e) => {
          setToken(e.target.value);
        }}
        placeholder='Token'
      />
      <button onClick={handleCheckOut}>Check Out</button>
      <p>{message}</p>
    </div>
    );      

} 

function SignOut(){
  const [token,setToken] = useState('');
  const handleSignOut = async() =>{
    try{
      const response = await axios.post(`${site}/users/sign_out`,{},{
        headers:{
          Authorization: token,
        }
      }
      );
      console.log(response.data);
    }
    catch(e){
      setToken('錯誤:', e.message);
    }
  };
  return (
    <div>
      <h2>登出</h2>
      <input
        value={token}
        onChange={(e) => {
          setToken(e.target.value);
        }}
        placeholder='Token'
      />
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  )
}

const TodoList = ({ token }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [todoEdit, setTodoEdit] = useState({});

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    const response = await axios.get(`${site}/todos`, {
      headers: {
        Authorization: token,
      },
    });
    setTodos(response.data.data);
  };

  const addTodo = async () => {
    if (!newTodo) return;
    const todo = {
      content: newTodo,
    };
    await axios.post(`${site}/todos`, todo, {
      headers: {
        Authorization: token,
      },
    });
    setNewTodo('');
    getTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${site}/todos/${id}`, {
      headers: {
        Authorization: token,
      },
    });
    getTodos();
  };

  const updateTodo = async (id) => {
    const todo = todos.find((todo) => todo.id === id);
    todo.content = todoEdit[id]
    await axios.put(`${site}/todos/${id}`, todo, {
      headers: {
        Authorization: token,
      },
    });
    getTodos();
    setTodoEdit({
      ...todoEdit,
      [id]: ''
    })
  };

  const toggleStatus = async (id) => {
    await axios.patch(
      `${site}/todos/${id}/toggle`,
      {},
      {
        headers: {
          Authorization: token,
        },
      },
    );
    getTodos();
  };

  return (
    <div>
      <input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder='New Todo'
      />
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo.content} {todo.status ? '完成' : '未完成'}
            | {todoEdit[todo.id]}
            <input type="text" placeholder='更新值' onChange={
              (e) => {
                const newTodoEdit = {
                  ...todoEdit
                }
                newTodoEdit[todo.id] = e.target.value
                setTodoEdit(newTodoEdit)
              }
            } />
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            <button onClick={() => updateTodo(todo.id)}>Update</button>
            <button onClick={() => toggleStatus(todo.id)}>
              Toggle Status
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

function App() {
  const [token, setToken] = useState('');
  const TodoToken = document.cookie
    .split('; ')
    .find((row) => row.startsWith('hexschoolTodo='))
    ?.split('=')[1];
  useEffect(() => {
    if (TodoToken) {
      setToken(TodoToken);
    }
  }, []);
  
  return (
    <>
      <SignUp />
      <SignIn />
      <CheckOut setToken={setToken} token={token}  />
      <SignOut />
      <h2>Todo list</h2>
      {
        token && <TodoList token={token} />
      }
    </>
  )
}

export default App;
