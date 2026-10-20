
import { db } from '../../../../prisma/db.js';

type Varchar<N extends number> = string & {
  readonly __varcharLength: N;
};

const varchar = <N extends number>(value: string) =>
  value as Varchar<N>;

const currencies = [
  {
    name: varchar<100>('Turkish Lira'),
    code: varchar<3>('TRY'),
    numericCode: 949,
    symbol: varchar<10>('₺'),
    decimalPlaces: 2,
    sortOrder: 1,
    isActive: true,
  },
  {
    name: varchar<100>('Syrian Pound'),
    code: varchar<3>('SYP'),
    numericCode: 760,
    symbol: varchar<10>('ل.س'),
    decimalPlaces: 2,
    sortOrder: 2,
    isActive: true,
  },
  {
    name: varchar<100>('Saudi Riyal'),
    code: varchar<3>('SAR'),
    numericCode: 682,
    symbol: varchar<10>('﷼'),
    decimalPlaces: 2,
    sortOrder: 3,
    isActive: true,
  },
  {
    name: varchar<100>('US Dollar'),
    code: varchar<3>('USD'),
    numericCode: 840,
    symbol: varchar<10>('$'),
    decimalPlaces: 2,
    sortOrder: 4,
    isActive: true,
  },
] as const;

export async function seedCurrencies() {
  for (const currency of currencies) {
    await db.orm.public.Currency.upsert({
      create: currency,
      update: {
        name: currency.name,
        numericCode: currency.numericCode,
        symbol: currency.symbol,
        decimalPlaces: currency.decimalPlaces,
        sortOrder: currency.sortOrder,
        isActive: currency.isActive,
      },
      conflictOn: { code: currency.code },
    });
  }

  console.log(`✅ Currencies seeded: ${currencies.length}`);
}
