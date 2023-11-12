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

// Chat endpoint
app.post('/chat', async (req, res) => {
    try{
        const userMessage = req.body.messages[req.body.messages.length - 1].content;
        console.log(`User message:`, userMessage);

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {"role": "system", "content": "Keep your answers short and concise."},
                {"role": "user", "content": userMessage}
            ],
            n: 1,
        });

        console.log("Prompt tokens:", response.usage.prompt_tokens)
        console.log("Completion tokens:", response.usage.completion_tokens)
        console.log("Total tokens:", response.usage.total_tokens)
        console.log("OpenAI Response:", response.choices[0]);

        res.json(response);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.post('/stream', async(req, res)=>{
    // Header setup
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });

    try {
        const userMessage = req.body.messages[req.body.messages.length - 1].content;
        console.log(`User message:`, userMessage);

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {"role": "system", "content": "Keep your answers short and concise."},
                {"role": "user", "content": userMessage}
            ],
            stream: true,
            n: 1,
        });

        console.log("OpenAI Response:");
        for await (const chunk of response) {
            const data = chunk.choices[0].delta.content;
            if (data) {
                // Send data to client
                console.log("OpenAI Response:", data.toString());
                res.write(`data: ${JSON.stringify({ content: data })}\n\n`);
            }
        }

        res.end();

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send(error.toString());
    }
});
