//Download the triple data in a file with the default name "myfile.bin" for download to the Windows download folder.
function exportBinary(tripleList) {
    const link = document.createElement('a');
    const content = tripleList.join('\n');
    const file =  new Blob([content], { type: 'application/octet-stream' });
    link.href =  URL.createObjectURL(file);
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

//interface for the export function from the user
//Returns false if the export function is incorrect.
function importExportFunction() {
    // Create a new <input> element of type "file
    const fileInput = document.createElement('input');
    fileInput.type = 'file';

    // Add an event handler to get the selected file path.
    fileInput.addEventListener('change', event => {
        const file = event.target.files[0];
        console.log("fileInputStart")
        console.log(file);
        console.log("fileInputEnd")
        /*
        call of the backend import missing
            content
            appendData
        */
    });

    fileInput.click();

    return false;
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

export { exportBinaryTest, exportSubgraphData, exportGraphData, importExportFunction };