const express = require('express')
const cors = require('cors');
const app = express();
app.use(cors());
const port = process.env.PORT || 3001;
const OpenAI = require('openai');


app.use(express.json());

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


app.post('/chat', async (req, res) => {
    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {"role": "system", "content": "Keep your answers short and concise."},
                {"role": "user", "content": req.body.messages}
            ]
        });

        console.log("OpenAI Response:", response.data);

        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});
