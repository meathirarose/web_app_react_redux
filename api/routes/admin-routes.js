import express from 'express';
import { deleteUser, fetchUserData, getUsers, signin, signout } from '../controllers/admin-controller.js';
import { verifyAdmin } from '../utils/verifyAdmin.js'


const router = express.Router();

router.post('/sign-in', signin);
router.get('/signout', signout);
router.get('/getUsers', verifyAdmin, getUsers);
router.get('/fetchUserData/:id', verifyAdmin, fetchUserData);
router.delete('/deleteUser/:id', verifyAdmin, deleteUser);

export default router;