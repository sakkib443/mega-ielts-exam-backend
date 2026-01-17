"use strict";
/**
 * Update Writing Set with Image URLs
 *
 * Run with: npx ts-node src/seeds/update-writing-images.ts
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
function updateWritingImages() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to MongoDB
            console.log('🔌 Connecting to MongoDB...');
            yield mongoose_1.default.connect(MONGODB_URI);
            console.log('✅ Connected to MongoDB');
            // Find the Writing Set
            const writingSet = yield questionSet_model_1.QuestionSet.findOne({ setId: 'WRITING_SET_001' });
            if (!writingSet) {
                console.log('❌ Writing Set not found');
                return;
            }
            console.log('📝 Found Writing Set:', writingSet.setId);
            // Update Task 1 with map image
            if (writingSet.writingTasks && writingSet.writingTasks.length > 0) {
                // Task 1 - Map Comparison
                writingSet.writingTasks[0].imageUrl = '/images/writing/task1_norbiton_maps.png';
                writingSet.writingTasks[0].imageUrls = ['/images/writing/task1_norbiton_maps.png'];
                console.log('✅ Task 1 image URL added');
                // Task 2 - Essay (optional image, mainly text-based)
                if (writingSet.writingTasks.length > 1) {
                    writingSet.writingTasks[1].imageUrl = '/images/writing/task2_risk_taking.png';
                    console.log('✅ Task 2 image URL added');
                }
            }
            // Save the updated document
            yield writingSet.save();
            console.log('✅ Writing Set updated successfully!');
            // Verify the update
            const updatedSet = yield questionSet_model_1.QuestionSet.findOne({ setId: 'WRITING_SET_001' });
            if (updatedSet && updatedSet.writingTasks) {
                console.log('\n📊 Updated Tasks:');
                updatedSet.writingTasks.forEach((task, index) => {
                    console.log(`  Task ${index + 1}:`);
                    console.log(`    - Type: ${task.taskType}`);
                    console.log(`    - SubType: ${task.task1SubType || task.task2SubType || 'N/A'}`);
                    console.log(`    - Image URL: ${task.imageUrl || 'No image'}`);
                });
            }
        }
        catch (error) {
            console.error('❌ Error updating images:', error);
        }
        finally {
            yield mongoose_1.default.disconnect();
            console.log('\n🔌 Disconnected from MongoDB');
        }
    });
}
// Run the update
updateWritingImages()
    .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
})
    .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
