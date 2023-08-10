const { createInflate } = require('zlib');

const fs = require('fs').promises;

(async () => {
    const CREATE_FILE = 'create a file';

    const createFile = async (path) => {
        try {
            const existingFile = await fs.open(path, 'r');
            existingFile.close();
            return console.log(`File: ${path} already exists!`)
        } catch (err) {
            const newFile = await fs.open(path, 'w');
            newFile.close();
            return console.log(`File: ${path} has been created`)
        }
    }
    
    //OPEN FILE
    const fileHandler = await fs.open('./file.txt', 'r');

    fileHandler.on('change', async() => {
        const fileSize =(await fileHandler.stat()).size;
        console.log(fileSize)
        const buffer = Buffer.alloc(fileSize)
        const offset = 0;
        const length = buffer.byteLength;
        const position = 0;
    
        //Read file
        await fileHandler.read(buffer, offset, length, position)

        const data = buffer.toString();

        if(data.includes(CREATE_FILE)){
            const path = data.substring(CREATE_FILE.length + 1);
            createFile(path)
        }
    })
    // ARGS

    //FILE WATCHER

    const watcher = fs.watch('./file.txt');

    for await (const event of watcher){
        if (event.eventType === 'change');
        fileHandler.emit('change');
    }

})()