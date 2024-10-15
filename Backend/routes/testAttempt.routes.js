router.post("/start/:testId", async (req, res) => {
  const userId = req.user._id;
  const testId = req.params.testId;

  try {
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    const attemptCount = await TestAttempt.countDocuments({
      user: userId,
      test: testId,
      status: { $in: ["completed", "in-progress"] },
    });

    if (attemptCount >= test.attemptsAllowed) {
      return res
        .status(403)
        .json({ message: "No attempts left for this test" });
    }

    const newAttempt = new TestAttempt({
      user: userId,
      test: testId,
      startTime: new Date(),
      maxEndTime: new Date(Date.now() + test.duration * 60000),
      status: "in-progress",
    });

    await newAttempt.save();

    res.json({
      message: "Test attempt started",
      attemptId: newAttempt._id,
      maxEndTime: newAttempt.maxEndTime,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error starting test attempt", error: error.message });
  }
});
