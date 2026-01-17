"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListeningBandScore = exports.LISTENING_BAND_CONVERSION = void 0;
// Band score conversion (IELTS Listening)
exports.LISTENING_BAND_CONVERSION = {
    40: 9.0, 39: 9.0,
    38: 8.5, 37: 8.5,
    36: 8.0, 35: 8.0,
    34: 7.5, 33: 7.5, 32: 7.5,
    31: 7.0, 30: 7.0,
    29: 6.5, 28: 6.5, 27: 6.5,
    26: 6.0, 25: 6.0, 24: 6.0, 23: 6.0,
    22: 5.5, 21: 5.5, 20: 5.5, 19: 5.5, 18: 5.5,
    17: 5.0, 16: 5.0,
    15: 4.5, 14: 4.5, 13: 4.5,
    12: 4.0, 11: 4.0, 10: 4.0,
    9: 3.5, 8: 3.5,
    7: 3.0, 6: 3.0, 5: 3.0,
    4: 2.5,
    3: 2.0,
    2: 1.5,
    1: 1.0,
    0: 0
};
// Helper function to get band score
const getListeningBandScore = (correctAnswers) => {
    if (correctAnswers > 40)
        correctAnswers = 40;
    if (correctAnswers < 0)
        correctAnswers = 0;
    return exports.LISTENING_BAND_CONVERSION[correctAnswers] || 0;
};
exports.getListeningBandScore = getListeningBandScore;
