const connectDB = require("../../config/mongoose.db");
const saveDummyData = require("../dummy.data/questions");

async function seedDatabase() {
  try {
    await saveDummyData();
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

module.exports = seedDatabase;
