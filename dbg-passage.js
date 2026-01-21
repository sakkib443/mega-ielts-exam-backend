const mongoose = require("mongoose");
require("dotenv").config();

async function main() {
    await mongoose.connect(process.env.DATABASE_URL);
    const db = mongoose.connection.db;

    const test = await db.collection("questionsets").findOne({ setType: "LISTENING" });

    if (!test) {
        console.log("No Listening test found!");
        process.exit(1);
    }

    console.log("Sections:", test.sections?.length);

    test.sections?.forEach((section, i) => {
        console.log(`\n=== Section ${i + 1} ===`);
        console.log("Passage (first 500 chars):", section.passage?.substring(0, 500));
        console.log("Questions:", section.questions?.map(q => q.questionNumber).join(", "));
    });

    await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
