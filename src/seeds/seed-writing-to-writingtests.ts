/**
 * Seed Script: Add Writing Test to writingtests collection
 * 
 * Task 1: Line Graph - Electrical Appliances & Housework Hours (1920-2019)
 * Task 2: Essay - History of Houses/Buildings
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { WritingTest, generateWritingTestId } from '../app/modules/writing/writing.model';

dotenv.config();

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/ielts';

async function seedWritingTest2() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Generate new test ID
        const { testId, testNumber } = await generateWritingTestId();
        console.log(`📝 Creating Writing Test: ${testId} (Test #${testNumber})`);

        const adminId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');

        const writingTest = new WritingTest({
            testId,
            testNumber,
            title: `Writing Test ${testNumber} - Electrical Appliances & House History`,
            description: 'Academic Writing Test with Line Graph Analysis (Task 1) and Two-Part Question Essay (Task 2)',
            testType: 'academic',
            source: 'Cambridge IELTS',

            tasks: [
                // TASK 1 - Mixed Charts (Line Graphs)
                {
                    taskNumber: 1,
                    taskType: 'task1-academic',
                    subType: 'line-graph',

                    prompt: `The charts below show the changes in ownership of electrical appliances and amount of time spent doing housework in households in one country between 1920 and 2019.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.`,

                    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',

                    minWords: 150,
                    recommendedTime: 20,

                    images: [
                        {
                            url: '/images/writing/electrical-appliances-graph.png',
                            description: 'Two charts showing percentage of households with electrical appliances (washing machine, refrigerator, vacuum cleaner) from 1920-2019, and hours of housework per week from 1920-2019.',
                            caption: 'Percentage of households with electrical appliances (1920-2019) and Number of hours of housework per week per household (1920-2019)'
                        }
                    ],

                    keyPoints: [
                        'Clear relationship between rise in appliance ownership and decrease in housework hours',
                        'Refrigerator saw the most dramatic rise - from near 0% to 100%',
                        'Vacuum cleaner and refrigerator both reached near-saturation by 1980',
                        'Washing machine had steadiest growth but never reached full saturation (~70%)',
                        'Housework hours decreased from 50 hours/week in 1920 to just 10 hours by 2019'
                    ],

                    sampleAnswer: `The two charts illustrate the changing patterns of electrical appliance ownership and weekly housework hours in households from 1920 to 2019.

Overall, there is a clear inverse relationship between the two trends: as ownership of electrical appliances increased substantially, the time spent on housework decreased dramatically.

Looking at appliance ownership, all three items showed significant growth over the century. Refrigerators experienced the most remarkable surge, climbing from approximately 2% in 1920 to nearly 100% by 1980, where it plateaued. Similarly, vacuum cleaners rose from around 30% to 95%, also stabilizing by 1980. In contrast, washing machines demonstrated steadier but less dramatic growth, increasing from 40% to approximately 70% by 2019.

The second chart reveals a corresponding decline in housework hours. Starting at roughly 50 hours per week in 1920, the figure dropped sharply to around 30 hours by 1960. This decline continued more gradually afterward, reaching approximately 10 hours by 2019.

The correlation between these trends suggests that the proliferation of labour-saving appliances significantly reduced the domestic workload.`,

                    examinerTips: [
                        'Start with an overview comparing both charts',
                        'Use specific data points to support your observations',
                        'Make comparisons between the different appliances',
                        'Link the two charts to show the relationship'
                    ]
                },

                // TASK 2 - Two-Part Question Essay
                {
                    taskNumber: 2,
                    taskType: 'task2',
                    subType: 'two-part-question',

                    prompt: `In some countries, more and more people are becoming interested in finding out about the history of the house or building they live in.

What are the reasons for this?
How can people research this?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.`,

                    instructions: 'You should spend about 40 minutes on this task. Write at least 250 words.',

                    minWords: 250,
                    recommendedTime: 40,

                    keyPoints: [
                        'Reasons: Sense of connection to past, curiosity about previous occupants, property value, genealogy interest, TV shows influence',
                        'Research methods: Local archives, land registry, census records, newspapers, neighbors, online databases, historic maps'
                    ],

                    sampleAnswer: `In recent years, there has been growing interest in exploring the history of residential properties. This essay will examine the reasons behind this trend and suggest practical methods for conducting such research.

Several factors contribute to people's curiosity about their homes' past. Firstly, there is an increasing desire to feel connected to history and heritage. Knowing that a house has witnessed generations of families and historical events can create a profound sense of belonging. Secondly, the popularity of television programs about home renovation and ancestry has sparked widespread interest in property history.

Additionally, practical considerations play a role. Some homeowners research their property's history to understand its architectural features better, which can inform renovation decisions. Others may be motivated by potential increases in property value, as historical significance can enhance a home's market appeal.

Regarding research methods, numerous resources are available. Local archives and historical societies often maintain records of property ownership and building permits. Land registry offices provide official documentation of previous owners. Census records and electoral rolls can reveal fascinating details about former residents. Modern technology has also made research more accessible, with online databases and digitized historical newspapers enabling people to explore from their homes. Finally, speaking with long-term neighbors can provide invaluable personal accounts.

In conclusion, the trend of researching property history stems from both emotional and practical motivations, and various traditional and digital resources make such investigations increasingly feasible.`,

                    examinerTips: [
                        'Address BOTH questions equally',
                        'Use clear paragraphing for each question part',
                        'Provide specific examples',
                        'Include introduction and conclusion'
                    ]
                }
            ],

            totalTasks: 2,
            duration: 60,
            difficulty: 'medium',
            topicCategories: ['Technology', 'Society', 'History', 'Housing'],
            isActive: true,
            usageCount: 0,
            createdBy: adminId
        });

        await writingTest.save();
        console.log('✅ Writing Test created successfully!');
        console.log(`   Test ID: ${testId}`);
        console.log(`   Test Number: ${testNumber}`);

        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');

    } catch (error) {
        console.error('❌ Error:', error);
        await mongoose.disconnect();
    }
}

seedWritingTest2();
