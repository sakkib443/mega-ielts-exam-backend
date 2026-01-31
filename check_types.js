const mongoose = require('mongoose');

const DATABASE_URL = 'mongodb+srv://sakib:NXvrDSl7qvqii0Uq@cluster0.mspodzi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function checkQuestionTypes() {
    try {
        await mongoose.connect(DATABASE_URL);
        console.log('Connected to database');

        const ReadingTest = mongoose.model('ReadingTest', new mongoose.Schema({}, { strict: false }), 'readingtests');

        const test = await ReadingTest.findOne({ testNumber: 1702 });

        if (!test) {
            console.log('Test 1702 not found');
            return;
        }

        console.log('Test Title:', test.title);

        test.sections.forEach((section, sIdx) => {
            console.log(`\nSection ${sIdx + 1}: ${section.title}`);
            const types = new Set();
            if (section.questions) {
                section.questions.forEach(q => types.add(q.questionType));
            }
            console.log('Question Types:', Array.from(types));

            if (section.questionGroups) {
                console.log('Question Groups:', section.questionGroups.map(g => g.groupType || g.questionType));
            }
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkQuestionTypes();
