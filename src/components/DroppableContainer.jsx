import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export default function DroppableContainer({ id, items, children, className }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      <div
        ref={setNodeRef}
        className={`${className || ''} ${isOver ? 'drop-over' : ''}`}
      >
        {children}
      </div>
    </SortableContext>
  );
}
