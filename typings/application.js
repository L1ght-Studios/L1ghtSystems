const output = require("../src/Utility/Output")
module.exports = {
    /**
     * Sets the folder where the commands are
     * @param {any} client the discord bot client
     * @param {any} folder the folder where the commands are
     * @param {any} json the json folder containing important tokens
     */
    async loadCommands(client, folder, json) {
        if (!client) return output.error("light", "no client provided, failed to load commands");
        if (!folder) return output.error("light", "no folder provided, failed to load commands");
        if (!json) return output.error("light", "no json data proveded, failed to load commands");
        require("../src/Commands/LoadCommands")(client, folder, json)
    }
}