import { useState } from "react";
import { useForm } from "react-hook-form";

interface IEditText {
  editText: string;
}

interface IUseCardItemProps {
  todoId: number;
  todoText: string;
  onUpdateClick: (todoId: number, todoText: string) => void;
}

export function useCardItem({ todoId, todoText, onUpdateClick }: IUseCardItemProps) {
  //1.카드 수정모드 상태관리
  const [isEditing, setIsEditing] = useState(false);
  //2. 폼 로직 관리
  const { register, handleSubmit, reset, getValues } = useForm({
    defaultValues: { editText: todoText },
  });
  //3. 폼 제출 핸들러(upDate)
  const onEditSubmit = ({ editText }: IEditText) => {
    const trimedText = editText.trim();
    if (trimedText === "") {
      alert("내용을 입력해 주세요.");
      reset({ editText: todoText }); // 원래 텍스트로 복원
      setIsEditing(false);
      return;
    }
    onUpdateClick(todoId, trimedText);
    reset({ editText: trimedText });
    setIsEditing(false);
  };
  //4. 입력필드 포커스 해제(onBlur)
  const onBlurHandler = () => {
    const currentText = getValues("editText").trim();
    if (currentText && currentText !== todoText.trim()) {
      onUpdateClick(todoId, currentText);
    }
    setIsEditing(false);
    reset({ editText: todoText });
  };
  //5. ESC 키 핸들러
  const onKeyDownHandler = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      setIsEditing(false);
      reset({ editText: todoText });
    }
  };
  const onStartEditing = () => setIsEditing(true);

  return {
    isEditing,
    register,
    handleSubmit,
    onEditSubmit,
    onBlurHandler,
    onKeyDownHandler,
    onStartEditing,
  };
}
