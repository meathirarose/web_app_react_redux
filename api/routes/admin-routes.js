import express from 'express';
import { addNewUser, deleteUser, editUserData, fetchUserData, getUsers, signin, signout } from '../controllers/admin-controller.js';
import { verifyAdmin } from '../utils/verifyAdmin.js'


const router = express.Router();

router.post('/sign-in', signin);
router.get('/signout', signout);
router.get('/getUsers', verifyAdmin, getUsers);
router.get('/fetchUserData/:id', verifyAdmin, fetchUserData);
router.put('/updateUser/:id', verifyAdmin, editUserData);
router.post('/addUser', verifyAdmin, addNewUser);
router.delete('/deleteUser/:id', verifyAdmin, deleteUser);

export default router;