import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Ordering = ({ question, onAnswerChange, currentAnswer = [] }) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(
      currentAnswer.length ? currentAnswer : question.items
    );
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onAnswerChange(items.map((item) => item.id));
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
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-3 bg-white border rounded shadow-sm"
                    >
                      {item.text}
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
