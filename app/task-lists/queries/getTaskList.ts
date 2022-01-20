import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetTaskList = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetTaskList), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const taskList = await db.taskList.findFirst({ where: { id } })

  if (!taskList) throw new NotFoundError()

  return taskList
})
