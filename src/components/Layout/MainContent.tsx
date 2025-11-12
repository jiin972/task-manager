import styled from "styled-components";
import TodoBoard from "../todo/TodoBoard";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { toDoState } from "../../atoms";
import { closestCorners, DndContext, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";

const Wrapper = styled.div`
  padding: 20px 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 15px;
`;

function MainContent() {
  const toDos = useRecoilValue(toDoState); //IBoard[]배열
  const setToDos = useSetRecoilState(toDoState);
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
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId !== overId) {
      setToDos((oldBoards) => {
        const oldIndex = oldBoards.findIndex((board) => board.id === activeId);
        const newIndex = oldBoards.findIndex((board) => board.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return oldBoards;
        return arrayMove(oldBoards, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
      <Wrapper>
        <SortableContext items={boardIds}>
          {toDos.map((board) => (
            <TodoBoard
              boardId={board.id}
              boardTitle={board.title}
              toDos={board.toDos}
              key={board.id}
              onRenameBoard={updateToBoardTitle}
              onDeleteBoard={deleteToBoard}
            />
          ))}
        </SortableContext>
      </Wrapper>
    </DndContext>
  );
}
export default MainContent;
