import styled from "styled-components";
import TodoBoard from "../todo/TodoBoard";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { toDoState, type IBoard } from "../../atoms";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import DragableCard from "../todo/DragableCard";
import { TodoContainer } from "../todo/style/TodoBoard.style";

const Wrapper = styled.div`
  padding: 20px 50px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 15px;
  min-height: 100vh;
`;

interface IMainContentsProps {
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
}

function MainContent({ setIsDragging }: IMainContentsProps) {
  const toDos = useRecoilValue(toDoState); //IBoard[]배열
  const setToDos = useSetRecoilState(toDoState);
  const [activeId, setActiveId] = useState<string | null>(null); // Drag중인 활성요소 상태
  const boardIds = toDos.map((board) => board.id);
  //보드명 수정에 따른 recoil업데이트 로직
  const updateToBoardTitle = (boardId: string, newTitle: string) => {
    setToDos((allBoards) => {
      return allBoards.map((board) =>
        board.id === boardId ? { ...board, title: newTitle } : board
      );
    });
  };
  //보드 삭제에 따른 recoil업데이트 로직
  const deleteToBoard = (boardId: string) => {
    if (window.confirm("선택한 보드를 삭제하시겠습니까?")) {
      setToDos((allBoard) => {
        return allBoard.filter((board) => board.id !== boardId);
      });
    }
  };
  // toDo보드들의 drag 로직
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setIsDragging(false); //드래그가 영역밖에서 끝나면 상태를 끔
      setActiveId(null);
      return;
    }
    //dnd로 카드 이동로직(보드 이동과 분리)
    if (active.data.current?.type === "card") {
      const sourceBoardId = active.data.current.boardId;
      const activeCardId = active.id;
      const targetBoardId = over.data.current?.boardId || over.id;
      setToDos((allBoards: IBoard[]) => {
        const sourceBoardIndex = allBoards.findIndex(
          (board) => board.id === sourceBoardId
        );
        const targetBoardIndex = allBoards.findIndex(
          (board) => board.id === targetBoardId
        );
        if (sourceBoardIndex === -1) return allBoards;
        const sourceToDos = allBoards[sourceBoardIndex].toDos;
        const activeCard = sourceToDos.find(
          (toDo) => String(toDo.id) === activeCardId
        );
        if (!activeCard) return allBoards;
        //같은 보드내 이동 로직
        if (sourceBoardId === targetBoardId) {
          const oldIndex = sourceToDos.findIndex(
            (toDo) => String(toDo.id) === String(activeCardId)
          );
          const newIndex = sourceToDos.findIndex(
            (toDo) => String(toDo.id) === String(over.id)
          );
          if (oldIndex === -1 || newIndex === -1) return allBoards;
          const newToDos = arrayMove(sourceToDos, oldIndex, newIndex);
          const newBoards = [...allBoards];
          newBoards[sourceBoardIndex] = {
            ...newBoards[sourceBoardIndex],
            toDos: newToDos,
          };
          return newBoards;
        }
        // 다른보드 교차이동 로직
        else if (targetBoardIndex !== -1) {
          const newSourceToDos = sourceToDos.filter(
            (toDo) => String(toDo.id) !== activeCardId
          );
          //도착보드 : 카드삽입 위치 계산 및 삽입
          const newTargetToDos = [...allBoards[targetBoardIndex].toDos];
          const dropIndex = newTargetToDos.findIndex(
            (toDo) => String(toDo.id) === over.id
          );
          const newIndex = dropIndex === -1 ? newTargetToDos.length : dropIndex;

          newTargetToDos.splice(newIndex, 0, activeCard);

          const newBoards = [...allBoards];
          newBoards[sourceBoardIndex] = {
            ...newBoards[sourceBoardIndex],
            toDos: newSourceToDos,
          };
          newBoards[targetBoardIndex] = {
            ...newBoards[targetBoardIndex],
            toDos: newTargetToDos,
          };
          return newBoards;
        }
        return allBoards;
      });
    } else {
      //보드 이동 로직
      const activeId = active.id as string;
      const overId = over.id as string;
      let targetBoardId = overId;
      if (!boardIds.includes(overId) && over.data.current?.boardId) {
        targetBoardId = over.data.current.boardId;
      }
      if (activeId !== targetBoardId && boardIds.includes(targetBoardId)) {
        setToDos((oldBoards) => {
          const oldIndex = oldBoards.findIndex(
            (board) => board.id === activeId
          );
          const newIndex = oldBoards.findIndex(
            (board) => board.id === targetBoardId
          );
          if (oldIndex === -1 || newIndex === -1) return oldBoards;
          return arrayMove(oldBoards, oldIndex, newIndex);
        });
      }
    }
    setActiveId(null);
    setIsDragging(false);
  };
  //Drag중인 활성요소 상태관리
  const activeCard = activeId
    ? toDos
        .flatMap((board) =>
          board.toDos.map((card) => ({ ...card, boardId: board.id }))
        )
        .find((card) => String(card.id) === activeId)
    : null;
  const activeIdBoard = activeId && boardIds.includes(activeId);
  const activeBoard = activeIdBoard
    ? toDos.find((board) => board.id === activeId)
    : null;
  const onDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    setActiveId(event.active.id as string);
  };

  useEffect(() => {
    if (activeId) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [activeId]);

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <Wrapper>
        <SortableContext items={boardIds}>
          {toDos.map((board) => (
            <TodoBoard
              key={board.id}
              boardId={board.id}
              boardTitle={board.title}
              toDos={board.toDos}
              onRenameBoard={updateToBoardTitle}
              onDeleteBoard={deleteToBoard}
            />
          ))}
        </SortableContext>
      </Wrapper>
      <DragOverlay>
        {activeIdBoard ? (
          <div style={{ width: 300, minWidth: 300 }}>
            <TodoContainer
              $isOver={false}
              $isDragging={true}
              $listIsOver={false}
            >
              <div style={{ padding: "20px 30px" }}>{activeBoard?.title}</div>
            </TodoContainer>
          </div>
        ) : activeCard ? (
          <DragableCard
            toDoId={activeCard.id}
            toDoText={activeCard.text}
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
