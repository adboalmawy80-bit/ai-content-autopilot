const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

exports.generateContent = async (req, res) => {
    const { topic, platform, tone } = req.body;

    if (!topic || !platform) {
        return res.status(400).json({ error: 'Topic and platform are required' });
    }

    try {
        const prompt = `Write a professional ${platform} post about "${topic}" using a ${tone || 'engaging'} tone. Include relevant hashtags.`;
        
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 500
        });

        const generatedContent = response.choices[0].message.content;
        res.json({ success: true, content: generatedContent });
    } catch (error) {
        console.error('OpenAI Error:', error.message);
        res.status(500).json({ error: 'Failed to generate content' });
    }
};
