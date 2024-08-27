import { useRouteError } from "react-router-dom";

export default function Error401Page() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-401-page">
      <h1>Oops!</h1>
      <p>No tienes permisos para entrar a esta página.</p>
    </div>
  );
}