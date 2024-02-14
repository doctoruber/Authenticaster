import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios';
import '@react95/icons/icons.css';
import Navbar from './NavBar'; 
import { useSpring, animated } from 'react-spring'; 
import styled, { keyframes } from 'styled-components'; 
import { Buffer } from 'buffer';

window.Buffer = Buffer;

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: [
      '"Roboto Mono"',
      'monospace',
    ].join(','),
  },
});


const fadeIn = keyframes`
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;


const CheckScoreContainer = styled('div')`
  background: linear-gradient(270deg, #000, #000);
  background-size: 400% 400%;
  animation: ${fadeIn} 15s ease once;
  padding: 50px;
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const ScoreDisplay = styled(animated.div)`
  margin-top: 20px;
  padding: 20px;
  background-color: #222;
  color: #0f0; // A greenish hue for better visibility
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0px 0px 8px rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  animation: ${fadeIn} 2s ease-out;
  display: inline-block;
`;

const Content = styled('div')`
  display: inline-block;
  margin: auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
`;

const CheckScore: React.FC = () => {
    const titleAnimation = useSpring({ opacity: 1, from: { opacity: 0 } });
    const [launchcasterUrl, setLaunchcasterUrl] = useState('');
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('');
    const [votes, setVotes] = useState(0);
    const [reliabilityScore, setReliabilityScore] = useState('');
    const scoreAnimation = useSpring({ opacity: 1, from: { opacity: 0 } });

    const fetchData = async () => {
      if (!launchcasterUrl) return; 
    
      const functionUrl = 'https://main--authenticaster.netlify.app/.netlify/functions/fetchLaunchcasterData';

      const encodedUrl = encodeURIComponent(launchcasterUrl);
      try {
          const response = await axios.get(`${functionUrl}?url=${encodedUrl}`);
          const data = response.data;
          console.log(data);
          setTitle(data.title);
          setTime(data.time);
          setVotes(data.votes);
          setReliabilityScore(`Reliability Score: ${parseFloat(data.reliabilityScore).toFixed(2)}%`);
    
      } catch (error) {
          console.error('Error fetching data:', error);
      }
    };
    

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); 
        fetchData();
    };

    return (
      <ThemeProvider theme={theme}>
          <Navbar />
          <CssBaseline />
          <CheckScoreContainer>
              <Grid container spacing={3} style={{ padding: 24 }}>
                  <Grid item xs={12}>
                      <animated.div style={titleAnimation}>
                          <Typography variant="h3" component="h1" gutterBottom>
                              Hi. This is Authenticaster!
                          </Typography>
                      </animated.div>
                      <Content>
                          <form onSubmit={handleSubmit}>
                              <TextField 
                                  label="Launchcaster Post URL" 
                                  variant="outlined" 
                                  fullWidth 
                                  value={launchcasterUrl}
                                  onChange={(e) => setLaunchcasterUrl(e.target.value)}
                              />
                              <Button type="submit" variant="contained" style={{ marginTop: '20px' }}>
                                  Verify Post
                              </Button>
                          </form>
                          {reliabilityScore && (
                              <ScoreDisplay style={scoreAnimation}>
                                  {reliabilityScore}
                              </ScoreDisplay>
                          )}
                      </Content>
                  </Grid>
              </Grid>
          </CheckScoreContainer>
      </ThemeProvider>
  );
};

export default CheckScore;