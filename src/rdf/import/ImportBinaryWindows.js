import React, { useState } from 'react';

function importBinary(replace) {
    // Create a new <input> element of type "file
    const fileInput = document.createElement('input');
    fileInput.type = 'file';

    // Define the onload function outside the change event listener
    const handleFileRead = function (event) {
        const content = event.target.result;
        const tripleList = content.split('\n').map(line => {
            const [subject, predicate, object] = line.split(' ');
            return { subject, predicate, object };
        });
        console.log(tripleList);
    };

    // Add an event handler to get the selected file path.
    fileInput.addEventListener('change', event => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = handleFileRead; // Assign the onload function here
        reader.readAsText(file);
    });

    fileInput.click();
}

function importBinaryTest() {
    importBinary(false);
}

export { importBinaryTest };