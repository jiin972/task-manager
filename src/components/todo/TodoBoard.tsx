import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { toDoState, type ITodo } from "../../atoms";
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

//interface
interface IForm {
  toDoItem: string;
}

interface IHandleDelete {
  onDeleteClick: (todoId: number) => void;
}

interface IHandleUpdate {
  onUpdateClicked: (todoId: number, editText: string) => void;
}

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
  onRenameBoard,
  onDeleteBoard,
  boardTitle,
}: ITodoBoardProps) {
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
  });
  const setAllToDos = useSetRecoilState(toDoState); // 아이템 수정 update를 위한 recoilState
  const [isEditing, setIsEditing] = useState(false); // 보드명 수정을 위한 state
  const { register, handleSubmit, setValue } = useForm<IForm>({
    defaultValues: { toDoItem: "" },
  }); // 아이템 입력/수정/삭제를 위한 form관리
  const { setNodeRef: setListNodeRef, isOver: listIsOver } = useDroppable({
    id: `board-list-${boardId}`,
    data: { type: "board-list", boardId },
  });

  //아이템 입력로직
  const handleValid = ({ toDoItem }: IForm) => {
    const newToDoItem = {
      id: Date.now(),
      text: toDoItem,
    };
    setAllToDos((allBoards) => {
      return allBoards.map((board) =>
        board.id === boardId
          ? { ...board, toDos: [newToDoItem, ...board.toDos] }
          : board
      );
    });
    setValue("toDoItem", "");
  };
  //아이템 삭제로직
  const onDeleteClick: IHandleDelete["onDeleteClick"] = (todoId) => {
    if (window.confirm("선택한 목록을 삭제하시겠습니까?")) {
      setAllToDos((allBoards) => {
        return allBoards.map((board) =>
          String(board.id) === String(boardId)
            ? {
                ...board,
                toDos: board.toDos.filter(
                  (toDo) => String(toDo.id) !== String(todoId)
                ),
              }
            : board
        );
      });
    }
  };
  //아이템 수정로직
  const onUpdateClick: IHandleUpdate["onUpdateClicked"] = (
    toDoId,
    editText
  ) => {
    setAllToDos((allBoards) => {
      return allBoards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              toDos: board.toDos.map((toDo) =>
                toDo.id === toDoId ? { ...toDo, text: editText } : toDo
              ),
            }
          : board
      );
    });
  };
  //To-Do 입력 form의 취소로직
  const onKeyDownHandler = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setValue("toDoItem", "");
    }
  };
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
          <BtnToDrag variants={btnVarianst} {...listeners}>
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
              toDoId={toDo.id}
              toDoText={toDo.text}
              onDeleteClick={onDeleteClick}
              onUpdateClick={onUpdateClick}
              boardId={boardId}
              isOverlay={false}
            />
          ))}
        </TodoItems>
      </SortableContext>
      <TodoForm
        onSubmit={handleSubmit(handleValid)}
        onKeyDown={onKeyDownHandler}
        onBlur={() => setValue("toDoItem", "")}
      >
        <TodoInput
          {...register("toDoItem", { required: true })}
          placeholder={`${boardTitle}에 추가`}
        />
      </TodoForm>
    </TodoContainer>
  );
}
export default TodoBoard;
