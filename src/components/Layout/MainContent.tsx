import styled from "styled-components";
import TodoBoard from "../todo/TodoBoard";
import { useSetRecoilState } from "recoil";
import { toDoState, type IBoard } from "../../atoms";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useEffect } from "react";
import DragableCard from "../todo/DragableCard";
import { TodoContainer } from "../todo/style/TodoBoard.style";
import { useKanbanDnd } from "../../hooks/useKanbanDnd";

const Wrapper = styled.div`
  padding: 20px 50px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  justify-content: center;
  align-items: flex-start;
  gap: 15px;
  min-height: 100vh;
`;

interface IMainContentsProps {
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
}

function MainContent({ setIsDragging }: IMainContentsProps) {
  const setToDos = useSetRecoilState(toDoState); //recoil setter함수
  const {
    boards,
    activeId,
    activeBoard,
    activeCard,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    collisionDetection,
  } = useKanbanDnd(setIsDragging);
  const boardIds = boards.map((board: IBoard) => board.id);
  const updateToBoardTitle = (boardId: string, newTitle: string) => {
    setToDos((allBoards) => {
      return allBoards.map((board) =>
        board.id === boardId ? { ...board, title: newTitle } : board
      );
    });
  };
  const deleteToBoard = (boardId: string) => {
    if (window.confirm("선택한 보드를 삭제하시겠습니까?")) {
      setToDos((allBoards) => {
        return allBoards.filter((board) => board.id !== boardId);
      });
    }
  };
  // 드래그 중 스크롤/스크롤방지 기능
  useEffect(() => {
    if (activeId) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev; //클린업 함수
      };
    }
  }, [activeId]);
  // 센서 정의(터치 및 마우스)
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor)
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      collisionDetection={collisionDetection}
    >
      <Wrapper>
        <SortableContext items={boardIds}>
          {boards.map((board) => (
            <TodoBoard
              key={board.id}
              boardId={board.id}
              toDos={board.toDos}
              boardTitle={board.title}
              onRenameBoard={updateToBoardTitle}
              onDeleteBoard={deleteToBoard}
            />
          ))}
        </SortableContext>
      </Wrapper>
      <DragOverlay>
        {activeBoard ? (
          <div style={{ width: 300, minWidth: 300 }}>
            <TodoContainer $isOver={false} $isDragging={true} $listIsOver={false}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "20px 30px",
                  flex: 1,
                  fontSize: "1.5em",
                  fontWeight: "bold",
                  minHeight: 150,
                  width: "100%",
                  transform: "translateY(-90px)",
                }}
              >
                <span>{activeBoard?.title}</span>
              </div>
            </TodoContainer>
          </div>
        ) : activeCard ? (
          <DragableCard
            todoId={activeCard.id}
            todoText={activeCard.text}
            boardId={activeCard.boardId}
            index={0}
            onDeleteClick={() => {}}
            onUpdateClick={() => {}}
            isOverlay={true}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
export default MainContent;
