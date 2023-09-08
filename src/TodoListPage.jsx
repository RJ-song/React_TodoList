import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'


const site = 'https://todolist-api.hexschool.io'

function TodoListPage() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [todoEdit, setTodoEdit] = useState({});

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    try {
      const response = await axios.get(`${site}/todos`, {
        headers: {
          Authorization: token,
        },
      });
      setTodos(response.data.data);
    } catch (error) {
      console.error("獲取失敗", error);
    }
  };

  const addTodo = async () => {
    if (!newTodo) return;
    const todo = {
      content: newTodo,
    };
    try {
      await axios.post(`${site}/todos`, todo, {
        headers: {
          Authorization: token,
        },
      });
      setNewTodo("");
      getTodos();
    } catch (error) {
      console.error("新增失敗", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${site}/todos/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      getTodos();
    } catch (error) {
      console.error("刪除失敗", error);
    }
  };

  const updateTodo = async (id) => {
    const editedContent = todoEdit[id];
    if (editedContent === undefined) return;

    const todo = todos.find((todo) => todo.id === id);
    todo.content = editedContent;

    try {
      await axios.put(`${site}/todos/${id}`, todo, {
        headers: {
          Authorization: token,
        },
      });
      getTodos();
      setTodoEdit({
        ...todoEdit,
        [id]: "",
      });
    } catch (error) {
      console.error("更新失敗", error);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.patch(
        `${site}/todos/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      getTodos();
    } catch (error) {
      console.error("切換狀態失敗", error);
    }
  };
  const clearCompletedTodos = async () => {
    const completedTodos = todos.filter((todo) => todo.completed);
  
    try {
      for (const todo of completedTodos) {
        await axios.delete(`${site}/todos/${todo.id}`, {
          headers: {
            Authorization: token,
          },
        });
      }
      
      getTodos(); // 重新获取待办事项列表，以更新状态
    } catch (error) {
      console.error("清除失敗", error);
    }
  };
  return (
    <div id="todoListPage" className="bg-half">
      <nav>
        <h1><a href="#">ONLINE TODO LIST</a></h1>
        <ul>
          <li className="todo_sm"><a href="#"><span>我的代辦</span></a></li>
          <li><a href="/">登出</a></li>
        </ul>
      </nav>
      <div className="container todoListPage vhContainer">
        <div className="todoList_Content">
          <div className="inputBox">
            <input
              type="text"
              placeholder="請輸入待辦事項"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            {/* <input
                   className="formControls_btnSubmit"
                   type="button"
                   onClick={addTodo}
                   value="新增"/> */}
            <button type="button" onClick={addTodo}>
            <i className="fa fa-plus"></i>新增
            </button>
          </div>
          <div className="todoList_list">
            <ul className="todoList_tab">
              <li><a href="#" className="active">全部</a></li>
              <li><a href="#">待完成</a></li>
              <li><a href="#">已完成</a></li>
            </ul>
            <div className="todoList_items">
              <ul className="todoList_item">
                {todos.map((todo) => (
                  <li key={todo.id}>
                    <label className="todoList_label">
                      <input
                        className="todoList_input"
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleStatus(todo.id)}
                      />
                      <input
                        className="todoList_text"
                        type="text"
                        value={todoEdit[todo.id] || todo.content}
                        onChange={(e) =>
                          setTodoEdit({
                            ...todoEdit,
                            [todo.id]: e.target.value,
                          })
                        }
                        onBlur={() => updateTodo(todo.id)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            updateTodo(todo.id);
                          }
                        }}
                      />
                    </label>
                    <a href="#" onClick={() => deleteTodo(todo.id)}>
                      <i className="fa fa-times"></i>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="todoList_statistics">
                <p>{todos.filter((todo) => todo.completed).length} 個已完成項目</p>
                <a href="#" onClick={clearCompletedTodos}>清除已完成項目</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoListPage;