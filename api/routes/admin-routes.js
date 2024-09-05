import express from 'express';
import { verifyAdmin } from '../utils/verifyAdmin.js';
import { signin } from '../controllers/admin-controller.js';


const router = express.Router();

router.post('/sign-in', signin);

export default router;


