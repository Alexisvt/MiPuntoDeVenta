CREATE TABLE app_user (
  id UUID PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'OPERATOR')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE product (
  id UUID PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  sku VARCHAR(80) UNIQUE,
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  tracks_stock BOOLEAN NOT NULL DEFAULT TRUE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE cash_session (
  id UUID PRIMARY KEY,
  status VARCHAR(20) NOT NULL CHECK (status IN ('OPEN', 'CLOSED')),
  opening_amount_cents INTEGER NOT NULL CHECK (opening_amount_cents >= 0),
  opened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ,
  opened_by_id UUID NOT NULL REFERENCES app_user(id),
  closed_by_id UUID REFERENCES app_user(id),
  CONSTRAINT cash_session_close_state CHECK (
    (status = 'OPEN' AND closed_at IS NULL AND closed_by_id IS NULL) OR
    (status = 'CLOSED' AND closed_at IS NOT NULL AND closed_by_id IS NOT NULL)
  )
);
CREATE UNIQUE INDEX one_open_cash_session ON cash_session ((status)) WHERE status = 'OPEN';

CREATE TABLE sale (
  id UUID PRIMARY KEY,
  cash_session_id UUID NOT NULL REFERENCES cash_session(id),
  operator_id UUID NOT NULL REFERENCES app_user(id),
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('CASH', 'CARD', 'SINPE', 'TRANSFER')),
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sale_line (
  id UUID PRIMARY KEY,
  sale_id UUID NOT NULL REFERENCES sale(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES product(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0)
);

CREATE TABLE receipt (
  id UUID PRIMARY KEY,
  sale_id UUID UNIQUE NOT NULL REFERENCES sale(id),
  status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'PRINTED', 'FAILED')),
  printed_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  last_error VARCHAR(500)
);
