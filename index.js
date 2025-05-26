module.exports = {
    start: function(client) {
        require("./src/Utility/Client").Setup(client)
    },
    output: require("./src/Utility/Output"),
    mongodb: require("./typings/database"),
    application: require("./typings/application")
}