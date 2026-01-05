# آموزش کامل پروژه «Simple Finance Dashboard»

این راهنما برای یک توسعه‌دهنده مبتدی نوشته شده است تا بداند در این پروژه چه اتفاقی می‌افتد، فایل‌ها و توابع کلیدی کدام‌اند، جریان‌های کاری چگونه اجرا می‌شوند و دیتابیس چه ساختاری دارد.

## نمای کلی معماری
- **Next.js (App Router)**: صفحات و API در پوشه `web/app` پیاده شده‌اند. صفحات سمت سرور یا کلاینت هستند و API ها با Route Handler نوشته شده‌اند.
- **MongoDB + Mongoose**: مدل‌ها در `web/lib/models` قرار دارند و اتصال پایدار در `web/lib/db.ts` مدیریت می‌شود.
- **احراز هویت با JWT**: توکن در کوکی httpOnly ذخیره می‌شود. توابع کمکی در `web/lib/auth.ts` قرار دارند.
- **UI و فرم‌ها**: کامپوننت‌های پایه shadcn/ui در `web/components/ui` و فرم‌ها با React Hook Form + Zod ساخته شده‌اند.
- **استایل**: Tailwind CSS و توکن‌های رنگ/تم در `app/globals.css` و `tailwind.config.ts` تعریف شده‌اند.

## ساختار پوشه‌ها (مسیرهای مهم)
```
web/
├── app/
│   ├── page.tsx                # صفحه اصلی (Landing)
│   ├── register/page.tsx       # صفحه ثبت‌نام
│   ├── login/page.tsx          # صفحه ورود
│   ├── dashboard/page.tsx      # داشبورد محافظت‌شده + آمار
│   ├── finance/page.tsx        # فرم و لیست رکوردهای مالی (محافظت‌شده)
│   └── api/
│       ├── auth/
│       │   ├── register/route.ts # API ثبت‌نام
│       │   ├── login/route.ts    # API ورود (صدور JWT)
│       │   └── logout/route.ts   # API خروج (پاک‌کردن کوکی)
│       └── finance/route.ts      # API ایجاد/دریافت رکوردهای مالی
├── lib/
│   ├── db.ts                  # اتصال پایدار به MongoDB با کش سراسری
│   ├── auth.ts                # خواندن/تأیید JWT از کوکی و گرفتن کاربر جاری
│   └── models/
│       ├── User.ts            # مدل کاربر (ایمیل یکتا + پسورد هش‌شده)
│       └── FinanceRecord.ts   # مدل رکورد مالی (ماه، درآمد، هزینه، userId)
├── components/ui/             # دکمه، ورودی، کارت، فرم و ...
├── tailwind.config.ts         # پیکربندی Tailwind و تم رنگی
└── README.md                  # راه‌اندازی و توضیحات پروژه
```

## دیتابیس و مدل‌ها
- **User** (`lib/models/User.ts`)
	- فیلدها: `email` (unique, lowercased), `password` (هش‌شده با bcrypt), `createdAt` (timestamps فعال است).
	- نکته: از `models.User || model("User")` برای جلوگیری از دوباره‌کامپایل شدن مدل در HMR استفاده شده است.

- **FinanceRecord** (`lib/models/FinanceRecord.ts`)
	- فیلدها: `userId` (ObjectId به User)، `month` (فرمت `YYYY-MM`)، `income`، `expense`، `createdAt` (timestamps).
	- اعتبارسنجی مقدارهای منفی با `min: 0` و فرمت ماه با Zod در API انجام می‌شود.

## اتصال به پایگاه داده
- فایل: `lib/db.ts`
- از کش سراسری (`globalThis._mongooseCache`) استفاده شده تا در توسعه یا سرورلس اتصال جدید در هر درخواست ایجاد نشود.
- `connectToDatabase()` خطا می‌دهد اگر `MONGODB_URI` در `.env.local` تنظیم نشده باشد.

## احراز هویت (JWT در کوکی httpOnly)
- فایل کمکی: `lib/auth.ts`
	- `getCurrentUser()`: کوکی `auth-token` را می‌خواند، JWT را با `JWT_SECRET` تأیید می‌کند و اطلاعات کاربر را برمی‌گرداند یا `null` می‌دهد.
	- `requireAuth()`: در صورت نبود کاربر، خطا می‌دهد (برای سرور کامپوننت‌ها).
- API ها:
	- `app/api/auth/register/route.ts`: دریافت ایمیل/پسورد، اعتبارسنجی Zod، هش با bcrypt (10 round)، ذخیره در MongoDB.
	- `app/api/auth/login/route.ts`: تأیید کاربر، مقایسه bcrypt، ساخت JWT (۷ روزه) و ست‌کردن کوکی httpOnly.
	- `app/api/auth/logout/route.ts`: پاک‌کردن کوکی با `maxAge: 0`.
- نکته محیطی: مقدار `JWT_SECRET` باید در `.env.local` ست شود (برای Production حتماً مقدار قوی و تصادفی).

## صفحات و جریان‌های کاری
- **صفحه اصلی** (`app/page.tsx`): معرفی پروژه و دکمه‌های Register / Login.
- **ثبت‌نام** (`app/register/page.tsx`):
	- کلاینت کامپوننت؛ فرم با React Hook Form + Zod؛ فیلدهای ایمیل، پسورد، تکرار پسورد.
	- ارسال به `/api/auth/register`، در موفقیت ریدایرکت به `/login?registered=true`.
- **ورود** (`app/login/page.tsx`):
	- فرم ایمیل/پسورد با RHF + Zod.
	- در موفقیت: ریدایرکت به `/dashboard` و کوکی JWT ست می‌شود.
	- اگر از ثبت‌نام آمده باشد `registered=true` پیام موفقیت نمایش می‌دهد.
- **داشبورد** (`app/dashboard/page.tsx`):
	- سرور کامپوننت؛ `getCurrentUser()` و در نبود کاربر `redirect('/login')`.
	- اتصال DB و محاسبه `User.countDocuments()` و `FinanceRecord.countDocuments()`.
	- نمایش کارت‌های آماری و دکمه خروج (Server Action → `/api/auth/logout`).
- **رکوردهای مالی** (`app/finance/page.tsx`):
	- کلاینت کامپوننت محافظت‌شده؛ در mount رکوردها را از `GET /api/finance` می‌خواند.
	- فرم ماه/درآمد/هزینه با RHF + Zod؛ ارسال به `POST /api/finance`، پس از موفقیت لیست را ریفرش می‌کند.
	- جدول رکوردها با محاسبه Net و رنگ‌بندی مثبت/منفی.

## API مالی (`app/api/finance/route.ts`)
- **POST**: اعتبارسنجی Zod (فرمت ماه و اعداد غیرمنفی)، بررسی تکراری بودن ماه برای همان کاربر، ایجاد رکورد جدید.
- **GET**: دریافت همه رکوردهای کاربر جاری (مرتب‌سازی نزولی بر اساس ماه)، خروجی Lean برای سادگی.
- هر دو متد قبل از کار، احراز هویت را با `getCurrentUser()` بررسی می‌کنند؛ در صورت 401، پاسخ مناسب می‌دهند.

## جریان داده از کلاینت تا دیتابیس (مثال ثبت رکورد مالی)
1) کاربر در `/finance` فرم را پر می‌کند و Submit می‌زند.
2) کلاینت با `fetch('/api/finance', { method: 'POST', body: ... })` داده را می‌فرستد.
3) در Route Handler:
	 - JWT از کوکی خوانده و اعتبارسنجی می‌شود → userId بدست می‌آید.
	 - Zod ورودی را چک می‌کند (فرمت ماه، اعداد غیرمنفی).
	 - به MongoDB متصل می‌شود → رکورد جدید با userId ذخیره می‌شود.
4) پاسخ 201 برمی‌گردد → کلاینت فرم را ریست و لیست را مجدد از GET می‌گیرد.

## نکات مهم امنیتی و پیکربندی
- حتماً `MONGODB_URI` و `JWT_SECRET` را در `.env.local` تنظیم کنید (Production: مقادیر قوی و عدم انتشار).
- کوکی `auth-token` httpOnly و در Production با `secure: true` ست می‌شود.
- برای Atlas باید IP خود را در بخش Network Access باز کنید (یا 0.0.0.0/0 برای توسعه).

## اسکریپت‌های کاربردی (در پوشه web)
- `npm run dev` : اجرای سرور توسعه
- `npm run lint`: بررسی کیفیت کد
- `npm run build` و `npm run start`: آماده‌سازی و اجرای نسخه Production

## مسیرهای کلیدی برای مرور سریع
- مدل‌ها: `lib/models/User.ts` ، `lib/models/FinanceRecord.ts`
- اتصال DB: `lib/db.ts`
- احراز هویت: `lib/auth.ts`
- API ها: `app/api/auth/*` و `app/api/finance/route.ts`
- فرم‌ها: `app/register/page.tsx` ، `app/login/page.tsx` ، `app/finance/page.tsx`
- داشبورد: `app/dashboard/page.tsx`

## پیشنهاد برای تمرین بیشتر
- افزودن ویرایش/حذف رکورد مالی در همان API و UI.
- افزودن نمودار (مثلاً با recharts) برای نمایش روند درآمد/هزینه.
- اضافه کردن ریست پسورد و تأیید ایمیل.
- نوشتن تست‌های ساده API با Jest یا Vitest.

موفق باشید! این سند را می‌توانید بارها مرور کنید تا معماری و جریان‌ها برایتان جا بیفتد.
