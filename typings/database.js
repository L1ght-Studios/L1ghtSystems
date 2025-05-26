const output = require("../src/Utility/Output")

module.exports = {
    /**
     * connects your bot to mongodb
     * @param {string} uri the connection token to connect to the database
     */
    async connect(uri) {
        if (!uri) return output.warn("database", "a uri must be provided to connect to the database")
        require("../src/Database/Connect")(uri)
    }
}