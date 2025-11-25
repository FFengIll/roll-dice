import { Clear, Delete, Undo } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    Paper,
    Snackbar,
    Stack,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface ScoreItem {
    id: string;
    value: number;
    timestamp: number;
}

interface HistoryState {
    items: ScoreItem[];
    timestamp: number;
}

const ScoreRecorder = () => {
    const STORAGE_KEY = "ScoreRecord";
    const MAX_HISTORY = 10;

    const [items, setItems] = useState<ScoreItem[]>(() => {
        try {
            const savedItems = localStorage.getItem(STORAGE_KEY);
            return savedItems ? JSON.parse(savedItems) : [];
        } catch (error) {
            console.error('Error loading saved items:', error);
            return [];
        }
    });

    const [inputValue, setInputValue] = useState('');
    const [history, setHistory] = useState<HistoryState[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.error('Error saving items:', error);
            setSnackbarMessage('Failed to save data');
            setSnackbarOpen(true);
        }
    }, [items]);

    const addItem = useCallback(() => {
        const number = parseFloat(inputValue);
        if (!isNaN(number)) {
            const newItem: ScoreItem = {
                id: Date.now().toString(),
                value: number,
                timestamp: Date.now()
            };

            setHistory(prev => [
                { items: [...items], timestamp: Date.now() },
                ...prev.slice(0, MAX_HISTORY - 1)
            ]);

            setItems(prev => [...prev, newItem]);
            setInputValue('');
        } else {
            setSnackbarMessage('Please enter a valid number');
            setSnackbarOpen(true);
        }
    }, [inputValue, items]);

    const removeItem = useCallback((id: string) => {
        setHistory(prev => [
            { items: [...items], timestamp: Date.now() },
            ...prev.slice(0, MAX_HISTORY - 1)
        ]);
        setItems(prev => prev.filter(item => item.id !== id));
    }, [items]);

    const clearItems = useCallback(() => {
        if (items.length > 0) {
            setHistory(prev => [
                { items: [...items], timestamp: Date.now() },
                ...prev.slice(0, MAX_HISTORY - 1)
            ]);
            setItems([]);
            setInputValue('');
        }
    }, [items]);

    const undo = useCallback(() => {
        if (history.length > 0) {
            const [lastState, ...restHistory] = history;
            setItems(lastState.items);
            setHistory(restHistory);
        }
    }, [history]);

    const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            addItem();
        }
    }, [addItem]);

    const formatTimestamp = useCallback((timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString();
    }, []);

    const sumItems = useMemo(() =>
        items.reduce((acc, item) => acc + item.value, 0),
        [items]
    );

    const uniqueSortedValues = useMemo(() => {
        const values = items.map(item => item.value);
        return [...new Set(values)].sort((a, b) => a - b);
    }, [items]);

    return (
        <Box sx={{
            maxWidth: { xs: '100%', sm: '1000px' },
            minWidth: "50vw",
            margin: '0 auto',
            padding: { xs: 2, sm: 3 }
        }}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">
                    Score Record
                </Typography>
                {/* <Typography color="text.secondary">
                    Total: {items.length} scores
                </Typography> */}
            </Stack>

            {/* Stats Card */}
            <Paper elevation={1} sx={{
                borderRadius: 2,
                p: 3,
                mb: 3,
                textAlign: 'center'
            }}>
                <Typography variant="body2" color="text.secondary">
                    Total
                </Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ mt: 1, color: 'primary.main' }}>
                    {sumItems}
                </Typography>
            </Paper>

            {/* Quick Add */}
            {uniqueSortedValues.length > 0 && (
                <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
                        Quick Add
                    </Typography>
                    <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                        sx={{ gap: 1 }}
                    >
                        {uniqueSortedValues.slice(0, 12).map((value, index) => (
                            <Button
                                key={index}
                                variant="outlined"
                                size="small"
                                onClick={() => setInputValue(value.toString())}
                                sx={{
                                    minWidth: '45px',
                                    borderRadius: 2
                                }}
                            >
                                {value}
                            </Button>
                        ))}
                    </Stack>
                </Paper>
            )}

            {/* Input Section */}
            <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Stack spacing={2}>
                    <TextField
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Enter a score"
                        fullWidth
                        size="medium"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button
                                        variant="contained"
                                        onClick={addItem}
                                        size="medium"
                                        sx={{ minWidth: '80px' }}
                                    >
                                        Add
                                    </Button>
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 2 }
                        }}
                    />
                    <Stack direction="row" spacing={2} justifyContent="center">
                        {history.length > 0 && (
                            <Tooltip title={`Undo (${history.length} available)`}>
                                <Button
                                    startIcon={<Undo />}
                                    onClick={undo}
                                    variant="outlined"
                                    color="primary"
                                    sx={{ borderRadius: 2 }}
                                >
                                    Undo
                                </Button>
                            </Tooltip>
                        )}
                        <Button
                            startIcon={<Clear />}
                            onClick={() => setConfirmDialogOpen(true)}
                            color="error"
                            variant="outlined"
                            disabled={items.length === 0}
                            sx={{ borderRadius: 2 }}
                        >
                            Clear All
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            {/* Score List */}
            <Paper elevation={0} sx={{
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                maxHeight: { xs: '100px', sm: '200px' },
                overflowY: 'auto'
            }}>
                {items.length > 0 ? (
                    <List sx={{ p: 0 }}>
                        {[...items].reverse().map((item, index) => (
                            <ListItem
                                key={item.id}
                                onClick={() => setInputValue(item.value.toString())}
                                sx={{
                                    cursor: 'pointer',
                                    borderBottom: index === 0 ? 'none' : '1px solid',
                                    borderColor: 'divider',
                                    '&:hover': { backgroundColor: 'action.hover' },
                                    py: 2
                                }}
                                secondaryAction={
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Tooltip title={`Added at ${formatTimestamp(item.timestamp)}`}>
                                            <Typography
                                                color="text.secondary"
                                                sx={{ fontSize: '0.75rem', display: { xs: 'none', sm: 'block' } }}
                                            >
                                                {formatTimestamp(item.timestamp)}
                                            </Typography>
                                        </Tooltip>
                                        <Tooltip title="Delete this score?">
                                            <IconButton
                                                edge="end"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeItem(item.id);
                                                }}
                                                size="small"
                                                color="error"
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                }
                            >
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                                    <Box sx={{
                                        backgroundColor: 'primary.main',
                                        color: 'primary.contrastText',
                                        borderRadius: '50%',
                                        width: '36px',
                                        height: '36px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.875rem',
                                        fontWeight: 'bold',
                                        flexShrink: 0
                                    }}>
                                        #{items.length - index}
                                    </Box>
                                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                        {item.value}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: { xs: 'block', sm: 'none' } }}
                                    >
                                        {formatTimestamp(item.timestamp)}
                                    </Typography>
                                </Stack>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Box sx={{
                        py: 8,
                        textAlign: 'center'
                    }}>
                        <Typography color="text.secondary">
                            No scores recorded yet. Add your first score above!
                        </Typography>
                    </Box>
                )}
            </Paper>

            {/* Clear Confirmation Dialog */}
            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Clear all scores?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This will remove all recorded scores. This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={() => {
                            clearItems();
                            setConfirmDialogOpen(false);
                        }}
                        color="error"
                        variant="contained"
                    >
                        Clear All
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="info"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ScoreRecorder;
