const output = require("../Utility/Output")
const database = require("./Schemas/LightSystems")

const update = async function(data) {
    const save = await database.findOne({ ClientId: data.clientid })

    if (!save) {
        const newsave = new database({
            ClientId: data.clientid,
            BotOwner: data.botowner,
            SupportGuild: data.supportserver,
            TestGuild: data.testguild
        })

        await newsave.save();
    } else {
        save.updateOne({
            ClientId: data.clientid,
            BotOwner: data.botowner || "none provided",
            SupportGuild: data.supportserver || "none provided",
            TestGuild: data.testguild
        })
    }
}

module.exports = async function (data) {
    if (!data.clientid) return output.warn("database", "no clientid provided, save canceled");
    if (!data.testguild) return output.warn("database", "no test guild provided, save canceled");

    update(data)
}