const output = require("../src/Utility/Output")

module.exports = {
    /**
     * connects your bot to mongodb
     * @param {string} uri the connection token to connect to the database
     */
    async connect(uri) {
        if (!uri) return output.warn("database", "a uri must be provided to connect to the database")
        require("../src/Database/Connect")(uri)
    },


    /**
     * sets the bot up with mongodb allowing full bot control
     * @param {string} clientid the id of your discord bot *REQUIRED
     * @param {string} testguild the id of your discord bot test server *REQUIRED
     * @param {string} supportserver the id of your bots support server
     * @param {string} botowner the id of the owner of the bot
     * 
     */
    async setup(clientid, testguild, supportserver, botowner) {
        const data = {
            clientid: clientid,
            testguild: testguild,
            supportserver: supportserver,
            botowner: botowner
        }

        require("../src/Database/Setup")(data)
    }
}