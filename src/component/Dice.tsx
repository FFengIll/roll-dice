
import './RollDice.css';


export const Dice = ({ id, value = '', size = 50, style = {}, isSelected = false, onClick }: { id: string; value?: string; size?: number; style?: React.CSSProperties; isSelected?: boolean; onClick: () => void }) => {
    return (
        <div
            id={id}
            className={`dice ${value === '' ? 'shaking' : 'dice'} ${isSelected ? 'selected' : ''}`}
            style={{
                width: size,
                height: size,
                fontSize: size * 0.5,
                ...style
            }}
            onClick={onClick}
        >
            {value}
        </div>
    );
};


export const CustomDice = ({ id, value = "", type = 6, size = 50, style = {}, isSelected = false, onClick }: { id: string; value?: string; type?: number; size?: number; style?: React.CSSProperties; isSelected?: boolean; onClick: () => void }) => {
    return (
        <div
            id={id}
            className={`dice ${value === '' ? 'shaking' : 'dice'} ${isSelected ? 'selected' : ''}`}
            style={{
                width: size,
                height: size,
                fontSize: size * 0.4,
                ...style
            }}
            onClick={onClick}
        >
            {/* 修改此处，根据type的值显示不同内容 */}
            {type === 6 ? value : `${value}/${type}`}
        </div>
    );
};

