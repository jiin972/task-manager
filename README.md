## Task Manage app

- React, Typescript, React-hook-form 등을 이용한 Task Manage 서비스 구현 프로젝트

---

#### 구현방향

- 해야할 업무, 진행중인 업무, 완료된 일로 카테고리 구분
  - 해야할 업무: 입력/수정/삭제 기능 적용
  - 진행중인 업무 : 입력/수정/삭제 가능하게 함
  - 완료된 업무 : 입력/수정/삭제 가능하게 함, 완료 카테고리 등록시 등록 일/시 노출
- 각 data는 Local storage에 저장되게 로직 구성
- 새로운 보드(toDo,Doing,Done 외)를 추가할 수 있게 적용
- 기타: Light/Dark Theme 구현

[레퍼런스](https://te6-in.github.io/nomad-trello-clone/)

---

#### 개발환경

- OS: MacOs
- 개발언어: Javascript(ES6), Typescript
- 프론트: React
- 배포: Netlify
- 라이브러리: npm, Recoil, React-hook-form ,Recoil-persist(로컬저장), @dnd-kit/core ,styled-components, framer-motion
- 기타: ~~폰트어썸 라이브러리(@fortawesome/react-fontawesome, @fortawesome/free-solid-svg-icons, @fortawesome/fontawesome-svg-core)~~
  lucideReact로 대체

---

#### 프로젝트 구조(화면구성)

- [Header]$$
  - title, 보드추가, themeMode 로 구성
- [MainContent](기본 3개의 보드)
  - [BoardHeader]
    - 보드title, titleRename 버튼, delete 버튼, **Drag버튼**
  - [BoardBody]
    - ToDoList
  - [BoardFooter]
    - AddToDo
- [Footer]

#### 프로젝트 구조(폴더구조) -- 작성 중

- [src]
  - [components]
    - [Layout]
      - Header.tsx
      - MainContent.tsx
      - Footer.tsx

#### 프로젝트 추가 기능

- 시계 컴포넌트 배치
- 날씨 컴포넌트 추가
- 드래그 시작 시 화면에 휴지통 나타내기

---

#### 개발 과정

###### 프로젝트 테마(styled-components)

- 다크 모드
- 라이트 모드
- resetCss(글로벌Css)
- 각 모드 구현은 Recoil을 통한 atom으로 관리(예정)

- 버그: 새로고침 시 테마 초기화 현상

###### 보드로직 구성

- 보드의 할일 추가 및 삭제 로직 구현
- 보드 내 카드에 수정 로직 구현
- 새로운 보드(기본 제공 보드외) 추가 기능 구현

##### 완료된 목록 관리 로직 구현
