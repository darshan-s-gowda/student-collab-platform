const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');   

const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// ✅ CORS setup
const allowedOrigins = [
  "http://localhost:3000",
  "https://student-collab-platform-nine.vercel.app",
  process.env.CLIENT_URL
].filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.options('*', cors());

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));

app.get('/', (req, res) => res.json({ message: 'StudentCollab API is running...' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));