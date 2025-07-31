type AgentState = {
  memory: Record<string, any>;
  conversationHistory: Message[];
  currentTask?: string;
  personality?: string;
};

type Message = {
  role: "user" | "model" | "system";
  content: string;
  timestamp: number;
};
const DEFAULT_PERSONALITY = `You are an exceptionally powerful AI assistant with these capabilities:

1. **Precision Thinking**:
   - Analyze problems from multiple perspectives
   - Break down complex concepts into understandable parts
   - Provide step-by-step reasoning when appropriate

2. **Knowledge Mastery**:
   - Access to comprehensive, up-to-date information
   - Ability to synthesize information from diverse domains
   - Clear distinction between facts and opinions

3. **Adaptive Communication**:
   - Adjust explanation depth based on user's apparent knowledge level
   - Use examples and analogies to enhance understanding
   - Offer multiple solution approaches when applicable

4. **Proactive Assistance**:
   - Anticipate potential follow-up questions
   - Suggest related topics of interest
   - Flag potential misunderstandings or knowledge gaps

5. **Professional Tone**:
   - Be concise yet thorough
   - Maintain polite, professional demeanor
   - Structure responses for clarity (use bullet points, numbering, etc.)

   Special Instructions:
- Always verify facts before presenting as truth
- Admit knowledge limitations when uncertain
- Prioritize accuracy over speed in responses
- For technical topics, include relevant context and caveats
- When appropriate, suggest additional resources for deeper learning`;

class GeminiAgent {
  private state: AgentState;
  private apiKey: string;
  private baseUrl: string;
  private modelName: string;

  constructor(apiKey: string, modelName: string = "gemini-2.0-flash") {
    this.apiKey = apiKey;
    this.baseUrl = "https://generativelanguage.googleapis.com/v1beta";
    this.modelName = modelName;
    this.state = {
      memory: {},
      conversationHistory: [],
      personality: DEFAULT_PERSONALITY,
    };
  }

  public async initialize(systemPrompt?: string): Promise<void> {
    const prompt = systemPrompt ?? this.state.personality ?? "";
    this.addMessage("system", prompt);
  }

  public async processInput(userInput: string): Promise<string> {
    this.addMessage("user", userInput);

    try {
      const response = await this.generateResponse();
      this.addMessage("model", response);
      return response;
    } catch (error) {
      console.error("Processing error:", error);
      const errorMessage = "Error!";
      this.addMessage("model", errorMessage);
      return errorMessage;
    }
  }

  private async generateResponse(): Promise<string> {
    const response = await fetch(
      `${this.baseUrl}/models/${this.modelName}:generateContent?key=${this.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: this.formatMessagesForAPI(),
          systemInstruction: {
            parts: [{ text: this.getSystemPrompt() }],
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_ONLY_HIGH",
            },
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_ONLY_HIGH",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_ONLY_HIGH",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_ONLY_HIGH",
            },
          ],
          generationConfig: {
            maxOutputTokens: 2000,
            temperature: 0.8,
            topP: 0.9,
            topK: 40,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `API request failed: ${errorData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Invalid response format from API");
    }

    return data.candidates[0].content.parts[0].text;
  }

  private formatMessagesForAPI() {
    return this.state.conversationHistory.map((msg) => ({
      role: msg.role === "system" ? "user" : msg.role,
      parts: [{ text: msg.content }],
    }));
  }

  private getSystemPrompt(): string {
    return `Current state:
	  ${JSON.stringify(
      {
        memory: this.state.memory,
        currentTask: this.state.currentTask,
        personality: this.state.personality,
      },
      null,
      2
    )}
	  
	  Conversation history length: ${this.state.conversationHistory.length}`;
  }

  private addMessage(role: "user" | "model" | "system", content: string): void {
    this.state.conversationHistory.push({
      role,
      content,
      timestamp: Date.now(),
    });
  }

  public remember(key: string, value: any): void {
    this.state.memory[key] = value;
  }

  public recall(key: string): any {
    return this.state.memory[key];
  }

  public forget(key: string): boolean {
    if (key in this.state.memory) {
      delete this.state.memory[key];
      return true;
    }
    return false;
  }

  public setTask(task: string): void {
    this.state.currentTask = task;
  }

  public clearTask(): void {
    this.state.currentTask = undefined;
  }

  public setPersonality(personality: string): void {
    this.state.personality = personality;
    if (this.state.conversationHistory.some((m) => m.role === "system")) {
      this.state.conversationHistory = this.state.conversationHistory.map((m) =>
        m.role === "system" ? { ...m, content: personality } : m
      );
    } else {
      this.addMessage("system", personality);
    }
  }

  public clearMemory(): void {
    this.state.memory = {};
  }

  public clearConversation(preserveSystem: boolean = true): void {
    this.state.conversationHistory = preserveSystem
      ? this.state.conversationHistory.filter((m) => m.role === "system")
      : [];
  }

  public getConversationHistory(): Message[] {
    return [...this.state.conversationHistory];
  }

  public getMemorySnapshot(): Record<string, any> {
    return { ...this.state.memory };
  }

  public getCurrentTask(): string | undefined {
    return this.state.currentTask;
  }

  public getPersonality(): string | undefined {
    return this.state.personality;
  }

  public getState(): AgentState {
    return {
      memory: { ...this.state.memory },
      conversationHistory: [...this.state.conversationHistory],
      currentTask: this.state.currentTask,
      personality: this.state.personality,
    };
  }
}

export const createAgent = (
  apiKey: string,
  modelName?: string
): GeminiAgent => {
  return new GeminiAgent(apiKey, modelName);
};
