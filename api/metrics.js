import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function handler(req, res) {
  // Read mockData.json from the src/data directory
  const dataPath = path.join(__dirname, '..', 'src', 'data', 'mockData.json');
  
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    res.status(200).json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading mockData.json:', error);
    res.status(500).json({ error: 'Failed to read data' });
  }
}
