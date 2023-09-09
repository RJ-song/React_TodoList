import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { useToken } from './TokenContext.jsx';

const site = 'https://todolist-api.hexschool.io';

function TodoListPage() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const { token } = useToken();
  const [todoEdit, setTodoEdit] = useState({});
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    getTodos();
  }, [token]);

  const getTodos = async () => {
    try {
      const response = await axios.get(`${site}/todos`, {
        headers: {
          Authorization: token,
        },
      });
      setTodos(response.data.data);

     
      const initialEditValues = {};
      response.data.data.forEach((todo) => {
        initialEditValues[todo.id] = todo.content;
      });
      setTodoEdit(initialEditValues);
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
    } catch (error) {
      console.error("更新失敗", error);
    }
  };

  const toggleStatus = async (id, completed) => {
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

      
      setTodos((prevTodos) =>
        prevTodos.map((todo) => {
          if (todo.id === id) {
            todo.completed = !completed; 
          }
          return todo;
        })
      );
    } catch (error) {
      console.error("切换狀態失敗", error);
    }
  };

  const clearCompletedTodos = async () => {
    const completedTodoIds = todos.filter((todo) => todo.completed).map((todo) => todo.id);

    try {
      for (const id of completedTodoIds) {
        await axios.delete(`${site}/todos/${id}`, {
          headers: {
            Authorization: token,
          },
        });
      }
// 重新获取未删除的待办事项并更新本地状态
      const remainingTodos = todos.filter((todo) => !completedTodoIds.includes(todo.id));
      setTodos(remainingTodos);
    } catch (error) {
      console.error("清除失敗", error);
    }
  };

  
  const filteredTodos = todos.filter((todo) => {
    if (activeTab === 'all') {
      return true;
    } else if (activeTab === 'pending') {
      return !todo.completed;
    } else if (activeTab === 'completed') {
      return todo.completed;
    }
  });

  return (
    <div id="todoListPage" className="bg-half">
      <nav>
        <h1>
          <a href="/">ONLINE TODO LIST</a>
        </h1>
        <ul>
          <li className={`todo_sm ${activeTab === 'all' ? 'active' : ''}`}>
            <a href="javascript:void(0)" onClick={() => setActiveTab('all')}>
              <span>我的待辦</span>
            </a>
          </li>
          <li>
            <a href="/SignIn">登出</a>
          </li>
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
            <button type="button" onClick={addTodo}>
              <i className="fa fa-plus"></i>新增
            </button>
          </div>
          <div className="todoList_list">
            <ul className="todoList_tab">
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('all');
                  }}
                  className={activeTab === 'all' ? 'active' : ''}
                >
                  全部
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('pending');
                  }}
                  className={activeTab === 'pending' ? 'active' : ''}
                >
                  未完成
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('completed');
                  }}
                  className={activeTab === 'completed' ? 'active' : ''}
                >
                  已完成
                </a>
              </li>
            </ul>
            <div className="todoList_items">
              <ul className="todoList_item">
                {filteredTodos.length === 0 ? (
                  <li>目前尚無待辦事項</li>
                ) : (
                  filteredTodos.map((todo) => (
                    <li key={todo.id}>
                      <label className="todoList_label">
                      <input
                        className="todoList_input"
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleStatus(todo.id, todo.completed)}
                        />
                        <input
                          className="todoList_text"
                          type="text"
                          value={todoEdit[todo.id]}
                          onChange={(e) =>
                            setTodoEdit({
                              ...todoEdit,
                              [todo.id]: e.target.value,
                            })
                          }
                          onBlur={() => updateTodo(todo.id)}
                        />
                      </label>
                      <button className="deleteButton" onClick={() => deleteTodo(todo.id)}>
                        刪除
                      </button>
                    </li>
                  ))
                )}
              </ul>
              <div className="todoList_statistics">
                
                {activeTab === 'completed' && filteredTodos.length === 0 ? (
                  <p>尚無已完成事項</p>
                ) : activeTab === 'pending' && filteredTodos.length === 0 ? (
                  <p>尚無待完成事項</p>
                ) : (
                  <p>{filteredTodos.filter((todo) => !todo.completed).length} 個未完成項目</p>
                )}
                
                {activeTab === 'completed' ? (
                  <button onClick={clearCompletedTodos}>清除已完成項目</button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoListPage;
