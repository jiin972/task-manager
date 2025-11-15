import { useState } from "react";
import Footer from "./components/Layout/Footer";
import Header from "./components/Layout/Header";
import MainContent from "./components/Layout/MainContent";

function App() {
  const [isDragging, setIsDragging] = useState(false);
  return (
    <>
      <Header $isDragging={isDragging} />
      <MainContent setIsDragging={setIsDragging} />
      <Footer />
    </>
  );
}

export default App;
