import React from "react";
import { useDrag, useDrop } from "react-dnd";

const ItemType = "RULE";

interface DraggableRuleProps {
  index: number;
  moveRule: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
}

const DraggableRule: React.FC<DraggableRuleProps> = ({
  index,
  moveRule,
  children,
}) => {
  const ref = React.useRef<HTMLTableRowElement>(null);
  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveRule(item.index, index);
        item.index = index;
      }
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(drop(ref));

  return (
    <tr ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {children}
    </tr>
  );
};

export default DraggableRule;
