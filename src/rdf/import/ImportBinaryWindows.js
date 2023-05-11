import React, { useState } from 'react';

function importBinary(replace) {
    // Create a new <input> element of type "file
    const fileInput = document.createElement('input');
    fileInput.type = 'file';

    // Add an event handler to get the selected file path.
    fileInput.addEventListener('change', event => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            console.log(`Datei erfolgreich importiert aus: ${file.name}`);
            console.log(`Dateiinhalt: ${file.readAsBinaryString}`)
        };
        reader.readAsBinaryString(file);
    });

    fileInput.click();
}

function importBinaryTest() {
    importBinary(false);
}

export { importBinaryTest };