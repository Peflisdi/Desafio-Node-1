import express from 'express'
import { createTask, listTasks, updateTask, deleteTask, toggleTaskCompletion, importTasksFromCSV } from '../controllers/taskControllers.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' })
export const router = express.Router()

router.post('/tasks', createTask);
router.get('/tasks', listTasks);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);
router.patch('/tasks/:id/complete', toggleTaskCompletion);
router.post('/tasks/import', upload.single('file'), importTasksFromCSV);