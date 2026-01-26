const mongoose = require("mongoose");
require("dotenv").config();

async function addQuestion() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(process.env.DATABASE_URL);
        const db = mongoose.connection.db;

        // Find an admin user to assign as creator
        const adminUser = await db.collection("users").findOne({ role: "admin" });
        if (!adminUser) {
            console.error("❌ No admin user found in database!");
            process.exit(1);
        }

        // Auto-generate testNumber for the new collection (listeningtests)
        const lastListeningTest = await db.collection("listeningtests")
            .find({})
            .sort({ testNumber: -1 })
            .limit(1)
            .toArray();

        const nextTestNumber = (lastListeningTest[0]?.testNumber || 0) + 1;
        const nextTestId = `LISTENING_${nextTestNumber.toString().padStart(3, '0')}`;

        const newTest = {
            testId: nextTestId,
            testNumber: nextTestNumber,
            title: "Children’s Engineering Workshops",
            description: "IELTS Listening Practice Test - Part 1 (Extracted from Screenshot)",
            source: "Cambridge IELTS",
            mainAudioUrl: "",
            audioDuration: 0,
            sections: [
                {
                    sectionNumber: 1,
                    title: "Part 1 - Children’s Engineering Workshops",
                    context: "A talk about engineering workshops for children", // Required field
                    instructions: "Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
                    passage: "Children’s Engineering Workshops\n\nTiny Engineers (ages 4-5)\n\nActivities\n\n- Create a cover for an {1} so they can drop it from a height without breaking it.\n- Take part in a competition to build the tallest {2}.\n- Make a {3} powered by a balloon.\n\nJunior Engineers (ages 6-8)\n\nActivities:\n\n- Build model cars, trucks and {4} and learn how to program them so they can move.\n- Take part in a competition to build the longest {5} using card and wood.\n- Create a short {6} with special software.\n- Build, {7} and program a humanoid robot.\n\nCost for a five-week block: £50\n\nHeld on {8} from 10 am to 11 am\n\nLocation\n\nBuilding 10A, {9} Industrial Estate, Grasford\n\nPlenty of {10} is available.",
                    questions: [
                        { "questionNumber": 1, "questionType": "note-completion", "questionText": "Create a cover for an", "correctAnswer": "egg", "marks": 1 },
                        { "questionNumber": 2, "questionType": "note-completion", "questionText": "build the tallest", "correctAnswer": "tower", "marks": 1 },
                        { "questionNumber": 3, "questionType": "note-completion", "questionText": "Make a", "correctAnswer": "car", "marks": 1 },
                        { "questionNumber": 4, "questionType": "note-completion", "questionText": "Build model cars, trucks and", "correctAnswer": "animals", "marks": 1 },
                        { "questionNumber": 5, "questionType": "note-completion", "questionText": "build the longest", "correctAnswer": "bridge", "marks": 1 },
                        { "questionNumber": 6, "questionType": "note-completion", "questionText": "Create a short", "correctAnswer": "movie", "acceptableAnswers": ["film"], "marks": 1 },
                        { "questionNumber": 7, "questionType": "note-completion", "questionText": "Build,", "correctAnswer": "decorate", "marks": 1 },
                        { "questionNumber": 8, "questionType": "note-completion", "questionText": "Held on", "correctAnswer": "Wednesdays", "marks": 1 },
                        { "questionNumber": 9, "questionType": "note-completion", "questionText": "Building 10A,", "correctAnswer": "Fradstone", "marks": 1 },
                        { "questionNumber": 10, "questionType": "note-completion", "questionText": "Plenty of", "correctAnswer": "parking", "marks": 1 }
                    ]
                }
            ],
            totalQuestions: 10,
            totalMarks: 10,
            duration: 40,
            difficulty: "medium",
            isActive: true,
            usageCount: 0,
            createdBy: adminUser._id,
            createdAt: new Date(),
            updatedAt: new Date(),
            __v: 0
        };

        // Insert into the new collection (listeningtests)
        await db.collection("listeningtests").insertOne(newTest);
        console.log(`✅ Success! Added to 'listeningtests' collection as Set #${newTest.testNumber} (ID: ${newTest.testId})`);

        // Also keep sync with old collection (questionsets)
        const oldSetFormat = {
            ...newTest,
            setId: `LISTENING_SET_${newTest.testNumber.toString().padStart(3, '0')}`,
            setNumber: newTest.testNumber,
            setType: "LISTENING"
        };
        delete oldSetFormat.testId;

        await db.collection("questionsets").insertOne(oldSetFormat);
        console.log(`✅ Also added to 'questionsets' collection for compatibility.`);

        await mongoose.disconnect();
    } catch (error) {
        console.error("❌ Error adding question:", error);
        process.exit(1);
    }
}

addQuestion();
