# افزونه API Requester

افزونه‌ای ساده و کاربردی برای مرورگر کروم جهت ارسال و مدیریت درخواست‌های API.
![image](https://github.com/user-attachments/assets/014d7d57-53cf-44d7-aaf4-fa07a5f1dabe)


## ویژگی‌ها

- ارسال انواع درخواست‌ها: GET، POST، PUT، DELETE
- امکان تنظیم هدرهای سفارشی
- افزودن پارامترهای URL
- ارسال داده‌های JSON در بدنه درخواست
- نمایش پاسخ‌ها با فرمت زیبا
- مشاهده زمان پاسخگویی و وضعیت درخواست
- رابط کاربری فارسی با فونت وزیر
- طراحی ساده و کاربرپسند

## نصب افزونه

### نصب از Chrome Web Store

1. به [صفحه افزونه در Chrome Web Store](https://chrome.google.com/webstore/detail/api-requester/your-extension-id) بروید
2. روی دکمه "افزودن به کروم" کلیک کنید

### نصب به صورت دستی

1. این مخزن را دانلود یا clone کنید
2. اجرای دستور `npm install` برای نصب وابستگی‌ها
3. اجرای دستور `npx webpack` برای ساخت افزونه
4. در مرورگر کروم به آدرس `chrome://extensions` بروید
5. حالت "Developer mode" را فعال کنید
6. روی دکمه "Load unpacked" کلیک کرده و پوشه `dist` پروژه را انتخاب کنید

## نحوه استفاده

1. روی آیکون افزونه کلیک کنید یا یک تب جدید باز کنید
2. نوع درخواست (GET، POST و...) را انتخاب کنید
3. آدرس API مورد نظر را در فیلد مربوطه وارد کنید
4. در صورت نیاز، هدرها یا پارامترهای URL را اضافه کنید
5. برای درخواست‌های POST یا PUT، داده‌های JSON را در بخش بدنه درخواست وارد کنید
6. روی دکمه "ارسال" کلیک کنید
7. پاسخ دریافتی و اطلاعات آن را مشاهده کنید

## توسعه افزونه

### ساختار پروژه

```
chrome-extension-react-ts/
├── dist/                  # فایل‌های ساخته شده برای افزونه
├── public/                # فایل‌های استاتیک
│   ├── index.html         # صفحه اصلی افزونه
│   └── manifest.json      # فایل توضیحات افزونه
├── src/                   # کدهای منبع
│   ├── background.ts      # اسکریپت پس‌زمینه
│   └── newtab.ts          # اسکریپت تب جدید
├── webpack.config.js      # تنظیمات webpack
└── package.json           # وابستگی‌های پروژه
```

### دستورات مفید

- `npm install`: نصب وابستگی‌ها
- `npx webpack`: ساخت افزونه
- `npx webpack --watch`: ساخت افزونه با حالت پایش خودکار تغییرات

## تکنولوژی‌های استفاده شده

- TypeScript
- Webpack
- Chrome Extension API

## لایسنس

این پروژه تحت لایسنس MIT منتشر شده است.

## سازنده

مهرشاد براتی 
