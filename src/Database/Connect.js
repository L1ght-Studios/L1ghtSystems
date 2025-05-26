const output = require("../Utility/Output")
const { MongoClient, ServerApiVersion } = require("mongodb")
const { default: mongoose } = require("mongoose")

module.exports = async function (uri) {
    try {
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true
            }
        });

        async function run() {
            try {
                await client.connect();
                await client.db("admin").command({ ping: 1 });
                await output.print("database", "successfully connected to mongodb")
            } finally {
                await client.close()
                mongoose.connect(uri, { "serverApi": { "version": ServerApiVersion.v1, "strict": true, "deprecationErrors": true } })
            }
        }

        run().catch(console.dir);
    } catch (error) {
        output.error("database", "failed to connect to mongodb")
    }
}
