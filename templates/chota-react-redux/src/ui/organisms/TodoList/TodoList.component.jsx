import Alert from "../../atoms/Alert/Alert.component";
import AddTodoForm from "../../molecules/AddTodoForm/AddTodoForm.component";
import TodoItems from "../../molecules/TodoItems/TodoItems.component";
import Skeleton from "../../skeletons/Skeleton/Skeleton.component";

export default function TodoList({ todoData, events }) {
  const {
    onTodoCreate,
    onTodoEdit,
    onTodoUpdate,
    onTodoToggleUpdate,
    onTodoDelete,
  } = events;
  return (
    <>
      {todoData.error ? (
        <Alert
          variant={"error"}
          show={!!todoData.error}
          message={todoData.error}
        />
      ) : null}
      <AddTodoForm
        todoValue={todoData.currentTodoItem.text || ""}
        onTodoAdd={onTodoCreate}
        onTodoUpdate={onTodoUpdate}
        placeholder="Add your task"
        isLoading={todoData.isActionLoading}
        buttonInfo={{
          label: todoData.currentTodoItem.text ? "Save" : "Add",
          variant: "primary",
        }} // TODO: Work on Labels Concept
      />
      {todoData.isContentLoading ? (
        <>
          <br />
          <Skeleton height="24px" />
          <br />
          <Skeleton height="24px" />
          <br />
          <Skeleton height="24px" />
        </>
      ) : (
        <>
          <TodoItems
            todos={todoData.todoItems || []}
            onToggleClick={onTodoToggleUpdate}
            onDeleteClick={onTodoDelete}
            onEditClick={onTodoEdit}
            isDisabled={todoData.isActionLoading}
          />
        </>
      )}
    </>
  );
}
