import express from 'express';
import { signup, login } from '../controllers/authControllers.js';

const router = express.Router();

// Maps POST /signup to the signup controller
router.post('/signup', signup);

// Maps POST /login to the login controller
router.post('/login', login);

export default router;