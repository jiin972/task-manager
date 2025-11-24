import { arrayMove } from "@dnd-kit/sortable";
import { toDoState, type IBoard, type ITodo } from "../atoms";
import { useRecoilState } from "recoil";
import {
  closestCorners,
  rectIntersection,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useMemo, useState } from "react";

//충돌감지 조정
export const boardCollisionDetectionStrategy: CollisionDetection = (args) => {
  const { active, droppableContainers } = args;
  //카드 드래그 시 모서리 기준
  if (active.data.current?.type === "card") {
    return closestCorners(args);
  }
  //보드를 드래그 시 보드끼라만 충돌 감지
  const fillterdDroppableContainers = droppableContainers.filter(
    (container) =>
      container.data.current && container.data.current.type === "board"
  );
  return rectIntersection({
    ...args,
    droppableContainers: fillterdDroppableContainers,
  });
};

//헬퍼함수: 카드가 속한 보드ID 찾기(이중검색로직)
function findCardContainer(
  boards: IBoard[],
  dndItemId: string | number
): string | null {
  const targetDndId = String(dndItemId); //id의 타입 정의(dnd-kit)
  //1. targetId가 이미 유효한 보드 Id인 경우, 반환
  if (boards.some((board) => board.id === targetDndId)) {
    return targetDndId;
  }
  //2. 개선, Droppable ID 패턴 처리(🔥카드이동을 막은 버그해결)
  if (targetDndId.startsWith("board-list-")) {
    const boardFromList = targetDndId.replace("board-list-", "");
    if (boards.some((board) => board.id === boardFromList)) {
      return boardFromList;
    }
  }
  const container = boards.find((board) =>
    board.toDos.some((toDo) => String(toDo.id) === targetDndId)
  );
  // console.log("Searching for:", targetDndId);
  // console.log(
  //   `[findCardContainer] ID: ${targetDndId} -> Result: ${container ? container.id : "NULL"}`
  // );
  return container ? container.id : null;
}

//헬퍼함수: 카드 이동 로직
function moveCard(
  boards: IBoard[],
  activeContainerId: string,
  overContainerId: string,
  activeId: string,
  overId: string
): IBoard[] {
  //1. 카드를 기존보드에서 찾아서 제거
  let activeTodo: ITodo | undefined;
  const boardWithoutActive = boards.map((board) => {
    if (board.id === activeContainerId) {
      activeTodo = board.toDos.find((toDo) => String(toDo.id) === activeId);
      return {
        ...board,
        toDos: board.toDos.filter((toDo) => String(toDo.id) !== activeId),
      };
    }
    return board;
  });
  //2. 카드를 새 보드에 삽입
  return boardWithoutActive.map((board) => {
    if (board.id === overContainerId && activeTodo) {
      const newToDos = [...board.toDos];
      const overIdx = board.toDos.findIndex(
        (toDo) => String(toDo.id) === overId
      );
      //위치계산: overItem이 있으면 그 위치, 없으면 맨뒤
      const newIndex = overIdx >= 0 ? overIdx : newToDos.length;
      newToDos.splice(newIndex, 0, activeTodo);
      return { ...board, toDos: newToDos };
    }
    return board;
  });
}

// //커스텀 hook 본체
type BooleanSetter = React.Dispatch<React.SetStateAction<boolean>>;
type ActiveType = string | number | null;

export function useKanbanDnd(setIsDragging: BooleanSetter) {
  const [boards, setBoards] = useRecoilState(toDoState);
  const [activeId, setActiveId] = useState<ActiveType>(null);
  const collisionDetection = boardCollisionDetectionStrategy;
  //1.드래그 시작
  const handleDragStart = (e: DragStartEvent) => {
    setIsDragging(true);
    setActiveId(e.active.id);
    console.log("---시작---");
    console.log("Active ID:", e.active.id);
    console.log("Active Type:", e.active.data.current?.type);
  };

  //2. 드래그 Over(서로 다른 보드간 이동 처리)
  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;

    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);
    //보드가 아닌 카드를 드래그 중일 때만 실행
    if (active.data.current?.type !== "card") return;

    const activeContainer = findCardContainer(boards, activeIdStr);
    const overContainer = findCardContainer(boards, overIdStr);
    console.log("--- OVER ---");
    console.log("Over ID:", overIdStr);
    console.log("Active Container:", activeContainer);
    console.log("Over Container:", overContainer);

    if (!activeContainer || !overContainer) return;
    //컨테이너가 서로 다를 때 미리 이동(ui반응성 향상)- 무한루프유발로 삭제❌
    //   if (activeContainer !== overContainer) {
    //     setBoards((prev) => moveCard(prev, activeContainer, overContainer, activeIdStr, overIdStr));
    //   }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveId(null);
    setIsDragging(false);

    if (!over) return; // drop의 유효성 테스트

    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);
    //Case A. 보드끼리 순서 변경
    if (
      active.data.current?.type === "board" &&
      over.data.current?.type === "board"
    ) {
      if (activeIdStr !== overIdStr) {
        setBoards((oldBoards) => {
          const oldIdx = oldBoards.findIndex(
            (board) => board.id === activeIdStr
          );
          const newIdx = oldBoards.findIndex((board) => board.id === overIdStr);
          return arrayMove(oldBoards, oldIdx, newIdx);
        });
      }
      return;
    }
    //Case B. 같은 보드 내에서 카드 순서 변경
    const activeContainer = findCardContainer(boards, activeIdStr);
    const overContainer = findCardContainer(boards, overIdStr);
    console.log("--- END / CARD MOVE ---");
    console.log("Active Container (End):", activeContainer);
    console.log("Over Container (End):", overContainer);
    if (activeContainer && overContainer) {
      if (activeContainer === overContainer) {
        setBoards((prev) => {
          const boardIdx = prev.findIndex(
            (board) => board.id === overContainer
          );
          const board = prev[boardIdx];
          const oldIdx = board.toDos.findIndex(
            (toDo) => String(toDo.id) === activeIdStr
          );
          const newIdx = board.toDos.findIndex(
            (toDo) => String(toDo.id) === overIdStr
          );

          if (oldIdx !== newIdx) {
            const newToDos = arrayMove(board.toDos, oldIdx, newIdx);
            const newBoards = [...prev];
            newBoards[boardIdx] = { ...board, toDos: newToDos };
            return newBoards;
          }
          return prev;
        });
      }
      //Case C. 다른 보드로 카드 이동(🔥)
      else {
        setBoards((prev) =>
          moveCard(prev, activeContainer, overContainer, activeIdStr, overIdStr)
        );
      }
    }
  };

  //Active Card 찾기 로직
  const activeCard = useMemo(() => {
    if (!activeId) return null;
    const activeIdStr = String(activeId);
    for (const board of boards) {
      const card = board.toDos.find((toDo) => String(toDo.id) === activeIdStr);
      if (card) {
        return { ...card, boardId: board.id };
      }
    }
    return null;
  }, [activeId, boards]);
  const activeBoard = boards.find((board) => board.id === activeId) || null;

  return {
    boards,
    activeId,
    activeBoard,
    activeCard,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    collisionDetection,
  };
}
