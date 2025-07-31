# AI Chatbot - Gemini Powered

A modern, intelligent chatbot built with Next.js 15, TypeScript, and Google's Gemini AI. Features a beautiful UI with dark mode support, conversation persistence, and real-time chat capabilities.

## 🚀 Features

- **AI-Powered Conversations**: Powered by Google's Gemini AI
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Dark Mode**: Toggle between light and dark themes
- **Conversation Persistence**: Chat history saved locally
- **Real-time Chat**: Instant responses with loading states
- **Markdown Support**: Rich text formatting in responses
- **Error Handling**: Graceful error boundaries and fallbacks
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Custom components
- **AI**: Google Gemini API
- **Icons**: Heroicons & Lucide React
- **State Management**: React hooks with localStorage

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Google Gemini API key

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd ai-chatbot
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Gemini API Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
NEXT_PUBLIC_GEMINI_MODEL_NAME=gemini-pro
```

**Important**: Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
src/
├── app/
│   ├── api/chat/          # API routes
│   ├── chat/              # Chat interface components
│   ├── lib/               # Utility libraries
│   └── types.ts           # TypeScript definitions
├── components/
│   ├── ui/                # Reusable UI components
│   ├── ErrorBoundary.tsx  # Error handling
│   └── LoadingSpinner.tsx # Loading states
└── lib/
    └── utils.ts           # Utility functions
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_GEMINI_API_KEY` | Your Gemini API key | Yes |
| `NEXT_PUBLIC_GEMINI_BASE_URL` | Gemini API base URL | Yes |
| `NEXT_PUBLIC_GEMINI_MODEL_NAME` | Gemini model to use | Yes |

### Customization

- **Personality**: Modify the default personality in `src/app/lib/agent.ts`
- **Styling**: Customize themes in `tailwind.config.ts`
- **API Settings**: Adjust generation parameters in the agent configuration

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Google Gemini](https://ai.google.dev/) for the AI capabilities
- [Tailwind CSS](https://tailwindcss.com/) for the styling
- [Radix UI](https://www.radix-ui.com/) for the component primitives
