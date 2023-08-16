import React, { useState } from 'react';
import { Typography, AppBar, CssBaseline, Toolbar, TextField, Button, CardContent, CardMedia, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import SearchIcon from '@mui/icons-material/Search';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

const theme = createTheme({
  palette: {
    primary: {
      main: '#9ae6b4',
    },
  },
});

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movieData, setMovieData] = useState(null);
  const [emptyInputError, setEmptyInputError] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collection, setCollection] = useState([]);

  const clickedSearch = async () => {
    if (searchTerm.trim() === '') {
      setEmptyInputError(true);
      return;
    }

    try {
      const apiKey = process.env.REACT_APP_OMDB_API_KEY;
      // Access the environment variable
      const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&t=${searchTerm}`);
      const data = await response.json();
      setMovieData(data);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };

  const handleCloseErrorPopup = () => {
    setEmptyInputError(false);
  };

  const handleAddToCollection = () => {
    if (!collection.some(movie => movie.Title === movieData.Title)) {
      setCollection([...collection, movieData]);
    }
  };

  return (
    <div style={{ backgroundColor: '#1a202c', minHeight: '100vh', color: '#d2d8e0' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <AppBar position="relative">
          <Toolbar>
            <LiveTvIcon />
            <Typography variant="h6" align="right" style={{ flex: 1 , color: 'red'}}>
              <u><Button onClick={() => setDrawerOpen(true)} style={{color:'black', fontWeight:'bold'}}>Collection</Button></u>
            </Typography>
          </Toolbar>
        </AppBar>

        <Typography variant="h3" align='center'> <u>Welcome To MovieNest!</u> </Typography>
        <div style={{ textAlign: 'center', margin: '5%' }}>
          <b>
            <Typography variant="body1" align="center">
              Discover MovieNest: Your Ultimate Movie Companion. Dive into an extensive movie database, explore curated genres, and receive personalized recommendations that match your unique taste. Join a vibrant community of film enthusiasts, where you can build watchlists, leave reviews, and engage in spirited discussions. Experience the world of cinema like never before with MovieNest: where every frame tells a story and every click opens a new cinematic adventure.
            </Typography>
          </b>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10%', fontWeight: 'bold' }}>
          <TextField
            id="standard-basic"
            variant="standard"
            placeholder="Enter Movie Name Here..."
            inputProps={{
              style: {
                fontWeight: 'bold',
                color: '#d2d8e0',
              },
            }}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <Button variant="contained" onClick={clickedSearch} style={{ marginLeft: '10px' }}>
            <SearchIcon style={{ color: '#d2d8e0' }} />
          </Button>
        </div>

        {movieData && (
          <Card sx={{ maxWidth: 345, margin: '0 auto' }}>
          <CardMedia
            component="img"
            height="194"
            image={movieData.Poster}
            alt="Movie Poster"
          />
          <CardContent>
            <Typography variant="h4" align="center">
              {movieData.Title}
            </Typography>
            <Typography variant="body1" align="center">
              {movieData.Plot}
            </Typography>
            <Button
              variant="outlined"
              onClick={handleAddToCollection}
              style={{ marginTop: '10px', color: '#2196F3', borderColor: '#2196F3' }}
              align="center"
            >
              Add To Collection
            </Button>
          </CardContent>
        </Card>
        )}

        <Drawer
          anchor="bottom"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box role="presentation">
            <List>
              <ListItem key="CollectionHeading" disablePadding>
                <ListItemText>
                  <Typography variant="h6" align="center">
                   <u> My Collection</u>
                  </Typography>
                  {collection.map((movie) => (
                      <>
                    <Typography variant="p" align="left" key={movie.imdbID}>
                      {movie.Title} - {movie.Genre}
                    </Typography>
                    <br />
                    </>
                  ))}
                </ListItemText>
              </ListItem>
            </List>
            <Divider />
          </Box>
        </Drawer>

        <Dialog
          open={emptyInputError}
          onClose={handleCloseErrorPopup}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Empty Input Error"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please enter a movie name before searching.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseErrorPopup} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </div>
  );
};

export default App;
