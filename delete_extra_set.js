const mongoose = require("mongoose");
require("dotenv").config();

async function deleteExtra() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(process.env.DATABASE_URL);
        const db = mongoose.connection.db;

        const idToDelete = "69771080f485a709d008d310"; // The one without the image

        console.log(`🗑️ Deleting test with ID: ${idToDelete}...`);

        const res1 = await db.collection("listeningtests").deleteOne({ _id: new mongoose.Types.ObjectId(idToDelete) });
        const res2 = await db.collection("questionsets").deleteOne({ _id: new mongoose.Types.ObjectId(idToDelete) });

        console.log(`✅ Deleted from listeningtests: ${res1.deletedCount}`);
        console.log(`✅ Deleted from questionsets: ${res2.deletedCount}`);

        await mongoose.disconnect();
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

deleteExtra();
