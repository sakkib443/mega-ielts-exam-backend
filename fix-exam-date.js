const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://sakib:NXvrDSl7qvqii0Uq@cluster0.mspodzi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(async () => {
        console.log('Connected to MongoDB');

        // Set exam date to today for all students
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const result = await mongoose.connection.db.collection('students').updateMany(
            {},
            {
                $set: {
                    examDate: today,
                    paymentStatus: 'paid',
                    examStatus: 'not-started',
                    isActive: true,
                    canRetake: true
                }
            }
        );

        console.log(`\n✅ Updated ${result.modifiedCount} students`);
        console.log('- Exam date set to today');
        console.log('- Payment status: paid');
        console.log('- Exam status: not-started');
        console.log('- Can take exam now!\n');

        await mongoose.connection.close();
        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
