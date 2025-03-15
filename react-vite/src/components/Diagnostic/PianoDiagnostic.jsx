import { useEffect, useRef } from 'react';

const PianoDiagnostic = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Create a simple SVG piano for testing
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "200px");
      svg.setAttribute("viewBox", "0 0 700 200");
      svg.style.border = "1px solid red";

      // Create 7 white keys
      for (let i = 0; i < 7; i++) {
        const whiteKey = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        whiteKey.setAttribute("x", i * 100);
        whiteKey.setAttribute("y", 0);
        whiteKey.setAttribute("width", 100);
        whiteKey.setAttribute("height", 200);
        whiteKey.setAttribute("fill", "white");
        whiteKey.setAttribute("stroke", "black");
        svg.appendChild(whiteKey);
      }

      // Create 5 black keys
      const blackKeyPositions = [0, 1, 3, 4, 5];
      for (let i = 0; i < 5; i++) {
        const blackKey = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        blackKey.setAttribute("x", blackKeyPositions[i] * 100 + 70);
        blackKey.setAttribute("y", 0);
        blackKey.setAttribute("width", 60);
        blackKey.setAttribute("height", 120);
        blackKey.setAttribute("fill", "black");
        svg.appendChild(blackKey);
      }

      containerRef.current.appendChild(svg);
    }
  }, []);

  return (
    <div>
      <h3>Piano Diagnostic</h3>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '200px',
          border: '1px solid blue',
          marginBottom: '20px'
        }}
      ></div>
    </div>
  );
};

export default PianoDiagnostic;
