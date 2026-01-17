/**
 * Migration Script: Move data from QuestionSets to new separate collections
 * - Listening questions → ListeningTests
 * - Reading questions → ReadingTests
 * - Writing questions → WritingTests
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { QuestionSet } from '../app/modules/questionSet/questionSet.model';
import { ListeningTest } from '../app/modules/listening/listening.model';
import { ReadingTest } from '../app/modules/reading/reading.model';
import { WritingTest } from '../app/modules/writing/writing.model';

dotenv.config();

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/ielts';

async function migrateData() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Get all old question sets
        const oldSets = await QuestionSet.find({}).lean();
        console.log(`📦 Found ${oldSets.length} question sets to migrate\n`);

        let listeningCount = 0;
        let readingCount = 0;
        let writingCount = 0;

        for (const oldSet of oldSets) {
            console.log(`Processing: ${oldSet.setType} - ${oldSet.title}`);

            if (oldSet.setType === 'LISTENING') {
                // Check if already exists
                const exists = await ListeningTest.findOne({
                    $or: [
                        { testNumber: oldSet.setNumber },
                        { title: oldSet.title }
                    ]
                });

                if (exists) {
                    console.log('  ⏭️  Already exists, skipping...');
                    continue;
                }

                // Map to new format
                const newListening = new ListeningTest({
                    testId: `LISTENING_${oldSet.setNumber.toString().padStart(3, '0')}`,
                    testNumber: oldSet.setNumber,
                    title: oldSet.title,
                    description: oldSet.description,
                    source: 'Cambridge IELTS',
                    mainAudioUrl: oldSet.mainAudioUrl || '',
                    audioDuration: oldSet.audioDuration || 0,
                    sections: oldSet.sections?.map((section: any, idx: number) => ({
                        sectionNumber: section.sectionNumber || idx + 1,
                        title: section.title || `Part ${idx + 1}`,
                        context: section.instructions || 'Listen carefully and answer the questions.',
                        audioUrl: section.audioUrl || '',
                        instructions: section.instructions || 'Answer the following questions.',
                        passage: section.passage || '',
                        questions: section.questions?.map((q: any) => ({
                            questionNumber: q.questionNumber,
                            questionType: q.questionType || 'note-completion',
                            questionText: q.questionText,
                            options: q.options || [],
                            correctAnswer: q.correctAnswer,
                            acceptableAnswers: [],
                            marks: q.marks || 1
                        })) || []
                    })) || [],
                    totalQuestions: oldSet.totalQuestions || 40,
                    totalMarks: oldSet.totalMarks || 40,
                    duration: oldSet.duration || 40,
                    difficulty: oldSet.difficulty || 'medium',
                    isActive: oldSet.isActive !== false,
                    usageCount: oldSet.usageCount || 0,
                    createdBy: oldSet.createdBy
                });

                await newListening.save();
                listeningCount++;
                console.log('  ✅ Migrated to ListeningTests');

            } else if (oldSet.setType === 'READING') {
                const exists = await ReadingTest.findOne({
                    $or: [
                        { testNumber: oldSet.setNumber },
                        { title: oldSet.title }
                    ]
                });

                if (exists) {
                    console.log('  ⏭️  Already exists, skipping...');
                    continue;
                }

                const newReading = new ReadingTest({
                    testId: `READING_${oldSet.setNumber.toString().padStart(3, '0')}`,
                    testNumber: oldSet.setNumber,
                    title: oldSet.title,
                    description: oldSet.description,
                    testType: 'academic',
                    source: 'Cambridge IELTS',
                    sections: oldSet.sections?.map((section: any, idx: number) => ({
                        sectionNumber: section.sectionNumber || idx + 1,
                        title: section.title || `Passage ${idx + 1}`,
                        passage: section.passage || '',
                        instructions: section.instructions || 'Read the passage and answer the questions.',
                        questions: section.questions?.map((q: any) => ({
                            questionNumber: q.questionNumber,
                            questionType: q.questionType || 'true-false-not-given',
                            questionText: q.questionText,
                            options: q.options || [],
                            correctAnswer: q.correctAnswer,
                            acceptableAnswers: [],
                            marks: q.marks || 1
                        })) || []
                    })) || [],
                    totalQuestions: oldSet.totalQuestions || 40,
                    totalMarks: oldSet.totalMarks || 40,
                    duration: oldSet.duration || 60,
                    difficulty: oldSet.difficulty || 'medium',
                    isActive: oldSet.isActive !== false,
                    usageCount: oldSet.usageCount || 0,
                    createdBy: oldSet.createdBy
                });

                await newReading.save();
                readingCount++;
                console.log('  ✅ Migrated to ReadingTests');

            } else if (oldSet.setType === 'WRITING') {
                const exists = await WritingTest.findOne({
                    $or: [
                        { testNumber: oldSet.setNumber },
                        { title: oldSet.title }
                    ]
                });

                if (exists) {
                    console.log('  ⏭️  Already exists, skipping...');
                    continue;
                }

                const newWriting = new WritingTest({
                    testId: `WRITING_${oldSet.setNumber.toString().padStart(3, '0')}`,
                    testNumber: oldSet.setNumber,
                    title: oldSet.title,
                    description: oldSet.description,
                    testType: 'academic',
                    source: 'Cambridge IELTS',
                    tasks: oldSet.writingTasks?.map((task: any) => ({
                        taskNumber: task.taskNumber,
                        taskType: task.taskNumber === 1 ? 'task1-academic' : 'task2',
                        subType: task.taskNumber === 1 ? 'bar-chart' : 'opinion',
                        prompt: task.prompt,
                        instructions: task.instructions || 'Write at least the minimum number of words.',
                        minWords: task.minWords || (task.taskNumber === 1 ? 150 : 250),
                        recommendedTime: task.taskNumber === 1 ? 20 : 40,
                        images: task.imageUrl ? [{ url: task.imageUrl, description: 'Task image' }] : []
                    })) || [],
                    totalTasks: 2,
                    duration: oldSet.duration || 60,
                    difficulty: oldSet.difficulty || 'medium',
                    isActive: oldSet.isActive !== false,
                    usageCount: oldSet.usageCount || 0,
                    createdBy: oldSet.createdBy
                });

                await newWriting.save();
                writingCount++;
                console.log('  ✅ Migrated to WritingTests');
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log('📊 Migration Summary:');
        console.log(`  Listening Tests: ${listeningCount}`);
        console.log(`  Reading Tests: ${readingCount}`);
        console.log(`  Writing Tests: ${writingCount}`);
        console.log('='.repeat(50));

        // Verify
        const newListening = await ListeningTest.countDocuments();
        const newReading = await ReadingTest.countDocuments();
        const newWriting = await WritingTest.countDocuments();

        console.log('\n✅ New Collection Counts:');
        console.log(`  ListeningTests: ${newListening}`);
        console.log(`  ReadingTests: ${newReading}`);
        console.log(`  WritingTests: ${newWriting}`);

    } catch (error) {
        console.error('❌ Migration Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

migrateData();
