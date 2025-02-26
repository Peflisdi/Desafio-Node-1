import { PrismaClient } from "@prisma/client";
import multipart from "@fastify/multipart";
import csv from "csv-parser"
import fs from 'node:fs'

const prisma = new PrismaClient()

export async function uploadRoutes(app) {
  app.register(multipart);

  app.post("/upload", async (req, rep) => {
    const file = await req.file()
    if (!file) return rep.status(400).send({ message: "No file uploaded" })

    const tasks = []

    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(file.filepath).pipe(csv())

      stream
        .on('data', (row) => {
          tasks.push({
            title: row.title,
            description: row.description,
          })
        })
        .on('end', async () => {
          await prisma.task.createMany({ data: tasks })
          resolve(rep.send({ message: 'Tasks imported successfully '}))
        })
        .on('error', (error) => {
          reject(rep.status(500).send({ error }))
        })
    })
  })
}