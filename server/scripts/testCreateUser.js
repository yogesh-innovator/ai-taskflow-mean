// scripts/testCreateUser.js
require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('../src/models/user.model');

async function run() {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      throw new Error('MONGO_URI is not set in .env');
    }

    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB for test script');

    // Clear the test user if it exists
    await User.deleteOne({ email: 'test.user@example.com' });

    const user = new User({
      name: 'Test User',
      email: 'test.user@example.com',
      passsword: 'MyStrongPassword123', // this will be hashed by pre-save hook
      role: 'admin',
    });

    await user.save();

    console.log('✅ User created with id:', user._id);

    // Fetch from DB including passwordHash (since select: false)

    const fetchedUser = await User.findOne({ email: 'test.user@example.com' }).select(
      '+passwordHash'
    );

    console.log('Stored passwordHash:', fetchedUser.passwordHash);

    const isMatch = await fetchedUser.comparePassword('MyStrongPassword123');
    const isWrongMatch = await fetchedUser.comparePassword('WrongPassword');

    console.log('Correct password matches?', isMatch);
    console.log('Wrong password matches?', isWrongMatch);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (err) {
    console.error('❌ Error in test script:', err);
    process.exit(1);
  }
}
run();
