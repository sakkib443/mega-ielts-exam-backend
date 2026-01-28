/**
 * Seed Script: New IELTS Writing Test
 * 
 * Task 1: Line Graph - Electrical Appliances & Housework Hours (1920-2019)
 * Task 2: Essay - History of Houses/Buildings
 * 
 * Run with: npx ts-node src/seeds/seed-writing-test-new.ts
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { QuestionSet, generateSetId } from '../app/modules/questionSet/questionSet.model';

// Load environment variables
dotenv.config();

// MongoDB connection
const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/ielts';

async function seedNewWritingTest() {
    try {
        // Connect to MongoDB
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Generate new set ID
        const { setId, setNumber } = await generateSetId('WRITING');
        console.log(`📝 Creating Writing Set: ${setId} (Set #${setNumber})`);

        // Create admin user reference
        const adminId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');

        // Writing Question Set Data
        const writingSet = new QuestionSet({
            setId,
            setType: 'WRITING',
            setNumber,
            title: `IELTS Writing Test ${setNumber} - Electrical Appliances & House History`,
            description: 'Academic Writing Test with Line Graph Analysis (Task 1) and Two-Part Question Essay (Task 2)',

            // Writing Tasks
            writingTasks: [
                // ============================================
                // WRITING TASK 1 - Line Graphs (Mixed Charts)
                // ============================================
                {
                    taskNumber: 1,
                    taskType: 'task1',
                    task1SubType: 'mixed-charts',

                    prompt: `The charts below show the changes in ownership of electrical appliances and amount of time spent doing housework in households in one country between 1920 and 2019.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.`,

                    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',

                    minWords: 150,
                    recommendedTime: 20,

                    // Image URL (to be updated with actual uploaded image)
                    images: [
                        {
                            url: '/images/writing/electrical-appliances-graph.png',
                            description: 'Two charts: 1) Line graph showing percentage of households with washing machine, refrigerator, and vacuum cleaner from 1920-2019. 2) Line graph showing number of hours of housework per week from 1920-2019.',
                            caption: 'Percentage of households with electrical appliances (1920-2019) and Number of hours of housework per week per household (1920-2019)'
                        }
                    ],

                    // Image descriptions for accessibility
                    imageDescriptions: [
                        'Chart 1 - Percentage of households with electrical appliances (1920-2019): Shows three lines - Washing machine starts at ~40% in 1920 and rises steadily to ~70% by 2019. Refrigerator starts at ~2% in 1920, rises sharply to reach nearly 100% by 1980 and stays flat. Vacuum cleaner starts at ~30% in 1920, rises to ~95% by 1980 with slight fluctuation.',
                        'Chart 2 - Number of hours of housework per week per household (1920-2019): Single line starting at ~50 hours in 1920, decreasing steadily to ~30 hours by 1960, then falling more gradually to ~10 hours by 2019.',
                        '*housework = washing clothes, preparing meals, cleaning'
                    ],

                    // Data points for reference
                    dataPoints: {
                        washingMachine: { 1920: 40, 1940: 60, 1960: 70, 1980: 70, 2000: 75, 2019: 70 },
                        refrigerator: { 1920: 2, 1940: 55, 1960: 90, 1980: 100, 2000: 100, 2019: 100 },
                        vacuumCleaner: { 1920: 30, 1940: 60, 1960: 90, 1980: 95, 2000: 95, 2019: 95 },
                        houseworkHours: { 1920: 50, 1940: 45, 1960: 30, 1980: 18, 2000: 13, 2019: 10 }
                    },

                    // Key points students should cover
                    keyPoints: [
                        'Overview: Clear relationship between rise in appliance ownership and decrease in housework hours',
                        'Refrigerator saw the most dramatic rise - from near 0% to 100%',
                        'Vacuum cleaner and refrigerator both reached near-saturation (~95-100% by 1980',
                        'Washing machine had steadiest growth but never reached full saturation (~70%)',
                        'Housework hours decreased from 50 hours/week in 1920 to just 10 hours by 2019',
                        'Most significant decrease in housework occurred between 1920-1960',
                        'Correlation between increased appliance ownership and decreased housework time'
                    ],

                    // Scoring criteria
                    scoringCriteria: {
                        taskAchievement: 25,
                        coherenceCohesion: 25,
                        lexicalResource: 25,
                        grammaticalAccuracy: 25
                    },

                    // Sample answer
                    sampleAnswer: `The two charts illustrate the changing patterns of electrical appliance ownership and weekly housework hours in households from 1920 to 2019.

Overall, there is a clear inverse relationship between the two trends: as ownership of electrical appliances increased substantially, the time spent on housework decreased dramatically.

Looking at appliance ownership, all three items showed significant growth over the century. Refrigerators experienced the most remarkable surge, climbing from approximately 2% in 1920 to nearly 100% by 1980, where it plateaued. Similarly, vacuum cleaners rose from around 30% to 95%, also stabilizing by 1980. In contrast, washing machines demonstrated steadier but less dramatic growth, increasing from 40% to approximately 70% by 2019, though never achieving universal adoption.

The second chart reveals a corresponding decline in housework hours. Starting at roughly 50 hours per week in 1920, the figure dropped sharply to around 30 hours by 1960. This decline continued more gradually afterward, reaching approximately 10 hours by 2019 — an 80% reduction overall.

The correlation between these trends suggests that the proliferation of labour-saving appliances significantly reduced the domestic workload, particularly during the mid-twentieth century when appliance adoption was most rapid.`,

                    // Band descriptors
                    bandDescriptors: [
                        { band: 9, description: 'Fully addresses all parts with excellent overview and accurate data selection' },
                        { band: 8, description: 'Covers all key features with clear overview and good data comparison' },
                        { band: 7, description: 'Presents clear overview with relevant features and adequate comparisons' },
                        { band: 6, description: 'Presents an overview with some data but may miss key comparisons' },
                        { band: 5, description: 'Limited overview, may simply list data without proper comparison' }
                    ]
                },

                // ============================================
                // WRITING TASK 2 - Two-Part Question Essay
                // ============================================
                {
                    taskNumber: 2,
                    taskType: 'task2',
                    task2SubType: 'two-part-question',

                    prompt: `In some countries, more and more people are becoming interested in finding out about the history of the house or building they live in.

What are the reasons for this?
How can people research this?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.`,

                    instructions: 'You should spend about 40 minutes on this task. Write at least 250 words.',

                    minWords: 250,
                    recommendedTime: 40,

                    // Topic categories
                    topicCategories: ['Society', 'History', 'Culture', 'Housing'],

                    // Key points students should cover
                    keyPoints: [
                        'PART 1 - Reasons for interest:',
                        '- Sense of connection to the past and heritage',
                        '- Curiosity about previous occupants and their stories',
                        '- Property value considerations',
                        '- Growing interest in genealogy and family history',
                        '- TV shows and media influence (home renovation/history programs)',
                        '- Understanding architectural significance',
                        '- Preserving local history and community heritage',
                        '',
                        'PART 2 - Research methods:',
                        '- Local archives and historical societies',
                        '- Land registry and property records',
                        '- Census records and electoral rolls',
                        '- Old newspapers and local libraries',
                        '- Talking to neighbors and previous residents',
                        '- Online databases and genealogy websites',
                        '- Historic maps and photographs',
                        '- Building permits and planning documents'
                    ],

                    // Scoring criteria
                    scoringCriteria: {
                        taskAchievement: 25,
                        coherenceCohesion: 25,
                        lexicalResource: 25,
                        grammaticalAccuracy: 25
                    },

                    // Sample answer
                    sampleAnswer: `In recent years, there has been growing interest in exploring the history of residential properties. This essay will examine the reasons behind this trend and suggest practical methods for conducting such research.

Several factors contribute to people's curiosity about their homes' past. Firstly, there is an increasing desire to feel connected to history and heritage. Knowing that a house has witnessed generations of families and historical events can create a profound sense of belonging. Secondly, the popularity of television programs about home renovation and ancestry has sparked widespread interest in property history. Shows like "Who Do You Think You Are?" and various home improvement series have normalized this curiosity.

Additionally, practical considerations play a role. Some homeowners research their property's history to understand its architectural features better, which can inform renovation decisions. Others may be motivated by potential increases in property value, as historical significance can enhance a home's market appeal. Furthermore, the growing genealogy movement has encouraged people to explore not only their family trees but also the physical spaces their ancestors inhabited.

Regarding research methods, numerous resources are available. Local archives and historical societies often maintain records of property ownership and building permits. Land registry offices provide official documentation of previous owners. Census records and electoral rolls can reveal fascinating details about former residents. Modern technology has also made research more accessible, with online databases and digitized historical newspapers enabling people to explore from their homes. Finally, speaking with long-term neighbors can provide invaluable personal accounts and anecdotes.

In conclusion, the trend of researching property history stems from both emotional and practical motivations, and various traditional and digital resources make such investigations increasingly feasible.`,

                    // Band descriptors
                    bandDescriptors: [
                        { band: 9, description: 'Fully addresses both parts with well-developed, relevant ideas and excellent vocabulary' },
                        { band: 8, description: 'Addresses both questions thoroughly with clear development and good language control' },
                        { band: 7, description: 'Addresses both parts clearly with relevant ideas and adequate vocabulary' },
                        { band: 6, description: 'Addresses both parts but development may be uneven' },
                        { band: 5, description: 'Partially addresses both questions with limited development' }
                    ],

                    // Examiner tips
                    examinerTips: [
                        'Make sure to address BOTH questions equally',
                        'Use clear paragraphing - one for each question part',
                        'Provide specific examples to support your points',
                        'Use appropriate linking words between ideas',
                        'Include a brief introduction and conclusion'
                    ]
                }
            ],

            // Metadata
            totalQuestions: 2,
            totalMarks: 40,
            duration: 60,
            difficulty: 'medium',
            topicCategories: ['Technology', 'Society', 'History', 'Housing'],

            // Status
            isActive: true,
            usageCount: 0,

            // Admin reference
            createdBy: adminId
        });

        // Save to database
        await writingSet.save();
        console.log('✅ Writing Test created successfully!');
        console.log(`   Set ID: ${setId}`);
        console.log(`   Set Number: ${setNumber}`);
        console.log(`   Task 1: Multiple Charts (Electrical Appliances & Housework)`);
        console.log(`   Task 2: Two-Part Question (House History Research)`);

        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');

        return { success: true, setId, setNumber };

    } catch (error) {
        console.error('❌ Error seeding writing test:', error);
        await mongoose.disconnect();
        throw error;
    }
}

// Run the seed function
seedNewWritingTest()
    .then(result => {
        console.log('\n✨ Seeding completed!', result);
        process.exit(0);
    })
    .catch(error => {
        console.error('\n💥 Seeding failed:', error);
        process.exit(1);
    });
