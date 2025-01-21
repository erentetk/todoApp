import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('http://localhost:5000/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Todo\'lar yüklenirken hata:', error);
      setError('Todo\'lar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      setLoading(true);
      setError('');
      const response = await axios.post('http://localhost:5000/api/todos', {
        text: inputValue.trim()
      });
      setTodos([response.data, ...todos]);
      setInputValue('');
      console.log('Yeni todo eklendi:', response.data);
    } catch (error) {
      console.error('Todo eklenirken hata:', error);
      setError('Todo eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      setError('');
      const response = await axios.put(`http://localhost:5000/api/todos/${id}`, {
        completed: !completed
      });
      setTodos(todos.map(todo =>
        todo._id === id ? response.data : todo
      ));
      console.log('Todo güncellendi:', response.data);
    } catch (error) {
      console.error('Todo güncellenirken hata:', error);
      setError('Todo güncellenirken bir hata oluştu');
    }
  };

  const deleteTodo = async (id) => {
    try {
      setError('');
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
      console.log('Todo silindi:', id);
    } catch (error) {
      console.error('Todo silinirken hata:', error);
      setError('Todo silinirken bir hata oluştu');
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Todo Listesi</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Yeni todo ekle..."
            disabled={loading}
          />
          <button type="submit" disabled={loading || !inputValue.trim()}>
            {loading ? 'Ekleniyor...' : 'Ekle'}
          </button>
        </form>

        {loading && <div className="loading">Yükleniyor...</div>}
        
        <ul>
          {todos.map((todo) => (
            <li key={todo._id}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo._id, todo.completed)}
              />
              <span style={{ 
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#666' : '#000'
              }}>
                {todo.text}
              </span>
              <button 
                onClick={() => deleteTodo(todo._id)}
                className="delete-button"
              >
                Sil
              </button>
            </li>
          ))}
        </ul>
        
        {!loading && todos.length === 0 && (
          <p className="empty-message">Henüz todo eklenmemiş</p>
        )}
      </div>
    </div>
  );
}

export default App; 