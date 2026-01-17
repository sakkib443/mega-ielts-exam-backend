/**
 * Check if Listening Test exists in database
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { QuestionSet } from '../app/modules/questionSet/questionSet.model';

dotenv.config();

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/ielts';

async function checkListening() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Find all listening sets
        const listeningSets = await QuestionSet.find({ setType: 'LISTENING' }).lean();

        console.log('\n📊 LISTENING QUESTION SETS:');
        console.log('Total count:', listeningSets.length);

        if (listeningSets.length > 0) {
            listeningSets.forEach((set, index) => {
                console.log(`\n${index + 1}. ${set.title}`);
                console.log(`   Set ID: ${set.setId}`);
                console.log(`   Total Questions: ${set.totalQuestions}`);
                console.log(`   Sections: ${set.sections?.length || 0}`);
                console.log(`   Active: ${set.isActive}`);
            });
        } else {
            console.log('❌ No listening sets found!');
        }

        // Also check all question sets
        const allSets = await QuestionSet.find().select('setId setType title totalQuestions isActive').lean();
        console.log('\n\n📊 ALL QUESTION SETS:');
        console.log('Total count:', allSets.length);
        allSets.forEach((set, index) => {
            console.log(`${index + 1}. [${set.setType}] ${set.title} - ${set.totalQuestions} questions`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

checkListening();
