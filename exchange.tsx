export type Currency = 'USD' | 'EUR' | 'IDR' | 'JPY' | 'GBP';

interface ExchangeRates {
  base: Currency;
  rates: Record<Currency, number>;
}

export async function getExchangeRates(base: Currency): Promise<ExchangeRates> {
  const mockRates: Record<Currency, Record<Currency, number>> = {
    USD: { EUR: 0.91, IDR: 15500, JPY: 156, GBP: 0.79, USD: 1 },
    EUR: { USD: 1.1, IDR: 17000, JPY: 170, GBP: 0.87, EUR: 1 },
    IDR: { USD: 0.000064, EUR: 0.000059, JPY: 0.01, GBP: 0.000051, IDR: 1 },
    JPY: { USD: 0.0064, EUR: 0.0059, IDR: 100, GBP: 0.0051, JPY: 1 },
    GBP: { USD: 1.27, EUR: 1.15, IDR: 19000, JPY: 195, GBP: 1 },
  };

  return {
    base,
    rates: mockRates[base],
  };
}
