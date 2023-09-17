import { useEffect, useState } from 'react'
import './App.css'
import { BsTrash } from 'react-icons/bs'

const API_BASE = 'http://localhost:3000'

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false)
  const [newTodo, setNewTodo] = useState("")

  useEffect(() => {
    GetTodos();
  }, [])

  const GetTodos = () => {
    fetch(API_BASE + '/todos')
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error("Error: ", err))
  }

  const handleChecked = async (id) => {
    const data = await fetch(API_BASE + `/todo/complete/${id}`, { method: 'PUT' })
      .then(res => res.json())

    setTodos(prevTodos => prevTodos.map(todo => {
      if (todo._id === data._id) {
        todo.complete = data.complete
      }
      return todo;
    }));
  }

  const handleAddTodo = async () => {
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodo }), // newTodo holds the text of the new todo
      };

      const response = await fetch(`${API_BASE}/todo/new`, requestOptions);
      if (response.ok) {
        const newTodoItem = await response.json();
        setTodos([...todos, newTodoItem]); // Update the state with the new todo
        setNewTodo(''); // Clear the input field
      } else {
        console.error('Failed to add a new todo');
      }
    } catch (error) {
      console.error('Error adding a new todo:', error);
    }
  };

  const handleDelete = async (id) => {
    const data = await fetch(API_BASE + `/todo/delete/${id}`, { method: 'DELETE' })
      .then(res => res.json())

    setTodos(prevTodos => prevTodos.filter(todo => todo._id !== data._id));
  }

  return (
    <div className='container'>
      <div className="header">My Todos</div>
      <div className="new-todo">
        <input
          type="text"
          placeholder="Placeholder"
          className="input"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button className="add-button" onClick={handleAddTodo}>
          Add
        </button>
      </div>
      <div className="todos">
        {todos.map(todo => (
          <div className={"item" + (todo.complete ? "-complete" : "")} key={todo._id}>
            <div className='box-1'>
              <div
                className={"checkbox" + (todo.complete ? "-complete" : "")}
                onClick={() => handleChecked(todo._id)}
              ></div>
              <div className="task">{todo.text}</div>
            </div>
            <div onClick={() => handleDelete(todo._id)}>
              <BsTrash size={12}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App
