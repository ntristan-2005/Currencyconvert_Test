import { NextRequest, NextResponse } from 'next/server';

type Currency = 'USD' | 'EUR' | 'IDR' | 'JPY' | 'GBP';

interface UserAccount {
  id: string;
  balances: Record<Currency, number>;
}

const mockAccounts: Record<string, UserAccount> = {
  user123: {
    id: 'user123',
    balances: {
      USD: 1000,
      EUR: 500,
      IDR: 15000000,
      JPY: 200000,
      GBP: 300,
    },
  },
};

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id') || '';

  const account = mockAccounts[userId];

  if (!account) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(account);
}

