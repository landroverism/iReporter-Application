import { action } from "./_generated/server";
import { v } from "convex/values";

export const analyzeReportContent = action({
  args: {
    description: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const prompt = `
Analyze the following report description and categorize it:

Description: "${args.description}"

Based on this description, determine:
1. Category: "red-flag" (corruption/misconduct) or "intervention" (infrastructure/service request)
2. Specific type from these options:

Red Flag types:
- Bribery and Corruption
- Embezzlement of Public Funds
- Abuse of Office
- Fraudulent Activities
- Nepotism and Favoritism
- Misuse of Government Resources
- Other Corruption

Intervention types:
- Road Repairs and Maintenance
- Water and Sanitation Issues
- Public Facility Problems
- Healthcare Service Issues
- Education Infrastructure
- Public Safety Concerns
- Environmental Issues
- Other Infrastructure

3. Suggest an improved title (max 100 characters)
4. Suggest an improved description with better structure and clarity

Respond in JSON format:
{
  "category": "red-flag" or "intervention",
  "type": "specific type from the list above",
  "suggestedTitle": "improved title",
  "improvedDescription": "improved description",
  "confidence": 0.0-1.0
}
`;

      const response = await fetch(`${process.env.CONVEX_OPENAI_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CONVEX_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-nano',
          messages: [
            {
              role: 'system',
              content: 'You are an AI assistant that helps categorize citizen reports for a government transparency platform. Be accurate and helpful.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        const result = JSON.parse(content);
        return result;
      } catch (parseError) {
        console.error('Failed to parse AI response:', content);
        return {
          category: null,
          type: null,
          suggestedTitle: null,
          improvedDescription: null,
          confidence: 0
        };
      }
    } catch (error) {
      console.error('Error in AI analysis:', error);
      return {
        category: null,
        type: null,
        suggestedTitle: null,
        improvedDescription: null,
        confidence: 0
      };
    }
  },
});

export const chatWithAssistant = action({
  args: {
    message: v.string(),
    chatHistory: v.array(v.object({
      role: v.union(v.literal("user"), v.literal("assistant")),
      content: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    try {
      const systemMessage = {
        role: 'system' as const,
        content: `You are a helpful AI assistant for iReporter, a platform for reporting corruption and requesting government intervention. 

Your role is to:
1. Help users understand how to file effective reports
2. Provide guidance on what information to include
3. Explain the difference between red flag (corruption) and intervention (infrastructure) reports
4. Answer questions about the reporting process
5. Offer encouragement and support to citizens

Be friendly, professional, and supportive. Keep responses concise but helpful.`
      };

      const messages = [
        systemMessage,
        ...args.chatHistory,
        { role: 'user' as const, content: args.message }
      ];

      const response = await fetch(`${process.env.CONVEX_OPENAI_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CONVEX_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-nano',
          messages: messages,
          temperature: 0.7,
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;
      
      return {
        message: assistantMessage
      };
    } catch (error) {
      console.error('Error in chat:', error);
      return {
        message: "I'm sorry, I'm having trouble responding right now. Please try again later or proceed with filing your report manually."
      };
    }
  },
});
