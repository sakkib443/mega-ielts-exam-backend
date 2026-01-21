import mongoose from "mongoose";
import { ListeningTest } from "../app/modules/listening/listening.model";
import { User } from "../app/modules/user/user.model";
import config from "../app/config";

const cambridge17Test1 = {
    testId: "LISTENING_CAMBRIDGE_17_1",
    testNumber: 17,
    title: "Cambridge IELTS 17 Academic Listening Test 1",
    description: "Official Cambridge IELTS 17 Academic Listening Test 1",
    source: "Cambridge IELTS Book 17 Test 1",
    difficulty: "medium",
    isActive: true,
    duration: 40,
    totalQuestions: 40,
    totalMarks: 40,
    sections: [
        {
            sectionNumber: 1,
            title: "Buckworth Conservation Group",
            context: "A telephone conversation about joining a conservation group",
            instructions: "Write ONE WORD AND/OR A NUMBER for each answer.",
            passage: `Regular activities

Beach
- making sure the beach does not have {1} on it
- no {2}

Nature reserve
- maintaining paths
- nesting boxes for birds installed
- next task is taking action to attract {3} to the place
- identifying types of {4}
- building a new {5}

Forthcoming events

Saturday
- meet at Dunsmore Beach car park
- walk across the sands and reach the {6}
- take a picnic
- wear appropriate {7}

Woodwork session
- suitable for {8} to participate in
- making {9} out of wood
- 17th, from 10 a.m. to 3 p.m.
- cost of session (no camping): £{10}`,
            questions: [
                { questionNumber: 1, questionType: "form-completion", questionText: "making sure the beach does not have ___ on it", correctAnswer: "litter", marks: 1 },
                { questionNumber: 2, questionType: "form-completion", questionText: "no ___", correctAnswer: "dogs", marks: 1 },
                { questionNumber: 3, questionType: "form-completion", questionText: "next task is taking action to attract ___ to the place", correctAnswer: "insects", marks: 1 },
                { questionNumber: 4, questionType: "form-completion", questionText: "identifying types of ___", correctAnswer: "butterflies", marks: 1 },
                { questionNumber: 5, questionType: "form-completion", questionText: "building a new ___", correctAnswer: "wall", marks: 1 },
                { questionNumber: 6, questionType: "form-completion", questionText: "walk across the sands and reach the ___", correctAnswer: "island", marks: 1 },
                { questionNumber: 7, questionType: "form-completion", questionText: "wear appropriate ___", correctAnswer: "boots", marks: 1 },
                { questionNumber: 8, questionType: "form-completion", questionText: "suitable for ___ to participate in", correctAnswer: "beginners", marks: 1 },
                { questionNumber: 9, questionType: "form-completion", questionText: "making ___ out of wood", correctAnswer: "spoons", marks: 1 },
                { questionNumber: 10, questionType: "form-completion", questionText: "cost of session (no camping): £___", correctAnswer: "35", marks: 1 }
            ]
        },
        {
            sectionNumber: 2,
            title: "Boat trip round Tasmania",
            context: "A tour guide giving information about a boat trip",
            instructions: "Questions 11-14: Choose the correct letter, A, B or C. Questions 15-20: Choose TWO letters, A-E.",
            questions: [
                { questionNumber: 11, questionType: "multiple-choice", questionText: "What is the maximum number of people who can stand on each side of the boat?", options: ["9", "15", "18"], correctAnswer: "A", marks: 1 },
                { questionNumber: 12, questionType: "multiple-choice", questionText: "What colour are the new boats?", options: ["dark red", "jet black", "light green"], correctAnswer: "C", marks: 1 },
                { questionNumber: 13, questionType: "multiple-choice", questionText: "Which lunchbox is suitable for someone who doesn't eat meat or fish?", options: ["Lunchbox 1", "Lunchbox 2", "Lunchbox 3"], correctAnswer: "B", marks: 1 },
                { questionNumber: 14, questionType: "multiple-choice", questionText: "What should passengers do with their litter?", options: ["take it home with them", "hand it to a member of staff", "put it in the bins on the boat"], correctAnswer: "B", marks: 1 },
                { questionNumber: 15, questionType: "multiple-choice", questionText: "Which TWO features of the lighthouse does Lou mention?", options: ["why it was built", "who built it", "how long it took to build", "who staffed it", "what it was built with"], correctAnswer: "A", marks: 1 },
                { questionNumber: 16, questionType: "multiple-choice", questionText: "Which TWO features of the lighthouse does Lou mention?", options: ["why it was built", "who built it", "how long it took to build", "who staffed it", "what it was built with"], correctAnswer: "D", marks: 1 },
                { questionNumber: 17, questionType: "multiple-choice", questionText: "Which TWO types of creature might come close to the boat?", options: ["sea eagles", "fur seals", "dolphins", "whales", "penguins"], correctAnswer: "B", marks: 1 },
                { questionNumber: 18, questionType: "multiple-choice", questionText: "Which TWO types of creature might come close to the boat?", options: ["sea eagles", "fur seals", "dolphins", "whales", "penguins"], correctAnswer: "C", marks: 1 },
                { questionNumber: 19, questionType: "multiple-choice", questionText: "Which TWO points does the guide make about the caves?", options: ["only larger boats can go into them", "their entrances are often blocked", "it is too dangerous for individuals to go near them", "someone will explain what is inside them", "they cannot be reached on foot"], correctAnswer: "D", marks: 1 },
                { questionNumber: 20, questionType: "multiple-choice", questionText: "Which TWO points does the guide make about the caves?", options: ["only larger boats can go into them", "their entrances are often blocked", "it is too dangerous for individuals to go near them", "someone will explain what is inside them", "they cannot be reached on foot"], correctAnswer: "E", marks: 1 }
            ]
        },
        {
            sectionNumber: 3,
            title: "Work experience for veterinary science students",
            context: "Two students discussing their farm work experience",
            instructions: "Questions 21-26: Choose the correct letter, A, B or C. Questions 27-30: Choose FOUR answers from the box and write the correct letter, A-F, next to questions.",
            questions: [
                { questionNumber: 21, questionType: "multiple-choice", questionText: "What problem did both Diana and Tim have when arranging their work experience?", options: ["make initial contact with suitable farms", "organising transport to and from the farm", "finding a placement for the required length of time"], correctAnswer: "A", marks: 1 },
                { questionNumber: 22, questionType: "multiple-choice", questionText: "Tim was pleased to be able to help", options: ["a lamb that had a broken leg.", "a sheep that was having difficult giving birth.", "a newly born lamb that was having trouble feeding."], correctAnswer: "B", marks: 1 },
                { questionNumber: 23, questionType: "multiple-choice", questionText: "Diana says the sheep on her farm", options: ["were of various different varieties.", "were mainly reared for their meat.", "had better quality wool than sheep on the hills."], correctAnswer: "B", marks: 1 },
                { questionNumber: 24, questionType: "multiple-choice", questionText: "What did the students learn about adding supplements to chicken feed?", options: ["These should only be given if specially needed.", "It is worth paying extra for the most effective ones.", "The amount given at one time should be limited."], correctAnswer: "A", marks: 1 },
                { questionNumber: 25, questionType: "multiple-choice", questionText: "What happened when Diana was working with dairy cows?", options: ["She identified some cows incorrectly.", "She accidentally threw some milk away.", "She made a mistake when storing milk."], correctAnswer: "B", marks: 1 },
                { questionNumber: 26, questionType: "multiple-choice", questionText: "What did both farmers mention about vets and farming?", options: ["Vets are failing to cope with some aspects of animal health.", "There needs to be a fundamental change in the training of vets.", "Some jobs could be done by the farmer rather than by a vet."], correctAnswer: "C", marks: 1 },
                {
                    questionNumber: 27,
                    questionType: "matching",
                    questionText: "Medical terminology",
                    options: [
                        "Tim found this easier than expected.",
                        "Tim thought this was not very clearly organised.",
                        "Diana may do some further study on this.",
                        "They both found the reading required for this was difficult.",
                        "Tim was shocked at something he learned on this module.",
                        "They were both surprised how little is known about some aspects of this."
                    ],
                    correctAnswer: "A",
                    marks: 1
                },
                { questionNumber: 28, questionType: "matching", questionText: "Diet and nutrition", options: ["A", "B", "C", "D", "E", "F"], correctAnswer: "E", marks: 1 },
                { questionNumber: 29, questionType: "matching", questionText: "Animal disease", options: ["A", "B", "C", "D", "E", "F"], correctAnswer: "F", marks: 1 },
                { questionNumber: 30, questionType: "matching", questionText: "Wildlife medication", options: ["A", "B", "C", "D", "E", "F"], correctAnswer: "C", marks: 1 }
            ]
        },
        {
            sectionNumber: 4,
            title: "Labyrinths",
            context: "A lecture about labyrinths and their history",
            instructions: "Write ONE WORD ONLY for each answer.",
            passage: `Definition
- a winding spiral path leading to a central area

Labyrinths compared with mazes
- Mazes are a type of {31}
- {32} is needed to navigate through a maze
- the word ‘maze’ is derived from a word meaning a feeling of {33}

Labyrinths represent a journey through life
- they have frequently been used in {34} and prayer

Early examples of the labyrinth spiral
- Ancient carvings on {35} have been found across many cultures
- The Pima, a Native American tribe, wove the symbol on baskets
- Ancient Greeks used the symbol on {36}

Walking labyrinths
- The largest surviving example of a turf labyrinth once had a big {37} at its centre

Labyrinths nowadays
- Believed to have a beneficial impact on mental and physical health, e.g., walking a maze can reduce a person’s {38} rate
- Used in medical and health and fitness settings and also prisons
- Popular with patients, visitors and staff in hospitals
- patients who can't walk can use ‘finger labyrinths’ made from {39}
- research has shown that Alzheimer’s sufferers experience less {40}`,
            questions: [
                { questionNumber: 31, questionType: "note-completion", questionText: "Mazes are a type of ___", correctAnswer: "puzzle", marks: 1 },
                { questionNumber: 32, questionType: "note-completion", questionText: "___ is needed to navigate through a maze", correctAnswer: "logic", marks: 1 },
                { questionNumber: 33, questionType: "note-completion", questionText: "the word ‘maze’ is derived from a word meaning a feeling of ___", correctAnswer: "confusion", marks: 1 },
                { questionNumber: 34, questionType: "note-completion", questionText: "they have frequently been used in ___ and prayer", correctAnswer: "meditation", marks: 1 },
                { questionNumber: 35, questionType: "note-completion", questionText: "Ancient carvings on ___ have been found across many cultures", correctAnswer: "stone", marks: 1 },
                { questionNumber: 36, questionType: "note-completion", questionText: "Ancient Greeks used the symbol on ___", correctAnswer: "coins", marks: 1 },
                { questionNumber: 37, questionType: "note-completion", questionText: "The largest surviving example of a turf labyrinth once had a big ___ at its centre", correctAnswer: "tree", marks: 1 },
                { questionNumber: 38, questionType: "note-completion", questionText: "walking a maze can reduce a person’s ___ rate", correctAnswer: "breathing", marks: 1 },
                { questionNumber: 39, questionType: "note-completion", questionText: "patients who can't walk can use ‘finger labyrinths’ made from ___", correctAnswer: "paper", marks: 1 },
                { questionNumber: 40, questionType: "note-completion", questionText: "research has shown that Alzheimer’s sufferers experience less ___", correctAnswer: "anxiety", marks: 1 }
            ]
        }
    ]
};

async function seedCambridge17() {
    try {
        await mongoose.connect(config.database_url as string);
        const existing = await ListeningTest.findOne({ testId: cambridge17Test1.testId });
        if (existing) {
            await ListeningTest.findByIdAndUpdate(existing._id, cambridge17Test1);
            console.log("Cambridge 17 Test 1 already exists. Updated successfully!");
        } else {
            const admin = await User.findOne({ role: "admin" });
            if (!admin) { process.exit(1); }
            await ListeningTest.create({ ...cambridge17Test1, createdBy: admin._id });
            console.log("Cambridge IELTS 17 Test 1 created successfully!");
        }
        await mongoose.disconnect();
    } catch (error) {
        process.exit(1);
    }
}
seedCambridge17();
