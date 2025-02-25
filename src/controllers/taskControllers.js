import { v4 as uuidv4 } from 'uuid';
import {
    createTaskService,
    listTasksService,
    updateTaskService,
    deleteTaskService,
    toggleTaskCompletionService,
    importTasksFromCSVService
} from '../services/taskService.js';

export const createTask = async (req, res) => {
    const { title, description } = req.body;
    const task = await createTaskService({ title, description });
    res.status(201).json(task);
};

export const listTasks = async (req, res) => {
    const { title, description } = req.query;
    const tasks = await listTasksService({ title, description });
    res.json(tasks);
};

export const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const task = await updateTaskService(id, { title, description });
    res.json(task);
};

export const deleteTask = async (req, res) => {
    const { id } = req.params;
    await deleteTaskService(id);
    res.status(204).send();
};

export const toggleTaskCompletion = async (req, res) => {
    const { id } = req.params;
    const task = await toggleTaskCompletionService(id);
    res.json(task);
};

export const importTasksFromCSV = async (req, res) => {
    try {
        console.log(req.file); // Verifique se o arquivo está sendo recebido
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const tasks = await importTasksFromCSVService(req.file.path);
        res.status(201).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};