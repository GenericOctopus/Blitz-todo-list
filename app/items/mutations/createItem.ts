import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateItem = z.object({
  name: z.string(),
})

export default resolver.pipe(resolver.zod(CreateItem), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const item = await db.item.create({ data: input })

  return item
})
