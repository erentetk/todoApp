const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

console.log('MongoDB URI:', process.env.MONGODB_URI); // URI'yi kontrol et

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB bağlantısı başarılı');
    console.log('Veritabanı adı:', mongoose.connection.name);
    console.log('Bağlantı durumu:', mongoose.connection.readyState);
  })
  .catch((err) => {
    console.error('MongoDB bağlantı hatası:', err);
    process.exit(1); // Hata durumunda uygulamayı sonlandır
  });

// Bağlantı olaylarını dinle
mongoose.connection.on('error', (err) => {
  console.error('MongoDB bağlantı hatası:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB bağlantısı kesildi');
});

// Todo şeması
const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Todo = mongoose.model('Todo', todoSchema);

// API rotaları
// Tüm todoları getir
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    console.log('Tüm todolar getirildi:', todos);
    res.json(todos);
  } catch (error) {
    console.error('Todos getirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
});

// Yeni todo ekle
app.post('/api/todos', async (req, res) => {
  try {
    console.log('Gelen todo verisi:', req.body);
    
    const { text } = req.body;
    if (!text) {
      console.log('Text alanı boş');
      return res.status(400).json({ message: 'Text alanı zorunludur' });
    }

    const newTodo = new Todo({
      text,
      completed: false
    });

    console.log('Oluşturulan todo:', newTodo);

    const savedTodo = await newTodo.save();
    console.log('Kaydedilen todo:', savedTodo);
    res.status(201).json(savedTodo);
  } catch (error) {
    console.error('Todo ekleme hatası:', error);
    res.status(400).json({ message: error.message });
  }
});

// Todo güncelle
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    
    console.log('Güncellenecek todo ID:', id);
    console.log('Yeni completed değeri:', completed);

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { completed },
      { new: true }
    );

    if (!updatedTodo) {
      console.log('Todo bulunamadı:', id);
      return res.status(404).json({ message: 'Todo bulunamadı' });
    }

    console.log('Todo güncellendi:', updatedTodo);
    res.json(updatedTodo);
  } catch (error) {
    console.error('Todo güncelleme hatası:', error);
    res.status(400).json({ message: error.message });
  }
});

// Todo sil
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Silinecek todo ID:', id);

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      console.log('Todo bulunamadı:', id);
      return res.status(404).json({ message: 'Todo bulunamadı' });
    }

    console.log('Todo silindi:', deletedTodo);
    res.json({ message: 'Todo başarıyla silindi' });
  } catch (error) {
    console.error('Todo silme hatası:', error);
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
}); 