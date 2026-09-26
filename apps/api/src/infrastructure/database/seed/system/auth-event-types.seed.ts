import { db } from '../../../../prisma/db.js';

type Varchar<N extends number> = string & {
  readonly __varcharLength: N;
};

const varchar = <N extends number>(value: string) =>
  value as Varchar<N>;

const authEventTypes = [
  {
    code: varchar<50>('REGISTER'),
    name: varchar<100>('User Registered'),
    description: 'إنشاء حساب',
    sortOrder: 1,
    isActive: true,
  },
  {
    code: varchar<50>('LOGIN'),
    name: varchar<100>('User Logged In'),
    description: 'تسجيل دخول ناجح',
    sortOrder: 2,
    isActive: true,
  },
  {
    code: varchar<50>('LOGOUT'),
    name: varchar<100>('User Logged Out'),
    description: 'تسجيل خروج',
    sortOrder: 3,
    isActive: true,
  },
  {
    code: varchar<50>('LOGIN_FAILED'),
    name: varchar<100>('Login Failed'),
    description: 'محاولة دخول فاشلة',
    sortOrder: 4,
    isActive: true,
  },
  {
    code: varchar<50>('PASSWORD_CHANGED'),
    name: varchar<100>('Password Changed'),
    description: 'تغيير كلمة المرور',
    sortOrder: 5,
    isActive: true,
  },
  {
    code: varchar<50>('PASSWORD_RESET_REQUESTED'),
    name: varchar<100>('Password Reset Requested'),
    description: 'طلب إعادة تعيين كلمة المرور',
    sortOrder: 6,
    isActive: true,
  },
  {
    code: varchar<50>('PASSWORD_RESET_COMPLETED'),
    name: varchar<100>('Password Reset Completed'),
    description: 'إتمام إعادة تعيين كلمة المرور',
    sortOrder: 7,
    isActive: true,
  },
  {
    code: varchar<50>('EMAIL_VERIFIED'),
    name: varchar<100>('Email Verified'),
    description: 'تأكيد البريد',
    sortOrder: 8,
    isActive: true,
  },
] as const;

export async function seedAuthEventTypes() {
  for (const eventType of authEventTypes) {
    await db.orm.public.AuthEventType.upsert({
      create: eventType,
      update: {
        name: eventType.name,
        description: eventType.description,
        sortOrder: eventType.sortOrder,
        isActive: eventType.isActive,
      },
      conflictOn: {
        code: eventType.code,
      },
    });
  }

  console.log(
    `✅ Auth Event Types seeded: ${authEventTypes.length}`,
  );
}