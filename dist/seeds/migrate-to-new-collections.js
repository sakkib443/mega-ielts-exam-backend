"use strict";
/**
 * Migration Script: Move data from QuestionSets to new separate collections
 * - Listening questions → ListeningTests
 * - Reading questions → ReadingTests
 * - Writing questions → WritingTests
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
const listening_model_1 = require("../app/modules/listening/listening.model");
const reading_model_1 = require("../app/modules/reading/reading.model");
const writing_model_1 = require("../app/modules/writing/writing.model");
dotenv.config();
const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/ielts';
function migrateData() {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('🔌 Connecting to MongoDB...');
            yield mongoose_1.default.connect(MONGODB_URI);
            console.log('✅ Connected to MongoDB\n');
            // Get all old question sets
            const oldSets = yield questionSet_model_1.QuestionSet.find({}).lean();
            console.log(`📦 Found ${oldSets.length} question sets to migrate\n`);
            let listeningCount = 0;
            let readingCount = 0;
            let writingCount = 0;
            for (const oldSet of oldSets) {
                console.log(`Processing: ${oldSet.setType} - ${oldSet.title}`);
                if (oldSet.setType === 'LISTENING') {
                    // Check if already exists
                    const exists = yield listening_model_1.ListeningTest.findOne({
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
                    const newListening = new listening_model_1.ListeningTest({
                        testId: `LISTENING_${oldSet.setNumber.toString().padStart(3, '0')}`,
                        testNumber: oldSet.setNumber,
                        title: oldSet.title,
                        description: oldSet.description,
                        source: 'Cambridge IELTS',
                        mainAudioUrl: oldSet.mainAudioUrl || '',
                        audioDuration: oldSet.audioDuration || 0,
                        sections: ((_a = oldSet.sections) === null || _a === void 0 ? void 0 : _a.map((section, idx) => {
                            var _a;
                            return ({
                                sectionNumber: section.sectionNumber || idx + 1,
                                title: section.title || `Part ${idx + 1}`,
                                context: section.instructions || 'Listen carefully and answer the questions.',
                                audioUrl: section.audioUrl || '',
                                instructions: section.instructions || 'Answer the following questions.',
                                passage: section.passage || '',
                                questions: ((_a = section.questions) === null || _a === void 0 ? void 0 : _a.map((q) => ({
                                    questionNumber: q.questionNumber,
                                    questionType: q.questionType || 'note-completion',
                                    questionText: q.questionText,
                                    options: q.options || [],
                                    correctAnswer: q.correctAnswer,
                                    acceptableAnswers: [],
                                    marks: q.marks || 1
                                }))) || []
                            });
                        })) || [],
                        totalQuestions: oldSet.totalQuestions || 40,
                        totalMarks: oldSet.totalMarks || 40,
                        duration: oldSet.duration || 40,
                        difficulty: oldSet.difficulty || 'medium',
                        isActive: oldSet.isActive !== false,
                        usageCount: oldSet.usageCount || 0,
                        createdBy: oldSet.createdBy
                    });
                    yield newListening.save();
                    listeningCount++;
                    console.log('  ✅ Migrated to ListeningTests');
                }
                else if (oldSet.setType === 'READING') {
                    const exists = yield reading_model_1.ReadingTest.findOne({
                        $or: [
                            { testNumber: oldSet.setNumber },
                            { title: oldSet.title }
                        ]
                    });
                    if (exists) {
                        console.log('  ⏭️  Already exists, skipping...');
                        continue;
                    }
                    const newReading = new reading_model_1.ReadingTest({
                        testId: `READING_${oldSet.setNumber.toString().padStart(3, '0')}`,
                        testNumber: oldSet.setNumber,
                        title: oldSet.title,
                        description: oldSet.description,
                        testType: 'academic',
                        source: 'Cambridge IELTS',
                        sections: ((_b = oldSet.sections) === null || _b === void 0 ? void 0 : _b.map((section, idx) => {
                            var _a;
                            return ({
                                sectionNumber: section.sectionNumber || idx + 1,
                                title: section.title || `Passage ${idx + 1}`,
                                passage: section.passage || '',
                                instructions: section.instructions || 'Read the passage and answer the questions.',
                                questions: ((_a = section.questions) === null || _a === void 0 ? void 0 : _a.map((q) => ({
                                    questionNumber: q.questionNumber,
                                    questionType: q.questionType || 'true-false-not-given',
                                    questionText: q.questionText,
                                    options: q.options || [],
                                    correctAnswer: q.correctAnswer,
                                    acceptableAnswers: [],
                                    marks: q.marks || 1
                                }))) || []
                            });
                        })) || [],
                        totalQuestions: oldSet.totalQuestions || 40,
                        totalMarks: oldSet.totalMarks || 40,
                        duration: oldSet.duration || 60,
                        difficulty: oldSet.difficulty || 'medium',
                        isActive: oldSet.isActive !== false,
                        usageCount: oldSet.usageCount || 0,
                        createdBy: oldSet.createdBy
                    });
                    yield newReading.save();
                    readingCount++;
                    console.log('  ✅ Migrated to ReadingTests');
                }
                else if (oldSet.setType === 'WRITING') {
                    const exists = yield writing_model_1.WritingTest.findOne({
                        $or: [
                            { testNumber: oldSet.setNumber },
                            { title: oldSet.title }
                        ]
                    });
                    if (exists) {
                        console.log('  ⏭️  Already exists, skipping...');
                        continue;
                    }
                    const newWriting = new writing_model_1.WritingTest({
                        testId: `WRITING_${oldSet.setNumber.toString().padStart(3, '0')}`,
                        testNumber: oldSet.setNumber,
                        title: oldSet.title,
                        description: oldSet.description,
                        testType: 'academic',
                        source: 'Cambridge IELTS',
                        tasks: ((_c = oldSet.writingTasks) === null || _c === void 0 ? void 0 : _c.map((task) => ({
                            taskNumber: task.taskNumber,
                            taskType: task.taskNumber === 1 ? 'task1-academic' : 'task2',
                            subType: task.taskNumber === 1 ? 'bar-chart' : 'opinion',
                            prompt: task.prompt,
                            instructions: task.instructions || 'Write at least the minimum number of words.',
                            minWords: task.minWords || (task.taskNumber === 1 ? 150 : 250),
                            recommendedTime: task.taskNumber === 1 ? 20 : 40,
                            images: task.imageUrl ? [{ url: task.imageUrl, description: 'Task image' }] : []
                        }))) || [],
                        totalTasks: 2,
                        duration: oldSet.duration || 60,
                        difficulty: oldSet.difficulty || 'medium',
                        isActive: oldSet.isActive !== false,
                        usageCount: oldSet.usageCount || 0,
                        createdBy: oldSet.createdBy
                    });
                    yield newWriting.save();
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
            const newListening = yield listening_model_1.ListeningTest.countDocuments();
            const newReading = yield reading_model_1.ReadingTest.countDocuments();
            const newWriting = yield writing_model_1.WritingTest.countDocuments();
            console.log('\n✅ New Collection Counts:');
            console.log(`  ListeningTests: ${newListening}`);
            console.log(`  ReadingTests: ${newReading}`);
            console.log(`  WritingTests: ${newWriting}`);
        }
        catch (error) {
            console.error('❌ Migration Error:', error);
        }
        finally {
            yield mongoose_1.default.disconnect();
            console.log('\n🔌 Disconnected from MongoDB');
        }
    });
}
migrateData();
