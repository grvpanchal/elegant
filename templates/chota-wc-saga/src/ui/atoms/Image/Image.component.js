import { html } from "lit"

export default function Image(props) {
    return html`
        <img alt=${props.alt} src=${props.src} />
    `;
}