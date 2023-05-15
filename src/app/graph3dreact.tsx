import {
    ForceGraph3D
} from "react-force-graph";

import miserables from "./miserables.js";

export default function graph3DReact() {

    let data = miserables
    return (
        <ForceGraph3D graphData={data}></ForceGraph3D>
    )
}