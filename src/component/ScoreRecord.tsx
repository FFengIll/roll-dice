import React, {useState, useEffect} from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    InputAdornment,
    ListItemIcon,
    Grid2 as Grid
} from '@mui/material';

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

    return (
        <Container sx={{marginTop: 2}}>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <Typography variant="h4" gutterBottom>Score Record</Typography>
                    <Typography variant="h5">Total: {sumItems}</Typography>
                </Grid>

                <Grid size={12}>
                    <Grid container spacing={1}>
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

                <Grid size={12}>
                    <Grid container spacing={1} alignItems="center">
                        <Grid>
                            <TextField
                                type="number"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                label="Enter a score"
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Button variant="contained" color="primary" onClick={addItem}>
                                                Add
                                            </Button>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid>
                            <Button variant="outlined" color="secondary" onClick={clearItems}
                                    style={{marginRight: '10px'}}>Clear</Button>
                            <Button variant="outlined" onClick={revokeItems} disabled={prevItems.length === 0}
                                    style={{marginRight: '10px'}}>Revoke</Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid size={12}>
                    <List>
                        {items.slice().map((item, index) => {
                            const displayIndex = index + 1;
                            return (
                                <ListItem key={index}>
                                    <ListItemIcon>
                                        <Typography variant="body1">{`${displayIndex})`}</Typography>
                                    </ListItemIcon>
                                    <ListItemText primary={`${item}`}/>
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