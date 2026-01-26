const mongoose = require("mongoose");
require("dotenv").config();

async function updateFullTest() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(process.env.DATABASE_URL);
        const db = mongoose.connection.db;

        // Find the record by its updated title
        const filter = { title: "Cambridge IELTS 16 Academic Listening Test 1", setType: "LISTENING" };

        const fullTest = {
            title: "Cambridge IELTS 16 Academic Listening Test 1",
            description: "Full Academic Listening Test from Cambridge 16",
            source: "Cambridge IELTS 16",
            mainAudioUrl: "",
            audioDuration: 0,
            sections: [
                {
                    sectionNumber: 1,
                    title: "Part 1 - Children’s Engineering Workshops",
                    context: "A conversation between a father and a workshop organizer about engineering classes for children.",
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
                },
                {
                    sectionNumber: 2,
                    title: "Part 2 - Stevenson’s Company",
                    context: "A speaker gives an introduction to Stevenson's company and provides directions on a map.",
                    instructions: "Questions 11-14: Choose the correct letter, A, B or C.", // MCQ Instruction
                    questions: [
                        {
                            "questionNumber": 11,
                            "questionType": "multiple-choice",
                            "questionText": "Stevenson's was founded in",
                            "options": ["A. 1923", "B. 1924", "C. 1926"],
                            "correctAnswer": "C", // Updated to C as per user
                            "marks": 1
                        },
                        {
                            "questionNumber": 12,
                            "questionType": "multiple-choice",
                            "questionText": "Originally, Stevenson's manufactured goods for",
                            "options": ["A. the healthcare industry", "B. the automotive industry", "C. the machine tools industry"],
                            "correctAnswer": "A",
                            "marks": 1
                        },
                        {
                            "questionNumber": 13,
                            "questionType": "multiple-choice",
                            "questionText": "What does the speaker say about the company premises?",
                            "options": ["A. The company has recently moved.", "B. The company has no plans to move.", "C. The company is going to move shortly."],
                            "correctAnswer": "B",
                            "marks": 1
                        },
                        {
                            "questionNumber": 14,
                            "questionType": "multiple-choice",
                            "questionText": "The programme for the work experience group includes",
                            "options": ["A. time to do research", "B. meetings with a teacher", "C. talks by staff"],
                            "correctAnswer": "C",
                            "marks": 1
                        },
                        // Map labeling 15-20 starting here
                        {
                            "questionNumber": 15,
                            "questionType": "matching",
                            "questionText": "coffee room",
                            "options": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
                            "correctAnswer": "H",
                            "imageUrl": "https://www.engnovate.com/wp-content/uploads/2021/06/Cambridge-16-Test-1-Part-2-Map.png",
                            "mainInstruction": "Label the map below.",
                            "subInstruction": "Write the correct letter, A-J, next to Questions.",
                            "audioTimestamp": "00:00",
                            "marks": 1
                        },
                        {
                            "questionNumber": 16,
                            "questionType": "matching",
                            "questionText": "warehouse",
                            "options": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
                            "correctAnswer": "C",
                            "marks": 1
                        },
                        {
                            "questionNumber": 17,
                            "questionType": "matching",
                            "questionText": "staff canteen",
                            "options": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
                            "correctAnswer": "G",
                            "marks": 1
                        },
                        {
                            "questionNumber": 18,
                            "questionType": "matching",
                            "questionText": "meeting room",
                            "options": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
                            "correctAnswer": "B",
                            "marks": 1
                        },
                        {
                            "questionNumber": 19,
                            "questionType": "matching",
                            "questionText": "human resources",
                            "options": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
                            "correctAnswer": "I",
                            "marks": 1
                        },
                        {
                            "questionNumber": 20,
                            "questionType": "matching",
                            "questionText": "boardroom",
                            "options": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
                            "correctAnswer": "A",
                            "marks": 1
                        }
                    ]
                },
                {
                    sectionNumber: 3,
                    title: "Part 3 - Art Projects",
                    context: "Jess and Tom discuss their art projects and the meanings behind different bird paintings.",
                    instructions: "Questions 21-24: Choose TWO letters, A-E. Questions 25-30: Choose SIX answers from the box.",
                    questions: [
                        {
                            "questionNumber": 21,
                            "questionType": "multiple-choice-multi",
                            "questionText": "Which TWO parts of the introductory stage to their art projects do Jess and Tom agree were useful?",
                            "options": ["A. the Bird Park visit", "B. the workshop sessions", "C. the Natural History Museum visit", "D. the projects done in previous years", "E. the handouts with research sources"],
                            "correctAnswer": ["C", "E"],
                            "mainInstruction": "Choose TWO letters, A-E.",
                            "marks": 1
                        },
                        {
                            "questionNumber": 22,
                            "questionType": "multiple-choice-multi",
                            "questionText": "Which TWO parts of the introductory stage to their art projects do Jess and Tom agree were useful?",
                            "options": ["A. the Bird Park visit", "B. the workshop sessions", "C. the Natural History Museum visit", "D. the projects done in previous years", "E. the handouts with research sources"],
                            "correctAnswer": ["C", "E"],
                            "marks": 1
                        },
                        {
                            "questionNumber": 23,
                            "questionType": "multiple-choice-multi",
                            "questionText": "In which TWO ways do both Jess and Tom decide to change their proposals?",
                            "options": ["A. by giving a rationale for their action plans", "B. by being less specific about the outcome", "C. by adding a video diary presentation", "D. by providing a timeline and a mind map", "E. by making their notes more evaluative"],
                            "correctAnswer": ["B", "E"],
                            "mainInstruction": "Questions 23-24",
                            "audioTimestamp": "00:00",
                            "marks": 1
                        },
                        {
                            "questionNumber": 24,
                            "questionType": "multiple-choice-multi",
                            "questionText": "In which TWO ways do both Jess and Tom decide to change their proposals?",
                            "options": ["A. by giving a rationale for their action plans", "B. by being less specific about the outcome", "C. by adding a video diary presentation", "D. by providing a timeline and a mind map", "E. by making their notes more evaluative"],
                            "correctAnswer": ["B", "E"],
                            "marks": 1
                        },
                        // Matching 25-30
                        {
                            "questionNumber": 25,
                            "questionType": "matching",
                            "questionText": "Falcon (Landseer)",
                            "options": ["A. a childhood memory", "B. hope for the future", "C. fast movement", "D. a potential threat", "E. the power of colour", "F. the continuity of life", "G. protection of nature", "H. a confused attitude to nature"],
                            "correctAnswer": "D",
                            "marks": 1
                        },
                        {
                            "questionNumber": 26,
                            "questionType": "matching",
                            "questionText": "Fish hawk (Audubon)",
                            "options": ["A. a childhood memory", "B. hope for the future", "C. fast movement", "D. a potential threat", "E. the power of colour", "F. the continuity of life", "G. protection of nature", "H. a confused attitude to nature"],
                            "correctAnswer": "C",
                            "marks": 1
                        },
                        {
                            "questionNumber": 27,
                            "questionType": "matching",
                            "questionText": "Kingfisher (van Gogh)",
                            "options": ["A. a childhood memory", "B. hope for the future", "C. fast movement", "D. a potential threat", "E. the power of colour", "F. the continuity of life", "G. protection of nature", "H. a confused attitude to nature"],
                            "correctAnswer": "A",
                            "marks": 1
                        },
                        {
                            "questionNumber": 28,
                            "questionType": "matching",
                            "questionText": "Portrait of William Wells",
                            "options": ["A. a childhood memory", "B. hope for the future", "C. fast movement", "D. a potential threat", "E. the power of colour", "F. the continuity of life", "G. protection of nature", "H. a confused attitude to nature"],
                            "correctAnswer": "H",
                            "marks": 1
                        },
                        {
                            "questionNumber": 29,
                            "questionType": "matching",
                            "questionText": "Vairumati (Gauguin)",
                            "options": ["A. a childhood memory", "B. hope for the future", "C. fast movement", "D. a potential threat", "E. the power of colour", "F. the continuity of life", "G. protection of nature", "H. a confused attitude to nature"],
                            "correctAnswer": "F",
                            "marks": 1
                        },
                        {
                            "questionNumber": 30,
                            "questionType": "matching",
                            "questionText": "Portrait of Giovanni de Medici",
                            "options": ["A. a childhood memory", "B. hope for the future", "C. fast movement", "D. a potential threat", "E. the power of colour", "F. the continuity of life", "G. protection of nature", "H. a confused attitude to nature"],
                            "correctAnswer": "G",
                            "marks": 1
                        }
                    ]
                },
                {
                    sectionNumber: 4,
                    title: "Part 4 - Stoicism",
                    context: "A lecturing discussing the ancient philosophy of Stoicism and its relevance today.",
                    instructions: "Complete the notes below. Write ONE WORD ONLY for each answer.",
                    passage: "Stoicism is still relevant today because of its {31} appeal.\n\nAncient Stoics\n– Stoicism was founded over 2,000 years ago in Greece.\n– The Stoics' ideas are surprisingly well known, despite not being intended for {32}.\n\nStoic principles\n– Happiness could be achieved by leading a virtuous life.\n– Controlling emotions was essential.\n– Epictetus said that external events cannot be controlled but the {33} people make in response can be controlled.\n– A Stoic is someone who has a different view on experiences which others would consider as {34}.\n\nThe influence of Stoicism\n– George Washington organised a {35} about Cato to motivate his men.\n– The French artist Delacroix was a Stoic.\n– Adam Smith's ideas on {36} were influenced by Stoicism.\n– Some of today's political leaders are inspired by the Stoics.\n\nCognitive Behaviour Therapy (CBT)\n– the treatment for {37} is based on ideas from Stoicism\n– people learn to base their thinking on {38}.\n\nIn business, people benefit from Stoicism by identifying obstacles as {39}.\n\nRelevance of Stoicism\n– It requires a lot of {40} but Stoicism can help people to lead a good life.\n– It teaches people that having a strong character is more important than anything else.",
                    questions: [
                        { "questionNumber": 31, "questionType": "note-completion", "questionText": "relevant today because of its _______ appeal", "correctAnswer": "practical", "marks": 1 },
                        { "questionNumber": 32, "questionType": "note-completion", "questionText": "despite not being intended for _______", "correctAnswer": "publication", "marks": 1 },
                        { "questionNumber": 33, "questionType": "note-completion", "questionText": "the _______ people make in response", "correctAnswer": "choices", "marks": 1 },
                        { "questionNumber": 34, "questionType": "note-completion", "questionText": "others would consider as _______", "correctAnswer": "negative", "marks": 1 },
                        { "questionNumber": 35, "questionType": "note-completion", "questionText": "organised a _______ about Cato", "correctAnswer": "play", "marks": 1 },
                        { "questionNumber": 36, "questionType": "note-completion", "questionText": "Adam Smith's ideas on _______", "correctAnswer": "capitalism", "marks": 1 },
                        { "questionNumber": 37, "questionType": "note-completion", "questionText": "treatment for _______ is based on", "correctAnswer": "depression", "marks": 1 },
                        { "questionNumber": 38, "questionType": "note-completion", "questionText": "learn to base their thinking on _______", "correctAnswer": "logic", "marks": 1 },
                        { "questionNumber": 39, "questionType": "note-completion", "questionText": "identifying obstacles as _______", "correctAnswer": "opportunity", "marks": 1 },
                        { "questionNumber": 40, "questionType": "note-completion", "questionText": "requires a lot of _______ but Stoicism", "correctAnswer": "practice", "acceptableAnswers": ["practise"], "marks": 1 }
                    ]
                }
            ],
            totalQuestions: 40,
            totalMarks: 40,
            updatedAt: new Date()
        };

        // Update in both collections using the correct title
        const result1 = await db.collection("listeningtests").updateOne(
            { title: filter.title },
            { $set: fullTest }
        );

        const result2 = await db.collection("questionsets").updateOne(
            { title: filter.title },
            {
                $set: {
                    ...fullTest,
                    setType: "LISTENING"
                }
            }
        );

        console.log(`✅ Full Test Updated! Result1: ${result1.modifiedCount}, Result2: ${result2.modifiedCount}`);

        await mongoose.disconnect();
    } catch (error) {
        console.error("❌ Error updating test:", error);
        process.exit(1);
    }
}

updateFullTest();
