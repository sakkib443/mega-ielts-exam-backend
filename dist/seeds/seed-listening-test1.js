"use strict";
/**
 * Seed Script: Cambridge IELTS Test 1 - Listening Questions
 *
 * This script adds a complete IELTS Listening test with 4 parts (40 questions)
 * to the database.
 *
 * Run with: npx ts-node src/seeds/seed-listening-test1.ts
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
const questionSet_model_1 = require("../app/modules/questionSet/questionSet.model");
// Load environment variables
dotenv.config();
// MongoDB connection
const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/ielts';
function seedListeningTest1() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to MongoDB
            console.log('🔌 Connecting to MongoDB...');
            yield mongoose_1.default.connect(MONGODB_URI);
            console.log('✅ Connected to MongoDB');
            // Check if this set already exists
            const existingSet = yield questionSet_model_1.QuestionSet.findOne({
                setType: 'LISTENING',
                title: { $regex: /Cambridge.*Test.*1.*Listening/i }
            });
            if (existingSet) {
                console.log('⚠️ Listening Test 1 already exists in database');
                return {
                    success: true,
                    setId: existingSet.setId,
                    message: 'Listening set already exists'
                };
            }
            // Generate new set ID
            const { setId, setNumber } = yield (0, questionSet_model_1.generateSetId)('LISTENING');
            console.log(`🎧 Creating Listening Set: ${setId}`);
            // Create admin user reference
            const adminId = new mongoose_1.default.Types.ObjectId('507f1f77bcf86cd799439011');
            // Listening Question Set Data
            const listeningSet = new questionSet_model_1.QuestionSet({
                setId,
                setType: 'LISTENING',
                setNumber,
                title: 'Cambridge IELTS Test 1 - Listening',
                description: 'Cambridge IELTS Academic Listening Test with 4 parts covering various question types including note completion, multiple choice, matching, and table completion.',
                // Main audio URL - to be updated later
                mainAudioUrl: '',
                audioDuration: 2400,
                // Sections (4 parts)
                sections: [
                    // ============================================
                    // PART 1: Bankside Recruitment Agency (Questions 1-10)
                    // ============================================
                    {
                        sectionNumber: 1,
                        title: 'Bankside Recruitment Agency',
                        instructions: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
                        audioUrl: '',
                        passage: `Bankside Recruitment Agency

• Address of agency: 497 Eastside, Docklands
• Name of agent: Becky __________ (1)
• Phone number: 07866 510333
• Best to call her in the __________ (2)

Typical jobs
• Clerical and admin roles, mainly in the finance industry
• Must have good __________ (3) skills
• Jobs are usually for at least one __________ (4)
• Pay is usually __________ (5) £ per hour

Registration process
• Wear a __________ (6) to the interview
• Must bring your __________ (7) to the interview
• They will ask questions about each applicant's __________ (8)

Advantages of using an agency
• The __________ (9) you receive at interview will benefit you
• Will get access to vacancies which are not advertised
• Less __________ (10) is involved in applying for jobs`,
                        questions: [
                            {
                                questionNumber: 1,
                                questionType: 'note-completion',
                                questionText: 'Name of agent: Becky __________',
                                correctAnswer: 'Jamieson',
                                marks: 1
                            },
                            {
                                questionNumber: 2,
                                questionType: 'note-completion',
                                questionText: 'Best to call her in the __________',
                                correctAnswer: 'afternoon',
                                marks: 1
                            },
                            {
                                questionNumber: 3,
                                questionType: 'note-completion',
                                questionText: 'Must have good __________ skills',
                                correctAnswer: 'communication',
                                marks: 1
                            },
                            {
                                questionNumber: 4,
                                questionType: 'note-completion',
                                questionText: 'Jobs are usually for at least one __________',
                                correctAnswer: 'week',
                                marks: 1
                            },
                            {
                                questionNumber: 5,
                                questionType: 'note-completion',
                                questionText: 'Pay is usually __________ £ per hour',
                                correctAnswer: ['10', 'ten'],
                                marks: 1
                            },
                            {
                                questionNumber: 6,
                                questionType: 'note-completion',
                                questionText: 'Wear a __________ to the interview',
                                correctAnswer: 'suit',
                                marks: 1
                            },
                            {
                                questionNumber: 7,
                                questionType: 'note-completion',
                                questionText: 'Must bring your __________ to the interview',
                                correctAnswer: 'passport',
                                marks: 1
                            },
                            {
                                questionNumber: 8,
                                questionType: 'note-completion',
                                questionText: "They will ask questions about each applicant's __________",
                                correctAnswer: 'personality',
                                marks: 1
                            },
                            {
                                questionNumber: 9,
                                questionType: 'note-completion',
                                questionText: 'The __________ you receive at interview will benefit you',
                                correctAnswer: 'feedback',
                                marks: 1
                            },
                            {
                                questionNumber: 10,
                                questionType: 'note-completion',
                                questionText: 'Less __________ is involved in applying for jobs',
                                correctAnswer: 'time',
                                marks: 1
                            }
                        ]
                    },
                    // ============================================
                    // PART 2: Matthews Island Holidays (Questions 11-20)
                    // ============================================
                    {
                        sectionNumber: 2,
                        title: 'Matthews Island Holidays',
                        instructions: 'Questions 11-14: Choose the correct letter, A, B or C.\nQuestions 15-20: Complete the table below. Write ONE WORD AND/OR A NUMBER for each answer.',
                        audioUrl: '',
                        passage: `Timetable for Isle of Man holiday

| Day | Activity | Notes |
|-----|----------|-------|
| Day 1 | Arrive | Introduction by manager. Hotel dining room has view of the __________ (15) |
| Day 2 | Tynwald Exhibition and Peel | Tynwald may have been founded in __________ (16) not 979. |
| Day 3 | Trip to Snaefell | Travel along promenade in a tram; train to Laxey; train to the __________ (17) of Snaefell |
| Day 4 | Free day | Company provides a __________ (18) for local transport and heritage sites. |
| Day 5 | Take the __________ (19) railway train from Douglas to Port Erin | Free time, then coach to Castletown – former __________ (20) has old castle. |
| Day 6 | Leave | Leave the island by ferry or plane |`,
                        questions: [
                            {
                                questionNumber: 11,
                                questionType: 'multiple-choice',
                                questionText: 'According to the speaker, the company',
                                options: [
                                    'A. has been in business for longer than most of its competitors.',
                                    'B. arranges holidays to more destinations than its competitors.',
                                    'C. has more customers than its competitors.'
                                ],
                                correctAnswer: 'A',
                                marks: 1
                            },
                            {
                                questionNumber: 12,
                                questionType: 'multiple-choice',
                                questionText: 'Where can customers meet the tour manager before travelling to the Isle of Man?',
                                options: [
                                    'A. Liverpool',
                                    'B. Heysham',
                                    'C. Luton'
                                ],
                                correctAnswer: 'B',
                                marks: 1
                            },
                            {
                                questionNumber: 13,
                                questionType: 'multiple-choice',
                                questionText: 'How many lunches are included in the price of the holiday?',
                                options: [
                                    'A. three',
                                    'B. four',
                                    'C. five'
                                ],
                                correctAnswer: 'A',
                                marks: 1
                            },
                            {
                                questionNumber: 14,
                                questionType: 'multiple-choice',
                                questionText: 'Customers have to pay extra for',
                                options: [
                                    'A. guaranteeing themselves a larger room.',
                                    'B. booking at short notice.',
                                    'C. transferring to another date.'
                                ],
                                correctAnswer: 'C',
                                marks: 1
                            },
                            {
                                questionNumber: 15,
                                questionType: 'note-completion',
                                questionText: 'Hotel dining room has view of the __________',
                                correctAnswer: 'river',
                                marks: 1
                            },
                            {
                                questionNumber: 16,
                                questionType: 'note-completion',
                                questionText: 'Tynwald may have been founded in __________ not 979',
                                correctAnswer: '1422',
                                marks: 1
                            },
                            {
                                questionNumber: 17,
                                questionType: 'note-completion',
                                questionText: 'Train to the __________ of Snaefell',
                                correctAnswer: 'top',
                                marks: 1
                            },
                            {
                                questionNumber: 18,
                                questionType: 'note-completion',
                                questionText: 'Company provides a __________ for local transport and heritage sites',
                                correctAnswer: 'pass',
                                marks: 1
                            },
                            {
                                questionNumber: 19,
                                questionType: 'note-completion',
                                questionText: 'Take the __________ railway train from Douglas to Port Erin',
                                correctAnswer: 'steam',
                                marks: 1
                            },
                            {
                                questionNumber: 20,
                                questionType: 'note-completion',
                                questionText: 'Coach to Castletown – former __________ has old castle',
                                correctAnswer: 'capital',
                                marks: 1
                            }
                        ]
                    },
                    // ============================================
                    // PART 3: Birth Order Research (Questions 21-30)
                    // ============================================
                    {
                        sectionNumber: 3,
                        title: 'Birth Order and Personality Research',
                        instructions: `Questions 21-26: What did findings of previous research claim about the personality traits a child is likely to have because of their position in the family? Choose SIX answers from the box and write the correct letter, A–H, next to Questions 21–26.

Personality Traits:
A. outgoing
B. selfish
C. independent
D. attention-seeking
E. introverted
F. co-operative
G. caring
H. competitive

Questions 27-28: Choose the correct letter, A, B or C.
Questions 29-30: Choose TWO letters, A-E.`,
                        audioUrl: '',
                        passage: `Position in family:
21. the eldest child __________
22. a middle child __________
23. the youngest child __________
24. a twin __________
25. an only child __________
26. a child with much older siblings __________`,
                        questions: [
                            {
                                questionNumber: 21,
                                questionType: 'matching',
                                questionText: 'The eldest child',
                                options: ['A. outgoing', 'B. selfish', 'C. independent', 'D. attention-seeking', 'E. introverted', 'F. co-operative', 'G. caring', 'H. competitive'],
                                correctAnswer: 'G',
                                marks: 1
                            },
                            {
                                questionNumber: 22,
                                questionType: 'matching',
                                questionText: 'A middle child',
                                options: ['A. outgoing', 'B. selfish', 'C. independent', 'D. attention-seeking', 'E. introverted', 'F. co-operative', 'G. caring', 'H. competitive'],
                                correctAnswer: 'F',
                                marks: 1
                            },
                            {
                                questionNumber: 23,
                                questionType: 'matching',
                                questionText: 'The youngest child',
                                options: ['A. outgoing', 'B. selfish', 'C. independent', 'D. attention-seeking', 'E. introverted', 'F. co-operative', 'G. caring', 'H. competitive'],
                                correctAnswer: 'A',
                                marks: 1
                            },
                            {
                                questionNumber: 24,
                                questionType: 'matching',
                                questionText: 'A twin',
                                options: ['A. outgoing', 'B. selfish', 'C. independent', 'D. attention-seeking', 'E. introverted', 'F. co-operative', 'G. caring', 'H. competitive'],
                                correctAnswer: 'E',
                                marks: 1
                            },
                            {
                                questionNumber: 25,
                                questionType: 'matching',
                                questionText: 'An only child',
                                options: ['A. outgoing', 'B. selfish', 'C. independent', 'D. attention-seeking', 'E. introverted', 'F. co-operative', 'G. caring', 'H. competitive'],
                                correctAnswer: 'B',
                                marks: 1
                            },
                            {
                                questionNumber: 26,
                                questionType: 'matching',
                                questionText: 'A child with much older siblings',
                                options: ['A. outgoing', 'B. selfish', 'C. independent', 'D. attention-seeking', 'E. introverted', 'F. co-operative', 'G. caring', 'H. competitive'],
                                correctAnswer: 'C',
                                marks: 1
                            },
                            {
                                questionNumber: 27,
                                questionType: 'multiple-choice',
                                questionText: 'What do the speakers say about the evidence relating to birth order and academic success?',
                                options: [
                                    'A. There is conflicting evidence about whether oldest children perform best in intelligence tests.',
                                    'B. There is little doubt that birth order has less influence on academic achievement than socio-economic status.',
                                    'C. Some studies have neglected to include important factors such as family size.'
                                ],
                                correctAnswer: 'C',
                                marks: 1
                            },
                            {
                                questionNumber: 28,
                                questionType: 'multiple-choice',
                                questionText: "What does Ruth think is surprising about the difference in oldest children's academic performance?",
                                options: [
                                    'A. It is mainly thanks to their roles as teachers for their younger siblings.',
                                    'B. The advantages they have only lead to a slightly higher level of achievement.',
                                    'C. The extra parental attention they receive at a young age makes little difference.'
                                ],
                                correctAnswer: 'A',
                                marks: 1
                            },
                            {
                                questionNumber: 29,
                                questionType: 'multiple-choice',
                                questionText: 'Which TWO experiences of sibling rivalry do the speakers agree has been valuable for them? (First answer)',
                                options: [
                                    'A. learning to share',
                                    'B. learning to stand up for oneself',
                                    'C. learning to be a good loser',
                                    'D. learning to be tolerant',
                                    'E. learning to say sorry'
                                ],
                                correctAnswer: 'B',
                                marks: 1
                            },
                            {
                                questionNumber: 30,
                                questionType: 'multiple-choice',
                                questionText: 'Which TWO experiences of sibling rivalry do the speakers agree has been valuable for them? (Second answer)',
                                options: [
                                    'A. learning to share',
                                    'B. learning to stand up for oneself',
                                    'C. learning to be a good loser',
                                    'D. learning to be tolerant',
                                    'E. learning to say sorry'
                                ],
                                correctAnswer: 'D',
                                marks: 1
                            }
                        ]
                    },
                    // ============================================
                    // PART 4: The Eucalyptus Tree in Australia (Questions 31-40)
                    // ============================================
                    {
                        sectionNumber: 4,
                        title: 'The Eucalyptus Tree in Australia',
                        instructions: 'Complete the notes below. Write ONE WORD ONLY for each answer.',
                        audioUrl: '',
                        passage: `The Eucalyptus Tree in Australia

Importance
• it provides __________ (31) and food for a wide range of species
• its leaves provide __________ (32) which is used to make a disinfectant

Reasons for present decline in number

A) Diseases
(i) 'Mundulla Yellows'
• Cause – lime used for making __________ (33) was absorbed
– trees were unable to take in necessary iron through their roots

(ii) 'Bell-miner Associated Die-back'
• Cause – __________ (34) feed on eucalyptus leaves
– they secrete a substance containing sugar
– bell-miner birds are attracted by this and keep away other species

B) Bushfires
William Jackson's theory:
• high-frequency bushfires have impact on vegetation, resulting in the growth of __________ (35)
• mid-frequency bushfires result in the growth of eucalyptus forests, because they:
– make more __________ (36) available to the trees
– maintain the quality of the __________ (37)
• low-frequency bushfires result in the growth of __________ (38) 'rainforest', which is:
– a __________ (39) ecosystem
– an ideal environment for the __________ (40) of the bell-miner`,
                        questions: [
                            {
                                questionNumber: 31,
                                questionType: 'note-completion',
                                questionText: 'It provides __________ and food for a wide range of species',
                                correctAnswer: 'shelter',
                                marks: 1
                            },
                            {
                                questionNumber: 32,
                                questionType: 'note-completion',
                                questionText: 'Its leaves provide __________ which is used to make a disinfectant',
                                correctAnswer: 'oil',
                                marks: 1
                            },
                            {
                                questionNumber: 33,
                                questionType: 'note-completion',
                                questionText: 'Lime used for making __________ was absorbed',
                                correctAnswer: 'roads',
                                marks: 1
                            },
                            {
                                questionNumber: 34,
                                questionType: 'note-completion',
                                questionText: '__________ feed on eucalyptus leaves',
                                correctAnswer: 'insects',
                                marks: 1
                            },
                            {
                                questionNumber: 35,
                                questionType: 'note-completion',
                                questionText: 'High-frequency bushfires have impact on vegetation, resulting in the growth of __________',
                                correctAnswer: ['grass', 'grasses'],
                                marks: 1
                            },
                            {
                                questionNumber: 36,
                                questionType: 'note-completion',
                                questionText: 'Mid-frequency bushfires make more __________ available to the trees',
                                correctAnswer: 'water',
                                marks: 1
                            },
                            {
                                questionNumber: 37,
                                questionType: 'note-completion',
                                questionText: 'Mid-frequency bushfires maintain the quality of the __________',
                                correctAnswer: 'soil',
                                marks: 1
                            },
                            {
                                questionNumber: 38,
                                questionType: 'note-completion',
                                questionText: "Low-frequency bushfires result in the growth of __________ 'rainforest'",
                                correctAnswer: 'dry',
                                marks: 1
                            },
                            {
                                questionNumber: 39,
                                questionType: 'note-completion',
                                questionText: 'A __________ ecosystem',
                                correctAnswer: 'simple',
                                marks: 1
                            },
                            {
                                questionNumber: 40,
                                questionType: 'note-completion',
                                questionText: 'An ideal environment for the __________ of the bell-miner',
                                correctAnswer: ['nest', 'nests'],
                                marks: 1
                            }
                        ]
                    }
                ],
                // Metadata
                totalQuestions: 40,
                totalMarks: 40,
                duration: 40,
                difficulty: 'medium',
                // Status
                isActive: true,
                usageCount: 0,
                // Admin reference
                createdBy: adminId
            });
            // Save to database
            yield listeningSet.save();
            console.log(`✅ Listening Set created successfully: ${setId}`);
            return {
                success: true,
                setId,
                message: 'Listening questions seeded successfully'
            };
        }
        catch (error) {
            console.error('❌ Error seeding listening questions:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
        finally {
            // Disconnect from MongoDB
            yield mongoose_1.default.disconnect();
            console.log('🔌 Disconnected from MongoDB');
        }
    });
}
// Run the seed function
seedListeningTest1()
    .then((result) => {
    console.log('\n📊 Seed Result:', result);
    process.exit(result.success ? 0 : 1);
})
    .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
