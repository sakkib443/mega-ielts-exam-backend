import mongoose from 'mongoose';
import { ListeningTest } from '../src/app/modules/listening/listening.model';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.DATABASE_URL || "mongodb://localhost:27017/ielts";

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to database');

        const testData: any = {
            testId: "LISTENING_CB15_T1",
            testNumber: 3,
            title: "Listening Set 03 - CB15",
            description: "Cambridge IELTS 15 Academic Listening Test 1",
            duration: 40,
            difficulty: "medium",
            totalQuestions: 40,
            totalMarks: 40,
            isActive: true,
            createdBy: new mongoose.Types.ObjectId("65b76fc88f5c9e29a8f12345"),
            sections: [
                {
                    sectionNumber: 1,
                    title: "Part 1: Bankside Recruitment Agency",
                    instructions: "Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
                    passage: `**Bankside Recruitment Agency**\n\n- Address of agency: 497 Eastside, Docklands\n- Name of agent: Becky {1}\n- Phone number: 07866 510333\n- Best to call her in the {2}\n\n**Typical jobs**\n- Clerical and admin roles, mainly in the finance industry\n- Must have good {3} skills\n- Jobs are usually for at least one {4}\n- Pay is usually £{5} per hour\n\n**Registration process**\n- Wear a {6} to the interview\n- Must bring your {7} to the interview\n- They will ask questions about each applicant’s {8}\n\n**Advantages of using an agency**\n- The {9} you receive at interview will benefit you\n- Will get access to vacancies which are not advertised\n- Less {10} is involved in applying for jobs`,
                    questions: [
                        { questionNumber: 1, questionType: "note-completion", correctAnswer: "Jamieson", blockType: "question" },
                        { questionNumber: 2, questionType: "note-completion", correctAnswer: "afternoon", blockType: "question" },
                        { questionNumber: 3, questionType: "note-completion", correctAnswer: "communication", blockType: "question" },
                        { questionNumber: 4, questionType: "note-completion", correctAnswer: "week", blockType: "question" },
                        { questionNumber: 5, questionType: "note-completion", correctAnswer: "10", blockType: "question" },
                        { questionNumber: 6, questionType: "note-completion", correctAnswer: "suit", blockType: "question" },
                        { questionNumber: 7, questionType: "note-completion", correctAnswer: "passport", blockType: "question" },
                        { questionNumber: 8, questionType: "note-completion", correctAnswer: "personality", blockType: "question" },
                        { questionNumber: 9, questionType: "note-completion", correctAnswer: "feedback", blockType: "question" },
                        { questionNumber: 10, questionType: "note-completion", correctAnswer: "time", blockType: "question" }
                    ]
                },
                {
                    sectionNumber: 2,
                    title: "Part 2: Matthews Island Holidays",
                    instructions: "Questions 11-14: Choose the correct letter, A, B or C. Questions 15-20: Complete the table below. Write ONE WORD AND/OR A NUMBER for each answer.",
                    passage: `**Timetable for Isle of Man holiday**\n\n| Day | Activity | Notes |\n|---|---|---|\n| Day 1 | Arrive | Hotel dining room has view of the {15} |\n| Day 2 | Coach to Peel | Visit Tynwald exhibition - founded in {16} |\n| Day 3 | Snaefell Mountain Railway | 8-kilometre ride to the {17} of Snaefell |\n| Day 4 | Free | Company provides a {18} for local transport and heritage sites |\n| Day 5 | Steam railway | Ride on the {19} railway from Douglas to Port Erin |\n| | Castletown | Former {20} of the Isle of Man |`,
                    questions: [
                        { questionNumber: 11, questionType: "multiple-choice", questionText: "According to the speaker, the company", options: ["has been in business for longer than most of its competitors.", "arranges holidays to more destinations than its competitors.", "has more customers than its competitors."], correctAnswer: "A", blockType: "question" },
                        { questionNumber: 12, questionType: "multiple-choice", questionText: "Where can customers meet the tour manager before travelling to the Isle of Man?", options: ["Liverpool", "Heysham", "Luton"], correctAnswer: "B", blockType: "question" },
                        { questionNumber: 13, questionType: "multiple-choice", questionText: "How many lunches are included in the price of the holiday?", options: ["three", "four", "five"], correctAnswer: "A", blockType: "question" },
                        { questionNumber: 14, questionType: "multiple-choice", questionText: "Customers have to pay extra for", options: ["guaranteeing themselves a larger room.", "booking at short notice.", "transferring to another date."], correctAnswer: "C", blockType: "question" },
                        { questionNumber: 15, questionType: "note-completion", correctAnswer: "river", blockType: "question" },
                        { questionNumber: 16, questionType: "note-completion", correctAnswer: "1422", blockType: "question" },
                        { questionNumber: 17, questionType: "note-completion", correctAnswer: "top", blockType: "question" },
                        { questionNumber: 18, questionType: "note-completion", correctAnswer: "pass", blockType: "question" },
                        { questionNumber: 19, questionType: "note-completion", correctAnswer: "steam", blockType: "question" },
                        { questionNumber: 20, questionType: "note-completion", correctAnswer: "capital", blockType: "question" }
                    ]
                },
                {
                    sectionNumber: 3,
                    title: "Part 3: Personality Traits and Birth Order",
                    instructions: "Questions 21-26: Write the correct letter, A-H, next to Questions 21-26. Questions 27-30: Choose the correct letter, A, B or C.",
                    passage: `**Personality traits**\nA is affectionate\nB is good at relating to others\nC is independent\nD is attention-seeking\nE is selfish\nF is creative\nG is organised\nH is studious\n\n**Position in the family**\n21 the eldest child: {21}\n22 a middle child: {22}\n23 the youngest child: {23}\n24 a twin: {24}\n25 an only child: {25}\n26 a child with much older siblings: {26}`,
                    questions: [
                        { questionNumber: 21, questionType: "matching", questionText: "the eldest child", correctAnswer: "G", blockType: "question" },
                        { questionNumber: 22, questionType: "matching", questionText: "a middle child", correctAnswer: "B", blockType: "question" },
                        { questionNumber: 23, questionType: "matching", questionText: "the youngest child", correctAnswer: "E", blockType: "question" },
                        { questionNumber: 24, questionType: "matching", questionText: "a twin", correctAnswer: "F", blockType: "question" },
                        { questionNumber: 25, questionType: "matching", questionText: "an only child", correctAnswer: "D", blockType: "question" },
                        { questionNumber: 26, questionType: "matching", questionText: "a child with much older siblings", correctAnswer: "C", blockType: "question" },
                        { questionNumber: 27, questionType: "multiple-choice", questionText: "What do the speakers say about the evidence relating to birth order and academic success?", options: ["There is conflicting evidence about whether oldest children perform best in intelligence tests.", "The evidence for academic success is not as strong as that for personality.", "The studies on twins and academic achievement are inconclusive."], correctAnswer: "A", blockType: "question" },
                        { questionNumber: 28, questionType: "multiple-choice", questionText: "What did the Loughborough University study on twins reveal?", options: ["The second-born twin often performs better than the first-born.", "There are no significant differences in academic ability between twins.", "Twins often have different academic strengths."], correctAnswer: "B", blockType: "question" },
                        { questionNumber: 29, questionType: "multiple-choice", questionText: "The speakers agree that the most surprising finding of previous research is that", options: ["the youngest child is often the most rebellious.", "a middle child can be very competitive.", "a child with much older siblings can be very responsible."], correctAnswer: "C", blockType: "question" },
                        { questionNumber: 30, questionType: "multiple-choice", questionText: "What do the speakers conclude about the research into birth order?", options: ["It is difficult to isolate the effects of birth order from other factors.", "The findings are still open to interpretation.", "There is a need for more longitudinal studies."], correctAnswer: "A", blockType: "question" }
                    ]
                },
                {
                    sectionNumber: 4,
                    title: "Part 4: The Eucalyptus Tree in Australia",
                    instructions: "Complete the notes below. Write ONE WORD ONLY for each answer.",
                    passage: `**The Eucalyptus Tree in Australia**\n\n**Importance**\n- It provides {31} and food for a wide range of species.\n- Its leaves provide {32} which is used to make a disinfectant.\n\n**Reasons for present decline in numbers**\n**A) Diseases**\n- (i) 'Mundulla Yellows'\n  - Cause – lime used for making {33} was absorbed.\n  - trees were unable to take in necessary iron through their roots.\n- (ii) 'Bell-miner Associated Die-back'\n  - Cause – {34} feed on eucalyptus leaves.\n  - they secrete a substance containing sugar.\n  - bell-miner birds are attracted by this and keep away other species.\n\n**B) Bushfires**\nWilliam Jackson’s theory:\n- High-frequency bushfires have impact on vegetation, resulting in the growth of {35}.\n- Mid-frequency bushfires result in the growth of eucalyptus forests, because they:\n  - make more {36} available to the trees.\n  - maintain the quality of the {37}.\n- Low-frequency bushfires result in the growth of ‘{38} rainforest’, which is:\n  - a {39} ecosystem.\n  - an ideal environment for the {40} of the bell-miner.`,
                    questions: [
                        { questionNumber: 31, questionType: "note-completion", correctAnswer: "shelter", blockType: "question" },
                        { questionNumber: 32, questionType: "note-completion", correctAnswer: "oil", blockType: "question" },
                        { questionNumber: 33, questionType: "note-completion", correctAnswer: "roads", blockType: "question" },
                        { questionNumber: 34, questionType: "note-completion", correctAnswer: "insects", blockType: "question" },
                        { questionNumber: 35, questionType: "note-completion", correctAnswer: "grass", blockType: "question" },
                        { questionNumber: 36, questionType: "note-completion", correctAnswer: "water", blockType: "question" },
                        { questionNumber: 37, questionType: "note-completion", correctAnswer: "soil", blockType: "question" },
                        { questionNumber: 38, questionType: "note-completion", correctAnswer: "dry", blockType: "question" },
                        { questionNumber: 39, questionType: "note-completion", correctAnswer: "simple", blockType: "question" },
                        { questionNumber: 40, questionType: "note-completion", correctAnswer: "survival", blockType: "question" }
                    ]
                }
            ]
        };

        const User = mongoose.model('User', new mongoose.Schema({ role: String }));
        const admin: any = await User.findOne({ role: 'admin' });
        if (admin) {
            testData.createdBy = admin._id;
        }

        const existing = await ListeningTest.findOne({ testNumber: 3 });
        if (existing) {
            await ListeningTest.deleteOne({ testNumber: 3 });
            console.log('Removed existing Test 3');
        }

        await ListeningTest.create(testData);
        console.log('Successfully seeded Listening Test 3 with EXACT image match for Part 2.');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seed();
