import { component } from "haunted";
import ChotaElement from "./ChotaElement";

const ChotaComponent = (comp, options) => component(comp, { baseElement: ChotaElement, ...options});

export default ChotaComponent;