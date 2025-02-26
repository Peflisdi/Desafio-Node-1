import { PrismaClient } from "@prisma/client";
import { z } from 'zod'

const prisma = new PrismaClient

export async function taskRoutes(app) {
  app.post('/tasks', async (req, rep) => {
    const schema = z.object({
      title: z.string().min(1),
      description: z.string().min(1)
    })

    const { title, description } = schema.parse(req.body)

    const task = await prisma.task.create({
      data: { title, description}
    })

    return rep.status(201).send(task)
  })

  app.get('/tasks', async (req) => {
    return prisma.task.findMany()
  })

  app.put('/tasks/:id', async (req, rep) => {
    const id = req.params.id
    const schema = z.object({
      title: z.string().optional(),
      description: z.string().optional()
    })

    const data = schema.parse(req.body)

    const task = await prisma.task.update({
      where: { id },
      data
    })

    return rep.send(task)
  })

  app.delete('/tasks/:id', async (req, rep) => {
    const id = req.params.id
    
    await prisma.task.delete({
      where: { id }
    })

    return rep.status(204).send()
  })

  app.patch('/tasks/:id/complete', async (req, rep) => {
    const id = req.params.id

    const task = await prisma.task.findUnique({ where: { id } })
    if (!task) {
      return rep.status(404).send({ message: 'Task not found' })
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        completedAt: task.completedAt ? null : new Date(),
        updatedAt: new Date()
      },
    });
    
    return rep.send(updatedTask)
  })
}