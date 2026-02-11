import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load env vars
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import { SpeakingTest, generateSpeakingTestId } from "../app/modules/speaking/speaking.model";

const speakingTestData = {
    title: "Cambridge IELTS 17 Academic Speaking Test 1",
    description: "Speaking test from Cambridge IELTS Book 17, Academic Test 1",
    source: "Cambridge IELTS Book 17 Test 1",
    difficulty: "medium" as const,
    part1: {
        topics: [
            {
                topicName: "History",
                questions: [
                    "What did you study in history lessons when you were at school?",
                    "Did you enjoy studying history at school? [Why/Why not?]",
                    "How often do you watch TV programmes about history now? [Why/Why not?]",
                    "What period in history would you like to learn more about? [Why?]"
                ]
            }
        ],
        duration: 5
    },
    part2: {
        topic: "A Neighbourhood",
        cueCard: "Describe the neighbourhood you lived in when you were a child.",
        bulletPoints: [
            "where in your town/city the neighbourhood was",
            "what kind of people lived there",
            "what it was like to live in this neighbourhood"
        ],
        followUpQuestion: "and explain whether you would like to live in this neighbourhood in the future.",
        preparationTime: 60,
        speakingTime: 120,
        followUpQuestions: []
    },
    part3: {
        topic: "Neighbourhoods and Communities",
        questions: [
            "What sort of things can neighbours do to help each other?",
            "How well do people generally know their neighbours in your country?",
            "How important do you think it is to have good neighbours?",
            "Which facilities are most important to people living in cities?",
            "How does shopping in small local shops differ from shopping in large city centre shops?",
            "Do you think that children should always go to the school nearest to where they live?"
        ],
        duration: 5
    }
};

async function seedSpeakingTest() {
    try {
        const mongoUri = process.env.DATABASE_URL || "mongodb://localhost:27017/mega-ielts";
        console.log("Connecting to MongoDB...", mongoUri);

        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB ✅");

        // Check if already exists
        const existing = await SpeakingTest.findOne({ source: speakingTestData.source });
        if (existing) {
            console.log("Speaking test already exists, skipping seed.");
            await mongoose.disconnect();
            return;
        }

        const { testId, testNumber } = await generateSpeakingTestId();

        // Calculate total questions
        let totalQuestions = 0;
        speakingTestData.part1.topics.forEach(topic => {
            totalQuestions += topic.questions.length;
        });
        totalQuestions += 1; // Part 2 cue card
        totalQuestions += speakingTestData.part3.questions.length;

        // Get admin user
        const User = mongoose.model("User", new mongoose.Schema({ role: String }), "users");
        const admin = await User.findOne({ role: "admin" });

        if (!admin) {
            console.log("No admin user found. Using a placeholder ObjectId.");
        }
        const adminId = admin?._id || new mongoose.Types.ObjectId();

        const result = await SpeakingTest.create({
            ...speakingTestData,
            testId,
            testNumber,
            totalQuestions,
            duration: 14,
            createdBy: adminId,
        });

        console.log(`\n✅ Speaking Test seeded successfully!`);
        console.log(`   Test ID: ${result.testId}`);
        console.log(`   Test Number: ${result.testNumber}`);
        console.log(`   Title: ${result.title}`);
        console.log(`   Total Questions: ${result.totalQuestions}`);
        console.log(`   Part 1 Topics: ${result.part1.topics.length}`);
        console.log(`   Part 1 Questions: ${result.part1.topics.reduce((acc, t) => acc + t.questions.length, 0)}`);
        console.log(`   Part 2 Bullet Points: ${result.part2.bulletPoints.length}`);
        console.log(`   Part 3 Questions: ${result.part3.questions.length}`);

        await mongoose.disconnect();
        console.log("\nDisconnected from MongoDB ✅");
    } catch (error) {
        console.error("Error seeding speaking test:", error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

seedSpeakingTest();
