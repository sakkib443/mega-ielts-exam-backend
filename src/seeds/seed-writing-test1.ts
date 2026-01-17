/**
 * Seed Script: Cambridge IELTS Test 1 - Writing Questions
 * 
 * This script adds the Writing Task 1 (Map Comparison) and Task 2 (Essay)
 * questions from Cambridge IELTS Book to the database.
 * 
 * Run with: npx ts-node src/seeds/seed-writing-test1.ts
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { QuestionSet, generateSetId } from '../app/modules/questionSet/questionSet.model';

// Load environment variables
dotenv.config();

// MongoDB connection
const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/ielts';

interface SeedResult {
    success: boolean;
    setId?: string;
    message: string;
}

async function seedWritingTest1(): Promise<SeedResult> {
    try {
        // Connect to MongoDB
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if this set already exists
        const existingSet = await QuestionSet.findOne({
            setType: 'WRITING',
            title: { $regex: /Cambridge.*Test.*1.*Writing/i }
        });

        if (existingSet) {
            console.log('⚠️ Writing Test 1 already exists in database');
            return {
                success: true,
                setId: existingSet.setId,
                message: 'Writing set already exists'
            };
        }

        // Generate new set ID
        const { setId, setNumber } = await generateSetId('WRITING');
        console.log(`📝 Creating Writing Set: ${setId}`);

        // Create admin user reference (use a default ObjectId or find admin)
        // For seeding, we'll use a placeholder - in production, get actual admin ID
        const adminId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');

        // Writing Question Set Data
        const writingSet = new QuestionSet({
            setId,
            setType: 'WRITING',
            setNumber,
            title: 'Cambridge IELTS Test 1 - Writing',
            description: 'Cambridge IELTS Academic Writing Test with Map Comparison (Task 1) and Opinion Essay (Task 2)',

            // Writing Tasks
            writingTasks: [
                // ============================================
                // WRITING TASK 1 - Map Comparison
                // ============================================
                {
                    taskNumber: 1,
                    taskType: 'task1',
                    task1SubType: 'map-comparison',

                    prompt: `The maps below show an industrial area in the town of Norbiton, and planned future development of the site.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.`,

                    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',

                    minWords: 150,
                    recommendedTime: 20,

                    // Image descriptions since we cannot store actual images in seed
                    imageDescriptions: [
                        'Norbiton industrial area now: Shows farmland to the north, a roundabout connected to the town on the west, and factories (marked with diagonal lines pattern) along the southern road.',
                        'Planned future development: The farmland is reduced, the roundabout remains connected to town. The factory area is replaced with housing (marked with grid pattern), a playground in the center, and a school building to the east. The development extends further east with more housing areas.'
                    ],

                    // Key points students should cover
                    keyPoints: [
                        'Current state: Factories and farmland dominate the area',
                        'Factory areas will be converted to housing',
                        'A new playground will be added in the central area',
                        'A school will be built on the eastern side',
                        'The roundabout connecting to town will be retained',
                        'Farmland will be significantly reduced',
                        'Overall transformation from industrial to residential'
                    ],

                    // Scoring criteria
                    scoringCriteria: {
                        taskAchievement: 25,
                        coherenceCohesion: 25,
                        lexicalResource: 25,
                        grammaticalAccuracy: 25
                    },

                    // Sample answer
                    sampleAnswer: `The two maps illustrate the current industrial area in Norbiton and the planned redevelopment of the site.

At present, the area is dominated by industrial features. There is farmland to the north, and factories occupy the southern portion of the site, accessible via a road that connects to a roundabout on the western side, which leads to the town.

The planned development shows significant transformation. The factories will be demolished and replaced by residential housing. A playground will be constructed in the central area where the roundabout remains. Additionally, a school building will be established on the eastern side of the development.

The farmland to the north will be considerably reduced to make way for more housing units. The road connecting to the town through the roundabout will be maintained, providing access to the new residential area.

Overall, the plans show a complete transformation from an industrial zone to a residential community with educational and recreational facilities, while maintaining the connection to the main town.`,

                    // Band descriptors
                    bandDescriptors: [
                        { band: 9, description: 'Fully addresses all parts of the task with complete accuracy and excellent vocabulary' },
                        { band: 8, description: 'Addresses all parts well with good range of vocabulary and minor errors' },
                        { band: 7, description: 'Addresses all parts with some flexibility in vocabulary usage' },
                        { band: 6, description: 'Addresses the task adequately but may lack detail in places' },
                        { band: 5, description: 'Partially addresses the task with limited vocabulary range' }
                    ]
                },

                // ============================================
                // WRITING TASK 2 - Opinion Essay (Advantages vs Disadvantages)
                // ============================================
                {
                    taskNumber: 2,
                    taskType: 'task2',
                    task2SubType: 'advantages-disadvantages',

                    prompt: `It is important for people to take risks, both in their professional lives and their personal lives.

Do you think the advantages of taking risks outweigh the disadvantages?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.`,

                    instructions: 'You should spend about 40 minutes on this task. Write at least 250 words.',

                    minWords: 250,
                    recommendedTime: 40,

                    // Key points students should cover
                    keyPoints: [
                        'Define what risk-taking means in professional and personal contexts',
                        'Advantages: Personal growth, career advancement, innovation, building confidence',
                        'Advantages: Overcoming fear, seizing opportunities, learning from failure',
                        'Disadvantages: Financial loss, emotional stress, relationship strain',
                        'Disadvantages: Potential failure, wasted time and resources',
                        'Balance: Calculated risks vs reckless risks',
                        'Personal examples or case studies',
                        'Clear conclusion stating your opinion'
                    ],

                    // Scoring criteria
                    scoringCriteria: {
                        taskAchievement: 25,
                        coherenceCohesion: 25,
                        lexicalResource: 25,
                        grammaticalAccuracy: 25
                    },

                    // Sample answer
                    sampleAnswer: `Taking risks is an inevitable part of life, and whether these occur in our professional or personal spheres, they can significantly shape our futures. In my view, while risk-taking does carry certain disadvantages, the advantages far outweigh them.

On one hand, there are clear drawbacks to taking risks. Financial loss is perhaps the most tangible consequence, particularly in business ventures that may not succeed. Similarly, personal risks such as relocating to a new country or ending a stable relationship can lead to emotional distress and uncertainty. Moreover, failed risks can damage one's reputation and self-confidence, making future endeavors more challenging.

However, the benefits of taking calculated risks are substantial. Professionally, those who take risks often achieve greater career advancement. Entrepreneurs like Elon Musk and Jeff Bezos built their empires by taking significant financial risks that paid off exponentially. In personal life, risks enable personal growth and self-discovery. For instance, traveling solo or learning a new skill pushes individuals beyond their comfort zones, fostering resilience and adaptability.

Furthermore, risks often lead to innovation and progress. Without risk-takers, humanity would lack many technological advancements and social improvements. The key distinction lies between reckless gambling and calculated risk-taking, where potential outcomes are carefully considered.

In conclusion, while risks do carry potential downsides, the opportunities for growth, success, and fulfillment they present make them worthwhile. I firmly believe that embracing calculated risks is essential for both personal development and professional success.`,

                    // Band descriptors
                    bandDescriptors: [
                        { band: 9, description: 'Presents a fully developed position with relevant, extended ideas and excellent vocabulary' },
                        { band: 8, description: 'Presents a well-developed response with logical arguments and good language control' },
                        { band: 7, description: 'Presents a clear position with relevant main ideas and adequate vocabulary' },
                        { band: 6, description: 'Presents a position with relevant ideas but may lack focus in places' },
                        { band: 5, description: 'Expresses a position but development may be limited' }
                    ]
                }
            ],

            // Metadata
            totalQuestions: 2,
            totalMarks: 40, // Writing is scored out of 40 (each task contributes equally)
            duration: 60, // 60 minutes total (20 + 40)
            difficulty: 'medium',

            // Status
            isActive: true,
            usageCount: 0,

            // Admin reference
            createdBy: adminId
        });

        // Save to database
        await writingSet.save();
        console.log(`✅ Writing Set created successfully: ${setId}`);

        return {
            success: true,
            setId,
            message: 'Writing questions seeded successfully'
        };

    } catch (error) {
        console.error('❌ Error seeding writing questions:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

// Run the seed function
seedWritingTest1()
    .then((result) => {
        console.log('\n📊 Seed Result:', result);
        process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
