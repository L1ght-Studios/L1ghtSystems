const fs = require("node:fs")
const path = require("node:path")
const output = require("../Utility/Output")
const { REST, Routes } = require("discord.js")
const database = require("../Database/Schemas/LightSystems")

module.exports = async function (client, folder, json) {
    const globalcommands = []
    const guildcommands = []

    const folderpath = path.join(__dirname, `../../../../${folder}`)
    const commandfiles = fs.readdirSync(folderpath)

    for (const file of commandfiles) {
        const commandpath = path.join(folderpath, file)
        const command = require(commandpath)

        if ("data" in command && "file" in command && "global" in command) {
            try {
                if (command.global === false) {
                    client.guildcommands.set(command.data.name)
                    guildcommands.push(command.data)
                } else {
                    client.commands.set(command.data.name)
                    globalcommands.push(command.data)
                }
            } catch (error) {
                output.error("command", `client not started failed to load commands please use lightsystems.start(client)`)
                output.info("assistance", "stuck? contact @therealdevrose on discord for assistance with using this system")
            }
        } else {
            output.warn("command", `the command in ${commandpath} is missing properties, the required properties are { data: slashcommandbuilder, file: require(command), global: boolean }`)
        }
    }

    const rest = new REST().setToken(json.Token);

    (async () => {
        try {
            output.print("commands", `${globalcommands.length} global (/) commands are updating`)

            const data = await rest.put(
                Routes.applicationCommand(json.ClientId),
                { body: globalcommands }
            )

            output.print("commands", `${data.length} global (/) commands have been updated`)
        } catch (error) {
            output.error("commands", `something unexpected went wrong: ${error}`)
        }

        try {
            const botdata = await database.findOne({ ClientId: json.ClientId })
            if (!botdata) {
                output.warn("database", "mongodb has not been setup, please setup to load guild only commands")
                output.info("assistance", "stuck? contact @therealdevrose on discord for assistance with using this system")
                return;
            }

            if (!botdata.TestGuild) {
                output.warn("database", "test guild not provided when setting up guild commands, all guild commands will not be loaded")
                output.info("assistance", "stuck? contact @therealdevrose on discord for assistance with using this system");
                return;
            }

            try {
                output.print("commands", `${guildcommands.length} test (/) commands are updating`)

                const data = await rest.put(
                    Routes.applicationGuildCommands(json.ClientId, botdata.TestGuild),
                    { body: guildcommands }
                )

                output.print("commands", `${data.length} test (/) commands have been updated`)
            } catch (error) {
                output.error("commands", `something unexpected went wrong: ${error}`)
            }
        } catch (error) {
            output.error("commands", `something unexpected went wrong: ${error}`)
        }
    })
}