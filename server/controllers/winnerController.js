const axios = require('axios');

exports.determineWinner = async (req, res) => {
  const { communityCards, playerCards } = req.query;
  try {
    const response = await axios.get(`${process.env.POKER_API_URL}?cc=${communityCards}&pc[]=${playerCards}`);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not cal winner' });
  }
};