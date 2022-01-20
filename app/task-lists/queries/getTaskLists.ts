import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetTaskListsInput
  extends Pick<Prisma.TaskListFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetTaskListsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: taskLists,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.taskList.count({ where }),
      query: (paginateArgs) => db.taskList.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      taskLists,
      nextPage,
      hasMore,
      count,
    }
  }
)
