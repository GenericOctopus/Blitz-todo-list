import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateTaskList = z.object({
  text: z.string(),
})

export default resolver.pipe(resolver.zod(CreateTaskList), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const taskList = await db.taskList.create({ data: input })

  return taskList
})
