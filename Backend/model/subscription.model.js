const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      unique: true,
    },
    plan: {
      type: {
        type: String,
        enum: ["free", "basic", "premium"],
        default: "free",
        required: [true, "Subscription type is required"],
      },
      expiryDate: {
        type: Date,
        required: function () {
          return this.plan.type !== "free";
        },
      },
    },
    paymentHistory: [
      {
        amount: {
          type: Number,
          required: [true, "Payment amount is required"],
          min: [0, "Payment amount cannot be negative"],
        },
        date: {
          type: Date,
          required: [true, "Payment date is required"],
          default: Date.now,
        },
        planType: {
          type: String,
          required: [true, "Plan type for payment is required"],
          enum: ["basic", "premium"],
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing
subscriptionSchema.index({ user: 1 }, { unique: true });
subscriptionSchema.index({ "plan.type": 1 });
subscriptionSchema.index({ isActive: 1 });

// Methods
subscriptionSchema.methods.renewSubscription = function (planType, expiryDate) {
  this.plan.type = planType;
  this.plan.expiryDate = expiryDate;
  this.isActive = true;
  return this.save();
};

subscriptionSchema.methods.cancelSubscription = function () {
  this.isActive = false;
  return this.save();
};

// Virtuals
subscriptionSchema.virtual("isExpired").get(function () {
  if (this.plan.type === "free") return false;
  return this.plan.expiryDate < new Date();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
