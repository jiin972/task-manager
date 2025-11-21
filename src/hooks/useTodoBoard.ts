import { useSetRecoilState } from "recoil";
import { toDoState, type IBoard, type ITodo } from "../atoms";
import { useForm } from "react-hook-form";

interface IForm {
  todoItem: string;
}

interface IUseTodoBoard {
  boardId: string;
}

type IHandleAdd = (data: IForm) => void;
type IHandleDelete = (todoId: number) => void;
type IHandleUpdate = (todoId: number, editText: string) => void;

export function useTodoBoard({ boardId }: IUseTodoBoard) {
  const setAllTodos = useSetRecoilState(toDoState);
  //form관리 로직
  const { register, handleSubmit, setValue } = useForm<IForm>({
    defaultValues: { todoItem: "" },
  });
  //1. 아이템 추가 로직(create)
  const onAddTodo: IHandleAdd = ({ todoItem }) => {
    const newTodoItem: ITodo = { id: Date.now(), text: todoItem };
    setAllTodos((allBoards: IBoard[]) => {
      return allBoards.map((board) =>
        board.id === boardId ? { ...board, toDos: [newTodoItem, ...board.toDos] } : board
      );
    });
    setValue("todoItem", "");
  };
  //2. 아이템 삭제 로직(delete)
  const onDeleteTodo: IHandleDelete = (todoId) => {
    if (window.confirm("선택한 목록을 삭제하시겠습니까?")) {
      setAllTodos((allBoards: IBoard[]) => {
        return allBoards.map((board) =>
          String(board.id) === String(boardId)
            ? { ...board, toDos: board.toDos.filter((toDo) => String(toDo.id) !== String(todoId)) }
            : board
        );
      });
    }
  };
  //3. 아이템 수정 로직(update)
  const onUpdateTodo: IHandleUpdate = (todoId, editText) => {
    setAllTodos((allBoards: IBoard[]) => {
      return allBoards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              toDos: board.toDos.map((toDo) =>
                toDo.id === todoId ? { ...toDo, text: editText } : toDo
              ),
            }
          : board
      );
    });
  };
  //4. 폼 취소 로직(esc키)
  const onInputKeyDownHandler = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === `Escape`) {
      event.preventDefault();
      event.stopPropagation();
      setValue("todoItem", "");
    }
  };
  return {
    register,
    handleSubmit,
    setValue,
    onAddTodo,
    onDeleteTodo,
    onUpdateTodo,
    onInputKeyDownHandler,
  };
}
