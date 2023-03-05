import { useState } from "react";

import './style.css';

import Game from "./game";
import StartPage from "./startpage";

export default function App() {
  const [isGame, setIsGame] = useState<boolean>(false);

  const test = () => {
    setIsGame(true);
  };

  return (
    <div className="App">{isGame ? <Game /> : <StartPage test={test} />}</div>
  );
}
