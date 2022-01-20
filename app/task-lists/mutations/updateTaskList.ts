import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateTaskList = z.object({
  id: z.number(),
  text: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateTaskList),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const taskList = await db.taskList.update({ where: { id }, data })

    return taskList
  }
)
