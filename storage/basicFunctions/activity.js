let indexMess = 0;
//  V Pararameters V

const activities = [{
    name: 'I am beyond death ! AGAIN !',
    type: 'PLAYING'
}]

const intervalFromChange = 60000;
//  ^ Pararameters ^


module.exports.run = async (client) => {
    if (activities.length === 1) client.discordToolsBox.get("clientUser").setActivity(client, activities[0]);
    else {
        let activityIndex = 0;
        client.discordToolsBox.get("clientUser").setActivity(client, activities[activityIndex]);
        const intervalObj = setInterval(async function () {
            if (activityIndex < activities.length - 1) activityIndex++;
            else activityIndex = 0;
            client.discordToolsBox.get("clientUser").setActivity(client, activities[activityIndex]);
        }, intervalFromChange);

        client.intervalList.push(intervalObj);
    }
}

module.exports.help = {
    name: "activity"
};