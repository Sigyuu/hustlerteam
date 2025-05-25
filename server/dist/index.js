import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Jeśli masz folder public (frontend Vite), możesz to odkomentować:
// app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('✅ Hustler Team backend działa!');
});

app.listen(PORT, () => {
  console.log(`🚀 Serwer uruchomiony na porcie ${PORT}`);
});
