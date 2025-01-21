import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
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
        text: inputValue.trim(),
        status: 'todo'
      });
      setTodos([response.data, ...todos]);
      setInputValue('');
    } catch (error) {
      console.error('Todo eklenirken hata:', error);
      setError('Todo eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    try {
      setError('');
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Todo silinirken hata:', error);
      setError('Todo silinirken bir hata oluştu');
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // Aynı sütunda sıralama değişikliği
    const sourceItems = Array.from(todos.filter(todo => todo.status === source.droppableId));
    sourceItems.splice(source.index, 1);
    
    try {
      // Status'u güncelle
      await axios.put(`http://localhost:5000/api/todos/${draggableId}/status`, {
        status: destination.droppableId
      });

      // Todos state'ini güncelle
      setTodos(prevTodos => 
        prevTodos.map(todo => 
          todo._id === draggableId 
            ? { ...todo, status: destination.droppableId }
            : todo
        )
      );
    } catch (error) {
      console.error('Todo güncellenirken hata:', error);
      setError('Todo güncellenirken bir hata oluştu');
    }
  };

  const getTodosByStatus = (status) => {
    return todos.filter(todo => todo.status === status);
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Todo Listesi</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="todo-form">
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
        
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="board">
            <div className="column">
              <h2>Yapılacak</h2>
              <Droppable droppableId="todo">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="todo-list"
                  >
                    {getTodosByStatus('todo').map((todo, index) => (
                      <Draggable
                        key={todo._id}
                        draggableId={todo._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`todo-item ${snapshot.isDragging ? 'dragging' : ''}`}
                          >
                            <span>{todo.text}</span>
                            <button
                              onClick={() => deleteTodo(todo._id)}
                              className="delete-button"
                            >
                              Sil
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            <div className="column">
              <h2>Yapılıyor</h2>
              <Droppable droppableId="doing">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="todo-list"
                  >
                    {getTodosByStatus('doing').map((todo, index) => (
                      <Draggable
                        key={todo._id}
                        draggableId={todo._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`todo-item ${snapshot.isDragging ? 'dragging' : ''}`}
                          >
                            <span>{todo.text}</span>
                            <button
                              onClick={() => deleteTodo(todo._id)}
                              className="delete-button"
                            >
                              Sil
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            <div className="column">
              <h2>Yapıldı</h2>
              <Droppable droppableId="done">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="todo-list"
                  >
                    {getTodosByStatus('done').map((todo, index) => (
                      <Draggable
                        key={todo._id}
                        draggableId={todo._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`todo-item done ${snapshot.isDragging ? 'dragging' : ''}`}
                          >
                            <span>{todo.text}</span>
                            <button
                              onClick={() => deleteTodo(todo._id)}
                              className="delete-button"
                            >
                              Sil
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
