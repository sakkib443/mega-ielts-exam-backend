const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

async function main() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        const db = mongoose.connection.db;

        // Fetch one Listening question set from the old collection
        const listeningTest = await db.collection("questionsets").findOne({ setType: "LISTENING" });

        if (listeningTest) {
            fs.writeFileSync("db_sample.json", JSON.stringify(listeningTest, null, 2));
            console.log("Data saved to db_sample.json");
        } else {
            console.log("No Listening test found in 'questionsets' collection.");
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error fetching data:", error);
        process.exit(1);
    }
}

main();
