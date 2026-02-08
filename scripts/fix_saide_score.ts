import mongoose from "mongoose";
import dotenv from "dotenv";
import { Student } from "../src/app/modules/student/student.model";
import { AutoMarkingService } from "../src/app/modules/examSession/autoMarking.service";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const fixSaideScore = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL as string);
        console.log("Connected to database");

        const examId = "BACIELTS260015";
        const student = await Student.findOne({ examId: examId.toUpperCase() });

        if (!student) {
            console.log("Student not found");
            return;
        }

        console.log("Found student:", student.nameEnglish);

        const listeningCorrect = student.scores?.listening?.correctAnswers || 0;
        const readingCorrect = student.scores?.reading?.correctAnswers || 0;

        // Recalculate using NEW AutoMarkingService
        const newListeningBand = AutoMarkingService.convertToBandScore(listeningCorrect, "listening");
        const newReadingBand = AutoMarkingService.convertToBandScore(readingCorrect, "reading");

        console.log(`Updating scores for ${listeningCorrect} listening and ${readingCorrect} reading...`);
        console.log(`Old Listening Band: ${student.scores?.listening?.band} -> New: ${newListeningBand}`);

        if (student.scores) {
            student.scores.listening.band = newListeningBand;
            student.scores.reading.band = newReadingBand;

            const bands = [newListeningBand, newReadingBand, student.scores.writing?.overallBand || 0].filter(b => b > 0);
            student.scores.overall = AutoMarkingService.calculateOverallBand(bands);
        }

        await student.save();
        console.log("Successfully fixed student scores using official IELTS tables!");

    } catch (error) {
        console.error("Error fixing scores:", error);
    } finally {
        await mongoose.disconnect();
    }
};

fixSaideScore();
