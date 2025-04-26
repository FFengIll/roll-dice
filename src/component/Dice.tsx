
import './RollDice.css';


const D6 = ({ id, value = 0, size = 50, style = {}, isSelected = false, onClick }: { id: string; value?: number; size?: number; style?: React.CSSProperties; isSelected?: boolean; onClick: () => void }) => {
    return (
        <div
            id={id}
            className={`dice ${value === 0 ? 'shaking' : 'dice6'} ${isSelected ? 'selected' : ''}`}
            style={{
                width: size,
                height: size,
                fontSize: size * 0.5,
                ...style
            }}
            onClick={onClick}
        >
            {value || ""}
        </div>
    );
};

const D8 = ({ n, size }) => {
    return (
        <div
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: size, height: size, }}
        >
            <svg viewBox="0 0 172 172" fill="none" data-dietype="8" xmlns="http://www.w3.org/2000/svg"><path d="M0 34.4V129L86 0L0 34.4Z" fill="#66B3C4"></path><path d="M172 34.4V129L86 0L172 34.4Z" fill="#66B3C4"></path><path d="M86 0L172 129H0L86 0Z" fill="#99CCD8"></path><path d="M86 172L-3.87022e-06 129L172 129L86 172Z" fill="#00809D"></path><text x="50%" y="87px" fill="#111111" font-size="70px" font-weight="100" alignment-baseline="middle" text-anchor="middle">{n || ""}</text></svg>
        </div>
    )
}

const D10 = ({ n, size }) => {
    return (
        <div
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: size, height: size, }}
        >
            <svg viewBox="0 0 172 172" fill="none" data-dietype="10" xmlns="http://www.w3.org/2000/svg"><path d="M38.7 107.5L86 129L133.3 107.5H172L86 172L0 107.5H38.7Z" fill="#2C62A0"></path><path d="M86 0L133.3 107.5L86 129L38.7 107.5L86 0Z" fill="#7AB1E3"></path><path d="M86 0L38.7 107.5H0V70.95L86 0Z" fill="#3892D1"></path><path d="M86 0L133.3 107.5H172V70.95L86 0Z" fill="#3892D1"></path><text x="50%" y="87px" fill="#111111" font-size="70px" font-weight="100" alignment-baseline="middle" text-anchor="middle">{n || ""}</text></svg>
        </div>
    )
}

const D12 = ({ n, size }) => {

    return (
        <div
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: size, height: size, }}
        >
            <svg viewBox="0 0 172 172" fill="none" data-dietype="12" xmlns="http://www.w3.org/2000/svg"><path d="M34.3999 73.0996L85.9996 30.0996L137.6 73.0996L120.4 129H85.9996H51.5999L34.3999 73.0996Z" fill="#C8D899"></path><path d="M27.95 150.5L86.0001 172L144 150.5L120.4 129H86.0001H51.6L27.95 150.5Z" fill="#4C7001"></path><path d="M0 111.8L27.95 150.5L51.6 129L43 101.05L34.4 73.1L0 60.2V111.8Z" fill="#6B9D00"></path><path d="M172 111.8L144.05 150.5L120.4 129L129 101.05L137.6 73.1L172 60.2V111.8Z" fill="#6B9D00"></path><path d="M0 60.1996L34.4 73.0996L86 30.0996V14.4939V-0.000467682L27.95 21.4996L0 60.1996Z" fill="#ACC466"></path><path d="M172 60.1996L137.6 73.0996L86 30.0996V14.4939V-0.000467682L144.05 21.4996L172 60.1996Z" fill="#ACC466"></path><text x="50%" y="87px" fill="#111111" font-size="70px" font-weight="100" alignment-baseline="middle" text-anchor="middle">{n || ""}</text></svg>
        </div>
    )
}

const DN = ({ n, size }) => {

    return (
        <div
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: size, height: size, }}
        >

        </div>
    )
}


export const CustomDice = ({ id, value = 0, type = 6, size = 50, style = {}, isSelected = false, onClick }: { id: string; value?: number; type?: number; size?: number; style?: React.CSSProperties; isSelected?: boolean; onClick: () => void }) => {


    if (type === 8 || type === 12 || type === 10) {
        return (
            <div
                className={`dice ${value === 0 ? 'shaking' : 'dice'} ${isSelected ? 'selected' : ''}`}
            >
                {type === 8 && <D8 n={value} size={size} />}
                {type === 10 && <D10 n={value} size={size} />}
                {type === 12 && <D12 n={value} size={size} />}
            </div>
        );
    }

    return (
        <div
            id={id}
            className={`dice ${value === 0 ? 'shaking6' : 'dice6'} ${isSelected ? 'selected' : ''}`}
            style={{
                width: size,
                height: size,
                fontSize: size * 0.4,
                ...style
            }}
            onClick={onClick}
        >
            {/* 修改此处，根据type的值显示不同内容 */}
            {type === 6 ? value || "" : `${value}/${type}`}
        </div>
    );
};

