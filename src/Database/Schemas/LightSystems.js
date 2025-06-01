const mongoose = require("mongoose")

// All data here is stored using your own database you provided!
const schema = new mongoose.Schema({
    TestGuild: String,
    SupportGuild: String,
    ClientId: String,
    BotOwner: String,
})

module.exports = mongoose.model("L1ghtSystems", schema)