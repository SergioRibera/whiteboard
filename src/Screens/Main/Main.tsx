import Board from "../../Components/Board/Board";
import { ToolBar, IBrushState } from "../../Components/ToolBar/ToolBar";
import "./Main.css";

const Main = () => {
    const onChangeHandler = (conf: IBrushState) => {
        switch (conf.brushName) {
            case "pencil":
                break;
        }
    };
    return (
        <div className="main">
            <Board />
            <ToolBar onChange={onChangeHandler}/>
        </div>
    );
};

export default Main;
