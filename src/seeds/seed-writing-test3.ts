/**
 * Seed Script: Writing Test 3
 * 
 * Task 1: Process Diagram - Sugar Production from Sugar Cane
 * Task 2: Essay - Businesses emphasizing "new" products in advertising
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { WritingTest, generateWritingTestId } from '../app/modules/writing/writing.model';

dotenv.config();

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/ielts';

async function seedWritingTest3() {
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
            title: `Writing Test ${testNumber} - Sugar Production & Advertising`,
            description: 'Academic Writing Test with Process Diagram (Task 1) and Opinion Essay (Task 2)',
            testType: 'academic',
            source: 'Cambridge IELTS',

            tasks: [
                // TASK 1 - Process Diagram
                {
                    taskNumber: 1,
                    taskType: 'task1-academic',
                    subType: 'process-diagram',

                    prompt: `The diagram below shows the manufacturing process for making sugar from sugar cane.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.`,

                    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',

                    minWords: 150,
                    recommendedTime: 20,

                    images: [
                        {
                            url: '/images/writing/sugar-production-process.png',
                            description: 'A process diagram showing 7 stages of sugar production from sugar cane: 1) Growing (12-18 months), 2) Harvesting (by machine and manually), 3) Crushing (sugar canes crushed to extract juice), 4) Purifying juice (using limestone filter), 5) Evaporator (juice becomes syrup using heat), 6) Centrifuge (separates sugar crystals from syrup), 7) Drying and cooling (final sugar product)',
                            caption: 'How sugar is produced from sugar cane'
                        }
                    ],

                    keyPoints: [
                        '7-stage process from growing to final sugar product',
                        'Stage 1: Growing sugar cane takes 12-18 months',
                        'Stage 2: Harvesting done both mechanically and by hand',
                        'Stage 3: Crushing extracts juice from sugar canes',
                        'Stage 4: Juice purified using limestone filter',
                        'Stage 5: Evaporator uses heat to turn juice into syrup',
                        'Stage 6: Centrifuge separates sugar crystals from syrup',
                        'Stage 7: Drying and cooling produces final sugar',
                        'Process involves both agricultural and industrial stages'
                    ],

                    sampleAnswer: `The diagram illustrates the seven-stage process by which sugar is manufactured from sugar cane.

Overall, the process begins with growing and harvesting sugar cane, followed by several industrial stages that transform the raw material into refined sugar.

In the first stage, sugar cane is grown over a period of 12 to 18 months until it is ready for harvest. The harvesting process, which constitutes the second stage, can be performed either mechanically using large vehicles or manually by workers who cut the cane by hand.

Once harvested, the sugar cane enters the industrial phase. In stage three, the cane is crushed to extract its juice. This juice then passes through a limestone filter in stage four, where impurities are removed through purification. The purified juice subsequently enters an evaporator in stage five, where heat is applied to transform the liquid into syrup.

The syrup then moves to a centrifuge in stage six, which separates the sugar crystals from the remaining liquid. Finally, in the seventh and last stage, the sugar crystals undergo drying and cooling before the finished sugar product is ready for distribution.`,

                    examinerTips: [
                        'Use sequencing language (first, then, next, finally)',
                        'Use passive voice for process descriptions',
                        'Include an overview summarizing the main stages',
                        'Mention specific details like time periods and equipment'
                    ]
                },

                // TASK 2 - Opinion Essay
                {
                    taskNumber: 2,
                    taskType: 'task2',
                    subType: 'discussion-opinion',

                    prompt: `In their advertising, businesses nowadays usually emphasise that their products are new in some way.

Why is this? Do you think it is a positive or negative development?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.`,

                    instructions: 'You should spend about 40 minutes on this task. Write at least 250 words.',

                    minWords: 250,
                    recommendedTime: 40,

                    keyPoints: [
                        'PART 1 - Why businesses emphasize "new":',
                        '- Consumer psychology - people attracted to novelty',
                        '- Competitive market - need to stand out',
                        '- Technology advancement - constant updates',
                        '- Planned obsolescence strategy',
                        '- Social media influence - trends change rapidly',
                        '',
                        'PART 2 - Positive or Negative:',
                        'Positive aspects:',
                        '- Drives innovation and improvement',
                        '- Better products for consumers',
                        '- Economic growth and job creation',
                        '',
                        'Negative aspects:',
                        '- Encourages overconsumption',
                        '- Environmental waste',
                        '- Misleading marketing',
                        '- Financial pressure on consumers'
                    ],

                    sampleAnswer: `In today's competitive marketplace, businesses consistently highlight the novelty of their products in advertising campaigns. This essay will explore the reasons behind this trend and argue that while it has some benefits, it is predominantly a negative development.

The emphasis on newness in advertising stems from several factors. Primarily, companies understand that consumers are psychologically drawn to novel products, associating them with improvement and innovation. In saturated markets, claiming a product is "new" or "improved" helps businesses differentiate themselves from competitors. Furthermore, rapid technological advancement means companies must constantly release updates to remain relevant. The smartphone industry exemplifies this, with manufacturers launching new models annually, each marketed as revolutionary.

However, I believe this trend is largely negative for several reasons. Firstly, it promotes excessive consumerism by making people feel their existing possessions are outdated, even when they function perfectly well. This "throwaway culture" has severe environmental consequences, with electronic waste alone contributing millions of tonnes to landfills annually. Secondly, the pressure to constantly purchase new items places financial strain on consumers, particularly in economically challenging times.

Moreover, the emphasis on newness can be misleading. Products advertised as "new" often feature only minor modifications, yet command premium prices. This manipulative marketing erodes consumer trust and prioritizes profit over genuine innovation.

In conclusion, while the focus on novelty can drive technological progress, I maintain that its negative impacts on the environment, consumer finances, and marketing ethics outweigh these benefits. Businesses should instead emphasize quality and sustainability rather than perpetual newness.`,

                    examinerTips: [
                        'Address both parts of the question (why + positive/negative)',
                        'State your opinion clearly',
                        'Provide specific examples',
                        'Use appropriate linking words',
                        'Include balanced discussion before giving opinion'
                    ]
                }
            ],

            totalTasks: 2,
            duration: 60,
            difficulty: 'medium',
            topicCategories: ['Process', 'Manufacturing', 'Business', 'Advertising', 'Consumerism'],
            isActive: true,
            usageCount: 0,
            createdBy: adminId
        });

        await writingTest.save();
        console.log('✅ Writing Test created successfully!');
        console.log(`   Test ID: ${testId}`);
        console.log(`   Test Number: ${testNumber}`);
        console.log(`   Task 1: Process Diagram - Sugar Production`);
        console.log(`   Task 2: Discussion-Opinion Essay - Advertising & Newness`);

        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');

    } catch (error) {
        console.error('❌ Error:', error);
        await mongoose.disconnect();
    }
}

seedWritingTest3();
