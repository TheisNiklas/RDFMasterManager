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

export { exportBinaryTest };