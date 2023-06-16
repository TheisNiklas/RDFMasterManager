const reader = new FileReader();

//Download the triple data in a file with the default name "myfile.bin" for download to the Windows download folder.
function exportBinary(tripleList) {
    const link = document.createElement('a');
    const content = tripleList.join('\n');
    const file = new Blob([content], { type: 'application/octet-stream' });
    link.href = URL.createObjectURL(file);
    link.download = 'meineDatei.bin';
    link.click();
}

//Sample data for the triple export
function exportBinaryTest() {
    const tripleList = [
        { subject: 'Person1', predicate: 'hasAge', object: '25' },
        { subject: 'Person2', predicate: 'hasAge', object: '30' },
        { subject: 'Person3', predicate: 'hasAge', object: '45' },
        { subject: 'Person4', predicate: 'hasAge', object: '22' },
    ];

    exportBinary(tripleList)
}

//interface for the export of the current selected triple data in the graph
function exportSubgraphData(exportFunction) {
    console.log("exportSubgraph")
    console.log(exportFunction)
}

//interface for the export of the complete triple data
function exportGraphData(exportFunction) {
    console.log("exportGraph")
    console.log(exportFunction)
}

export { exportBinaryTest, exportSubgraphData, exportGraphData};