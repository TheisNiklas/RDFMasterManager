//import { TWEEN } from '@tweenjs/tween.js';
//import TWEEN from '@tweenjs/tween.js';
//import ForceGraph3D from 'react-force-graph-3d';

function graph3D() {
    const tripleList = [
        { subject: 'Person1', predicate: 'hasAge', object: '25' },
        { subject: 'Person2', predicate: 'hasAge', object: '30' },
        { subject: 'Person3', predicate: 'hasAge', object: '45' },
        { subject: 'Person4', predicate: 'hasAge', object: '22' },
    ];
    return tripleList;
}

export { graph3D };