import { type ITodo } from "../../atoms";
import DragableCard from "./DragableCard";
import { useState } from "react";
import BoardTitleEditor from "./BoardTitleEditor";
import { Pencil, Trash2, Grip } from "lucide-react";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  btnContainerVariants,
  BtnToDelete,
  BtnToDrag,
  BtnToModify,
  btnVarianst,
  ButtonContainer,
  TodoBoardTitle,
  TodoContainer,
  TodoForm,
  TodoHeader,
  TodoInput,
  TodoItems,
} from "./style/TodoBoard.style";
import { useDroppable } from "@dnd-kit/core";
import { useTodoBoard } from "../../hooks/useTodoBoard";

//interface

interface ITodoBoardProps {
  boardId: string;
  boardTitle: string;
  toDos: ITodo[];
  onRenameBoard: (boardId: string, newTitle: string) => void;
  onDeleteBoard: (boardId: string) => void;
  isDragging?: boolean;
  style?: React.CSSProperties;
}

function TodoBoard({
  boardId,
  toDos,
  boardTitle,
  onRenameBoard,
  onDeleteBoard,
}: ITodoBoardProps) {
  //dnd-kit Sortable Hook
  const {
    setNodeRef,
    listeners,
    attributes,
    transform,
    transition,
    isOver,
    isDragging,
  } = useSortable({
    id: boardId,
    data: {
      type: "board",
    },
  });
  //did-kit Droppable Hook
  const { setNodeRef: setListNodeRef, isOver: listIsOver } = useDroppable({
    id: `board-list-${boardId}`,
    data: { type: "board-list", boardId },
  });
  //커스텀 hook 사용
  const {
    register,
    handleSubmit,
    setValue,
    onAddTodo,
    onDeleteTodo,
    onUpdateTodo,
    onInputKeyDownHandler,
  } = useTodoBoard({ boardId });
  //보드명 수정 상태
  const [isEditing, setIsEditing] = useState(false);
  // dnd-kit/sortable의 style구현
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
  };

  return (
    <TodoContainer
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      $isOver={isOver}
      $isDragging={isDragging}
      $listIsOver={listIsOver}
    >
      <TodoHeader
        variants={btnContainerVariants}
        initial="normal"
        whileHover={"hover"}
      >
        {isEditing ? (
          <BoardTitleEditor
            boardId={boardId}
            currentTitle={boardTitle}
            setIsEditing={setIsEditing}
            onUpdateClick={(id, newTitle) => onRenameBoard(id, newTitle)}
          />
        ) : (
          <TodoBoardTitle onDoubleClick={() => setIsEditing(true)}>
            {boardTitle}
          </TodoBoardTitle>
        )}
        <ButtonContainer>
          <BtnToModify
            variants={btnVarianst}
            onClick={() => setIsEditing(true)}
          >
            <Pencil />
          </BtnToModify>
          <BtnToDelete
            onClick={() => onDeleteBoard(boardId)}
            variants={btnVarianst}
          >
            <Trash2 />
          </BtnToDelete>
          <BtnToDrag variants={btnVarianst}>
            <Grip />
          </BtnToDrag>
        </ButtonContainer>
      </TodoHeader>

      <SortableContext
        items={toDos.map((toDo) => toDo.id)}
        strategy={verticalListSortingStrategy}
      >
        <TodoItems ref={setListNodeRef} $listIsOver={listIsOver}>
          {toDos.map((toDo, index) => (
            <DragableCard
              key={toDo.id}
              index={index}
              todoId={toDo.id}
              todoText={toDo.text}
              onDeleteClick={onDeleteTodo}
              onUpdateClick={onUpdateTodo}
              boardId={boardId}
              isOverlay={false}
            />
          ))}
        </TodoItems>
      </SortableContext>
      <TodoForm
        onSubmit={handleSubmit(onAddTodo)}
        onKeyDown={onInputKeyDownHandler}
        onBlur={() => setValue("todoItem", "")}
      >
        <TodoInput
          {...register("todoItem", { required: true })}
          placeholder={`${boardTitle}에 추가`}
        />
      </TodoForm>
    </TodoContainer>
  );
}
export default TodoBoard;
