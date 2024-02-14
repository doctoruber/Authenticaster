const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.use(express.json());

app.get('/api/proxy', async (req, res) => {


  const targetURL = 'https://www.launchcaster.xyz/p/65c40e303216ae5507ef5743';

  try {
    const response = await axios.get(targetURL, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

