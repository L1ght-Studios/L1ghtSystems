<a href='https://discord.gg/SRPsXNXkTV' target='_blank'>![alt Discord](https://img.shields.io/discord/1375466939790524567?color=7289da&logo=discord&logoColor=white)</a>

# L1ght Systems

L1ghtSystems is a advanced Discord.JS command handler made by TheRealDevRose. The goal of this package is to make it simple and easy to get your bot off the ground without worrying about your own command handler.

# Documentation

The official documentation will be released soon!

# Installation

**NPM**

```bash
npm install lightsystems
```

# Latest Update
In the latest update we fixed some issues with mongoose, discord.js & the command handler

You can set wether to defer or not your command reply


# Support & Feature Requests

This package is looking for feedback and ideas to help cover more use cases. If you have any ideas feel free to share them within the "suggestions" channel in the [L1ght Studios Discord server](https://discord.gg/SRPsXNXkTV).

# Setup
You first need to install the following packages

```bash
npm install lightsystems
npm install discord.js
npm install mongoose
```

Once installed, create a folder of your choice! for example here we will use something named `index.js`
the file layout will be `src/index.js`
in index.js you want to do the following

here the file layout btw
```txt
- src
-> commands
--> Fun
--> Utility
---> Ping.js
-> configuration
--> discord.json
--> mongo.json
-> interactions
--> ping.js
```

```js
    const { Client, Events, GatewayIntentBits } = require("discord.js")
    const { output, application, mongodb, start } = require("lightsystems")
    const json = require("../configuration/config.json") // the folder containing your core

    const client = new Client({
        intents: [
            GatewayIntentBits.AutoModerationConfiguration,
            GatewayIntentBits.AutoModerationExecution,
            GatewayIntentBits.DirectMessagePolls,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.DirectMessageTyping,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.GuildExpressions,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessagePolls,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildModeration,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildScheduledEvents,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildWebhooks,
            GatewayIntentBits.Guilds,
            GatewayIntentBits.MessageContent
        ]
    })

    client.on(Events.ClientReady, () => {
        output.print("client", "the discord client is online")
        output.print("client", "loading all core modules")
        start(client) // start the bot
        mongodb.connect(require("../configuration/mongo.json").URI) // setup your mongodb
        mongodb.setup(json.ClientId, "testguildid", "supportguildid", "botowner")
        application.loadCommands(client, "src/interactions", json) // path to the folder containing the command data
    })

    client.login(json.Token)
```

then in `src/interactions` you want to create a folder named `ping.js`
put this in that folder
```js
const { application, output } = require("lightsystems")
const { SlashCommandBuilder, ApplicationIntegrationType, InteractionContextType } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("replys the the latancy between the database, discord and you")
        .setContexts(InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall),
        
    category: "utility", // cool feature
    cooldown: 5, // this cooldown resets on bot reboot
    global: true, // loads the commands globally accross all servers, requires mongodb
    textcommand: true, // this feature is still in development
    file: require("../commands/Utility/ping"), // the path to the command
    deferReply: true // yeilds the reply
}
```

then you want to go over to `src/commands/Utility/ping.js`
```js
const { EmbedBuilder } = require("discord.js")
const mongoose = require("mongoose")

const replys = {
    ping: new EmbedBuilder()
        .setDescription("*Pinging database, discord and you*")
        .setColor("#FF97FF"),
    response: function (bot, client, database) {
        const embed = new EmbedBuilder()
            .setTitle("📶 Ping Stats")
            .setColor("#FF97FF")
            .addFields(
                { name: '🤖 Bot Ping', value: `${bot}ms`, inline: true },
                { name: '👤 User Ping', value: `${client}ms`, inline: true },
                { name: '💾 Database Ping', value: database, inline: true }
            )
            .setTimestamp();

        return embed
    }
}

module.exports = async function (client, interaction) {
    const sent = await interaction.editReply({ embeds: [replys.ping] })
    const botping = interaction.client.ws.ping;
    const userping = sent.createdTimestamp - interaction.createdTimestamp;
    let databaseping = "Database is offline"

    if (mongoose.connection.readyState === 1) {
        const start = Date.now();
        await mongoose.connection.db.admin().ping()
        databaseping = `${Date.now() - start}ms`
    }

    await interaction.editReply({ embeds: [replys.response(botping, userping, databaseping)] })
}
```

thats all the code needed to get the bot online