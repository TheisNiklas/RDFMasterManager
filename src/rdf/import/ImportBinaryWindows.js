function importBinary(file, replace) {
    // Create a new object for the file dialog
    const dialog = require('electron').remote.dialog;

    // Display the file selection dialog
    dialog.showOpenDialog({
        // Set some options for the dialog
        buttonLabel: 'Öffnen',
        properties: ['openFile'],
        filters: [
            // Filter for the file selection dialog
            { name: 'Binärdatei', extensions: ['bin'] }
        ]
    }).then(result => {
        // If the user has selected a file
        if (!result.canceled) {
            // Get the path to the selected file
            const filePath = result.filePaths[0];

            // Read the contents of the file
            const fs = require('fs');
            fs.readFile(filePath, 'binary', (err, content) => {
                if (err) {
                    console.log(`Fehler beim Lesen der Datei: ${err.message}`);
                } else {
                    // If replace is set, replace the contents of the file
                    if (replace) {
                        file.setContent(content);
                    } else {
                        file.appendContent(content);
                    }
                    console.log(`Datei erfolgreich importiert aus: ${filePath}`);
                }
            });
        }
    }).catch(err => {
        console.log(`Fehler beim Öffnen des Dateiauswahldialogs: ${err.message}`);
    });
}


