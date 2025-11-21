import { useRecoilState, useSetRecoilState } from "recoil";
import { isDarkAtom, toDoState } from "../../atoms";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Plus, Sun, Moon } from "lucide-react";
import {
  AddBoardBtn,
  addBtnVarianst,
  BtnContainer,
  InputToAddBoard,
  inputVariants,
  ThemeToggleBtn,
  Title,
  toggleBtnVarianst,
  Wrapper,
} from "./style/Header.style";

//interface

interface IBoardForm {
  boardName: string;
}

interface HeaderProps {
  $isDragging: boolean;
}

function Header({ $isDragging }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useRecoilState(isDarkAtom); //테마구현을위한 state
  const setAllToDos = useSetRecoilState(toDoState);
  const [isAdding, setIsAdding] = useState(false);
  const { register, handleSubmit, reset } = useForm<IBoardForm>({
    defaultValues: { boardName: "" },
  });
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };
  // 새 보드 추가를 위한 로직
  const handleAddBoard = (data: IBoardForm) => {
    const boardTitle = data.boardName;
    setAllToDos((oldBoard) => {
      const newBoard = {
        id: Date.now().toString(),
        title: boardTitle,
        toDos: [],
      };
      return [...oldBoard, newBoard];
    });
    reset();
    setIsAdding(false);
  };
  const onAdding = () => {
    setIsAdding((prev) => !prev);
  };
  //보드 추가 입력 취소 로직
  const onKeyDownHandler = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      reset();
      setIsAdding(false);
    }
  };

  return (
    <Wrapper $isDragging={$isDragging}>
      <Title>
        <h2>Task Manager</h2>
      </Title>
      <BtnContainer>
        <AnimatePresence mode="wait">
          {isAdding ? (
            <motion.form
              key="addBoardForm"
              onSubmit={handleSubmit(handleAddBoard)}
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <InputToAddBoard
                key={"inputToAdd"}
                {...register("boardName", { required: true })}
                onKeyDown={onKeyDownHandler}
                onBlur={() => setIsAdding(false)}
                autoFocus
                placeholder="새 보드명 입력"
              />
            </motion.form>
          ) : (
            <AddBoardBtn
              key="addBoardBtn"
              onClick={onAdding}
              type="button"
              variants={addBtnVarianst}
              whileHover={"hover"}
            >
              <Plus />
            </AddBoardBtn>
          )}
        </AnimatePresence>
        <ThemeToggleBtn variants={toggleBtnVarianst} whileHover={"hover"} onClick={toggleTheme}>
          {isDarkMode ? <Sun /> : <Moon />}
        </ThemeToggleBtn>
      </BtnContainer>
    </Wrapper>
  );
}

export default Header;
