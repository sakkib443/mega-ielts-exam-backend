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
const questionSet_model_1 = require("../app/modules/questionSet/questionSet.model");
function seedTest() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.database_url);
            console.log("Connected to MongoDB");
            const listeningTest1 = {
                setType: "LISTENING",
                title: "Cambridge IELTS Test 1 - Listening",
                description: "Complete IELTS Listening Test 1 with 4 parts and 40 questions.",
                duration: 40,
                difficulty: "medium",
                mainAudioUrl: "",
                audioDuration: 0,
                sections: [
                    {
                        sectionNumber: 1,
                        title: "Part 1 - Buckworth Conservation Group",
                        instructions: "Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
                        audioUrl: "",
                        questions: [
                            { questionNumber: 1, questionType: "form-completion", questionText: "Beach - making sure the beach does not have _______ on it", correctAnswer: "litter", marks: 1 },
                            { questionNumber: 2, questionType: "form-completion", questionText: "Nature reserve - improvements to _______ for birdwatching", correctAnswer: "hide", marks: 1 },
                            { questionNumber: 3, questionType: "form-completion", questionText: "Next task is taking action to attract _______ to the place", correctAnswer: "butterflies", marks: 1 },
                            {
                                questionNumber: 4, questionType: "form-completion", questionText: "Identifying types of _______", correctAnswer: ",
                                ", marks: 1 },: {
                                    questionNumber: 5, questionType: "form-completion", questionText: "Building a new _______", correctAnswer: ",
                                    ", marks: 1 },: {
                                        questionNumber: 6, questionType: "form-completion", questionText: "Saturday - walk across the sands and reach the _______", correctAnswer: ",
                                        ", marks: 1 },: {
                                            questionNumber: 7, questionType: "form-completion", questionText: "Take a picnic, wear appropriate _______", correctAnswer: ",
                                            ", marks: 1 },: {
                                                questionNumber: 8, questionType: "form-completion", questionText: "Woodwork session - Suitable for _______ to participate in", correctAnswer: ",
                                                ", marks: 1 },: {
                                                    questionNumber: 9, questionType: "form-completion", questionText: "Making _______ out of wood", correctAnswer: ",
                                                    ", marks: 1 },: {
                                                        questionNumber: 10, questionType: "form-completion", questionText: "Cost of session (no camping): GBP _______", correctAnswer: ",
                                                        ", marks: 1 },: 
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        ],
                    },
                    {
                        sectionNumber: 2,
                        title: "Part 2 - Boat trip round Tasmania",
                        instructions: "Choose the correct letter, A, B or C.",
                        audioUrl: "",
                        questions: [
                            { questionNumber: 11, questionType: "multiple-choice", questionText: "What is the maximum number of people who can stand on each side of the boat?", options: ["A. 9", "B. 15", "C. 18"], correctAnswer: "B", marks: 1 },
                            { questionNumber: 12, questionType: "multiple-choice", questionText: "What colour are the tour boats?", options: ["A. dark red", "B. jet black", "C. light green"], correctAnswer: "C", marks: 1 },
                            { questionNumber: 13, questionType: "multiple-choice", questionText: "Which lunchbox is suitable for someone who does not eat meat or fish?", options: ["A. Lunchbox 1", "B. Lunchbox 2", "C. Lunchbox 3"], correctAnswer: "B", marks: 1 },
                            { questionNumber: 14, questionType: "multiple-choice", questionText: "What should people do with their litter?", options: ["A. take it home", "B. hand it to a member of staff", "C. put it in the bins provided on the boat"], correctAnswer: "B", marks: 1 },
                            { questionNumber: 15, questionType: "multiple-choice", questionText: "Which TWO features of the lighthouse does Lou mention? (First)", options: ["A. why it was built", "B. who built it", "C. how long it took to build", "D. who staffed it", "E. what it was built with"], correctAnswer: "A", marks: 1 },
                            { questionNumber: 16, questionType: "multiple-choice", questionText: "Which TWO features of the lighthouse does Lou mention? (Second)", options: ["A. why it was built", "B. who built it", "C. how long it took to build", "D. who staffed it", "E. what it was built with"], correctAnswer: "C", marks: 1 },
                            { questionNumber: 17, questionType: "multiple-choice", questionText: "Which TWO types of creature might come close to the boat? (First)", options: ["A. sea eagles", "B. fur seals", "C. dolphins", "D. whales", "E. penguins"], correctAnswer: "B", marks: 1 },
                            { questionNumber: 18, questionType: "multiple-choice", questionText: "Which TWO types of creature might come close to the boat? (Second)", options: ["A. sea eagles", "B. fur seals", "C. dolphins", "D. whales", "E. penguins"], correctAnswer: "C", marks: 1 },
                            { questionNumber: 19, questionType: "multiple-choice", questionText: "Which TWO points does Lou make about the caves? (First)", options: ["A. Only large tourist boats can visit them.", "B. The entrances to them are often blocked.", "C. It is too dangerous for individuals to go near them.", "D. Someone will explain what is inside them.", "E. They cannot be reached on foot."], correctAnswer: "C", marks: 1 },
                            { questionNumber: 20, questionType: "multiple-choice", questionText: "Which TWO points does Lou make about the caves? (Second)", options: ["A. Only large tourist boats can visit them.", "B. The entrances to them are often blocked.", "C. It is too dangerous for individuals to go near them.", "D. Someone will explain what is inside them.", "E. They cannot be reached on foot."], correctAnswer: "E", marks: 1 },
                        ],
                    },
                    {
                        sectionNumber: 3,
                        title: "Part 3 - Work experience for veterinary science students",
                        instructions: "Choose the correct letter, A, B or C.",
                        audioUrl: "",
                        questions: [
                            { questionNumber: 21, questionType: "multiple-choice", questionText: "What problem did both Diana and Tim have when arranging their work experience?", options: ["A. making initial contact with suitable farms", "B. organising transport to and from the farm", "C. finding a placement for the required length of time"], correctAnswer: "C", marks: 1 },
                            { questionNumber: 22, questionType: "multiple-choice", questionText: "Tim was pleased to be able to help", options: ["A. a lamb that had a broken leg.", "B. a sheep that was having difficulty giving birth.", "C. a newly born lamb that was having trouble feeding."], correctAnswer: "C", marks: 1 },
                            { questionNumber: 23, questionType: "multiple-choice", questionText: "Diana says the sheep on her farm", options: ["A. were of various different varieties.", "B. were mainly reared for their meat.", "C. had better quality wool than sheep on the hills."], correctAnswer: "A", marks: 1 },
                            { questionNumber: 24, questionType: "multiple-choice", questionText: "What did the students learn about adding supplements to chicken feed?", options: ["A. These should only be given if specially needed.", "B. It is worth paying extra for the most effective ones.", "C. The amount given at one time should be limited."], correctAnswer: "A", marks: 1 },
                            { questionNumber: 25, questionType: "multiple-choice", questionText: "What happened when Diana was working with dairy cows?", options: ["A. She identified some cows incorrectly.", "B. She accidentally threw some milk away.", "C. She made a mistake when storing milk."], correctAnswer: "A", marks: 1 },
                            { questionNumber: 26, questionType: "multiple-choice", questionText: "What did both farmers mention about vets and farming?", options: ["A. Vets are failing to cope with some aspects of animal health.", "B. There needs to be a fundamental change in the training of vets.", "C. Some jobs could be done by the farmer rather than by a vet."], correctAnswer: "C", marks: 1 },
                            { questionNumber: 27, questionType: "matching", questionText: "Medical terminology - What opinion do the students give?", options: ["A. Tim found this easier than expected.", "B. Tim thought this was not very clearly organised.", "C. Diana may do some further study on this.", "D. They both found the reading required for this was difficult.", "E. Tim was shocked at something he learned on this module.", "F. They were both surprised how little is known about some aspects of this."], correctAnswer: "A", marks: 1 },
                            { questionNumber: 28, questionType: "matching", questionText: "Diet and nutrition - What opinion do the students give?", options: ["A. Tim found this easier than expected.", "B. Tim thought this was not very clearly organised.", "C. Diana may do some further study on this.", "D. They both found the reading required for this was difficult.", "E. Tim was shocked at something he learned on this module.", "F. They were both surprised how little is known about some aspects of this."], correctAnswer: "D", marks: 1 },
                            { questionNumber: 29, questionType: "matching", questionText: "Animal disease - What opinion do the students give?", options: ["A. Tim found this easier than expected.", "B. Tim thought this was not very clearly organised.", "C. Diana may do some further study on this.", "D. They both found the reading required for this was difficult.", "E. Tim was shocked at something he learned on this module.", "F. They were both surprised how little is known about some aspects of this."], correctAnswer: "E", marks: 1 },
                            { questionNumber: 30, questionType: "matching", questionText: "Wildlife medication - What opinion do the students give?", options: ["A. Tim found this easier than expected.", "B. Tim thought this was not very clearly organised.", "C. Diana may do some further study on this.", "D. They both found the reading required for this was difficult.", "E. Tim was shocked at something he learned on this module.", "F. They were both surprised how little is known about some aspects of this."], correctAnswer: "F", marks: 1 },
                        ],
                    },
                    {
                        sectionNumber: 4,
                        title: "Part 4 - Labyrinths",
                        instructions: "Complete the notes below. Write ONE WORD ONLY for each answer.",
                        audioUrl: "",
                        questions: [
                            { questionNumber: 31, questionType: "note-completion", questionText: "Labyrinths compared with mazes - Mazes are a type of _______", correctAnswer: "puzzle", marks: 1 },
                            {
                                questionNumber: 32, questionType: "note-completion", questionText: "_______ is needed to navigate through a maze", correctAnswer: ",
                                ", marks: 1 },: {
                                    questionNumber: 33, questionType: "note-completion", questionText: "The word maze is derived from a word meaning a feeling of _______", correctAnswer: ",
                                    ", marks: 1 },: {
                                        questionNumber: 34, questionType: "note-completion", questionText: "Labyrinths have frequently been used in _______ and prayer", correctAnswer: ",
                                        ", marks: 1 },: {
                                            questionNumber: 35, questionType: "note-completion", questionText: "Ancient carvings on _______ have been found across many cultures", correctAnswer: ",
                                            ", marks: 1 },: {
                                                questionNumber: 36, questionType: "note-completion", questionText: "Ancient Greeks used the symbol on _______", correctAnswer: ",
                                                ", marks: 1 },: {
                                                    questionNumber: 37, questionType: "note-completion", questionText: "The largest surviving turf labyrinth once had a big _______ in the centre", correctAnswer: ",
                                                    ", marks: 1 },: {
                                                        questionNumber: 38, questionType: "note-completion", questionText: "Walking a maze can reduce a persons _______ rate", correctAnswer: ",
                                                        ", marks: 1 },: {
                                                            questionNumber: 39, questionType: "note-completion", questionText: "Patients who cannot walk can use finger labyrinths made from _______", correctAnswer: ",
                                                            ", marks: 1 },: {
                                                                questionNumber: 40, questionType: "note-completion", questionText: "Alzheimer sufferers experience less _______", correctAnswer: ",
                                                                ", marks: 1 },: 
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        ],
                    },
                ],
            };
            const newSet = yield questionSet_model_1.QuestionSet.create(listeningTest1);
            console.log("Listening Test 1 created!");
            console.log("Set ID:", newSet.setId);
            console.log("Set Number:", newSet.setNumber);
            console.log("Total Questions:", newSet.totalQuestions);
            yield mongoose_1.default.disconnect();
            console.log("Done!");
        }
        catch (error) {
            console.error("Error:", error);
            process.exit(1);
        }
    });
}
seedTest();
