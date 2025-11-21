import React from "react";
import { Grip, Pencil, Trash2 } from "lucide-react";
import {
  BtnToUpdate,
  cardVariants,
  iconVariants,
  TodoItem,
  TodoListUpdateInput,
  TodoText,
} from "./style/DragableCard.style";
import {
  BtnToDelete,
  BtnToDrag,
  btnVarianst,
  ButtonContainer,
  TodoForm,
} from "./style/TodoBoard.style";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCardItem } from "../../hooks/useCardItem";

//interface

interface IDragableCardProps {
  todoId: number;
  todoText: string;
  index: number;
  onUpdateClick: (todoId: number, editText: string) => void;
  onDeleteClick: (todoId: number) => void;
  boardId: string;
  isOverlay: boolean;
}

function DragalbeCard({
  todoId,
  todoText,
  onDeleteClick,
  onUpdateClick,
  boardId,
  isOverlay = false,
}: IDragableCardProps) {
  // useCardItem 훅 사용
  const {
    isEditing,
    register,
    handleSubmit,
    onEditSubmit,
    onBlurHandler,
    onKeyDownHandler,
    onStartEditing,
  } = useCardItem({ todoId, todoText, onUpdateClick });
  //dnd-kit sortable 훅
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todoId,
    data: {
      type: "card",
      boardId: boardId,
    },
  });
  //dnd 스타일 정의
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  if (isDragging) {
    console.log(`[Card ID: ${todoId}] Is Dragging: ${isDragging}`);
    console.log(`[Card ID: ${todoId}] Transform Style: ${CSS.Transform.toString(transform)}`);
  }

  return (
    <TodoItem
      variants={cardVariants}
      initial="normal"
      whileHover={"hover"}
      ref={setNodeRef}
      style={style}
      $isOverlay={isOverlay}
      $isDragging={isDragging}
      {...listeners}
      {...attributes}
    >
      {isEditing ? (
        <TodoForm onSubmit={handleSubmit(onEditSubmit)}>
          <TodoListUpdateInput
            {...register("editText", { required: true })}
            autoFocus
            onBlur={onBlurHandler}
            onKeyDown={onKeyDownHandler}
          />
        </TodoForm>
      ) : (
        <TodoText onDoubleClick={onStartEditing}>{todoText}</TodoText>
      )}
      <ButtonContainer variants={iconVariants}>
        {/* isEditing으로 호출*/}
        <BtnToUpdate onClick={onStartEditing}>
          <Pencil />
        </BtnToUpdate>
        <BtnToDelete onClick={() => onDeleteClick(todoId)}>
          <Trash2 />
        </BtnToDelete>
        <BtnToDrag variants={btnVarianst}>
          <Grip />
        </BtnToDrag>
      </ButtonContainer>
    </TodoItem>
  );
}
//버튼을 클릭 혹은, 아이템을 더블 클릭시 수정모드(폼입력상태) 작동

export default React.memo(DragalbeCard);
