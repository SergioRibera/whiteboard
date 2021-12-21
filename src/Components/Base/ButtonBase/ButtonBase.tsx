import './style.css';

interface ButtonBaseProps {
    style?: React.CSSProperties;
    onClick: () => void;
    onHover?: () => void;
    children?: React.ReactNode;
}

const ButtonBase = ({ style, children, onClick, onHover }: ButtonBaseProps) => {
    return (
        <div
            className="tool-button"
            style={style}
            onClick={onClick}
            onMouseEnter={onHover}>
            {children}
        </div>
    );
};

export default ButtonBase;
