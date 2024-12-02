const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    res.status(400).json({ error: 'No message provided' });
    return;
  }

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: message,
      max_tokens: 150,
      temperature: 0.7,
    });

    const reply = response.data.choices[0].text.trim();

    res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing your request' });
  }
};
