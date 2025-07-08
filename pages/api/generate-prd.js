// pages/api/generate-prd.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    const { prompt, requirements } = req.body;
  
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }
  
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.ANTHROPIC_API_KEY}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 3000,
          messages: [
            {
              role: 'user',
              content: `Generate a comprehensive Product Requirements Document (PRD) for: ${prompt}. 
              
              Requirements: ${requirements || 'Standard PRD format with sections for Overview, Goals, Features, User Stories, Technical Requirements, and Success Metrics'}
              
              Please structure the PRD professionally with clear sections and detailed content.`
            }
          ],
        }),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'API request failed');
      }
  
      res.status(200).json({
        success: true,
        prd: data.content[0].text
      });
  
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to generate PRD',
        error: error.message 
      });
    }
  }
