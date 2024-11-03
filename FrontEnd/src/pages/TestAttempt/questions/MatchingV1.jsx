import React, { useState, useRef, useEffect } from "react";

const MatchingV1 = ({ question, onAnswerChange, currentAnswer = [] }) => {
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const leftItemsRef = useRef([]);
  const rightItemsRef = useRef([]);

  const getAlphabetLabel = (index) => {
    return String.fromCharCode(65 + index); // 65 is ASCII for 'A'
  };

  useEffect(() => {
    drawLines();
    // Add window resize listener
    window.addEventListener("resize", drawLines);
    return () => window.removeEventListener("resize", drawLines);
  }, [currentAnswer]);

  const drawLines = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size to match container
    const container = containerRef.current;
    if (!container) return;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // Draw existing connections
    currentAnswer.forEach((pair) => {
      const leftIndex = question.leftColumn.findIndex(
        (item) => item.id === pair.left
      );
      const rightIndex = question.rightColumn.findIndex(
        (item) => item.id === pair.right
      );

      const leftElement = leftItemsRef.current[leftIndex];
      const rightElement = rightItemsRef.current[rightIndex];

      if (leftElement && rightElement) {
        drawConnection(ctx, leftElement, rightElement);
      }
    });
  };
  const drawConnection = (ctx, leftEl, rightEl) => {
    const leftRect = leftEl.getBoundingClientRect();
    const rightRect = rightEl.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const startX = leftRect.right - containerRect.left;
    const startY = leftRect.top - containerRect.top + leftRect.height / 2;
    const endX = rightRect.left - containerRect.left;
    const endY = rightRect.top - containerRect.top + rightRect.height / 2;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const handleLeftClick = (index, event) => {
    setDrawing(true);
    setStartPoint({
      index,
      id: question.leftColumn[index].id,
      element: event.currentTarget,
    });
  };

  const handleRightClick = (index, event) => {
    if (drawing && startPoint) {
      const rightId = question.rightColumn[index].id;

      // Remove any existing connections to this right item
      const newAnswer = currentAnswer.filter((pair) => pair.right !== rightId);

      // Also remove any existing connection from the left item
      const filteredAnswer = newAnswer.filter(
        (pair) => pair.left !== startPoint.id
      );

      // Add the new connection
      filteredAnswer.push({
        left: startPoint.id,
        right: rightId,
      });

      onAnswerChange(filteredAnswer);
      setDrawing(false);
      setStartPoint(null);
    }
  };

  // Add this helper function to get item text by id
  const getItemTextById = (id, column) => {
    const item = column.find((item) => item.id === id);
    return item ? item.text : "";
  };

  return (
    <div className="mb-6">
      <h3 className="font-medium mb-2 text-gray-200">
        {question.questionText}
      </h3>
      {question.instruction && (
        <p className="text-gray-400 mb-2">{question.instruction}</p>
      )}

      <div
        ref={containerRef}
        className="relative flex justify-between mt-4 min-h-[200px]"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
        />

        {/* Left Column */}
        <div className="w-[45%] flex flex-col space-y-4">
          {question.leftColumn.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => (leftItemsRef.current[index] = el)}
              onClick={(e) => handleLeftClick(index, e)}
              className={`p-3 rounded-lg border border-gray-600 cursor-pointer
                hover:bg-gray-700 transition-colors
                ${
                  startPoint?.index === index
                    ? "bg-blue-500/20 border-blue-500"
                    : "bg-gray-800"
                }`}
            >
              <span className="text-gray-300">
                {index + 1}. {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="w-[45%] flex flex-col space-y-4">
          {question.rightColumn.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => (rightItemsRef.current[index] = el)}
              onClick={(e) => handleRightClick(index, e)}
              className={`p-3 rounded-lg border border-gray-600 cursor-pointer
                hover:bg-gray-700 transition-colors
                ${drawing ? "bg-gray-700" : "bg-gray-800"}`}
            >
              <span className="text-gray-300">
                {getAlphabetLabel(index)}. {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add the answer preview section */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h4 className="text-gray-300 font-medium mb-2">Current Matches:</h4>
        {currentAnswer.length === 0 ? (
          <p className="text-gray-400">No matches made yet</p>
        ) : (
          <div className="space-y-2">
            {currentAnswer.map((pair, index) => (
              <div key={index} className="text-gray-300">
                {pair.left}. {getItemTextById(pair.left, question.leftColumn)}
                <span className="text-gray-400 mx-2">→</span>
                {pair.right}.{" "}
                {getItemTextById(pair.right, question.rightColumn)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchingV1;
