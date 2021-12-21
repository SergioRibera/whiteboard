import { Fragment, useState } from 'react';
import { RiEraserFill, RiMarkPenFill, RiPencilFill, RiSettings4Fill } from 'react-icons/ri';
import { FaTrash } from 'react-icons/fa';
import { ChromePicker } from 'react-color';
import IconButton from '../Base/IconButton/IconButton';
import ToolButton from '../ToolButton/ToolButton';
import './style.css';

interface IResizeBrushProps {
    onResize: (size: number) => void;
}

interface IBrushProps {
    onChange: (toolOption: IBrushState) => void;
    onEvent: (event: string) => void;
}

interface IChangeBrushColorProps {
    onChange: (color: string) => void;
}

interface IBrushState {
    brushName: string;
    brushSize: number;
    brushColor: string;
    brushShowToolTip: boolean;
}

const ResizeBrush = ({ onResize }: IResizeBrushProps) => {
    const [size, setSize] = useState<number>(12);

    const setState = (size: number) => {
        setSize(size);
        onResize(size);
    };

    return (
        <div className="resize-brush-slider">
            <div className="resize-brush-prefab">
                <div className="resize-brush-prefab-item"
                    onClick={() => setState(5)} />
                <div className="resize-brush-prefab-item"
                    onClick={() => setState(12)} />
                <div className="resize-brush-prefab-item"
                    onClick={() => setState(24)} />
                <div className="resize-brush-prefab-item"
                    onClick={() => setState(32)} />
            </div>
            <input
                type="range"
                min="1"
                max="50"
                value={size}
                onChange={(e) => setState(Number(e.target.value))}
            />
        </div>
    );
};

const ChangeColor = ({ onChange }: IChangeBrushColorProps) => {
    const [color, setColor] = useState<string>("#000000");

    return (
        <Fragment>
            <div className="color-picker">
                <ChromePicker
                    className="color-picker-item"
                    disableAlpha={true}
                    color={color}
                    onChange={(color) => { setColor(color.hex); onChange(color.hex)}}
                    />
                    {/*
                    colors={['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF', '#0065FF', '#FFF600']}
                    */}
            </div>
        </Fragment>
    );
};

const ToolTipContainer = ({ children, showing }: { children?: | React.ReactChild | React.ReactChild[], showing: boolean }) => {
    return (
        <div
            className={`tool-tip-container ${showing ? "tool-tip-container-showing" : ""}`}
            style={{
                left: showing ? "170%" : "-550px",
            }}
        >
            {children}
        </div>
    );
};

const ToolBar = ({ onChange, onEvent }: IBrushProps) => {
    const [showingToolBar] = useState<boolean>(true);
    const [currentBrush, setCurrentBrush] = useState<string>('pencil');
    const [penConf, setPenConf] = useState<IBrushState>({
        brushName: 'pencil',
        brushSize: 12,
        brushColor: "#000000",
        brushShowToolTip: false,
    });
    const [eraserConf, setEraserConf] = useState<IBrushState>({
        brushName: 'eraser',
        brushSize: 12,
        brushColor: "",
        brushShowToolTip: false,
    });
    const [markConf, setMarkConf] = useState<IBrushState>({
        brushName: 'mark',
        brushSize: 12,
        brushColor: "#84f370",
        brushShowToolTip: false,
    });

    return (
        <Fragment>
            <div className="tool-bar" style={{ left: (showingToolBar ? 0 : -250) + "px" }}>
                <ToolButton
                    icon={<RiPencilFill className="tool-btn-icon" />}
                    sizeBrush={penConf.brushSize}
                    currentColor={penConf.brushColor}
                    onClick={() => { setPenConf({ ...penConf, brushShowToolTip: !penConf.brushShowToolTip }) }}
                    onColorChange={() => { }}
                >
                    <ToolTipContainer showing={penConf.brushShowToolTip}>
                        <ResizeBrush onResize={newSize => {
                            setPenConf({ ...penConf, brushSize: newSize });
                            onChange(penConf);
                        }} />
                        <ChangeColor onChange={color => {
                            setPenConf({ ...penConf, brushColor: color });
                            onChange(penConf);
                        }} />
                    </ToolTipContainer>
                </ToolButton>
                <IconButton
                    children={<ToolTipContainer showing={eraserConf.brushShowToolTip}>
                        <ResizeBrush onResize={newSize => {
                            setEraserConf({ ...eraserConf, brushSize: newSize });
                            onChange(eraserConf);
                        }} />
                        <div className="btn-eraser-all" onClick={() => onEvent('eraseall')}>
                            <FaTrash />
                        </div>
                    </ToolTipContainer>}
                    icon={<RiEraserFill className="tool-btn-icon" />}
                    onClick={() => { setEraserConf({ ...eraserConf, brushShowToolTip: !eraserConf.brushShowToolTip }) }}
                />
                <ToolButton
                    icon={<RiMarkPenFill className="tool-btn-icon" />}
                    sizeBrush={markConf.brushSize}
                    currentColor={markConf.brushColor}
                    onClick={() => { setMarkConf({ ...markConf, brushShowToolTip: !markConf.brushShowToolTip }) }}
                    onColorChange={() => { }}
                >
                    <ToolTipContainer showing={markConf.brushShowToolTip}>
                        <ResizeBrush onResize={newSize => {
                            setMarkConf({ ...markConf, brushSize: newSize });
                            onChange(markConf);
                        }} />
                        <ChangeColor onChange={color => {
                            setMarkConf({ ...markConf, brushColor: color });
                            onChange(markConf);
                        }} />
                    </ToolTipContainer>
                </ToolButton>
                <IconButton
                    icon={<RiSettings4Fill className="tool-btn-icon" />}
                    onClick={() => { alert("Settings") }}
                />
            </div>
        </Fragment>
    );
};

export {
    type IBrushState,
    type IBrushProps,
    ToolBar,
}
