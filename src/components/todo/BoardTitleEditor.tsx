import { useForm, type SubmitHandler } from "react-hook-form";
import styled from "styled-components";

//styled-components
const TodoBoardInput = styled.input`
  background: none;
  border: none;
  outline: none;
  border-bottom: 2px solid transparent;
  height: 100%;
  width: 100%;
  font-size: 25px;
  font-weight: 700;

  &:focus {
    font-size: 25px;
    color: ${(props) => props.theme.colors.textColor};
    border-bottom-color: ${(props) => props.theme.colors.borderColor};
  }
`;

//interface
interface ITitleForm {
  editTitle: string;
}

interface IBoardEditProps {
  boardId: string;
  onUpdateClick: (boardId: string, newTitle: string) => void;
  setIsEditing: (isEditing: boolean) => void;
  currentTitle: string;
}

function BoardTitleEditor({
  boardId,
  onUpdateClick,
  setIsEditing,
  currentTitle,
}: IBoardEditProps) {
  const { register, handleSubmit, reset } = useForm<ITitleForm>({
    defaultValues: { editTitle: currentTitle },
  });
  //보드 타이틀 수정 로직(form조작)
  const handleTitle: SubmitHandler<ITitleForm> = ({
    editTitle,
  }: ITitleForm) => {
    const trimedTitle = editTitle.trim();
    if (trimedTitle && trimedTitle !== currentTitle) {
      onUpdateClick(boardId, trimedTitle);
    }
    setIsEditing(false); // 부모에 수정종료 요청
    reset({ editTitle: trimedTitle });
  };
  // 보드 타이틀 수정 조작 로직(escape, onBlur)
  const onKeydownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setIsEditing(false);
      reset({ editTitle: currentTitle });
    }
  };
  const onBlurHandler = () => {
    setIsEditing(false);
    reset({ editTitle: currentTitle });
  };

  return (
    <form onSubmit={handleSubmit(handleTitle)}>
      <TodoBoardInput
        {...register("editTitle", { required: true })}
        autoFocus
        onBlur={onBlurHandler}
        onKeyDown={onKeydownHandler}
      />
    </form>
  );
}

export default BoardTitleEditor;
