#TodoList.component.js

const TodoList = ({ data }) => {
  const { currentTodo, todoItems } = data;
  
  if(data.isContentLoading) return <>Loading...</>
  
  return (
    <form>
    	<input value={currentTodo.name} />
		<button>
    		{currentTodo.name ? 'Save' : 'Add'}
		</button>
    </form>
	<ul>
    	{todoItems.map(({ name, isChecked }) => (
          <li>
          	<label>name</label>
          	<input type="checkbox" value={isChecked} />
			<div style="float: left">
          		<button>Edit</button>
				<button>Delete</button>
          	</div>
          </li>
        ))}
    </ul>
  );
}

export default TodoList