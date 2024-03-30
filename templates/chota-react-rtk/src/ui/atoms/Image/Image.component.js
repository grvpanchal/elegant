export default function Image(props) {
    return (
        <img alt={props.alt} {...props} />
    );
}