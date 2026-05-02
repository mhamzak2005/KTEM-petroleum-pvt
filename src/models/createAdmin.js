const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 1. Define the Schema directly here to avoid path errors
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// 2. Hardcoded Connection String (Bypassing .env for this run)
const DB_URL = 'mongodb://mhamzak2005_db_user:vH0MuTtpwEC3MdbC@ac-0xqawzo-shard-00-00.nafupmg.mongodb.net:27017,ac-0xqawzo-shard-00-01.nafupmg.mongodb.net:27017,ac-0xqawzo-shard-00-02.nafupmg.mongodb.net:27017/?ssl=true&replicaSet=atlas-62rg8b-shard-0&authSource=admin&appName=Cluster0';

async function createAdmin() {
    try {
        console.log("Connecting directly to MongoDB Atlas...");
        await mongoose.connect(DB_URL);
        
        const hashedPassword = await bcrypt.hash('Admin123!', 10);
        
        await User.create({
            email: 'admin@ktem.com',
            password: hashedPassword,
            role: 'admin'
        });

        console.log("-----------------------------------------");
        console.log("✅ SUCCESS: Admin user created!");
        console.log("User: admin@ktem.com");
        console.log("Pass: Admin123!");
        console.log("-----------------------------------------");
        process.exit(0);
    } catch (error) {
        if (error.code === 11000) {
            console.log("⚠️  Note: This user already exists in your database.");
        } else {
            console.error("❌ ERROR:", error.message);
        }
        process.exit(1);
    }
}

createAdmin();