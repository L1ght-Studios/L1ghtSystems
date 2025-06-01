const output = require("../Utility/Output")
const { Collection, Events } = require("discord.js")

module.exports = {
    async Setup(client) {
        client.cooldowns = new Collection()
        client.commands = new Collection()
        client.guildcommands = new Collection()

        client.on(Events.InteractionCreate, (interaction) => {
            require("../Commands/InteractionCreate")(client, interaction)
        })

    }
}