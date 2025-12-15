import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  diagram: string;
  className?: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ diagram, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      mermaid.initialize({
        startOnLoad: true,
        theme: "default",
        themeVariables: {
          primaryColor: "#3b82f6",
          primaryTextColor: "#fff",
          primaryBorderColor: "#2563eb",
          lineColor: "#6b7280",
          secondaryColor: "#10b981",
          tertiaryColor: "#f59e0b",
          background: "white",
          mainBkg: "#3b82f6",
          secondBkg: "#10b981",
          tertiaryBkg: "#f59e0b",
        },
      });
      
      ref.current.innerHTML = diagram;
      mermaid.contentLoaded();
    }
  }, [diagram]);

  return <div ref={ref} className={`mermaid ${className}`} />;
};

export default MermaidDiagram;