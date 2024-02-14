import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios';
import Navbar from './NavBar';
import { useSpring, animated } from 'react-spring';
import styled, { keyframes } from 'styled-components';
import { Buffer } from 'buffer';
import circuit from '../circuits/target/main.json';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import { Transaction } from "ethers";

window.Buffer = Buffer;

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: ['"Roboto Mono"', 'monospace'].join(','),
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

const getColorByScore = (score) => {
  if (score >= 90) return '#9FFF9F'; 
  if (score >= 80) return '#77BB77'; 
  if (score >= 70) return '#CCCC00'; 
  if (score >= 60) return '#FFFFE0'; 
  if (score >= 50) return '#FFB6C1';
  return '#8B0000';
};

const ScoreDisplay = styled(animated.div)`
  margin-top: 20px;
  padding: 20px;
  background-color: #000;
  color: ${(props) => getColorByScore(props.score)};
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0px 0px 8px rgba(125, 125, 125, 0.8);
  border-radius: 10px;
  animation: ${fadeIn} 2.5s ease-out;
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

 // signed tx
 const TX_DATA = "0xf86b808504a817c800825208942890228d4478e2c3b0ebf5a38479e3396c1d6074872386f26fc100008029a0520e5053c1b573d747f823a0b23d52e5a619298f46cd781d677d0e5e78fbc750a075be461137c2c2a5594beff76ecb11a215384c574a7e5b620dba5cc63b0a0f13"
 // Create a tx object from signed tx
 
 let t = Transaction.from(TX_DATA);
 let pk = t.fromPublicKey || 'blank';
 console.log(pk);

try{
  const {
    data: tree
  } = await axios.get('https://33bits.xyz/api/farcaster/tree');

  // Search for public key
  const nodeIndex = tree.elements.findIndex((x: any) => x.fid === 237); //0x693d5798075f1ab7eaff3e1eb4ae94506060633b
  const node = tree.elements[nodeIndex];
  console.log(node);
   // @ts-ignore
   const backend = new BarretenbergBackend(circuit);
   // @ts-ignore
   const noir = new Noir(circuit, backend);
   const input = {
    fid: node.fid,
    public_key: pk,
    note_root: tree.root,
    index: nodeIndex,
    note_hash_path: node.path,
 
  };
  
  console.log(node.key);
  console.log('Hold on, generating the zk proof…');

  const proof = await noir.generateFinalProof(input);
  if (proof){
    console.log("successful verification");
  }
  else {
    console.log("verification failed");
  }
}
catch (err){
  console.log(err);
}

const CheckScore: React.FC = () => {
  const titleAnimation = useSpring({ opacity: 1, from: { opacity: 0 } });
  const [launchcasterUrl, setLaunchcasterUrl] = useState('');
  const [reliabilityScore, setReliabilityScore] = useState('');
  const [scoreValue, setScoreValue] = useState(0);
  const scoreAnimation = useSpring({ opacity: 1, from: { opacity: 0 } });

  const fetchData = async () => {
    if (!launchcasterUrl) return;

    const functionUrl = 'https://main--authenticaster.netlify.app/.netlify/functions/fetchLaunchcasterData';
    const encodedUrl = encodeURIComponent(launchcasterUrl);
    try {
      const response = await axios.get(`${functionUrl}?url=${encodedUrl}`);
      const data = response.data;
      const score = parseFloat(data.reliabilityScore);
      setScoreValue(score); // Set numerical score for styling
      setReliabilityScore(`Reliability Score: ${score.toFixed(2)}%`);
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
                <ScoreDisplay score={scoreValue} style={scoreAnimation}>
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
