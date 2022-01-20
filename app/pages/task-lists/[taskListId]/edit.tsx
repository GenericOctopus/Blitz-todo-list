import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getTaskList from "app/task-lists/queries/getTaskList"
import updateTaskList from "app/task-lists/mutations/updateTaskList"
import { TaskListForm, FORM_ERROR } from "app/task-lists/components/TaskListForm"

export const EditTaskList = () => {
  const router = useRouter()
  const taskListId = useParam("taskListId", "number")
  const [taskList, { setQueryData }] = useQuery(
    getTaskList,
    { id: taskListId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateTaskListMutation] = useMutation(updateTaskList)

  return (
    <>
      <Head>
        <title>Edit TaskList {taskList.id}</title>
      </Head>

      <div>
        <h1>Edit TaskList {taskList.id}</h1>
        <pre>{JSON.stringify(taskList, null, 2)}</pre>

        <TaskListForm
          submitText="Update TaskList"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateTaskList}
          initialValues={taskList}
          onSubmit={async (values) => {
            try {
              const updated = await updateTaskListMutation({
                id: taskList.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowTaskListPage({ taskListId: updated.id }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditTaskListPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditTaskList />
      </Suspense>

      <p>
        <Link href={Routes.TaskListsPage()}>
          <a>TaskLists</a>
        </Link>
      </p>
    </div>
  )
}

EditTaskListPage.authenticate = true
EditTaskListPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditTaskListPage
