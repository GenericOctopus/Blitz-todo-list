import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteTaskList = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteTaskList), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  await db.item.deleteMany({ where: { taskListId: id } })
  const taskList = await db.taskList.deleteMany({ where: { id } })

  return taskList
})
