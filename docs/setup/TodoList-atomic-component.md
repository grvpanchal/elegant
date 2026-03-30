#TodoList.component.js

#Atoms
const Input = (props) => <input {...props} />
const Button = (props) => <button {...props}>
  	{props.children}
</button>
const ListItem = (props) => <li {...props}>
  {props.children}
</li>

#Molecules
const List = (props) => <ul {...props}>
  {props.children}
</ul>

#Organism
const TodoList () => (<></>); 

export default TodoList