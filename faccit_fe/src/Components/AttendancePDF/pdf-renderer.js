// pdf-renderer.js
import ReactPDF from "@react-pdf/renderer";

// This is required to make @react-pdf/renderer work with CRA
ReactPDF.render = (props) => ReactPDF.renderToString(props.children);

export default ReactPDF;
