const mongoose = require('mongoose');
const DATABASE_URL = 'mongodb+srv://sakib:NXvrDSl7qvqii0Uq@cluster0.mspodzi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function run() {
    await mongoose.connect(DATABASE_URL);
    const ReadingTest = mongoose.model('ReadingTest', new mongoose.Schema({}, { strict: false }), 'readingtests');

    // Find tests where at least one question in any section lacks correctAnswer
    const tests = await ReadingTest.find({
        'sections.questions': {
            $elemMatch: {
                correctAnswer: { $exists: false }
            }
        }
    });

    console.log('Tests with questions missing correctAnswer:', tests.length);
    if (tests.length > 0) {
        console.log('Sample TestNumber:', tests[0].testNumber);
    }

    await mongoose.disconnect();
}

run();
