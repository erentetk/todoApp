const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB bağlantısı başarılı');
    console.log('Veritabanı adı:', mongoose.connection.name);
  })
  .catch((err) => {
    console.error('MongoDB bağlantı hatası:', err);
    process.exit(1);
  });

// Todo şeması
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  status: { type: String, enum: ['todo', 'doing', 'done'], default: 'todo' }
}, { versionKey: false });

const Todo = mongoose.model('Todo', todoSchema);

// API rotaları
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    console.log('Tüm todolar getirildi:', todos);
    res.json(todos);
  } catch (error) {
    console.error('Todos getirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Text alanı zorunludur' });
    }

    const newTodo = new Todo({
      text
    });

    const savedTodo = await newTodo.save();
    console.log('Yeni todo eklendi:', savedTodo);
    res.status(201).json(savedTodo);
  } catch (error) {
    console.error('Todo ekleme hatası:', error);
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Status güncelleme endpoint'i
app.put('/api/todos/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server ${PORT} portunda çalışıyor`);
}); 