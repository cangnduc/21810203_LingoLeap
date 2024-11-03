import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Ordering = ({ question, onAnswerChange, currentAnswer = [] }) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const itemIds = currentAnswer.length
      ? currentAnswer
      : question.items.map((item) => item.id);

    const reorderedIds = Array.from(itemIds);
    const [movedId] = reorderedIds.splice(result.source.index, 1);
    reorderedIds.splice(result.destination.index, 0, movedId);

    onAnswerChange(reorderedIds);
  };

  const items = currentAnswer.length
    ? currentAnswer.map((id) => question.items.find((item) => item.id === id))
    : question.items;

  return (
    <div className="mb-6">
      <h3 className="font-medium mb-2">{question.questionText}</h3>
      {question.instruction && (
        <p className="text-gray-600 mb-2">{question.instruction}</p>
      )}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="ordering">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {items.map((item, index) => (
                <Draggable key={item?.id} draggableId={item?.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-3 bg-white border rounded shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 cursor-grab active:cursor-grabbing"
                    >
                      {index + 1}. {item?.text || "Invalid item"}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Ordering;
