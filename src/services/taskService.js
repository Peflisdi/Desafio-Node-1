import { v4 as uuidv4 } from 'uuid';
import fs from 'node:fs';
import csv from 'csv-parser'; // Corrigido o nome do import

const tasks = [];

export const createTaskService = ({ title, description }) => {
    const task = {
        id: uuidv4(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
    };
    tasks.push(task);
    return task;
};

export const listTasksService = ({ title, description }) => {
    return tasks.filter(task => {
        return (!title || task.title.includes(title)) && (!description || task.description.includes(description));
    });
};

export const updateTaskService = (id, { title, description }) => {
    const task = tasks.find(t => t.id === id);
    if (!task) throw new Error('Task not found');

    if (title) task.title = title;
    if (description) task.description = description;
    task.updated_at = new Date();

    return task;
};

export const deleteTaskService = (id) => {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    tasks.splice(index, 1);
};

export const toggleTaskCompletionService = (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) throw new Error('Task not found');

    task.completed_at = task.completed_at ? null : new Date();
    task.updated_at = new Date();

    return task;
};

export const importTasksFromCSVService = (filePath) => {
    const importedTasks = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv()) // Corrigido o uso do csv-parser
            .on('data', (row) => {
                const task = createTaskService({
                    title: row.title,
                    description: row.description
                });
                importedTasks.push(task);
            })
            .on('end', () => {
                resolve(importedTasks);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};