"use strict";
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
const config_1 = __importDefault(require("../app/config"));
function checkDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.database_url);
            console.log("Connected to MongoDB");
            const db = mongoose_1.default.connection.db;
            // Check question sets
            const questionSets = yield db.collection("questionsets").find({}).toArray();
            console.log("\n=== Question Sets ===");
            console.log("Total:", questionSets.length);
            questionSets.forEach((s) => {
                console.log(`- ${s.title} | Type: ${s.setType} | SetNumber: ${s.setNumber}`);
            });
            // Check students
            const students = yield db.collection("students").find({}).toArray();
            console.log("\n=== Students ===");
            console.log("Total:", students.length);
            // Check exams
            const exams = yield db.collection("exams").find({}).toArray();
            console.log("\n=== Exams ===");
            console.log("Total:", exams.length);
            yield mongoose_1.default.disconnect();
            console.log("\nDisconnected");
        }
        catch (error) {
            console.error("Error:", error);
            process.exit(1);
        }
    });
}
checkDatabase();
