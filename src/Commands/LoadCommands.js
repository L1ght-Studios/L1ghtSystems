const fs = require("node:fs")
const path = require("node:path")
const output = require("../Utility/Output")
const { REST, Routes } = require("discord.js")
const Output = require("../Utility/Output")

module.exports = async function (client, folder, json) {
        const commands = []

        const folderpath = path.join(__dirname, `../../../../${folder}`)
        const interactions = fs.readdirSync(folderpath)

        for (const file of interactions) {
            const commandpath = path.join(folderpath, file)
            const command = require(commandpath)

            if ("data" in command && "file" in command) {
                try {
                    client.commands.set(command.data.name, command);
                } catch (error) {
                   output.error("light", `client.commands does not exists, please make sure you used "lightsystems.start(client)"\n${error}`)
                }
                commands.push(command.data)
            } else {
                output.warn("command", `the command in ${commandpath} is missing the properties "execute" or "data"`)
            }
        }


        const rest = new REST().setToken(json.Token);

        (async () => {
            try {
                output.print("commands", `started refreshing ${commands.length} application (/) commands`)

                const data = await rest.put(
                    Routes.applicationCommands(json.ClientId),
                    { body: commands }
                );

                output.print("commands", `successfully reloaded ${data.length} application (/) commands`)
            } catch (error) {
                output.error("commands", `${error}`)
            }
        })();

}