import { PointerEventHandler, useEffect, useRef, useState } from 'react';
import { stroke as brush, BrushStrokeResult } from '@disjukr/croquis-js/lib/brush/simple';

import './style.css';
import { getStylusState } from '@disjukr/croquis-js/lib/stylus';
import { StrokeDrawingContext } from '@disjukr/croquis-js/lib/stroke-protocol';

interface Config {
    brushSize: number;
    color: string;
}

export interface WindowSize {
    width: number;
    height: number;
}

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

const Board = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // useCanvasFadeout(canvasRef);
    const windowSize = useWindowSize();
    const [drawingContext, setDrawingContext] = useState<
        StrokeDrawingContext<any, any, BrushStrokeResult>
    >();
    const [config, setConfig] = useState<Config>(() => ({
        brushSize: 40,
        color: '#000',
    }));
    useEffect(() => {
        if (!drawingContext?.getState().update) return;
        const id = setInterval(drawingContext.getState().update, 10);
        return () => clearInterval(id);
    }, [drawingContext]);
    const downHandler: PointerEventHandler = e => {
        const ctx = canvasRef.current!.getContext('2d')!;
        const brushConfig = {
            ctx,
            size: config.brushSize,
            color: config.color,
        };
        const stylusState = getStylusState(e.nativeEvent);
        const drawingContext = brush.down(brushConfig, stylusState);
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
