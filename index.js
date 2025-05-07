const express = require('express');
const axios = require('axios');

const app =express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const windowNumbers = [];

const apiMap = {
  p:'http://20.244.56.144/test/primes',
  f:'http://20.244.56.144/test/fibo',
  e:'http://20.244.56.144/test/even',
  r:'http://20.244.56.144/test/rand'
}

function updateWindow(newNums) {
  for (let num of newNums) {
    if (!windowNumbers.includes(num)) {
      if (windowNumbers.length >= WINDOW_SIZE) {
        windowNumbers.shift();
      }
      windowNumbers.push(num);
    }
  }
}



function calculateAvg(arr) {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((a, b) => a + b, 0);
  return parseFloat((sum / arr.length).toFixed(2));
}


app.get('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;

 
  if (!apiMap[numberid]) {
    return res.status(400).json({ error: 'Invalid number ID' });
  }

  
  const windowPrevState = [...windowNumbers];
  let newNumbers = []

  
  try {
    const response = await axios.get(apiMap[numberid], { timeout: 500 })
    newNumbers = response.data.numbers || []
  } catch (err) {
    console.log('API call failed or timed out. Using empty list.')
  }


  updateWindow(newNumbers);
  const avg = calculateAvg(windowNumbers)



  res.json({
    windowPrevState,
    windowCurrState: [...windowNumbers],
    numbers: newNumbers,
    avg
  })
})



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})