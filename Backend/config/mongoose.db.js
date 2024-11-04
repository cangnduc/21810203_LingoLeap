const mongoose = require("mongoose");

const connectionString =
  process.env.NODE_ENV === "development"
    ? process.env.DEV_DB_MONGO_URI
    : process.env.PROD_DB_MONGO_URI;

class Database {
  connect(type = "mongoose") {
    if (type === "mongoose") {
      mongoose
        .connect(connectionString, {
          serverSelectionTimeoutMS: 5000, // 5 seconds timeout
        })
        .then(() => {
          console.log("Database connection successful");
        })
        .catch((err) => {
          console.error("Database connection error:", err);

          process.exit(1);
        });

      mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        console.log("MongoDB disconnected. Attempting to reconnect...");
        this.connect();
      });
    }
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
