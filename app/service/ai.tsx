// Message type definitions
export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type ChatHistory = ChatMessage[];

// function to call vercel backend instead of openai api directly
export const sendMessageToAI = async (message: string, history: ChatHistory = []): Promise<string> => {
  try {
    // call vercel backend
    const response = await fetch('https://mindmatter-backend.vercel.app/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history,
      }),
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // check to match the response format
    if (data.message) {
      return data.message;
    } else if (data.success && data.data?.message) {
      // else use this format
      return data.data.message;
    } else {
      console.error('AI API Error: Unexpected response format', data);
      return "I'm sorry, I encountered an error processing your request. Please try again later.";
    }
  } catch (error) {
    console.error('AI API Request Error:', error);
    return "I'm sorry, I couldn't connect to my brain right now. Please try again later.";
  }
};

export default sendMessageToAI