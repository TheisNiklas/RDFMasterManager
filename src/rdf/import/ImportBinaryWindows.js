function importFile(appendData) {
    // Create a new <input> element of type "file
    const fileInput = document.createElement('input');
    fileInput.type = 'file';

    // Add an event handler to get the selected file path.
    fileInput.addEventListener('change', event => {
        const file = event.target.files[0];
        console.log("fileInputStart")
        console.log(file);
        console.log(appendData)
        console.log("fileInputEnd")
        /*
        call of the backend import missing
            content
            appendData
        */
    });

    fileInput.click();
    return true;
}

export { importFile };