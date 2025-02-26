import fastify from "fastify";
import cors from "@fastify/cors";
import { taskRoutes } from '../routes/tasks.js'
import { uploadRoutes } from "../routes/upload.js";

const app = fastify()

app.register(cors)
app.register(taskRoutes)
app.register(uploadRoutes)

app.listen({ port: 3000 }).then(() => {
  console.log('server running')
})