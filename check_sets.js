const mongoose = require("mongoose");
require("dotenv").config();

async function check() {
    await mongoose.connect(process.env.DATABASE_URL);
    const db = mongoose.connection.db;

    const ids = ["69770ba0fa2d9c6b7b595dd0", "69771080f485a709d008d310"];
    for (const id of ids) {
        const set = await db.collection("listeningtests").findOne({ _id: new mongoose.Types.ObjectId(id) });
        console.log(`--- ID: ${id} ---`);
        console.log(`Title: ${set?.title}`);
        console.log(`Part 2 Question 15 Text: ${set?.sections?.[1]?.questions?.[4]?.questionText}`);
        console.log(`Part 2 Question 15 Image: ${set?.sections?.[1]?.questions?.[4]?.imageUrl}`);
    }
    await mongoose.disconnect();
}
check();
