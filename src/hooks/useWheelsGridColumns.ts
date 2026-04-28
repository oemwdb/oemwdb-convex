import { useState, useEffect } from "react";

/**
 * Breakpoints matching WheelsGrid:
 * grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7
 * xs=420, sm=640, md=768, lg=1024, xl=1280, 2xl=1536
 */
function getWheelsColumns(width: number): number {
  if (width >= 1536) return 7;
  if (width >= 1280) return 6;
  if (width >= 1024) return 5;
  if (width >= 768) return 4;
  if (width >= 640) return 3;
  if (width >= 420) return 2;
  return 1;
}

/**
 * Breakpoints matching VehiclesGrid:
 * grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5
 */
function getVehiclesColumns(width: number): number {
  if (width >= 1536) return 5;
  if (width >= 1280) return 4;
  if (width >= 1024) return 4;
  if (width >= 768) return 3;
  if (width >= 420) return 2;
  return 1;
}

function getEngineColumns(width: number): number {
  if (width >= 1280) return 6;
  if (width >= 1024) return 5;
  if (width >= 768) return 4;
  if (width >= 640) return 3;
  return 2;
}

export function useWheelsGridColumns(): number {
  const [columns, setColumns] = useState(() =>
    getWheelsColumns(typeof window !== "undefined" ? window.innerWidth : 1280)
  );
  useEffect(() => {
    const onResize = () => setColumns(getWheelsColumns(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return columns;
}

export function useVehicleGridColumns(): number {
  const [columns, setColumns] = useState(() =>
    getVehiclesColumns(typeof window !== "undefined" ? window.innerWidth : 1280)
  );
  useEffect(() => {
    const onResize = () => setColumns(getVehiclesColumns(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return columns;
}

export function useEngineGridColumns(): number {
  const [columns, setColumns] = useState(() =>
    getEngineColumns(typeof window !== "undefined" ? window.innerWidth : 1280)
  );
  useEffect(() => {
    const onResize = () => setColumns(getEngineColumns(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return columns;
}
