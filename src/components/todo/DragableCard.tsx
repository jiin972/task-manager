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
  // const uniqueId = `${boardId}-${todoId}`;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: todoId, //`${boardId}-${todoId}`<- 🔥이 id때문에 id비교 불일치로 카드이동 안됨,
    data: {
      type: "card",
      boardId: boardId,
    },
    disabled: isOverlay,
  });
  //dnd 스타일 정의
  const style = {
    // isOverlay가 true일 때는 transform과 transition을 적용하지 않음
    transform: isOverlay ? undefined : CSS.Transform.toString(transform) || "",
    transition,
    // 오버레이가 아닐 때만 isDragging에 따른 투명도를 적용
    opacity: !isOverlay && isDragging ? 0.4 : 1,
  };

  if (isDragging) {
    console.log(`[Card ID: ${boardId}-${todoId}] Is Dragging: ${isDragging}`);
    console.log(
      `[Card ID: ${boardId}-${todoId}] Transform Style: ${CSS.Transform.toString(
        transform
      )}`
    );
  }

  return (
    <TodoItem
      variants={cardVariants}
      initial="normal"
      whileHover={isOverlay ? undefined : "hover"}
      ref={setNodeRef}
      style={style} // 수정된 style 객체를 적용
      $isOverlay={isOverlay}
      $isDragging={isDragging}
      {...(!isOverlay && listeners)}
      {...(!isOverlay && attributes)}
    >
      {isEditing && !isOverlay ? (
        <TodoForm onSubmit={handleSubmit(onEditSubmit)}>
          <TodoListUpdateInput
            {...register("editText", { required: true })}
            autoFocus
            onBlur={onBlurHandler}
            onKeyDown={onKeyDownHandler}
          />
        </TodoForm>
      ) : (
        <TodoText onDoubleClick={!isOverlay ? onStartEditing : undefined}>
          {todoText}
        </TodoText>
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
