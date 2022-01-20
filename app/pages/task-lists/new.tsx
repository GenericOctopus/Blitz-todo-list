import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createTaskList from "app/task-lists/mutations/createTaskList"
import { TaskListForm, FORM_ERROR } from "app/task-lists/components/TaskListForm"

const NewTaskListPage: BlitzPage = () => {
  const router = useRouter()
  const [createTaskListMutation] = useMutation(createTaskList)

  return (
    <div>
      <h1>Create New TaskList</h1>

      <TaskListForm
        submitText="Create TaskList"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateTaskList}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const taskList = await createTaskListMutation(values)
            router.push(Routes.ShowTaskListPage({ taskListId: taskList.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.TaskListsPage()}>
          <a>TaskLists</a>
        </Link>
      </p>
    </div>
  )
}

NewTaskListPage.authenticate = true
NewTaskListPage.getLayout = (page) => <Layout title={"Create New TaskList"}>{page}</Layout>

export default NewTaskListPage
