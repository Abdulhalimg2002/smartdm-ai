
import { db } from '../../../../prisma/db.js';

type Varchar<N extends number> = string & {
  readonly __varcharLength: N;
};

const varchar = <N extends number>(value: string) =>
  value as Varchar<N>;

const regionTypes = [
  {
    name: varchar<50>('Country'),
    code: varchar<30>('COUNTRY'),
    description: 'A sovereign country',
    sortOrder: 1,
    isActive: true,
  },
  {
    name: varchar<50>('State / Province'),
    code: varchar<30>('STATE'),
    description: 'A state or province within a country',
    sortOrder: 2,
    isActive: true,
  },
  {
    name: varchar<50>('City'),
    code: varchar<30>('CITY'),
    description: 'A city or municipality within a country or region',
    sortOrder: 3,
    isActive: true,
  },
  {
    name: varchar<50>('District'),
    code: varchar<30>('DISTRICT'),
    description: 'A district within a city or region',
    sortOrder: 4,
    isActive: true,
  },
] as const;

export async function seedRegionTypes() {
  for (const regionType of regionTypes) {
    await db.orm.public.RegionType.upsert({
      create: regionType,
      update: {
        name: regionType.name,
        description: regionType.description,
        sortOrder: regionType.sortOrder,
        isActive: regionType.isActive,
      },
      conflictOn: { code: regionType.code },
    });
  }

  console.log(`✅ Region Types seeded: ${regionTypes.length}`);
}
