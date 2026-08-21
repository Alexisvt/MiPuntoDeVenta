import { FoundationStatus } from '../features/foundation/foundation-status';

export default function HomePage() {
  return (
    <main aria-labelledby="page-title" className="app-shell">
      <header className="product-header">
        <p className="product-name">MiPuntoDeVenta</p>
        <h1 id="page-title">Mi punto de venta</h1>
        <p>Todo listo para empezar el día.</p>
      </header>
      <div className="work-surface">
        <FoundationStatus />
      </div>
    </main>
  );
}
