# Kanban Todo Uygulaması

Bu proje, MERN (MongoDB, Express.js, React.js, Node.js) stack kullanılarak geliştirilmiş bir Kanban tarzı todo uygulamasıdır. Kullanıcılar, yapılacak işleri ekleyebilir, sürükle-bırak yöntemiyle farklı durumlara taşıyabilir ve silebilirler.

## Özellikler

- ✨ Modern ve kullanıcı dostu arayüz
- 🎯 Yapılacak, yapılıyor ve tamamlandı sütunları
- 🔄 Sürükle-bırak ile durum güncelleme
- 💾 MongoDB'de veri saklama
- 🚀 Real-time güncelleme
- 📱 Responsive tasarım

## Teknolojiler

### Frontend
- React.js
- @hello-pangea/dnd (Sürükle-bırak için)
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Cors
- Dotenv

## Kurulum

1. Repoyu klonlayın
```bash
git clone [repo-url]
cd [repo-name]
```

2. Backend için gerekli paketleri yükleyin ve başlatın
```bash
cd backend
npm install
npm start
```

3. Frontend için gerekli paketleri yükleyin ve başlatın
```bash
cd ../merhaba-dunya
npm install
npm start
```

4. `.env` dosyası oluşturun
```
MONGODB_URI=mongodb://localhost:27017/todoapp
PORT=5000
```

## Kullanım

1. Frontend: http://localhost:3000
2. Backend: http://localhost:5000

- Yeni todo eklemek için üst kısımdaki input alanını kullanın
- Todo'ları farklı durumlara taşımak için sürükleyip bırakın
- Todo'yu silmek için "Sil" butonunu kullanın

