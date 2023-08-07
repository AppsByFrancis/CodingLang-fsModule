const { createInflate } = require('zlib');

const fs = require('fs').promises;

( async () => {

    const CREATE_FILE = "create a file";

    const fileHandler = await fs.open('file.txt', 'r')

    const createFile = async (path) => {
        try {
            const existingFile = await fs.open(path, 'r');
            existingFile.close();
            return console.log(`File: ${path} exists`)
        } catch (err) {
            const newFile = await fs.open(path, 'w')
            newFile.close()
            return console.log(`File: ${path} has been created`)
        }
    }

    fileHandler.on("change", async () => {
        
        //READ ARGS
        const fileSize = (await fileHandler.stat()).size;
    
        const buffer = Buffer.alloc(fileSize);
        const offset = 0;
        const length = buffer.byteLength;
        const position = 0;
    
        // READ file
        await fileHandler.read(buffer, offset, length, position);
        console.log(buffer.toString())

        if (fileHandler.includes(CREATE_FILE)){
            const filePath = fileHandler.substring(CREATE_FILE + 1);
            createFile(filePath)
        }

    })



    // WATCH file
    const watcher = fs.watch('file.txt');

    for await( const event of watcher ){
        if(event.eventType === 'change'){
            fileHandler.emit('change')
        }
    }

})();