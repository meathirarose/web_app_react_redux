import express from 'express';
import { verifyAdmin } from '../utils/verifyAdmin.js';
import { signin, signout } from '../controllers/admin-controller.js';


const router = express.Router();

router.post('/sign-in', signin);
router.get('/signout', signout)

export default router;


