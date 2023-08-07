const fs = require('fs').promises;

// FIRST OPEN FILE - each opened file has
// a unique descriptor

// SECOND READ OR WRITE
//Absolute Path is relative to your operating system

(async () => {
    const fileHandler = await fs.open('./file.txt', 'r');

    fileHandler.on( "change", async () => {

        console.log('file has changed')
        
        const fileSize = (await fileHandler.stat()).size;
        console.log(fileSize)
        const allocateBuffer = Buffer.alloc(fileSize); // how many bytes should be used when reading or writing files -- to not use too much space(inefficiency) / too little -> data leak
    
        const offset = 0; //99% its 0 - buffer position from which we are going to start filling file data
        const position = 0; //position from which to start reading the file, always 0, bcs we are starting from index 0;
        const length = allocateBuffer.byteLength; //number of bytes to read OR (await fileHandler.stat()).size
    
        await fileHandler.read(allocateBuffer, offset, length, position)
        //You must read the file before you convert buffer to string
        //cant convert raw buffer data to string, first must read


        //decoder - 01 => something meaningful
        //encoder - something meaningful => 01
        // NODE has only character encoder and decoder



    } )
    // console.log(stats)
    
    const watcher = fs.watch('./file.txt') // watches file for changes (event.eventType = change || rename)
    
    
    for await (const event of watcher){
        if(event.eventType === "change"){

            
        }
    }
})(); 