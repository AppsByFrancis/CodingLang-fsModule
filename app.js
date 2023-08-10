const fs = require('fs').promises;

// FIRST OPEN FILE - each opened file has
// a unique descriptor

// SECOND READ OR WRITE
//Absolute Path is relative to your operating system

(async () => {
    const CREATE_FILE = "create a file";
    const DELETE_FILE = "delete file";
    const RENAME_FILE = "rename from";
    const ADD_TO_FILE = "add to"

    const fileHandler = await fs.open('./file.txt', 'r');

    const createFile = async (path) => {
        try {

            const isExistingFile = await fs.open(path, "r");
            isExistingFile.close();

            return console.log(`this file ${path} already exists.`)

        } catch (err) {

            const newFile = await fs.open(path, "w");
            newFile.close();

            return console.log(`File: ${path} has been created.`)
        }
    }

    const deleteFile = async (path) => {
        try {
            await fs.unlink(path);
        } catch (err) {
            if (err.code === "ENOENT"){
                console.log(`There is no file with path: "${path}" to be removed`);
            } else {
                console.log("An error occured while removing file");
                console.log(err)
            }

        }
    }

    const renameFile = async (oldName, newName) => {
        try {
            await fs.rename(oldName, newName)
        } catch (err) {
            if (err.code === "ENOENT"){
                console.log("No file at this path to rename, or destination doesn't exist")
            } else {
                console.log("An error occured :(");
                console.log(err);
            }
        }
    }
    let flag
    const addToFile = async (path, content) => {
        if(flag === content) return;
        try {
            const fileHandle = await fs.open(path, "a");
            fileHandle.write(content)
            flag = content;
            console.log("The content was successfully added")
            fileHandle.close()
        } catch (err) {
            console.log("An error occurred while removing file:");
            console.log(err)
        }
    }

    fileHandler.on( "change", async () => {
        
        const fileSize = (await fileHandler.stat()).size;
        const buffer = Buffer.alloc(fileSize); // how many bytes should be used when reading or writing files -- to not use too much space(inefficiency) / too little -> data leak
        
        const offset = 0; //99% its 0 - buffer position from which we are going to start filling file data
        const position = 0; //position from which to start reading the file, always 0, bcs we are starting from index 0;
        const length = buffer.byteLength; //number of bytes to read OR (await fileHandler.stat()).size
        
        await fileHandler.read(buffer, offset, length, position)
        //You must read the file before you convert buffer to string
        //cant convert raw buffer data to string, first must read
        
        
        //decoder - 01 => something meaningful
        //encoder - something meaningful => 01
        // NODE has only character encoder and decoder
        const data = buffer.toString();
        
        if (data.includes(CREATE_FILE)){
            const filePath = data.substring(CREATE_FILE.length + 1); /// "create file" length is 9 + 1 = 10, filePath = from index 10 till the end

            createFile(filePath);
        }

        if (data.includes(DELETE_FILE)){
            const filePath = data.substring(DELETE_FILE.length + 1);

            deleteFile(filePath);
        }

        if (data.includes(RENAME_FILE)){
            const _indx = data.indexOf('to'); // from letter T
            const oldFilePath = data.substring(RENAME_FILE.length + 1, _indx - 1);
            const newFilePath = data.substring(_indx + 3);

            renameFile(oldFilePath, newFilePath);
        }

        if (data.includes(ADD_TO_FILE)){
            const _indx = data.indexOf('content:');
            const filePath = data.substring(ADD_TO_FILE.length + 1, _indx);
            const content = data.substring(_indx + 9);

            addToFile(filePath, content)
        }
        
    } )
    // console.log(stats)
    

    const watcher = fs.watch('./file.txt') // watches file for changes (event.eventType = change || rename)
    
    for await (const event of watcher){
        if(event.eventType === "change"){
            fileHandler.emit('change');
            
        }
    }
})(); 