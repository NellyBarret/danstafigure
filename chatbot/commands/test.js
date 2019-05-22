const commands = require('../outils/utilityFunctions.js');
const fs = require('fs');
const http = require('http');
const https = require('https');
const fetch = require('node-fetch');
const FormData = require('form-data');

module.exports.run = async (bot, message, args) => {
    const filter = m => { if(m.author.id === message.author.id && m.attachments.last()) return true; return false; };
    const filter2 = m => { if(m.author.id === message.author.id) return true; return false; };
    await message.channel.send("je m'attends a une image");
    var collected = await message.channel.awaitMessages(filter2, { max: 1, errors: ['time']});
    var msg = await collected.last().attachments.last();
    var msg2 = await collected.last().content;


    // merci pour ces lignes de code
    // https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries
    // const fileWrite = await fs.createWriteStream("newfile.jpg");
    // const request = await https.get(msg.url, function(response) {
    //     response.pipe(fileWrite);
    // });
    // /////////////////////////////////

    // const fileRead = await fs.createReadStream(fileWrite.path);

    // var form = await new FormData();
    // await form.append('branch', 'workAPIBOT48H');
    // await form.append('commit_message', "Bot uploading an image");
    // await form.append('content', fileRead);

    console.log("test")
    
    
    //console.log("form : \n"+queryString)
    const fileWrite = await fs.createWriteStream("newfile.jpg");
    const fileRead = await fs.createReadStream(fileWrite.path);
    const pathToPOST = await bot.config.uri + bot.config.files + "Figures_de_style_images";
    // var xhr = new XMLHttpRequest();
    await https.get(msg.url, function(response) {
        response.pipe(fileWrite);
    });
    

    var form = await new FormData();
    //await form.append('branch', 'workAPIBOT48H');
    //await form.append('commit_message', "Bot uploading an image");
    await form.append('content', fileWrite, "FILENAME");
    console.log(fileWrite);
    return;

    const data = {
        "branch": "workAPIBOT48H",
        "commit_message": "Bot updating file",
        "content": fileRead
    };

    var response = await fetch(pathToPOST, {
        method: 'POST',
        async:true,
        headers: {
            'PRIVATE-TOKEN': bot.config.access,
            'Content-Type': `multipart/form-data; name="${msg.filename}"`
        },
        data: data
        // data() {
        //     /////////////////////////////////
        //     const fileWrite = fs.createWriteStream("newfile.jpg");
        //     const fileRead = fs.createReadStream(fileWrite.path);
        //     // var xhr = new XMLHttpRequest();
        //     https.get(msg.url, function(response) {
        //         response.pipe(fileWrite);
        //     });
            
        //     var form = new FormData();
        //     form.append('branch', 'workAPIBOT48H');
        //     form.append('commit_message', "Bot uploading an image");
        //     form.append('content', fileRead, "FILENAME");
        //     return form;
        // }
    });
    let plainText = await response.text();
    
    // var response = commands.postImage(bot, form, pathToPOST);
    // // var plainText = await response.text()
    console.log("response : \n"+plainText)
    if(response.status === 200) message.channel.send("POST reussi !");
    return;
};

module.exports.help = {
    name: "!",
    infos: "test"
};