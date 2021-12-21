import React, { ReactNode } from 'react';
import ButtonBase from '../ButtonBase/ButtonBase';
import './style.css';

interface IconButtonProps {
    style?: React.CSSProperties;
    onClick: () => void;
    onHover?: () => void;
    icon: React.ReactNode;
    children?: ReactNode;
}

const IconButton = ({ icon, style, children, onClick, onHover }: IconButtonProps) => {
    return (
        <ButtonBase
            style={style}
            onClick={onClick}
            onHover={onHover}>
            {icon}
            {children}
        </ButtonBase>
    );
};

export default IconButton;
