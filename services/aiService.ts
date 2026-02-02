
import { N8N_WEBHOOK_URL } from '../constants';

export const aiService = {
  async sendMessage(text: string): Promise<string> {
    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatInput: text })
      });

      if (!response.ok) throw new Error('AI service error');
      
      const data = await response.json();
      // Handle various response formats from n8n
      return data.output || data.text || data.response || "I'm sorry, I couldn't process that request.";
    } catch (error) {
      console.error('AI Service Error:', error);
      return "There was an error connecting to the AI Assistant. Please check your webhook configuration.";
    }
  }
};
