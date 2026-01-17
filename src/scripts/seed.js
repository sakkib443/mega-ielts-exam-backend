const mongoose = require(mongoose);
const MONGODB_URI = mongodb+srv://sakib:NXvrDSl7qvqii0Uq@cluster0.mspodzi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0;

const questionSetSchema = new mongoose.Schema({
    setId: String, setType: String, setNumber: Number, title: String, description: String,
    sections: Array, writingTasks: Array, mainAudioUrl: String, audioDuration: Number,
    totalQuestions: Number, totalMarks: Number, duration: Number, difficulty: String,
    isActive: { type: Boolean, default: true }, usageCount: { type: Number, default: 0 },
    createdBy: mongoose.Schema.Types.ObjectId
}, { timestamps: true });

questionSetSchema.pre(save, async function(next) {
    if (this.isNew) {
        const count = await mongoose.model(QuestionSet).countDocuments({ setType: this.setType });
        this.setNumber = count + 1;
        this.setId = this.setType + _SET_ + String(this.setNumber).padStart(3, 0);
        let totalQ = 0, totalM = 0;
        if (this.sections) {
            this.sections.forEach(s => {
                if (s.questions) {
                    totalQ += s.questions.length;
                    s.questions.forEach(q => totalM += q.marks || 1);
                }
            });
        }
        this.totalQuestions = totalQ;
        this.totalMarks = totalM;
    }
    next();
});

const QuestionSet = mongoose.model(QuestionSet, questionSetSchema);

const data = {
    setType: LISTENING,
    title: Cambridge IELTS Test 1 - Listening,
    description: IELTS Listening Test 1 with 40 questions,
    duration: 40, difficulty: medium, mainAudioUrl: ", audioDuration: 0,
 sections: [
 { sectionNumber: 1, title: Part 1, instructions: Complete the notes, audioUrl: ,
 questions: [
 {questionNumber:1,questionType:form-completion,questionText:Q1,correctAnswer:litter,marks:1},
 {questionNumber:2,questionType:form-completion,questionText:Q2,correctAnswer:hide,marks:1},
 {questionNumber:3,questionType:form-completion,questionText:Q3,correctAnswer:butterflies,marks:1},
 {questionNumber:4,questionType:form-completion,questionText:Q4,correctAnswer:TBD,marks:1},
 {questionNumber:5,questionType:form-completion,questionText:Q5,correctAnswer:TBD,marks:1},
 {questionNumber:6,questionType:form-completion,questionText:Q6,correctAnswer:TBD,marks:1},
 {questionNumber:7,questionType:form-completion,questionText:Q7,correctAnswer:TBD,marks:1},
 {questionNumber:8,questionType:form-completion,questionText:Q8,correctAnswer:TBD,marks:1},
 {questionNumber:9,questionType:form-completion,questionText:Q9,correctAnswer:TBD,marks:1},
 {questionNumber:10,questionType:form-completion,questionText:Q10,correctAnswer:TBD,marks:1}
 ]
 },
 { sectionNumber: 2, title: Part 2, instructions: MCQ, audioUrl: ,
 questions: [
 {questionNumber:11,questionType:multiple-choice,questionText:Q11,options:[A,B,C],correctAnswer:B,marks:1},
 {questionNumber:12,questionType:multiple-choice,questionText:Q12,options:[A,B,C],correctAnswer:C,marks:1},
 {questionNumber:13,questionType:multiple-choice,questionText:Q13,options:[A,B,C],correctAnswer:B,marks:1},
 {questionNumber:14,questionType:multiple-choice,questionText:Q14,options:[A,B,C],correctAnswer:B,marks:1},
 {questionNumber:15,questionType:multiple-choice,questionText:Q15,options:[A,B,C,D,E],correctAnswer:A,marks:1},
 {questionNumber:16,questionType:multiple-choice,questionText:Q16,options:[A,B,C,D,E],correctAnswer:C,marks:1},
 {questionNumber:17,questionType:multiple-choice,questionText:Q17,options:[A,B,C,D,E],correctAnswer:B,marks:1},
 {questionNumber:18,questionType:multiple-choice,questionText:Q18,options:[A,B,C,D,E],correctAnswer:C,marks:1},
 {questionNumber:19,questionType:multiple-choice,questionText:Q19,options:[A,B,C,D,E],correctAnswer:C,marks:1},
 {questionNumber:20,questionType:multiple-choice,questionText:Q20,options:[A,B,C,D,E],correctAnswer:E,marks:1}
 ]
 },
 { sectionNumber: 3, title: Part 3, instructions: MCQ, audioUrl: ,
 questions: [
 {questionNumber:21,questionType:multiple-choice,questionText:Q21,options:[A,B,C],correctAnswer:C,marks:1},
 {questionNumber:22,questionType:multiple-choice,questionText:Q22,options:[A,B,C],correctAnswer:C,marks:1},
 {questionNumber:23,questionType:multiple-choice,questionText:Q23,options:[A,B,C],correctAnswer:A,marks:1},
 {questionNumber:24,questionType:multiple-choice,questionText:Q24,options:[A,B,C],correctAnswer:A,marks:1},
 {questionNumber:25,questionType:multiple-choice,questionText:Q25,options:[A,B,C],correctAnswer:A,marks:1},
 {questionNumber:26,questionType:multiple-choice,questionText:Q26,options:[A,B,C],correctAnswer:C,marks:1},
 {questionNumber:27,questionType:matching,questionText:Q27,options:[A,B,C,D,E,F],correctAnswer:A,marks:1},
 {questionNumber:28,questionType:matching,questionText:Q28,options:[A,B,C,D,E,F],correctAnswer:D,marks:1},
 {questionNumber:29,questionType:matching,questionText:Q29,options:[A,B,C,D,E,F],correctAnswer:E,marks:1},
 {questionNumber:30,questionType:matching,questionText:Q30,options:[A,B,C,D,E,F],correctAnswer:F,marks:1}
 ]
 },
 { sectionNumber: 4, title: Part 4, instructions: Complete notes, audioUrl: ,
 questions: [
 {questionNumber:31,questionType:note-completion,questionText:Q31,correctAnswer:puzzle,marks:1},
 {questionNumber:32,questionType:note-completion,questionText:Q32,correctAnswer:TBD,marks:1},
 {questionNumber:33,questionType:note-completion,questionText:Q33,correctAnswer:TBD,marks:1},
 {questionNumber:34,questionType:note-completion,questionText:Q34,correctAnswer:TBD,marks:1},
 {questionNumber:35,questionType:note-completion,questionText:Q35,correctAnswer:TBD,marks:1},
 {questionNumber:36,questionType:note-completion,questionText:Q36,correctAnswer:TBD,marks:1},
 {questionNumber:37,questionType:note-completion,questionText:Q37,correctAnswer:TBD,marks:1},
 {questionNumber:38,questionType:note-completion,questionText:Q38,correctAnswer:TBD,marks:1},
 {questionNumber:39,questionType:note-completion,questionText:Q39,correctAnswer:TBD,marks:1},
 {questionNumber:40,questionType:note-completion,questionText:Q40,correctAnswer:TBD,marks:1}
 ]
 }
 ]
};

mongoose.connect(MONGODB_URI).then(async () => {
 console.log(Connected);
 const set = await QuestionSet.create(data);
 console.log(Created:, set.setId, Questions:, set.totalQuestions);
 await mongoose.disconnect();
}).catch(e => console.error(e));
