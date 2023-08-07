const fs = require('fs').promises;

(async () => {
    // Open file
    const fileData = await fs.open('./file.txt', 'r');

    fileData.on("change", async () => {
        
    
        // Read Method args
        const fileSize = (await fileData.stat()).size;
    
        const allocatedBuffer = Buffer.alloc(fileSize);
        const offset = 0;
        const length = allocatedBuffer.byteLength;
        const position = 0;
    
        console.log(fileSize);
        // Read file
    
        await fileData.read(allocatedBuffer, offset, length, position)
    
        const data = allocatedBuffer.toString('utf-8')
        console.log(data)

    })

    const watcher = fs.watch('./file.txt')

    for await (const event of watcher){
        if(event.eventType === "change"){
            fileData.emit("change")
        }
    }
})()