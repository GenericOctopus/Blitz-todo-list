import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getTaskLists from "app/task-lists/queries/getTaskLists"

const ITEMS_PER_PAGE = 100

export const TaskListsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ taskLists, hasMore }] = usePaginatedQuery(getTaskLists, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {taskLists.map((taskList) => (
          <li key={taskList.id}>
            <Link href={Routes.ShowTaskListPage({ taskListId: taskList.id })}>
              <a>{taskList.text}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const TaskListsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>TaskLists</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewTaskListPage()}>
            <a>Create TaskList</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <TaskListsList />
        </Suspense>
      </div>
    </>
  )
}

TaskListsPage.authenticate = true
TaskListsPage.getLayout = (page) => <Layout>{page}</Layout>

export default TaskListsPage
