import mongoose from "mongoose";
import config from "../app/config";

async function checkDatabase() {
    try {
        await mongoose.connect(config.database_url as string);
        console.log("Connected to MongoDB");

        const db = mongoose.connection.db;

        // Check question sets
        const questionSets = await db.collection("questionsets").find({}).toArray();
        console.log("\n=== Question Sets ===");
        console.log("Total:", questionSets.length);
        questionSets.forEach((s: any) => {
            console.log(`- ${s.title} | Type: ${s.setType} | SetNumber: ${s.setNumber}`);
        });

        // Check students
        const students = await db.collection("students").find({}).toArray();
        console.log("\n=== Students ===");
        console.log("Total:", students.length);

        // Check exams
        const exams = await db.collection("exams").find({}).toArray();
        console.log("\n=== Exams ===");
        console.log("Total:", exams.length);

        await mongoose.disconnect();
        console.log("\nDisconnected");

    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkDatabase();
