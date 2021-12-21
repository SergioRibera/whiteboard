import { useState } from 'react';
import IconButton from '../Base/IconButton/IconButton';
import './style.css';

interface ToolButtonProps {
    children?: | React.ReactChild | React.ReactChild[];
    label?: string;
    icon: JSX.Element;
    sizeBrush?: number;
    currentColor?: string;
    onClick: () => void;
    onColorChange?: (color: string) => void;
}

const ToolButton = ({ children, label, icon, sizeBrush, currentColor, onClick }: ToolButtonProps): JSX.Element => {
    // set default color if not set
    if (!currentColor)
        currentColor = "#fff";
    return (
        <IconButton
            icon={icon}
            style={{
                width: label ?? '35px',
                height: label ?? '35px',
            }}
            onClick={onClick}>
            {children}
            {label && <span>{label}</span>}
            {sizeBrush &&
                <div className="size-badge" style={{width: sizeBrush, height: sizeBrush, backgroundColor: currentColor}}></div>}
        </IconButton>
    );
};

export default ToolButton;
