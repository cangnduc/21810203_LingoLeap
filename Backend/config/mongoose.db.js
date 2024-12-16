const mongoose = require("mongoose");

const connectionString =
  process.env.NODE_ENV === "development"
    ? process.env.DEV_DB_MONGO_URI
    : process.env.PROD_DB_MONGO_URI;

class Database {
  constructor() {
    this.maxRetries = 5;
    this.retryDelay = 5000; // 5 seconds
    this.currentRetries = 0;
  }

  async connect(type = "mongoose") {
    if (type === "mongoose") {
      try {
        await mongoose.connect(connectionString, {
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 10000,
          socketTimeoutMS: 45000,
          retryWrites: true,
          retryReads: true,
          maxPoolSize: 10,
          minPoolSize: 5,
        });

        console.log("Database connection successful");

        // Reset retry counter on successful connection
        this.currentRetries = 0;

        // Set up connection event handlers
        mongoose.connection.on("error", (err) => {
          console.error("MongoDB connection error:", err);
          this.handleConnectionError();
        });

        mongoose.connection.on("disconnected", () => {
          console.log("MongoDB disconnected. Attempting to reconnect...");
          this.handleConnectionError();
        });
      } catch (err) {
        console.error("Database connection error:", err);
        this.handleConnectionError();
      }
    }
  }

  async handleConnectionError() {
    if (this.currentRetries < this.maxRetries) {
      this.currentRetries++;
      console.log(
        `Retrying connection... Attempt ${this.currentRetries} of ${this.maxRetries}`
      );

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, this.retryDelay));

      // Exponential backoff
      this.retryDelay = Math.min(this.retryDelay * 1.5, 30000); // Max 30 seconds

      // Close existing connection if any
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
      }

      // Retry connection
      await this.connect();
    } else {
      console.error(
        "Max retry attempts reached. Please check your database connection and restart the server."
      );
      // Optionally exit the process
      // process.exit(1);
    }
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // Method to reset connection
  async resetConnection() {
    this.currentRetries = 0;
    this.retryDelay = 5000;
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    await this.connect();
  }

  // Method to check connection status
  isConnected() {
    return mongoose.connection.readyState === 1;
  }
}

const instanceMongodb = Database.getInstance();

// Export both the instance and the class
module.exports = instanceMongodb;
