function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}


module.exports.addAllSongsFromList = addAllSongsFromList;
async function addAllSongsFromList(queue, musicList, user, newTockenSet, callback) {
    if (queue.data == null) queue.data = {};
    const token = makeid(10);
    queue.data.token = token;
    if (newTockenSet) await newTockenSet();
    for (let index = 0; index < musicList.length && index < 50; index++) {
        if (queue.data.token === token) {
            const element = musicList[index];
            if (!queue.destroyed) await queue.play("https://www.youtube.com/watch?v=" + element, {
                requestedBy: user
            }).catch((err) => {
                console.log(err);
                console.log("https://www.youtube.com/watch?v=" + element);
            })
            if (index === 0 && callback) callback();
        }
    }
    return;
}

module.exports.run = async (client, queue, playlistID) => {
    client.dataBase.get("music").selectByPlayistName(client, playlistID, async (error, result) => {
        if (error) throw error;
        const songList = [];
        for (let index = 0; index < result.length; index++) {
            const element = result[index];
            songList.push(element.tagName);
        }
        await addAllSongsFromList(queue, songList, client.user);
        //if (!queue.destroyed) await queue.setRepeatMode(RepeatMode.QUEUE);
    });
};

module.exports.help = {
    name: "startMusic"
};