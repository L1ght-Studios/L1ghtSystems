const output = require("../Utility/Output")
const { MessageFlags, Collection, time } = require("discord.js")

module.exports = async function (client, interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        output.warn("interaction", `no (/) command matching ${interaction.commandName} was found`)
        return;
    }

    const { cooldowns } = interaction.client;
    if (!cooldowns.has(command.data.name)) {
        cooldowns.set(command.data.name, new Collection())
    }

    const now = Date.now()
    const timestamps = cooldowns.get(command.data.name)
    const defaultcooldown = 5
    const cooldownamount = (command.cooldown ?? defaultcooldown) * 1_000;

    if (timestamps.has(interaction.user.id)) {
        const endtime = timestamps.get(interaction.user.id) + cooldownamount

        if (now < endtime) {
            const endtimestamp = Math.random(endtime / 1_000)
            return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${endtimestamp}:R>.`, flags: MessageFlags.Ephemeral });
        }
    } else {
        try {
            await interaction.deferReply();
            await command.file(client, interaction)
        } catch (error) {
            output.error("interaction", `unexpected error executing a command ${error}`)

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'Failed to execute this command!', flags: MessageFlags.Ephemeral })
            } else {
                interaction.reply({ content: "Failed to execute this command", flags: MessageFlags.Ephemeral })
            }
        }
    }

    timestamps.set(interaction.user.id, now)
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownamount)



}