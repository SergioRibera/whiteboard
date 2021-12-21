import { PointerEventHandler, useEffect, useRef, useState } from 'react';
import { getStroke as getSnakeStroke, SnakeState } from '@disjukr/croquis-js/lib/stabilizer/snake';
import { stroke as brush, defaultBrushConfig, BrushStrokeResult } from '@disjukr/croquis-js/lib/brush/simple';

import './style.css';
import { getStylusState } from '@disjukr/croquis-js/lib/stylus';
import { StrokeDrawingContext } from '@disjukr/croquis-js/lib/stroke-protocol';
import { IBrushState } from '../ToolBar/ToolBar';

export interface WindowSize {
    width: number;
    height: number;
}

const snake = getSnakeStroke(brush);

const useWindowSize = (): WindowSize => {
    const [windowSize, setWindowSize] = useState<WindowSize>({ width: 0, height: 0 });
    useEffect(() => {
        const resize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);
    return windowSize;
}

const useCanvasFadeout = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
    useEffect(() => {
        const id = setInterval(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d')!;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
        }, 50);
        return () => clearInterval(id);
    }, []);
}

const Board = ({ brushConf, event }: { brushConf: IBrushState, event?: string }) => {
    const { brushSize, brushColor } = brushConf;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // useCanvasFadeout(canvasRef);
    const windowSize = useWindowSize();
    const [drawingContext, setDrawingContext] = useState<
        StrokeDrawingContext<any, SnakeState, BrushStrokeResult>
    >();
    useEffect(() => {
        if (!drawingContext) return;
        const id = setInterval(drawingContext.getState().update, 10);
        return () => clearInterval(id);
    }, [drawingContext]);
    // Manage events
    useEffect(() => {
        switch (event) {
            case 'eraseall':
                const canvas = canvasRef.current;
                if (canvas) {
                    const ctx = canvas.getContext('2d')!;
                    // ctx.globalCompositeOperation = 'destination-out';
                    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                break;
        }
    }, []);
    const downHandler: PointerEventHandler = e => {
        const ctx = canvasRef.current!.getContext('2d')!;
        const stylusState = getStylusState(e.nativeEvent);
        const brushConfig = {
            ...defaultBrushConfig,
            ctx,
            size: brushSize,
            color: brushColor,
        };
        const drawingContext = snake.down(
            {
                tailCount: 5,
                weight: .5,
                catchUp: true,
                targetConfig: brushConfig,
            },
            stylusState
        );
        setDrawingContext(drawingContext);
    };
    useEffect(() => {
        if (!drawingContext) return;
        const moveHandler = (e: PointerEvent) => {
            const stylusState = getStylusState(e);
            drawingContext.move(stylusState);
        };
        const upHandler = (e: PointerEvent) => {
            const stylusState = getStylusState(e);
            drawingContext.up(stylusState);
            setDrawingContext(undefined);
        };
        window.addEventListener('pointermove', moveHandler);
        window.addEventListener('pointerup', upHandler);
        return () => {
            window.removeEventListener('pointermove', moveHandler);
            window.removeEventListener('pointerup', upHandler);
        };
    }, [drawingContext]);
    return (
        <div className="board">
            <canvas
                ref={canvasRef}
                onPointerDown={downHandler}
                width={windowSize.width}
                height={windowSize.height}
                style={{
                    touchAction: 'none',
                }}
            />
        </div>
    );
}

export default Board;
