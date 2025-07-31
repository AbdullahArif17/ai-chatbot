import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--color-destructive)",
          foreground: "var(--color-primary-foreground)",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--color-popover)",
          foreground: "var(--color-popover-foreground)",
        },
        card: {
          DEFAULT: "var(--color-card)",
          foreground: "var(--color-card-foreground)",
        },
        sidebar: {
          DEFAULT: "var(--color-sidebar)",
          foreground: "var(--color-sidebar-foreground)",
          primary: "var(--color-sidebar-primary)",
          "primary-foreground": "var(--color-sidebar-primary-foreground)",
          accent: "var(--color-sidebar-accent)",
          "accent-foreground": "var(--color-sidebar-accent-foreground)",
          border: "var(--color-sidebar-border)",
          ring: "var(--color-sidebar-ring)",
        },
        chart: {
          "1": "var(--color-chart-1)",
          "2": "var(--color-chart-2)",
          "3": "var(--color-chart-3)",
          "4": "var(--color-chart-4)",
          "5": "var(--color-chart-5)",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
        xl: "var(--radius-xl)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "bounce-gentle": "bounceGentle 2s infinite",
        "stream-pulse": "streamPulse 1.5s infinite",
        "text-reveal": "textReveal 0.5s ease-out forwards",
        "message-enter": "messageEnter 0.3s ease-out forwards",
        "typing-indicator": "typingIndicator 1.4s infinite ease-in-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite alternate",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 3s linear infinite",
        "bounce-slow": "bounce 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        bounceGentle: {
          "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-10px)" },
          "60%": { transform: "translateY(-5px)" },
        },
        streamPulse: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        textReveal: {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
            filter: "blur(4px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
            filter: "blur(0px)",
          },
        },
        messageEnter: {
          "0%": {
            opacity: "0",
            transform: "scale(0.95) translateY(20px)",
            filter: "blur(4px)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1) translateY(0)",
            filter: "blur(0px)",
          },
        },
        typingIndicator: {
          "0%, 60%, 100%": { transform: "translateY(0)" },
          "30%": { transform: "translateY(-8px)" },
        },
        glowPulse: {
          "0%": {
            boxShadow: "0 0 5px var(--color-primary)",
            transform: "scale(1)",
          },
          "100%": {
            boxShadow: "0 0 20px var(--color-primary), 0 0 30px var(--color-chart-1)",
            transform: "scale(1.02)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      transitionProperty: {
        height: "height",
        "max-height": "max-height",
        text: "color, text-shadow, filter",
        blur: "filter",
        spacing: "margin, padding",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), // Ensure this plugin is installed if you use it
    ({ addUtilities }: any) => {
      addUtilities({
        ".text-stream": {
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            right: "-8px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "3px",
            height: "1.2em",
            backgroundColor: "currentColor",
            borderRadius: "2px",
            animation: "streamPulse 1.5s infinite",
          },
        },
        ".typing-dot": {
          display: "inline-block",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "currentColor",
          animation: "typingIndicator 1.4s infinite ease-in-out",
          "&:nth-child(2)": {
            animationDelay: "0.2s",
          },
          "&:nth-child(3)": {
            animationDelay: "0.4s",
          },
        },
        ".glass-effect": {
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
        ".dark .glass-effect": {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
        ".message-gradient": {
          background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-chart-1) 100%)",
        },
        ".ai-gradient": {
          background: "linear-gradient(135deg, var(--color-card) 0%, var(--color-muted) 100%)",
        },
        ".dark .ai-gradient": {
          background: "linear-gradient(135deg, var(--color-card) 0%, var(--color-secondary) 100%)",
        },
        ".shimmer": {
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
            animation: "shimmer 2s linear infinite",
          },
        },
        ".gradient-border": {
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: "0",
            padding: "2px",
            background: "linear-gradient(135deg, var(--color-chart-1), var(--color-chart-2), var(--color-chart-3))",
            borderRadius: "inherit",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "xor",
          },
        },
        ".neon-glow": {
          boxShadow: "0 0 5px var(--color-chart-1), 0 0 20px var(--color-chart-1), 0 0 35px var(--color-chart-1)",
        },
        ".text-gradient": {
          background: "linear-gradient(135deg, var(--color-chart-1), var(--color-chart-2))",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        },
      })
    },
  ],
}

export default config
