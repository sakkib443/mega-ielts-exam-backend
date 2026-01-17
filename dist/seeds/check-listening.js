"use strict";
/**
 * Check if Listening Test exists in database
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
dotenv.config();
const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/ielts';
function checkListening() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('🔌 Connecting to MongoDB...');
            yield mongoose_1.default.connect(MONGODB_URI);
            console.log('✅ Connected to MongoDB');
            // Find all listening sets
            const listeningSets = yield questionSet_model_1.QuestionSet.find({ setType: 'LISTENING' }).lean();
            console.log('\n📊 LISTENING QUESTION SETS:');
            console.log('Total count:', listeningSets.length);
            if (listeningSets.length > 0) {
                listeningSets.forEach((set, index) => {
                    var _a;
                    console.log(`\n${index + 1}. ${set.title}`);
                    console.log(`   Set ID: ${set.setId}`);
                    console.log(`   Total Questions: ${set.totalQuestions}`);
                    console.log(`   Sections: ${((_a = set.sections) === null || _a === void 0 ? void 0 : _a.length) || 0}`);
                    console.log(`   Active: ${set.isActive}`);
                });
            }
            else {
                console.log('❌ No listening sets found!');
            }
            // Also check all question sets
            const allSets = yield questionSet_model_1.QuestionSet.find().select('setId setType title totalQuestions isActive').lean();
            console.log('\n\n📊 ALL QUESTION SETS:');
            console.log('Total count:', allSets.length);
            allSets.forEach((set, index) => {
                console.log(`${index + 1}. [${set.setType}] ${set.title} - ${set.totalQuestions} questions`);
            });
        }
        catch (error) {
            console.error('❌ Error:', error);
        }
        finally {
            yield mongoose_1.default.disconnect();
            console.log('\n🔌 Disconnected from MongoDB');
        }
    });
}
checkListening();
