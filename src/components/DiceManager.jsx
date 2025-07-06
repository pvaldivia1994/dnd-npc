import React, { useEffect, useRef, useState } from "react";
import { Fab, Box, Badge } from "@mui/material";
import DiceBox from "@3d-dice/dice-box";

export default function DiceManager() {
  const containerRef = useRef(null);
  const diceBoxRef = useRef(null);
  const initializedRef = useRef(false);
  const timeoutRef = useRef(null);
  const [lastResult, setLastResult] = useState(null); // Nuevo estado

  useEffect(() => {
    if (!initializedRef.current && containerRef.current && diceBoxRef.current === null) {
      initializedRef.current = true;

      const dbx = new DiceBox({
        container: "#dice-box",
        assetPath: "/assets/dice-box/",
        theme: "default",
        themeColor: "#ce0000",
        scale: 5,
        width: window.innerWidth,
        height: window.innerHeight,
      });

      dbx.init().then(() => {
        diceBoxRef.current = dbx;

        dbx.onRollComplete = (res) => {
          const resultValue = res?.[0]?.value;
          console.log("Resultado del d20:", resultValue);
          setLastResult(resultValue); // Guardar el resultado

          const diceBoxEl = document.getElementById("dice-box");
          if (diceBoxEl) {
            diceBoxEl.style.opacity = "1";
          }

          clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            if (diceBoxEl) diceBoxEl.style.opacity = "0";
          }, 2500);
        };
      }).catch((err) => {
        console.error("Error al inicializar DiceBox:", err);
      });
    }

    return () => {
      if (diceBoxRef.current) {
        diceBoxRef.current.clear();
        const canvas = document.querySelector("#dice-box canvas");
        if (canvas) canvas.remove();
        diceBoxRef.current = null;
        initializedRef.current = false;
      }
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const rollD20 = () => {
    const diceBoxEl = document.getElementById("dice-box");
    if (diceBoxEl) diceBoxEl.style.opacity = "1";

    clearTimeout(timeoutRef.current);
    diceBoxRef.current?.roll("1d20");
  };

  return (
    <>
      <Box
        id="dice-box"
        ref={containerRef}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1000,
          pointerEvents: "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      />
      <Badge
        badgeContent={lastResult ?? 0}
        color="error"
        sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1200, m:1  }}
      >
        <Fab
          color="info"
          onClick={rollD20}
          sx={{
            width: 56,
            height: 56,
          }}
        >
          <img
            src="/assets/dice-d20-svgrepo-com.svg"
            alt="D20"
            style={{ width: 32, height: 32 }}
          />
        </Fab>
      </Badge>
    </>
  );
}
