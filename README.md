# SenseVoice - AI Voice Technology Platform

Advanced AI voice technology for Bengali language processing with cutting-edge speech recognition and synthesis capabilities.

## 🚀 Features

- **Text-to-Speech (TTS)**: Convert text to natural-sounding Bengali speech
- **Automatic Speech Recognition (ASR)**: Transcribe Bengali audio to text
- **User Authentication**: Secure login/signup with Supabase
- **Dark Mode**: Full dark mode support
- **Responsive Design**: Optimized for all devices
- **Modern UI**: Built with Tailwind CSS and Radix UI components

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0.0 (React 19.2.0)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account
- Git

## 🏁 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/AST_TTS.git
cd AST_TTS
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=your_api_url
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📦 Project Structure

```
AST_TTS/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   ├── asr/                 # ASR feature pages
│   ├── tts/                 # TTS feature pages
│   ├── login/              # Authentication pages
│   ├── signup/
│   ├── profile/
│   ├── privacy-policy/
│   └── terms-conditions/
├── components/              # React components
│   ├── ui/                 # Reusable UI components
│   ├── footer.tsx
│   ├── navbar.tsx
│   └── ...
├── lib/                    # Utility functions
│   ├── supabase/          # Supabase client
│   └── utils.ts
├── public/                 # Static assets
│   ├── logo/
│   └── samples/
├── styles/                 # Global styles
├── .env.example           # Environment variables template
├── next.config.mjs        # Next.js configuration
├── tailwind.config.ts     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Review Pre-Deployment Checklist**
   See [PRE_DEPLOYMENT_CHECKLIST.md](./PRE_DEPLOYMENT_CHECKLIST.md)

2. **Follow Deployment Guide**
   See [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)

3. **Quick Deploy**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

Or click the button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/AST_TTS)

## 🔐 Environment Variables

Required environment variables for deployment:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `NEXT_PUBLIC_API_URL` | Backend API URL | Optional |

See `.env.production.example` for complete list.

## 🧪 Testing

```bash
# Run linter
npm run lint

# Build test
npm run build

# Test production build locally
npm run build && npm start
```

## 📱 Features Overview

### Text-to-Speech (TTS)
- Article & Blog Readout
- Audiobook Production
- E-commerce Audio
- Educational Voiceovers
- Podcast Conversion
- And more...

### Speech Recognition (ASR)
- Call Transcription
- Interview Transcription
- Meeting Minutes
- Voice Commands
- Voice Data Entry
- And more...

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Contact

**SenseVoice**
- Email: info@sensevoice.ai
- Phone: +880 123 456 7890
- Address: Banani, Dhaka-1213, Bangladesh

## 🔗 Links

- [Privacy Policy](/privacy-policy)
- [Terms & Conditions](/terms-conditions)
- [Documentation](./docs)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Vercel](https://vercel.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)

---

**Built with ❤️ by SenseVoice Team**
