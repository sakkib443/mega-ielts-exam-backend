const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://sakib:NXvrDSl7qvqii0Uq@cluster0.mspodzi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(async () => {
        console.log('Connected to MongoDB');

        // Update user role to admin
        const result = await mongoose.connection.db.collection('users').updateOne(
            { email: 'admin@gmail.com' },
            { $set: { role: 'admin' } }
        );

        if (result.modifiedCount > 0) {
            console.log('\n✅ SUCCESS: User role updated to ADMIN');
            console.log('\n=== ADMIN CREDENTIALS ===');
            console.log('Email: admin@gmail.com');
            console.log('Password: admin@gmail.com');
            console.log('Role: admin');
            console.log('========================\n');
        } else {
            console.log('No user found or already admin');
        }

        await mongoose.connection.close();
        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
