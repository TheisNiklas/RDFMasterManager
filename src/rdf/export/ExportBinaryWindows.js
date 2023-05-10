function exportBinary(tripleList) {
    // Create a new object for the file dialog
    const dialog = require('electron').remote.dialog;

    // Show the location dialog
    dialog.showSaveDialog({
        // Set some options for the dialog
        buttonLabel: 'Speichern',
        defaultPath: 'meineDatei.bin',
        filters: [
            // Filters for the file dialog
            { name: 'Binärdatei', extensions: ['bin'] }
        ]
    }).then(result => {
        // If the user has selected a location
        if (!result.canceled) {
            // Get the path to the selected file
            const filePath = result.filePath.toString();

            // Write the triple list to the selected file
            const fs = require('fs');
            const content = tripleList.join('\n');
            fs.writeFile(filePath, content, 'binary', err => {
                if (err) {
                    console.log(`Fehler beim Speichern der Datei: ${err.message}`);
                } else {
                    console.log(`Datei erfolgreich gespeichert unter: ${filePath}`);
                }
            });
        }
    }).catch(err => {
        console.log(`Fehler beim Öffnen des Speicherortdialogs: ${err.message}`);
    });
}

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