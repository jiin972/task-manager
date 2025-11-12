import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

// state 로컬스토리지 저장
const { persistAtom } = recoilPersist();

//theme관련 atom
export const isDarkAtom = atom<boolean>({
  key: "isDark",
  default: true,
  effects_UNSTABLE: [persistAtom],
});

//toDo input관련 atom

export interface ITodo {
  id: number;
  text: string;
}

// export interface ITodoState {
//   [key: string]: ITodo[];
// }

// export const toDoState = atom<ITodoState>({
//   key: "todoState",
//   default: { "해야할 일": [], "진행중인 일": [], "완료된 일": [] },
//   effects_UNSTABLE: [persistAtom],
// });

export interface IBoard {
  id: string;
  title: string;
  toDos: ITodo[];
}

export const toDoState = atom<IBoard[]>({
  key: "todoState",
  default: [
    { id: "board-1", title: "해야할 일", toDos: [] },
    { id: "board-2", title: "진행중인 일", toDos: [] },
    { id: "board-3", title: "완료된 일", toDos: [] },
  ],
  effects_UNSTABLE: [persistAtom],
});
