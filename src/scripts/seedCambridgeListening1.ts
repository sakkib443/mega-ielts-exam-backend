import mongoose from "mongoose";
import config from "../app/config";
import { QuestionSet } from "../app/modules/questionSet/questionSet.model";

async function seedCambridgeListeningTest1() {
    try {
        await mongoose.connect(config.database_url as string);
        console.log("Connected to MongoDB");

        // Check if already exists
        const existing = await QuestionSet.findOne({ setType: "LISTENING", setNumber: 2 });
        if (existing) {
            console.log("Listening Set #2 already exists. Deleting and recreating...");
            await QuestionSet.deleteOne({ _id: existing._id });
        }

        // Get a dummy admin user ID (or use a real one)
        const db = mongoose.connection.db;
        const adminUser = await db.collection("users").findOne({ role: "admin" });
        const createdBy = adminUser?._id || new mongoose.Types.ObjectId();

        const cambridgeListening1 = {
            setId: "LISTENING_SET_002",
            setType: "LISTENING",
            setNumber: 2,
            title: "Cambridge IELTS Test 1 - Listening",
            description: "Complete IELTS Listening Test 1 from Cambridge IELTS book with 4 parts and 40 questions.",
            duration: 40,
            difficulty: "medium",
            totalQuestions: 40,
            totalMarks: 40,
            mainAudioUrl: "",
            audioDuration: 2400,
            isActive: true,
            createdBy: createdBy,
            sections: [
                // ================== PART 1: Buckworth Conservation Group ==================
                {
                    sectionNumber: 1,
                    title: "Part 1 - Buckworth Conservation Group",
                    instructions: "Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
                    audioUrl: "",
                    questions: [
                        {
                            questionNumber: 1,
                            questionType: "form-completion",
                            questionText: "Beach - making sure the beach does not have _______ on it",
                            correctAnswer: "litter",
                            marks: 1
                        },
                        {
                            questionNumber: 2,
                            questionType: "form-completion",
                            questionText: "Nature reserve - improvements to _______ for birdwatching",
                            correctAnswer: "dogs",
                            marks: 1
                        },
                        {
                            questionNumber: 3,
                            questionType: "form-completion",
                            questionText: "Next task is taking action to attract _______ to the place",
                            correctAnswer: "insects",
                            marks: 1
                        },
                        {
                            questionNumber: 4,
                            questionType: "form-completion",
                            questionText: "Identifying types of _______",
                            correctAnswer: "butterflies",
                            marks: 1
                        },
                        {
                            questionNumber: 5,
                            questionType: "form-completion",
                            questionText: "Building a new _______",
                            correctAnswer: "wall",
                            marks: 1
                        },
                        {
                            questionNumber: 6,
                            questionType: "form-completion",
                            questionText: "Saturday - Meet at Dunsmore Beach car park, walk across the sands and reach the _______",
                            correctAnswer: "island",
                            marks: 1
                        },
                        {
                            questionNumber: 7,
                            questionType: "form-completion",
                            questionText: "Take a picnic, wear appropriate _______",
                            correctAnswer: "boots",
                            marks: 1
                        },
                        {
                            questionNumber: 8,
                            questionType: "form-completion",
                            questionText: "Woodwork session - Suitable for _______ to participate in",
                            correctAnswer: "beginners",
                            marks: 1
                        },
                        {
                            questionNumber: 9,
                            questionType: "form-completion",
                            questionText: "Making _______ out of wood",
                            correctAnswer: "spoons",
                            marks: 1
                        },
                        {
                            questionNumber: 10,
                            questionType: "form-completion",
                            questionText: "Cost of session (no camping): £_______",
                            correctAnswer: "35",
                            marks: 1
                        },
                    ],
                },

                // ================== PART 2: Boat Trip Round Tasmania ==================
                {
                    sectionNumber: 2,
                    title: "Part 2 - Boat Trip Round Tasmania",
                    instructions: "Choose the correct letter, A, B or C. For Questions 15-20, choose TWO letters.",
                    audioUrl: "",
                    questions: [
                        // Questions 11-14: Multiple Choice
                        {
                            questionNumber: 11,
                            questionType: "multiple-choice",
                            questionText: "What is the maximum number of people who can stand on each side of the boat?",
                            options: ["A. 9", "B. 15", "C. 18"],
                            correctAnswer: "A",
                            marks: 1
                        },
                        {
                            questionNumber: 12,
                            questionType: "multiple-choice",
                            questionText: "What colour are the tour boats?",
                            options: ["A. dark red", "B. jet black", "C. light green"],
                            correctAnswer: "C",
                            marks: 1
                        },
                        {
                            questionNumber: 13,
                            questionType: "multiple-choice",
                            questionText: "Which lunchbox is suitable for someone who doesn't eat meat or fish?",
                            options: ["A. Lunchbox 1", "B. Lunchbox 2", "C. Lunchbox 3"],
                            correctAnswer: "B",
                            marks: 1
                        },
                        {
                            questionNumber: 14,
                            questionType: "multiple-choice",
                            questionText: "What should people do with their litter?",
                            options: ["A. take it home", "B. hand it to a member of staff", "C. put it in the bins provided on the boat"],
                            correctAnswer: "B",
                            marks: 1
                        },
                        // Questions 15-16: Choose TWO features of the lighthouse (A and D in either order)
                        {
                            questionNumber: 15,
                            questionType: "multiple-choice",
                            questionText: "Which TWO features of the lighthouse does Lou mention? (Choose first answer)",
                            options: ["A. why it was built", "B. who built it", "C. how long it took to build", "D. who staffed it", "E. what it was built with"],
                            correctAnswer: "A",
                            marks: 1
                        },
                        {
                            questionNumber: 16,
                            questionType: "multiple-choice",
                            questionText: "Which TWO features of the lighthouse does Lou mention? (Choose second answer)",
                            options: ["A. why it was built", "B. who built it", "C. how long it took to build", "D. who staffed it", "E. what it was built with"],
                            correctAnswer: "D",
                            marks: 1
                        },
                        // Questions 17-18: Choose TWO types of creature (B and C in either order)
                        {
                            questionNumber: 17,
                            questionType: "multiple-choice",
                            questionText: "Which TWO types of creature might come close to the boat? (Choose first answer)",
                            options: ["A. sea eagles", "B. fur seals", "C. dolphins", "D. whales", "E. penguins"],
                            correctAnswer: "B",
                            marks: 1
                        },
                        {
                            questionNumber: 18,
                            questionType: "multiple-choice",
                            questionText: "Which TWO types of creature might come close to the boat? (Choose second answer)",
                            options: ["A. sea eagles", "B. fur seals", "C. dolphins", "D. whales", "E. penguins"],
                            correctAnswer: "C",
                            marks: 1
                        },
                        // Questions 19-20: Choose TWO points about the caves (D and E in either order)
                        {
                            questionNumber: 19,
                            questionType: "multiple-choice",
                            questionText: "Which TWO points does Lou make about the caves? (Choose first answer)",
                            options: ["A. Only large tourist boats can visit them.", "B. The entrances to them are often blocked.", "C. It is too dangerous for individuals to go near them.", "D. Someone will explain what is inside them.", "E. They cannot be reached on foot."],
                            correctAnswer: "D",
                            marks: 1
                        },
                        {
                            questionNumber: 20,
                            questionType: "multiple-choice",
                            questionText: "Which TWO points does Lou make about the caves? (Choose second answer)",
                            options: ["A. Only large tourist boats can visit them.", "B. The entrances to them are often blocked.", "C. It is too dangerous for individuals to go near them.", "D. Someone will explain what is inside them.", "E. They cannot be reached on foot."],
                            correctAnswer: "E",
                            marks: 1
                        },
                    ],
                },

                // ================== PART 3: Work Experience for Veterinary Science Students ==================
                {
                    sectionNumber: 3,
                    title: "Part 3 - Work Experience for Veterinary Science Students",
                    instructions: "Questions 21-26: Choose the correct letter, A, B or C. Questions 27-30: Match the opinions to the modules.",
                    audioUrl: "",
                    questions: [
                        // Questions 21-26: Multiple Choice
                        {
                            questionNumber: 21,
                            questionType: "multiple-choice",
                            questionText: "What problem did both Diana and Tim have when arranging their work experience?",
                            options: ["A. making initial contact with suitable farms", "B. organising transport to and from the farm", "C. finding a placement for the required length of time"],
                            correctAnswer: "A",
                            marks: 1
                        },
                        {
                            questionNumber: 22,
                            questionType: "multiple-choice",
                            questionText: "Tim was pleased to be able to help",
                            options: ["A. a lamb that had a broken leg.", "B. a sheep that was having difficulty giving birth.", "C. a newly born lamb that was having trouble feeding."],
                            correctAnswer: "B",
                            marks: 1
                        },
                        {
                            questionNumber: 23,
                            questionType: "multiple-choice",
                            questionText: "Diana says the sheep on her farm",
                            options: ["A. were of various different varieties.", "B. were mainly reared for their meat.", "C. had better quality wool than sheep on the hills."],
                            correctAnswer: "B",
                            marks: 1
                        },
                        {
                            questionNumber: 24,
                            questionType: "multiple-choice",
                            questionText: "What did the students learn about adding supplements to chicken feed?",
                            options: ["A. These should only be given if specially needed.", "B. It is worth paying extra for the most effective ones.", "C. The amount given at one time should be limited."],
                            correctAnswer: "A",
                            marks: 1
                        },
                        {
                            questionNumber: 25,
                            questionType: "multiple-choice",
                            questionText: "What happened when Diana was working with dairy cows?",
                            options: ["A. She identified some cows incorrectly.", "B. She accidentally threw some milk away.", "C. She made a mistake when storing milk."],
                            correctAnswer: "C",
                            marks: 1
                        },
                        {
                            questionNumber: 26,
                            questionType: "multiple-choice",
                            questionText: "What did both farmers mention about vets and farming?",
                            options: ["A. Vets are failing to cope with some aspects of animal health.", "B. There needs to be a fundamental change in the training of vets.", "C. Some jobs could be done by the farmer rather than by a vet."],
                            correctAnswer: "C",
                            marks: 1
                        },
                        // Questions 27-30: Matching
                        {
                            questionNumber: 27,
                            questionType: "matching",
                            questionText: "Medical terminology - What opinion do the students give about this module?",
                            options: ["A. Tim found this easier than expected.", "B. Tim thought this was not very clearly organised.", "C. Diana may do some further study on this.", "D. They both found the reading required for this was difficult.", "E. Tim was shocked at something he learned on this module.", "F. They were both surprised how little is known about some aspects of this."],
                            correctAnswer: "A",
                            marks: 1
                        },
                        {
                            questionNumber: 28,
                            questionType: "matching",
                            questionText: "Diet and nutrition - What opinion do the students give about this module?",
                            options: ["A. Tim found this easier than expected.", "B. Tim thought this was not very clearly organised.", "C. Diana may do some further study on this.", "D. They both found the reading required for this was difficult.", "E. Tim was shocked at something he learned on this module.", "F. They were both surprised how little is known about some aspects of this."],
                            correctAnswer: "E",
                            marks: 1
                        },
                        {
                            questionNumber: 29,
                            questionType: "matching",
                            questionText: "Animal disease - What opinion do the students give about this module?",
                            options: ["A. Tim found this easier than expected.", "B. Tim thought this was not very clearly organised.", "C. Diana may do some further study on this.", "D. They both found the reading required for this was difficult.", "E. Tim was shocked at something he learned on this module.", "F. They were both surprised how little is known about some aspects of this."],
                            correctAnswer: "F",
                            marks: 1
                        },
                        {
                            questionNumber: 30,
                            questionType: "matching",
                            questionText: "Wildlife medication - What opinion do the students give about this module?",
                            options: ["A. Tim found this easier than expected.", "B. Tim thought this was not very clearly organised.", "C. Diana may do some further study on this.", "D. They both found the reading required for this was difficult.", "E. Tim was shocked at something he learned on this module.", "F. They were both surprised how little is known about some aspects of this."],
                            correctAnswer: "C",
                            marks: 1
                        },
                    ],
                },

                // ================== PART 4: Labyrinths ==================
                {
                    sectionNumber: 4,
                    title: "Part 4 - Labyrinths",
                    instructions: "Complete the notes below. Write ONE WORD ONLY for each answer.",
                    audioUrl: "",
                    questions: [
                        {
                            questionNumber: 31,
                            questionType: "note-completion",
                            questionText: "Labyrinths compared with mazes - Mazes are a type of _______",
                            correctAnswer: "puzzle",
                            marks: 1
                        },
                        {
                            questionNumber: 32,
                            questionType: "note-completion",
                            questionText: "_______ is needed to navigate through a maze",
                            correctAnswer: "logic",
                            marks: 1
                        },
                        {
                            questionNumber: 33,
                            questionType: "note-completion",
                            questionText: "The word 'maze' is derived from a word meaning a feeling of _______",
                            correctAnswer: "confusion",
                            marks: 1
                        },
                        {
                            questionNumber: 34,
                            questionType: "note-completion",
                            questionText: "Labyrinths have frequently been used in _______ and prayer",
                            correctAnswer: "meditation",
                            marks: 1
                        },
                        {
                            questionNumber: 35,
                            questionType: "note-completion",
                            questionText: "Ancient carvings on _______ have been found across many cultures",
                            correctAnswer: "stone",
                            marks: 1
                        },
                        {
                            questionNumber: 36,
                            questionType: "note-completion",
                            questionText: "Ancient Greeks used the symbol on _______",
                            correctAnswer: "coins",
                            marks: 1
                        },
                        {
                            questionNumber: 37,
                            questionType: "note-completion",
                            questionText: "The largest surviving example of a turf labyrinth once had a big _______ in the centre",
                            correctAnswer: "tree",
                            marks: 1
                        },
                        {
                            questionNumber: 38,
                            questionType: "note-completion",
                            questionText: "Walking a maze can reduce a person's _______ rate",
                            correctAnswer: "breathing",
                            marks: 1
                        },
                        {
                            questionNumber: 39,
                            questionType: "note-completion",
                            questionText: "Patients who can't walk can use 'finger labyrinths' made from _______",
                            correctAnswer: "paper",
                            marks: 1
                        },
                        {
                            questionNumber: 40,
                            questionType: "note-completion",
                            questionText: "Research has shown that Alzheimer's sufferers experience less _______",
                            correctAnswer: "anxiety",
                            marks: 1
                        },
                    ],
                },
            ],
        };

        const newSet = await QuestionSet.create(cambridgeListening1);
        console.log("\n✅ Cambridge IELTS Test 1 - Listening created successfully!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("Set ID:", newSet.setId);
        console.log("Set Number:", newSet.setNumber);
        console.log("Title:", newSet.title);
        console.log("Total Questions:", newSet.totalQuestions);
        console.log("Total Sections:", newSet.sections?.length);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        // Print all answers for verification
        console.log("\n📋 All 40 Answers:");
        console.log("Part 1: 1.litter 2.dogs 3.insects 4.butterflies 5.wall 6.island 7.boots 8.beginners 9.spoons 10.35");
        console.log("Part 2: 11.A 12.C 13.B 14.B 15.A 16.D 17.B 18.C 19.D 20.E");
        console.log("Part 3: 21.A 22.B 23.B 24.A 25.C 26.C 27.A 28.E 29.F 30.C");
        console.log("Part 4: 31.puzzle 32.logic 33.confusion 34.meditation 35.stone 36.coins 37.tree 38.breathing 39.paper 40.anxiety");

        await mongoose.disconnect();
        console.log("\nDisconnected from MongoDB. Done!");

    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

seedCambridgeListeningTest1();
