export interface ReceiptDocument {
  readonly html: string;
  readonly saleId: string;
}

/** Browser-side seam for the installed receipt printer driver. */
export interface ReceiptPrinter {
  print(receipt: ReceiptDocument): Promise<void>;
}
