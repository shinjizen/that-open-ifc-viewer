import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, join(__dirname, 'public/ifc'));
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  }
});

app.use(cors());

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.status(200).send(`File uploaded: ${req.file.originalname}`);
});

app.use(express.static(join(__dirname, '../public/ifc')));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});