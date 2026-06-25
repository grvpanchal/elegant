export default function Input(props) {
  let id = props.id;
  if (!id) {
    id = Math.random();
  }
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {props.name || "Some Label"}
      </label>
      <input {...props} id={id} />
    </>
  );
}
