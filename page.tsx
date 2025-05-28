'use client';

import { useEffect, useState } from 'react';
import { getExchangeRates, Currency } from '@/lib/exchange';

interface UserAccount {
  id: string;
  balances: Record<Currency, number>;
}

export default function ConvertPage() {
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [from, setFrom] = useState<Currency>('USD');
  const [to, setTo] = useState<Currency>('EUR');
  const [amount, setAmount] = useState<number>(100);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchAccount() {
      const res = await fetch('/api/account');
      if (!res.ok) {
        setMessage('Failed to load account.');
        return;
      }
      const data = await res.json();
      setAccount(data);
    }

    fetchAccount();
  }, []);

  async function handleConvert() {
    if (!account) return;

    if (account.balances[from] < amount) {
      setMessage('Insufficient funds.');
      return;
    }

    try {
      const { rates } = await getExchangeRates(from);
      const rate = rates[to];

      if (!rate) {
        throw new Error('Invalid exchange rate.');
      }

      const converted = amount * rate;

      // Update mock state
      setAccount(prev => {
        if (!prev) return null;
        return {
          ...prev,
          balances: {
            ...prev.balances,
            [from]: prev.balances[from] - amount,
            [to]: prev.balances[to] + converted,
          },
        };
      });

      setMessage(`Converted ${amount} ${from} to ${converted.toFixed(2)} ${to}`);
    } catch (e: any) {
      setMessage(e.message || 'Conversion failed.');
    }
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Currency Converter</h1>

      {account && (
        <div className="mb-4">
          <h2 className="font-semibold">Your Balances:</h2>
          <ul>
            {Object.entries(account.balances).map(([cur, val]) => (
              <li key={cur}>
                {cur}: {val.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-2 mb-4">
        <label>
          From:
          <select value={from} onChange={e => setFrom(e.target.value as Currency)}>
            {['USD', 'EUR', 'IDR', 'JPY', 'GBP'].map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          To:
          <select value={to} onChange={e => setTo(e.target.value as Currency)}>
            {['USD', 'EUR', 'IDR', 'JPY', 'GBP'].map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(parseFloat(e.target.value))}
          />
        </label>
        <button onClick={handleConvert} className="bg-blue-500 text-white p-2 rounded">
          Convert
        </button>
      </div>

      {message && <p className="text-green-600">{message}</p>}
    </div>
  );
}
