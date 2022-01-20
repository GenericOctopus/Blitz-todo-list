import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getTaskList from "app/task-lists/queries/getTaskList"
import deleteTaskList from "app/task-lists/mutations/deleteTaskList"

export const TaskList = () => {
  const router = useRouter()
  const taskListId = useParam("taskListId", "number")
  const [deleteTaskListMutation] = useMutation(deleteTaskList)
  const [taskList] = useQuery(getTaskList, { id: taskListId })

  return (
    <>
      <Head>
        <title>TaskList {taskList.id}</title>
      </Head>

      <div>
        <h1>TaskList {taskList.id}</h1>
        <pre>{JSON.stringify(taskList, null, 2)}</pre>

        <Link href={Routes.EditTaskListPage({ taskListId: taskList.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteTaskListMutation({ id: taskList.id })
              router.push(Routes.TaskListsPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowTaskListPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.TaskListsPage()}>
          <a>TaskLists</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <TaskList />
      </Suspense>
    </div>
  )
}

ShowTaskListPage.authenticate = true
ShowTaskListPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowTaskListPage
