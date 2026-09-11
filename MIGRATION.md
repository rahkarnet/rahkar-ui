# مهاجرت `rahkar-wp` به rahkar-ui — وضعیت و تاریخچه

**مهاجرت انجام شده است.** این سند دیگر نقشهٔ راه نیست؛ ثبت اینکه چه شد، چرا
این‌طور شد، و چه چیزهایی باقی مانده.

| | |
|---|---|
| نسخهٔ rahkar-ui | ۰٫۳٫۰ |
| نسخهٔ rahkar-wp | ۰٫۶٫۱ |
| مسیر دیزاین سیستم | `D:\laragon\www\rahkar-ui` |
| صفحهٔ نمایشی | http://rahkar-ui.test/demo/ (یا `npm run demo`) |

---

## آنچه انجام شد

هر هشت قدم نقشهٔ اولیه تمام شده است:

| قدم | کار | وضعیت |
|---|---|---|
| ۱ | رفع باگ ادغام در `Settings::save()` | ✅ |
| ۲ | وندور کردن پکیج و اتصال بارگذارنده | ✅ `assets/vendor/rahkar-ui/` |
| ۳ | کلاس‌های `rk-` در رندر فیلدها | ✅ `Admin/Ui.php` با ~۷۰ نگاشت |
| ۴ | `ModulesPage` → `rk-card` با حالت مسدود | ✅ |
| ۵ | `SettingsPage` → پنل + `FormRow` + تب عمودی | ✅ |
| ۶ | `LogsPage` → نوار ابزار + جدول + صفحه‌بندی + کاشی آمار | ✅ |
| ۷ | سه `confirm()` → `ConfirmModal` | ✅ |
| ۸ | نگهبان ارسال + فیلد sentinel سمت PHP | ✅ |

درس بخش «همگام‌سازی» هم پیاده شد: `bin/sync-ui.php` حالا `build/manifest.json`
را می‌خواند و `assetHash` را مقایسه می‌کند، و اگر `package.json` و مانیفست
نسخه‌های متفاوتی بدهند کپی نمی‌کند.

---

## سه چیزی که در عمل درست شدند و در نقشهٔ اولیه نبودند

اینها را نگه داشته‌ام چون هر کدام یک تلهٔ واقعی‌اند که دوباره سراغ کسی می‌آیند.

### ۱. بیلد وندورشده در سکوت عقب می‌ماند

`VerticalTabs` در سورس ساخته شد ولی نسخه بالا نرفت. هر دو طرف `0.1.0` را
نشان می‌دادند، پس `bin/sync-ui.php` دلیلی برای کپی ندید. نتیجه: هر ۱۷ کلاس
`rk-vtabs*` صفر بار در بیلد وندورشده بودند — بدون هیچ خطایی. تنها نشانه‌اش این
بود که مارک‌آپ تب عمودی هیچ استایلی نمی‌گرفت.

**رفع، در دو لایه:**

- `npm run build` حالا اگر `package.json` و `VERSION` در `src/index.js` از هم
  جدا بیفتند با کد خروجی ۱ شکست می‌خورد.
- هر بیلد `build/manifest.json` تولید می‌کند و سینک `assetHash` را مقایسه
  می‌کند — هش محتوای webpack که با هر تغییر واقعی عوض می‌شود، چه کسی یادش
  بماند نسخه را بالا ببرد چه نه.

### ۲. `appearance: none` شورون وردپرس را برنمی‌دارد

پیشخوان وردپرس روی هر select این را می‌گذارد:

```css
.wp-core-ui select { max-width: 25rem; background-image: <شورون>; }
```

`appearance: none` فقط فلش بومی مرورگر را برمی‌دارد و کاری به `background-image`
ندارد — پس شورون وردپرس داخل کادر می‌ماند و کنار فلش خودمان **دو تا** می‌شود.
و `max-width: 25rem` کنترل را ۴۰۰ پیکسل نگه می‌دارد در حالی که `__wrap` تمام
عرض را می‌گیرد؛ چون فلش نسبت به `__wrap` مطلق است، از کادر جدا می‌افتد.

هر سه با هم لازم‌اند و در `src/components/Select/select.css` با همین توضیح
نوشته شده‌اند. روی ۱۲ سلکت در دو صفحهٔ پیشخوان واقعی آزموده شده.

### ۳. نگهبان فرم گروگان رانتایم وردپرس بود

`attachFormGuard` فقط از داخل `build/index.js` در دسترس بود، و آن فایل
react-jsx-runtime و wp-components و wp-element و wp-i18n را وابسته اعلام می‌کند.
یعنی برای یک ابزار صدخطیِ بدون هیچ وابستگی، مصرف‌کننده باید حدود ۱٫۱۵ مگابایت
رانتایم را روی صفحه‌ای می‌آورد که کامل سمت سرور رندر می‌شود. نتیجه‌اش این شد که
افزونه نسخهٔ خودش را در `assets/dist/admin-settings.js` نوشت.

**رفع (نسخهٔ ۰٫۳٫۰):** یک entry دوم در webpack.

```
build/form-guard.js           ~۲ کیلوبایت
build/form-guard.asset.php    'dependencies' => array()
```

سمت PHP:

```php
Rahkar_UI::enqueue_form_guard();      // فقط نگهبان، بدون دیزاین سیستم
Rahkar_UI::guard_handle();            // 'rahkar-ui-form-guard'
```

سمت جاوااسکریپت، بدون هیچ بیلدی در پلاگین:

```js
const guard = window.rahkarUI.formGuard( form, {
	sentinelName: 'rahkar_sentinel',
	onDirtyChange: ( scopes ) => setDirtyTabs( scopes ),
} );
```

خالی بودن `dependencies` هم در زمان ساخت بررسی می‌شود: اگر روزی این entry
وابستگی پیدا کند، `npm run build` شکست می‌خورد. چون اگر نشکند، هیچ‌جا معلوم
نمی‌شود و همان باری که برداشتیم بی‌صدا برمی‌گردد.

---

## کاری که در `rahkar-wp` مانده

**کپی تکراری نگهبان را بردارید.** `assets/dist/admin-settings.js` نسخهٔ محلی
`attachFormGuard` را دارد و بالایش نوشته شده که اگر پکیج روزی فایل مستقل بدهد
باید برداشته شود. حالا داده است.

- `SYNC_FILES` در `bin/sync-ui.php` باید `build/form-guard.js` و
  `build/form-guard.asset.php` را هم بیاورد.
- جای نسخهٔ محلی، `Rahkar_UI::enqueue_form_guard()` صدا زده شود.
- `Ui::VERSION` روی ۰٫۳٫۰ هم‌تراز شود.

**تأیید بعد از سینک:**

```bash
php -r "print_r( require 'assets/vendor/rahkar-ui/build/form-guard.asset.php' );"
# dependencies باید آرایهٔ خالی باشد

grep -c rk-vtabs assets/vendor/rahkar-ui/build/index.css
# باید عددی نزدیک ۳۵ بدهد، نه صفر
```

---

## چیزهایی که هنوز معادل ندارند

این بخش‌های `admin.css` هنوز در دیزاین سیستم معادلی ندارند و باید سر جایشان
بمانند:

- `rahkar-city-list` و `rahkar-city-list--custom`
- `rahkar-province-picker`
- `rahkar-events` و زیرکلاس‌هایش
- `rahkar-add-city`

اگر الگویشان در پلاگین‌های بعدی هم تکرار شد، وقتش است که به rahkar-ui بیایند.

---

## قواعدی که باید رعایت بمانند

**فونت دو بار لود نشود.** بارگذارندهٔ rahkar-ui فقط وقتی فونت را enqueue می‌کند
که فایل woff2 کنارش باشد. اگر پلاگین خودش لودش می‌کند، فایل را از پوشهٔ
وندورشده بردارید.

**استایل پلاگین بعد از rahkar-ui لود شود.** `Rahkar_UI::handle()` را به‌عنوان
وابستگی اعلام کنید تا ترتیب تضمین شود.

**فرانت‌اند ری‌اکت نگیرد.** ماژول‌هایی که خروجی عمومی دارند (شهرهای ایران در
تسویه‌حساب، اطلاع‌رسانی موجودی) فقط کلاس‌های `rk-` بگیرند. لایهٔ CSS بدون
جاوااسکریپت کار می‌کند؛ لایهٔ ری‌اکت حدود ۱٫۱۵ مگابایت وابستگی می‌آورد. نگهبان
فرم استثناست — حالا مستقل و بدون وابستگی است.

**هر پنل تنظیمات `data-rk-scope` بگیرد** تا نگهبان بداند تغییر در کدام بخش
افتاده و نقطهٔ «ذخیره‌نشده» روی تب درست بنشیند.

---

## نگاشت کلاس‌ها

برای وقتی که صفحهٔ تازه‌ای اضافه می‌شود.

| مارک‌آپ وردپرس | rahkar-ui |
|---|---|
| `button button-primary` | `rk-button rk-button--primary` |
| `button` | `rk-button rk-button--secondary` |
| `button button-link-delete` | `rk-button rk-button--destructive` |
| `notice notice-success is-dismissible` | `rk-notice rk-notice--success` |
| `widefat striped` | `rk-table-wrap` + `rk-table rk-table--striped` |
| `tablenav-pages` | `rk-pagination` |
| `<table class="form-table">` | `rk-form` + `rk-form-row` |
| `regular-text` | `rk-field__input` داخل `rk-field` |
| `small-text` (عدد) | `rk-number__input` داخل `rk-number rk-field` |
| `large-text code` | `rk-textarea__input` داخل `rk-textarea rk-textarea--mono` |
| `<select>` خام | `rk-select` + `rk-select__wrap` + `rk-select__arrow` |
| `onsubmit="return confirm(…)"` | `ConfirmModal` |

مارک‌آپ دقیق هر کدام در `demo/index.html` هست — همان را کپی کنید، از حفظ
ننویسید. هر قاعدهٔ CSS هم نام‌کلاس ری‌اکتی را می‌گیرد و هم HTML ساده را.
