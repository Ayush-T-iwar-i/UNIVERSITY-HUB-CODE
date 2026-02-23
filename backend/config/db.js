const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("🗄️  Database Connected");
    console.log(`📡 Host: ${conn.connection.host}`);

  } catch (error) {
    console.error("❌ Database Connection Failed");
    process.exit(1);
  }
};

module.exports = connectDB;
