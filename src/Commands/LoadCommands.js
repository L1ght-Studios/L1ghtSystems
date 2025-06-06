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
                    client.guildcommands.set(command.data.name, command)
                    guildcommands.push(command.data)
                } else {
                    client.commands.set(command.data.name, command)
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
            if (globalcommands.length > 0) {
                output.print("commands", `started updating ${globalcommands.length} global (/) commands`)

                const data = await rest.put(
                    Routes.applicationCommands(json.ClientId),
                    { body: globalcommands }
                )

                output.print("commands", `successfully updated ${data.length} global (/) commands`)
            }
        } catch (error) {
            output.error("commands", `something unexpected went wrong: ${error}`)
        }

        try {
            const botdata = await database.findOne({ ClientId: json.ClientId })
            if (!botdata) {
                output.warn("database", "mongodb has not been setup, please setup to load guild only commands")
                output.info("assistance", "stuck? contact @therealdevrose on discord for assistance with using this system")
                return
            }

            if (!botdata.TestGuild) {
                output.warn("database", "test guild not provided when setting up guild commands, all guild commands will not be loaded")
                output.info("assistance", "stuck? contact @therealdevrose on discord for assistance with using this system");
                return
            }

            try {
                if (guildcommands.length > 0) {
                    output.print("commands", `started updating ${guildcommands.length} guild (/) commands`)
                    const data = await rest.put(
                        Routes.applicationGuildCommands(json.ClientId, botdata.TestGuild),
                        { body: guildcommands }
                    )

                    output.print("commands", `successfully updated ${data.length} test (/) commands`)
                }
            } catch (error) {
                output.error("commands", `something unexpected went wrong: ${error}`)
            }
        } catch (error) {
            output.error("commands", `something unexpected went wrong: ${error}`)
        }
    })();
}