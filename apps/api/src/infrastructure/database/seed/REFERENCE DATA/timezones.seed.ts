
import { db } from '../../../../prisma/db.js';

type Varchar<N extends number> = string & {
  readonly __varcharLength: N;
};

const varchar = <N extends number>(value: string) =>
  value as Varchar<N>;

const timezones = [
  {
    ianaName: varchar<100>('Europe/Istanbul'),
    regionCode: varchar<20>('TR-34'),
    sortOrder: 1,
    isActive: true,
  },
  {
    ianaName: varchar<100>('Asia/Damascus'),
    regionCode: varchar<20>('SY-DI'),
    sortOrder: 2,
    isActive: true,
  },
  {
    ianaName: varchar<100>('Asia/Riyadh'),
    regionCode: varchar<20>('SA-01'),
    sortOrder: 3,
    isActive: true,
  },
] as const;

export async function seedTimezones() {
  for (const timezone of timezones) {
    const region = await db.orm.public.Region
      .where({ code: timezone.regionCode })
      .first();

    if (!region) {
      throw new Error(
        `Region not found for timezone ${timezone.ianaName}: ${timezone.regionCode}`,
      );
    }

    await db.orm.public.Timezone.upsert({
      create: {
        ianaName: timezone.ianaName,
        regionId: region.id,
        sortOrder: timezone.sortOrder,
        isActive: timezone.isActive,
      },
      update: {
        regionId: region.id,
        sortOrder: timezone.sortOrder,
        isActive: timezone.isActive,
      },
      conflictOn: { ianaName: timezone.ianaName },
    });
  }

  console.log(`✅ Timezones seeded: ${timezones.length}`);
}
