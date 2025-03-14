import { useEffect, useRef } from 'react';

const SvgDiagnostic = () => {
    const svgRef = useRef(null);
    const htmlRef = useRef(null);

    useEffect(() => {
        // Test SVG rendering
        if (svgRef.current) {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width", "200");
            svg.setAttribute("height", "100");

            // Create a white key
            const whiteKey = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            whiteKey.setAttribute("x", "10");
            whiteKey.setAttribute("y", "10");
            whiteKey.setAttribute("width", "30");
            whiteKey.setAttribute("height", "80");
            whiteKey.setAttribute("fill", "white");
            whiteKey.setAttribute("stroke", "black");

            // Create a black key
            const blackKey = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            blackKey.setAttribute("x", "30");
            blackKey.setAttribute("y", "10");
            blackKey.setAttribute("width", "20");
            blackKey.setAttribute("height", "50");
            blackKey.setAttribute("fill", "black");

            svg.appendChild(whiteKey);
            svg.appendChild(blackKey);
            svgRef.current.appendChild(svg);
        }

        // Test HTML rendering
        if (htmlRef.current) {
            const container = document.createElement("div");
            container.style.position = "relative";
            container.style.width = "200px";
            container.style.height = "100px";

            // Create a white key
            const whiteKey = document.createElement("div");
            whiteKey.style.position = "absolute";
            whiteKey.style.left = "10px";
            whiteKey.style.top = "10px";
            whiteKey.style.width = "30px";
            whiteKey.style.height = "80px";
            whiteKey.style.backgroundColor = "white";
            whiteKey.style.border = "1px solid black";

            // Create a black key
            const blackKey = document.createElement("div");
            blackKey.style.position = "absolute";
            blackKey.style.left = "30px";
            blackKey.style.top = "10px";
            blackKey.style.width = "20px";
            blackKey.style.height = "50px";
            blackKey.style.backgroundColor = "black";

            container.appendChild(whiteKey);
            container.appendChild(blackKey);
            htmlRef.current.appendChild(container);
        }
    }, []);

    return (
        <div className="diagnostic">
            <h3>SVG Rendering Test</h3>
            <div ref={svgRef}></div>

            <h3>HTML Rendering Test</h3>
            <div ref={htmlRef}></div>
        </div>
    );
};

export default SvgDiagnostic;
