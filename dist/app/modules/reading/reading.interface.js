"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReadingBandScore = exports.READING_BAND_CONVERSION_GT = exports.READING_BAND_CONVERSION_ACADEMIC = void 0;
// Band score conversion (IELTS Academic Reading)
exports.READING_BAND_CONVERSION_ACADEMIC = {
    40: 9.0, 39: 9.0,
    38: 8.5, 37: 8.5,
    36: 8.0, 35: 8.0,
    34: 7.5, 33: 7.5,
    32: 7.0, 31: 7.0, 30: 7.0,
    29: 6.5, 28: 6.5, 27: 6.5,
    26: 6.0, 25: 6.0, 24: 6.0, 23: 6.0,
    22: 5.5, 21: 5.5, 20: 5.5, 19: 5.5,
    18: 5.0, 17: 5.0, 16: 5.0, 15: 5.0,
    14: 4.5, 13: 4.5,
    12: 4.0, 11: 4.0, 10: 4.0,
    9: 3.5, 8: 3.5,
    7: 3.0, 6: 3.0,
    5: 2.5, 4: 2.5,
    3: 2.0, 2: 2.0,
    1: 1.0,
    0: 0
};
// Band score conversion (IELTS General Training Reading)
exports.READING_BAND_CONVERSION_GT = {
    40: 9.0,
    39: 8.5,
    38: 8.0, 37: 8.0,
    36: 7.5, 35: 7.5, 34: 7.5,
    33: 7.0, 32: 7.0,
    31: 6.5, 30: 6.5,
    29: 6.0, 28: 6.0, 27: 6.0,
    26: 5.5, 25: 5.5, 24: 5.5, 23: 5.5,
    22: 5.0, 21: 5.0, 20: 5.0, 19: 5.0, 18: 5.0,
    17: 4.5, 16: 4.5, 15: 4.5,
    14: 4.0, 13: 4.0, 12: 4.0,
    11: 3.5, 10: 3.5, 9: 3.5,
    8: 3.0, 7: 3.0, 6: 3.0,
    5: 2.5, 4: 2.5,
    3: 2.0, 2: 2.0,
    1: 1.0,
    0: 0
};
// Helper function to get band score
const getReadingBandScore = (correctAnswers, testType = "academic") => {
    if (correctAnswers > 40)
        correctAnswers = 40;
    if (correctAnswers < 0)
        correctAnswers = 0;
    const conversion = testType === "academic"
        ? exports.READING_BAND_CONVERSION_ACADEMIC
        : exports.READING_BAND_CONVERSION_GT;
    return conversion[correctAnswers] || 0;
};
exports.getReadingBandScore = getReadingBandScore;
