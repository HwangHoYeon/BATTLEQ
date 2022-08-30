module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontSize: {
        "3xl": "2rem",
        "4xl": "2.5rem",
        "5xl": "3rem",
        "6xl": "4rem",
        "7xl": "5rem",
        "10xl": "15rem",
      },
      colors: {
        "orange-400": "#facc15",
        salmon: "#E5CB9F",
      },
      borderRadius: {
        "button-gameStart": "30%",
      },
      width: {
        "width-gameScreen": "90%",
        "width-userLobby": "60%",
        "90per": "90%",
        "85per": "85%",
        "80per": "80%",
        "70per": "70%",
        "60per": "60%",
        "50per": "50%",
        "45per": "45%",
        "30per": "30%",
        "25per": "25%",
        "20per": "20%",
        "15per": "15%",
        "10per": "10%",
      },
      height: {
        "chat-height": "48rem",
        "90per": "90%",
        "85per": "85%",
        "80per": "80%",
        "70per": "70%",
        "60per": "60%",
        "50per": "50%",
        "45per": "45%",
        "25per": "25%",
        "20per": "20%",
        "15per": "15%",
        "10per": "10%",
      },
      spacing: {
        "left-category": "22rem",
        "left-introduction": "5.5rem",
      },
      animation: {
        "spin-slow": "grade 3s linear infinite",
      },

      keyframes: {
        grade: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(15deg)" },
        },
        gameTimer: {
          "0%": { transform: "rotateX(-100deg) rotate(0)" },
          "100%": { transform: "rotateX(0deg) rotate(-100deg)" },
        },
        stars: {
          "0%": { transform: "rotate(0) rotate(45)" },
          "100%": { transform: "translateY(0px) translateY(0.125rem)" },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
