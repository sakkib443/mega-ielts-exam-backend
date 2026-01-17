"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_BAND_DESCRIPTORS = exports.calculateWritingBand = exports.WRITING_TOPIC_CATEGORIES = void 0;
// Common topic categories for IELTS Writing
exports.WRITING_TOPIC_CATEGORIES = [
    "Education",
    "Technology",
    "Environment",
    "Health",
    "Society",
    "Culture",
    "Economy",
    "Government",
    "Media",
    "Crime",
    "Sports",
    "Travel",
    "Work",
    "Family",
    "Science",
    "Art",
    "Food",
    "Housing",
    "Transport",
    "Communication"
];
// Calculate overall writing band from criteria scores
const calculateWritingBand = (scores) => {
    const { taskAchievement, coherenceCohesion, lexicalResource, grammaticalAccuracy } = scores;
    const average = (taskAchievement + coherenceCohesion + lexicalResource + grammaticalAccuracy) / 4;
    // Round to nearest 0.5
    return Math.round(average * 2) / 2;
};
exports.calculateWritingBand = calculateWritingBand;
// Default band descriptors
exports.DEFAULT_BAND_DESCRIPTORS = [
    {
        band: 9,
        taskAchievement: "Fully addresses all parts of the task; presents a fully developed position",
        coherenceCohesion: "Uses cohesion in such a way that it attracts no attention; skillfully manages paragraphing",
        lexicalResource: "Uses a wide range of vocabulary with very natural and sophisticated control",
        grammaticalRange: "Uses a wide range of structures with full flexibility and accuracy"
    },
    {
        band: 8,
        taskAchievement: "Sufficiently addresses all parts of the task; presents a well-developed response",
        coherenceCohesion: "Sequences information and ideas logically; manages all aspects of cohesion well",
        lexicalResource: "Uses a wide range of vocabulary fluently and flexibly; rare minor errors",
        grammaticalRange: "Uses a wide range of structures; majority of sentences are error-free"
    },
    {
        band: 7,
        taskAchievement: "Addresses all parts of the task; presents a clear position throughout the response",
        coherenceCohesion: "Logically organizes information and ideas; clear progression throughout",
        lexicalResource: "Uses sufficient range of vocabulary; uses less common lexical items with some awareness",
        grammaticalRange: "Uses a variety of complex structures; produces frequent error-free sentences"
    },
    {
        band: 6,
        taskAchievement: "Addresses all parts of the task although some parts may be more fully covered than others",
        coherenceCohesion: "Arranges information and ideas coherently; uses cohesive devices effectively",
        lexicalResource: "Uses an adequate range of vocabulary; attempts less common vocabulary with some inaccuracy",
        grammaticalRange: "Uses a mix of simple and complex sentence forms; makes some errors in grammar"
    },
    {
        band: 5,
        taskAchievement: "Addresses the task only partially; format may be inappropriate in places",
        coherenceCohesion: "Presents information with some organization but there may be lack of overall progression",
        lexicalResource: "Uses a limited range of vocabulary; may make noticeable errors in spelling/word formation",
        grammaticalRange: "Uses only a limited range of structures; attempts complex sentences but with limited accuracy"
    }
];
