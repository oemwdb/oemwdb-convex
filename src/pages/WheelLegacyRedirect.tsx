import { Navigate, useLocation, useParams } from "react-router-dom";

export default function WheelLegacyRedirect() {
  const { wheelName = "" } = useParams<{ wheelName: string }>();
  const location = useLocation();

  return (
    <Navigate
      replace
      to={`/wheel/${encodeURIComponent(wheelName)}${location.search}${location.hash}`}
    />
  );
}
