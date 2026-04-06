const express = require('express');
const dotenv = require('dotenv');

const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: "https://student-collab-platform-nine.vercel.app",
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
