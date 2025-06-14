/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          950: "#030712",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        float: "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 3s infinite",
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
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
    },
  },
  plugins: [],
  safelist: [
    // Layout & Flexbox
    "flex",
    "min-h-screen",
    "w-full",
    "w-1/2",
    "w-64",
    "flex-col",
    "flex-row",
    "md:flex-row",
    "md:w-1/2",
    "lg:w-1/2",
    "items-center",
    "justify-center",

    // Spacing
    "p-2",
    "p-6",
    "p-12",
    "py-2",
    "px-4",
    "m-2",
    "my-2",
    "my-3",
    "mr-2",
    "mx-1",
    "mt-1",
    "space-y-6",

    // Sizing
    "h-8",
    "h-10",
    "w-10",
    "max-w-sm",
    "block",

    // Colors & Backgrounds
    "bg-white",
    "bg-white/50",
    "bg-white/90",
    "bg-gray-100",
    "bg-gray-200",
    "bg-gray-300",
    "bg-gray-700/50",
    "bg-gray-800/50",
    "bg-gray-900/80",
    "bg-blue-600",
    "bg-blue-700",
    "bg-red-100",
    "text-white",
    "text-gray-700",
    "text-gray-800",
    "text-gray-900",
    "text-red-800",

    // Borders & Shadows
    "border",
    "border-gray-300",
    "rounded-md",
    "rounded-lg",
    "shadow-sm",
    "shadow-md",
    "shadow-lg",

    // Typography
    "text-2xl",
    "text-sm",
    "font-bold",
    "font-medium",

    // Positioning
    "relative",
    "absolute",
    "left-1/2",
    "transform",
    "-translate-x-1/2",

    // States & Effects
    "cursor-pointer",
    "hover:bg-gray-100",
    "hover:bg-gray-300",
    "hover:bg-gray-700/50",
    "hover:bg-blue-700",
    "focus:ring-blue-500",
    "focus:border-blue-500",
  ],
};
