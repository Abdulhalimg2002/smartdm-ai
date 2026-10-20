
import { db } from '../../../../prisma/db.js';

type Varchar<N extends number> = string & {
  readonly __varcharLength: N;
};

const varchar = <N extends number>(value: string) =>
  value as Varchar<N>;

const regions = [
  // Countries
  {
    name: varchar<100>('Turkey'),
    code: varchar<20>('TR'),
    regionTypeCode: varchar<30>('COUNTRY'),
    parentRegionCode: null,
    sortOrder: 1,
    isActive: true,
  },
  {
    name: varchar<100>('Syria'),
    code: varchar<20>('SY'),
    regionTypeCode: varchar<30>('COUNTRY'),
    parentRegionCode: null,
    sortOrder: 2,
    isActive: true,
  },
  {
    name: varchar<100>('Saudi Arabia'),
    code: varchar<20>('SA'),
    regionTypeCode: varchar<30>('COUNTRY'),
    parentRegionCode: null,
    sortOrder: 3,
    isActive: true,
  },

  // Cities
  {
    name: varchar<100>('Istanbul'),
    code: varchar<20>('TR-34'),
    regionTypeCode: varchar<30>('CITY'),
    parentRegionCode: varchar<20>('TR'),
    sortOrder: 4,
    isActive: true,
  },
  {
    name: varchar<100>('Damascus'),
    code: varchar<20>('SY-DI'),
    regionTypeCode: varchar<30>('CITY'),
    parentRegionCode: varchar<20>('SY'),
    sortOrder: 5,
    isActive: true,
  },
  {
    name: varchar<100>('Riyadh'),
    code: varchar<20>('SA-01'),
    regionTypeCode: varchar<30>('CITY'),
    parentRegionCode: varchar<20>('SA'),
    sortOrder: 6,
    isActive: true,
  },

  // Districts
  {
    name: varchar<100>('Avcılar'),
    code: varchar<20>('TR-34-AVC'),
    regionTypeCode: varchar<30>('DISTRICT'),
    parentRegionCode: varchar<20>('TR-34'),
    sortOrder: 7,
    isActive: true,
  },
  {
    name: varchar<100>('Mezzeh'),
    code: varchar<20>('SY-DI-MEZ'),
    regionTypeCode: varchar<30>('DISTRICT'),
    parentRegionCode: varchar<20>('SY-DI'),
    sortOrder: 8,
    isActive: true,
  },
  {
    name: varchar<100>('Al Olaya'),
    code: varchar<20>('SA-01-OLY'),
    regionTypeCode: varchar<30>('DISTRICT'),
    parentRegionCode: varchar<20>('SA-01'),
    sortOrder: 9,
    isActive: true,
  },
] as const;

export async function seedRegions() {
  // Create parents before children.
  for (const region of regions) {
    const regionType = await db.orm.public.RegionType
      .where({ code: region.regionTypeCode })
      .first();

    if (!regionType) {
      throw new Error(
        `RegionType not found: ${region.regionTypeCode}`,
      );
    }

    let parentRegionId: string | null = null;

    if (region.parentRegionCode) {
      const parentRegion = await db.orm.public.Region
        .where({ code: region.parentRegionCode })
        .first();

      if (!parentRegion) {
        throw new Error(
          `Parent Region not found: ${region.parentRegionCode}`,
        );
      }

      parentRegionId = parentRegion.id;
    }

    await db.orm.public.Region.upsert({
      create: {
        name: region.name,
        code: region.code,
        regionTypeId: regionType.id,
        parentRegionId,
        sortOrder: region.sortOrder,
        isActive: region.isActive,
      },
      update: {
        name: region.name,
        regionTypeId: regionType.id,
        parentRegionId,
        sortOrder: region.sortOrder,
        isActive: region.isActive,
      },
      conflictOn: { code: region.code },
    });
  }

  console.log(`✅ Regions seeded: ${regions.length}`);
}
