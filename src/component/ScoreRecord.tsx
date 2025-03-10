import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Button,
    Container,
    Grid2 as Grid,
    InputAdornment,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import './ScoreRecord.css';

const ScoreRecord = () => {
    const [items, setItems] = useState(() => {
        const savedItems = localStorage.getItem('items');
        return savedItems ? JSON.parse(savedItems) : [];
    });
    const [inputValue, setInputValue] = useState('');
    const [prevItems, setPrevItems] = useState([]);
    const [spacing, setSpacing] = useState(5); // 控制间距

    useEffect(() => {
        localStorage.setItem('items', JSON.stringify(items));
    }, [items]);

    const addItem = () => {
        const number = parseFloat(inputValue);
        if (!isNaN(number)) {
            setPrevItems(items); // Store previous items before adding
            setItems([...items, number]);
            setInputValue('');
        }
    };

    const clearItems = () => {
        setPrevItems(items); // Store current items for restoration
        setItems([]);
        setInputValue('');
    };

    const revokeItems = () => {
        setItems(prevItems);
        setPrevItems([]);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            addItem();
        }
    };

    const sumItems = items.reduce((acc, item) => acc + item, 0);

    const uniqueSortedItems = [...new Set(items)].sort((a, b) => a - b);

    const goHome = () => {
        window.location.href = '/roll-dice/dist/';
    };

    return (
        <Container sx={{ marginTop: 2 }}>
            <Grid container spacing={2}>
                <button className="control-btn home-button" onClick={goHome} >
                    <FontAwesomeIcon icon={faHome} />
                </button>

                <Grid size={12} >
                    <Typography variant="h4" gutterBottom>Score Record</Typography>

                </Grid>

                <Grid size={12}>
                    <Typography variant="h5">Total: {sumItems}</Typography>
                </Grid>

                <Grid size={12} display="flex"
                    justifyContent="center"
                    alignItems="center">
                    <Grid container spacing={1} >
                        <Grid
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Typography variant="h5" gutterBottom>
                                {/* Quick:  */}
                            </Typography>
                        </Grid>
                        {uniqueSortedItems.map((item, index) => (
                            <Grid key={index}>
                                <Button variant="outlined" onClick={() => setInputValue(item)}>
                                    {item}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                <Grid size={12} display="flex"
                    justifyContent="center"
                    alignItems="center">
                    <Grid container spacing={1} alignItems="center">
                        <Grid  >
                            <TextField
                                type="number"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress} // 使用 onKeyDown 替代 onKeyPress
                                label="Enter a score"
                                variant="outlined"
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Button variant="contained" color="primary" onClick={addItem}>
                                                    Add
                                                </Button>
                                            </InputAdornment>
                                        ),
                                    },
                                }} // 使用 slotProps.input 替代 InputProps
                            />
                        </Grid>

                        <Grid>
                            <Button variant="outlined" color="secondary" onClick={clearItems}
                                style={{ marginRight: '10px' }}>Clear</Button>
                            <Button variant="outlined" onClick={revokeItems} disabled={prevItems.length === 0}
                                style={{ marginRight: '10px' }}>Revoke</Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid size={12} display="flex"
                    justifyContent="center"
                    alignItems="center">
                    <List sx={{
                        maxHeight: '300px',
                        minWidth: '300px',
                        overflow: 'auto',
                        alignContent: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f1f1f1',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#888',
                            borderRadius: '4px',
                        },
                    }}>
                        {items.slice().map((item, index) => {
                            const displayIndex = index + 1;
                            return (
                                <ListItem key={index}>
                                    <ListItemIcon>
                                        <Typography variant="body1">{`${displayIndex})`}</Typography>
                                    </ListItemIcon>
                                    <ListItemText primary={`${item}`} />
                                </ListItem>
                            );
                        }).reverse()}
                    </List>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ScoreRecord;