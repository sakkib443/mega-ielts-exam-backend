const mongoose = require("mongoose");
require("dotenv").config();

async function listSets() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        const db = mongoose.connection.db;

        console.log("LISTENING TESTS:");
        const tests = await db.collection("listeningtests").find({}).toArray();
        tests.forEach(t => console.log(`- [${t._id}] ${t.title}`));

        console.log("\nQUESTION SETS (LISTENING):");
        const qsets = await db.collection("questionsets").find({ setType: "LISTENING" }).toArray();
        qsets.forEach(t => console.log(`- [${t._id}] ${t.title}`));

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
}
listSets();
