'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { healthQueryOptions } from './health-query';

export function FoundationStatus() {
  const [showDetails, setShowDetails] = useState(false);
  const health = useQuery(healthQueryOptions());

  if (health.isPending) {
    return (
      <section aria-labelledby="connection-title" className="connection-status is-loading">
        <h2 id="connection-title">Estado del sistema</h2>
        <p aria-live="polite" role="status">
          Comprobando conexión
        </p>
      </section>
    );
  }

  if (health.isError) {
    return (
      <section aria-labelledby="connection-title" className="connection-status is-error">
        <h2 id="connection-title">Estado del sistema</h2>
        <div aria-live="assertive" role="alert">
          <strong>No pudimos conectar con el sistema</strong>
          <p>Revisá la conexión e intentá de nuevo.</p>
        </div>
        <button type="button" onClick={() => void health.refetch()}>
          Reintentar
        </button>
      </section>
    );
  }

  return (
    <section aria-labelledby="connection-title" className="connection-status is-available">
      <h2 id="connection-title">Estado del sistema</h2>
      <p aria-live="polite" role="status">
        <strong>Sistema disponible</strong>
      </p>
      <button type="button" onClick={() => setShowDetails((visible) => !visible)}>
        {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
      </button>
      {showDetails ? <p>La conexión se verifica directamente con el sistema.</p> : null}
    </section>
  );
}
