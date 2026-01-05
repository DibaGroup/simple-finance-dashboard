import mongoose, { type Mongoose } from "mongoose";

/**
 * Reusable MongoDB connection helper for API routes and server actions.
 * Caches the connection in the global scope to avoid creating new clients
 * on every request in development or serverless environments.
 */

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI. Add it to your environment.");
}

// چرا؟
// Next.js تو dev mode یا serverless
// ممکنه چند بار فایل اجرا بشه
// بدون cache → هر بار اتصال جدید

type MongooseCache = {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
};

// // ذخیره cache روی globalThis
// مفهوم مهم:
// globalThis = حافظه سراسری Node.js
// تا وقتی سرور بالا هست، این مقدار می‌مونه

const globalWithMongoose = globalThis as typeof globalThis & {
    _mongooseCache?: MongooseCache;
};


//6. ساخت cache یا استفاده از قبلی
// یعنی:
// اگر قبلاً وصل شدیم → استفاده کن
// اگر نه → بساز
const cache: MongooseCache = globalWithMongoose._mongooseCache || {
    conn: null,
    promise: null,
};

globalWithMongoose._mongooseCache = cache;


// 7. تابع اصلی اتصال
export async function connectToDatabase(): Promise<Mongoose> {
    //8. اگر قبلاً وصل شدیم
    if (cache.conn) {
        return cache.conn;
    }
//9. اگر اتصال در حال ساخته شدنه
    if (!cache.promise) {
        cache.promise = mongoose.connect(MONGODB_URI).then((mongooseInstance) => {
            return mongooseInstance;
               //یعنی:
               // اگر ۲ تا request همزمان اومد
                // هر دو از یک promise مشترک استفاده می‌کنن
        });
    }
//10. ذخیره نتیجه نهایی
    cache.conn = await cache.promise;
    return cache.conn;
}
