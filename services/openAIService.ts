
import { Client } from '../types';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export const openAIService = {
    /**
     * Send a message to OpenAI with CRM context
     */
    async sendMessage(userMessage: string, clients: Client[]): Promise<string> {
        if (!OPENAI_API_KEY) {
            return "OpenAI API key is not configured. Please check your environment settings.";
        }

        try {
            // Build context from client data
            const clientContext = clients.length > 0
                ? `Current CRM Database (${clients.length} clients):\n${clients.map(c =>
                    `- ${c.name}: ${c.status}, ${c.city}, ${c.phone}${c.notes ? `, Notes: ${c.notes}` : ''}`
                ).join('\n')}`
                : 'No clients in the database yet.';

            const messages: ChatMessage[] = [
                {
                    role: 'system',
                    content: `You are an intelligent CRM assistant for a real estate business. You help real estate agents manage their leads, schedule follow-ups, and provide insights about their clients.

${clientContext}

You can help with:
- Finding and filtering clients by status, location, or other criteria
- Scheduling follow-ups and reminders
- Drafting messages for clients
- Analyzing client data and providing insights
- Suggesting next best actions for leads

Be concise, professional, and proactive in your suggestions.`
                },
                {
                    role: 'user',
                    content: userMessage
                }
            ];

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: messages,
                    max_tokens: 500,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('OpenAI API Error:', errorData);
                throw new Error(`OpenAI API error: ${response.status}`);
            }

            const data = await response.json();
            return data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
        } catch (error) {
            console.error('OpenAI Service Error:', error);
            return "There was an error connecting to the AI Assistant. Please check your API key and try again.";
        }
    }
};
