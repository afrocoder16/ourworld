import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ember: "#ff8a3d",
        gold: "#c8a96d",
        parchment: "#f2e7cf",
        ink: "#241c14",
        velvet: "#1f1822",
        dossier: "#2a2e36"
      },
      boxShadow: {
        page: "0 30px 60px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(200,169,109,0.2)"
      },
      fontFamily: {
        display: ["var(--font-cinzel)", "serif"],
        body: ["var(--font-cormorant)", "serif"],
        mono: ["var(--font-space)", "monospace"]
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "0.13" },
          "50%": { opacity: "0.23" }
        },
        dust: {
          "0%": { transform: "translateY(0) translateX(0)", opacity: "0.1" },
          "100%": { transform: "translateY(-24px) translateX(8px)", opacity: "0.35" }
        },
        inkReveal: {
          "0%": { backgroundSize: "0% 100%" },
          "100%": { backgroundSize: "100% 100%" }
        },
        shimmer: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(220%)" }
        },
        twinkle: {
          "0%,100%": { opacity: "0.1" },
          "50%": { opacity: "0.7" }
        },
        floatDown: {
          "0%": { transform: "translateY(-20vh) rotate(0deg)", opacity: "0" },
          "15%": { opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(340deg)", opacity: "0" }
        },
        sealPress: {
          "0%": { transform: "translateY(-18px) scale(1.2)", opacity: "0" },
          "55%": { transform: "translateY(0) scale(1)", opacity: "1" },
          "70%": { transform: "translateY(4px) scale(0.94)" },
          "100%": { transform: "translateY(0) scale(1)" }
        },
        dragonSweep: {
          "0%": { transform: "translateX(-120%) translateY(-10%)", opacity: "0" },
          "40%": { opacity: "0.28" },
          "100%": { transform: "translateX(120%) translateY(10%)", opacity: "0" }
        },
        portalPulse: {
          "0%,100%": { opacity: "0.1", transform: "scale(0.97)" },
          "50%": { opacity: "0.35", transform: "scale(1.04)" }
        },
        psyPulse: {
          "0%": { transform: "translateX(-120%)", opacity: "0" },
          "20%": { opacity: "0.3" },
          "100%": { transform: "translateX(120%)", opacity: "0" }
        },
        featherDrift: {
          "0%": { transform: "translate(-12px,-18px) rotate(-8deg)", opacity: "0" },
          "25%": { opacity: "0.55" },
          "100%": { transform: "translate(28px,26px) rotate(22deg)", opacity: "0" }
        },
        glyphRotate: {
          "0%": { transform: "rotate(0deg) scale(0.95)", opacity: "0.04" },
          "50%": { opacity: "0.08" },
          "100%": { transform: "rotate(360deg) scale(1.08)", opacity: "0.04" }
        },
        gearSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        realmShift: {
          "0%": { opacity: "0.05", filter: "hue-rotate(0deg)" },
          "50%": { opacity: "0.2", filter: "hue-rotate(18deg)" },
          "100%": { opacity: "0.05", filter: "hue-rotate(0deg)" }
        },
        lightningFlash: {
          "0%,80%,100%": { opacity: "0" },
          "82%": { opacity: "0.25" },
          "84%": { opacity: "0.05" },
          "86%": { opacity: "0.2" },
          "88%": { opacity: "0" }
        },
        scratchFlicker: {
          "0%,100%": { opacity: "0.12" },
          "50%": { opacity: "0.28" }
        },
        pageBreath: {
          "0%,100%": { boxShadow: "0 24px 60px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(200,169,109,0.18)" },
          "50%": { boxShadow: "0 30px 72px rgba(0,0,0,0.42), inset 0 0 0 1px rgba(222,184,126,0.35)" }
        },
        fireEdge: {
          "0%": { opacity: "0.2", filter: "hue-rotate(0deg) brightness(1)" },
          "50%": { opacity: "0.45", filter: "hue-rotate(-8deg) brightness(1.15)" },
          "100%": { opacity: "0.22", filter: "hue-rotate(6deg) brightness(1)" }
        },
        runeFloat: {
          "0%": { transform: "translateY(8px) scale(0.92)", opacity: "0" },
          "25%": { opacity: "0.35" },
          "100%": { transform: "translateY(-24px) scale(1.05)", opacity: "0" }
        },
        spellSweep: {
          "0%": { transform: "translateX(-120%) scaleX(0.8)", opacity: "0" },
          "20%": { opacity: "0.35" },
          "100%": { transform: "translateX(120%) scaleX(1)", opacity: "0" }
        }
      },
      animation: {
        flicker: "flicker 2.8s ease-in-out infinite",
        dust: "dust 9s linear infinite",
        inkReveal: "inkReveal 1.2s ease-out forwards",
        shimmer: "shimmer 2s ease-in-out infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
        floatDown: "floatDown 4.5s linear forwards",
        sealPress: "sealPress 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
        dragonSweep: "dragonSweep 4.8s ease-in-out infinite",
        portalPulse: "portalPulse 3.8s ease-in-out infinite",
        psyPulse: "psyPulse 2.8s ease-in-out",
        featherDrift: "featherDrift 3.8s ease-out forwards",
        glyphRotate: "glyphRotate 16s linear infinite",
        gearSpin: "gearSpin 20s linear infinite",
        realmShift: "realmShift 4.2s ease-in-out infinite",
        lightningFlash: "lightningFlash 4s ease-in-out infinite",
        scratchFlicker: "scratchFlicker 1.2s ease-in-out infinite",
        pageBreath: "pageBreath 4.2s ease-in-out infinite",
        fireEdge: "fireEdge 1.8s ease-in-out infinite",
        runeFloat: "runeFloat 2.4s ease-out forwards",
        spellSweep: "spellSweep 2.8s ease-in-out"
      }
    }
  },
  plugins: []
};

export default config;
