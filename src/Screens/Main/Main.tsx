import { useEffect, useState } from "react";
import Board from "../../Components/Board/Board";
import { ToolBar, IBrushState } from "../../Components/ToolBar/ToolBar";
import "./Main.css";

const Main = () => {
    const [currentEvent, setCurrentEvent] = useState<string>();
    const [mainConf, setMainConf] = useState<IBrushState>({
        brushColor: "#000",
        brushSize: 12,
        brushName: "brush",
        brushShowToolTip: false,
    });
    const onChangeHandler = (conf: IBrushState) => {
        setMainConf({...conf})
    };
    return (
        <div className="main">
            <Board brushConf={mainConf} event={currentEvent}/>
            <ToolBar onChange={onChangeHandler} onEvent={(e) => setCurrentEvent(e)}/>
        </div>
    );
};

export default Main;
