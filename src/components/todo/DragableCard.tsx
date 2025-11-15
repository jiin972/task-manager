import React, { useState } from "react";
import { useForm } from "react-hook-form";
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

//interface
interface IEditText {
  editText: string;
}

interface IDragableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
  onUpdateClick: (toDoId: number, editText: string) => void;
  onDeleteClick: (toDoId: number) => void;
  boardId: string;
  isOverlay: boolean;
}

function DragalbeCard({
  toDoId,
  toDoText,
  onDeleteClick,
  onUpdateClick,
  boardId,
  isOverlay = false,
}: IDragableCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, reset, getValues } = useForm<IEditText>({
    defaultValues: { editText: toDoText },
  });
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: String(toDoId),
      data: {
        type: "card",
        boardId: boardId,
      },
    });
  //form제출 핸들러 정의(recoil업데이트 명령 전달)
  const onEditSubmit = ({ editText }: IEditText) => {
    const trimedText = editText.trim();
    if (trimedText === "") {
      alert("내용을 입력해 주세요.");
      reset({ editText: toDoText });
      setIsEditing(false);
      return;
    }
    onUpdateClick(toDoId, trimedText);
    reset({ editText: trimedText });
    setIsEditing(false);
  };
  // 더블클릭으로 수정상태에 대한 몇가지 수정
  const onBlurHandler = () => {
    const currentText = getValues("editText").trim();
    if (currentText && currentText !== toDoText.trim()) {
      onUpdateClick(toDoId, currentText);
    }
    setIsEditing(false);
    reset({ editText: toDoText || toDoText });
  };

  const onKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setIsEditing(false);
      reset({ editText: toDoText });
    }
  };
  //dnd 스타일 정읠
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <TodoItem
      variants={cardVariants}
      initial="normal"
      whileHover={"hover"}
      ref={setNodeRef}
      style={style}
      $isOverlay={isOverlay}
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
        <TodoText onDoubleClick={() => setIsEditing(true)}>{toDoText}</TodoText>
      )}
      <ButtonContainer variants={iconVariants}>
        {/* isEditing으로 호출*/}
        <BtnToUpdate onClick={() => setIsEditing(true)}>
          <Pencil />
        </BtnToUpdate>
        <BtnToDelete onClick={() => onDeleteClick(toDoId)}>
          <Trash2 />
        </BtnToDelete>
        <BtnToDrag variants={btnVarianst} {...listeners} {...attributes}>
          <Grip />
        </BtnToDrag>
      </ButtonContainer>
    </TodoItem>
  );
}
//버튼을 클릭 혹은, 아이템을 더블 클릭시 수정모드(폼입력상태) 작동

export default React.memo(DragalbeCard);
