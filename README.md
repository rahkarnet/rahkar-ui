# rahkar-ui

دیزاین سیستم مشترک پلاگین‌های خانوادهٔ **راهکار** (rahkarwp) برای پیشخوان ووکامرس فارسی.

هدف این است که همهٔ پلاگین‌ها یک ظاهر و یک رفتار داشته باشند: یک پالت، یک فونت،
یک مقیاس فاصله، یک ست آیکون — نه اینکه هر پلاگین رابط کاربری خودش را از نو بسازد.

**جهت بصری:** ابزار دقیق و صنعتی. پالت تک‌تأکیدی با سبز عمیق برند روی خنثی‌های
گرم، گوشه‌های نیمه‌تیز (۲ تا ۴ پیکسل)، سایه‌های مسطح و کم‌رنگ، آیکون‌های ضخامت
۱٫۷۵ با سرِ خط مربعی. بدون گرادیان، بدون افکت شیشه‌ای، بدون گوشه‌های کپسولی.

---

## نصب

پکیج روی `@wordpress/scripts` بنا شده تا با همان نسخهٔ ری‌اکتی که وردپرس عرضه
می‌کند سازگار بماند (`wp.element` / `wp.components` به‌صورت external).

```bash
npm install
npm run build      # خروجی در build/  (index.js، index.css، sprite.svg، index.asset.php، manifest.json)
```

پوشهٔ ساخته‌شده را داخل پلاگین خودتان بگذارید، مثلاً:

```
my-plugin/
└── vendor/
    └── rahkar-ui/
        ├── build/
        ├── php/
        └── assets/
```

> فونت **متغیر** وزیرمتن (نسخهٔ ۳۳٫۰۰۳، مجوز SIL OFL) همراه پکیج است:
> `assets/fonts/Vazirmatn-Variable.woff2` — یک فایل ۱۰۹ کیلوبایتی که هر سه وزن
> ۴۰۰/۵۰۰/۷۰۰ را می‌دهد. اگر فونت را جای دیگری لود می‌کنید، همان فایل را از پوشه
> بردارید؛ بارگذارندهٔ PHP وقتی نباشد آن را enqueue نمی‌کند و زنجیرهٔ جایگزین
> (Segoe UI / Tahoma) به کار می‌آید. جزئیات در
> [`assets/fonts/README.md`](assets/fonts/README.md).

---

## استفاده در پلاگین — سمت PHP

سه خط لازم است. نمونهٔ کامل در [`php/example-usage.php`](php/example-usage.php).

```php
// ۱) بارگذارنده را include کنید (خودش با class_exists محافظت شده).
require_once __DIR__ . '/vendor/rahkar-ui/php/class-rahkar-ui.php';

// ۲) نسخهٔ همراه پلاگین خودتان را ثبت کنید — این هنوز چیزی را لود نمی‌کند.
add_action( 'plugins_loaded', function () {
	Rahkar_UI::register(
		'0.1.0',
		plugin_dir_path( __FILE__ ) . 'vendor/rahkar-ui/',
		plugin_dir_url( __FILE__ ) . 'vendor/rahkar-ui/',
		'rahkar-shipping'   // نام پلاگین شما، فقط برای اشکال‌زدایی
	);
} );

// ۳) فقط در صفحه‌های خودتان enqueue کنید.
add_action( 'admin_enqueue_scripts', function ( $hook ) {
	if ( 'woocommerce_page_rahkar-shipping' !== $hook ) {
		return;
	}

	Rahkar_UI::enqueue();

	wp_enqueue_script(
		'rahkar-shipping-admin',
		plugin_dir_url( __FILE__ ) . 'build/admin.js',
		array( Rahkar_UI::handle() ),   // وابستگی، تا ترتیب لود درست بماند
		'1.4.0',
		true
	);
} );
```

ریشهٔ صفحهٔ خود را با کلاس `rk-root` بسازید تا فونت، جهت راست‌به‌چپ و توکن‌ها
اعمال شوند:

```php
echo '<div class="wrap"><div id="my-app" class="rk-root"></div></div>';
```

### چرا «ثبت» و بعد «enqueue»؟

اگر سه پلاگین راهکار هم‌زمان فعال باشند، هر سه یک نسخه از دیزاین سیستم را همراه
دارند. `register()` فقط پلاگین شما را وارد رقابت می‌کند؛ سرِ enqueue، بارگذارنده
بین همهٔ نسخه‌های ثبت‌شده **بالاترین نسخه** را انتخاب و فقط همان یکی را لود می‌کند
(نسخهٔ برنده در `$GLOBALS['rahkar_ui_loaded']` نگه داشته می‌شود). نسخه‌ای که فایل
`build/index.js` نداشته باشد اصلاً کاندیدا نمی‌شود، تا یک پلاگینِ build‌نشده بقیه
را از کار نیندازد.

توابع کمکی: `Rahkar_UI::version()`، `Rahkar_UI::handle()`،
`Rahkar_UI::sprite_url()`، `Rahkar_UI::registry()` (فهرست همهٔ نسخه‌های ثبت‌شده،
مفید برای صفحهٔ «وضعیت سیستم»).

---

## استفاده در پلاگین — سمت جاوااسکریپت

```jsx
import { Button, Card, Toggle, TextField, Icon, tokens } from 'rahkar-ui';
import { useState } from '@wordpress/element';

function ShippingModule() {
	const [ enabled, setEnabled ] = useState( true );
	const [ cost, setCost ] = useState( '45000' );

	return (
		<Card
			icon="truck"
			title="پست پیشتاز"
			description="محاسبهٔ خودکار هزینهٔ ارسال بر اساس وزن و استان مقصد."
			badge={ { text: enabled ? 'فعال' : 'غیرفعال', variant: enabled ? 'success' : undefined } }
			enabled={ enabled }
			onToggle={ setEnabled }
			actions={ <Button variant="primary" size="sm">ذخیره</Button> }
		>
			<TextField
				label="هزینهٔ پایه (تومان)"
				value={ cost }
				onChange={ setCost }
				help="برای سفارش‌های زیر ۵۰۰ گرم."
			/>
		</Card>
	);
}
```

### اتصال از سمت وبپکِ پلاگین شما

بستهٔ ساخته‌شده خودش را روی `window.rahkarUI.ui` منتشر می‌کند — همان الگویی که
وردپرس با `window.wp.components` دارد. پس `rahkar-ui` را در پلاگین خودتان
external کنید تا دوباره bundle نشود:

```js
// webpack.config.js پلاگین شما
module.exports = {
	...defaultConfig,
	externals: {
		...defaultConfig.externals,
		'rahkar-ui': [ 'rahkarUI', 'ui' ],
	},
};
```

و در PHP، `Rahkar_UI::handle()` را به‌عنوان وابستگی اسکریپت خود اعلام کنید (نمونهٔ
بالا) تا ترتیب لود تضمین شود.

---

## کامپوننت‌ها

همه روی ‎@wordpress/components‎ سوارند مگر جایی که ستون «پایه» خط تیره دارد؛
دلیلِ هر استثنا بالای فایل همان کامپوننت نوشته شده.

### کنترل‌های فرم

| کامپوننت | پایه | پراپ‌های اصلی |
|---|---|---|
| `Button` | `Button` | `variant` (`primary`/`secondary`/`destructive`)، `size`، `icon`، `iconPosition`، `isBusy`، `isFullWidth` |
| `TextField` | `TextControl` | `label`، `value`، `onChange`، `help`، `error`، `size`، `monospace`، `required` |
| `Textarea` | `TextareaControl` | `label`، `value`، `onChange`، `rows`، `help`، `error`، `monospace` |
| `NumberField` | `TextControl` | `min`، `max`، `step`، `unit`، `showRange`، `isFullWidth`، `error` |
| `Select` | `BaseControl` | `options` (آرایه یا نگاشت)، `value`، `onChange`، `size`، `auto`، `error` |
| `Toggle` | `FormToggle` | `checked`، `onChange`، `label`، `help`، `reverse`، `showState` |
| `FormRow` | — | `label`، `htmlFor`، `help`، `error`، `required`، `stacked` |

### ظرف‌ها

| کامپوننت | پایه | پراپ‌های اصلی |
|---|---|---|
| `Card` | `Card` + `CardHeader/Body/Footer` | `title`، `description`، `icon`، `enabled`، `onToggle`، `blockedReasons`، `badge`، `actions` |
| `Panel` | — | `title`، `description`، `icon`، `aside`، `actions` (+ `PanelSection`) |
| `Modal` | `Modal` | `title`، `subtitle`، `size`، `footer`، `onRequestClose` |
| `ConfirmModal` | `Modal` | `message`، `consequence`، `tone`، `confirmLabel`، `onConfirm`، `isBusy` |

### داده و ناوبری

| کامپوننت | پایه | پراپ‌های اصلی |
|---|---|---|
| `Table` | — | `columns`، `rows`، `striped`، `hover`، `compact`، `emptyMessage` |
| `Pagination` | — | `current`، `total`، `onChange`، `hrefFor`، `summary` |
| `Toolbar` | — | `attached` (+ `ToolbarSpacer`، `ToolbarGroup`) |
| `Tabs` | — | `items`، `active`، `onSelect`، `hrefFor` (+ `TabPanel`) |
| `VerticalTabs` | — | `items` (سلسله‌مراتبی)، `active`، `onSelect`، `hrefFor`، `searchable`، `sticky` (+ `VerticalTabsPanel`) |

### بازخورد

| کامپوننت | پایه | پراپ‌های اصلی |
|---|---|---|
| `Notice` | `Notice` | `status`، `title`، `isDismissible`، `onRemove`، `actions` |
| `Badge` | — | `variant`، `size`، `dot`، `monospace` |
| `StatTile` | — | `value`، `label`، `hint`، `status` |
| `EmptyState` | — | `icon`، `title`، `description`، `actions`، `inset` |
| `CodeBlock` | — | `label`، `value`، `light`، `inline` |

کامپوننت‌ها از پایه بازنویسی نشده‌اند؛ فقط لایهٔ ظاهری‌شان با توکن‌ها عوض شده تا
رفتار دسترس‌پذیری و مدیریت فوکوسِ خود وردپرس دست‌نخورده بماند.

### حالت سوم کارت ماژول

`Card` سه حالت دارد، نه دو: روشن، خاموش، و **مسدود**. سومی وقتی است که
پیش‌نیازی برآورده نشده و کاربر حتی نمی‌تواند ماژول را روشن کند:

```jsx
<Card
	icon="key"
	title="ورود پیامکی"
	description="ورود مشتری با کد یک‌بارمصرف."
	blockedReasons={ [
		'ماژول «اعلان‌ها» باید روشن باشد.',
		'هیچ سرویس‌دهندهٔ پیامکی پیکربندی نشده است.',
	] }
	onToggle={ toggle }
/>
```

اگر «مسدود» و «خاموش» یکی بودند، کاربر فقط یک سوییچ غیرفعال می‌دید و هیچ‌جا
نمی‌فهمید چرا. اینجا دلیل‌ها زیر توضیح ماژول فهرست می‌شوند و قاب کارت چین‌چین
می‌شود.

### چیدمان فرم

`FormRow` برچسب را خودش رندر می‌کند، نه کنترل داخلش. پس به کنترل `label` ندهید
و به‌جایش `id` بدهید:

```jsx
<FormRow label="سطح گزارش" htmlFor="log-level" help="هرچه پایین‌تر، پرحجم‌تر.">
	<Select
		id="log-level"
		value={ level }
		onChange={ setLevel }
		options={ { error: 'فقط خطا', warning: 'خطا و هشدار', debug: 'همه‌چیز' } }
	/>
</FormRow>
```

اگر هر دو برچسب بدهند، صفحه‌خوان دو برچسب برای یک کنترل می‌خواند.

### تب عمودی و ذخیره‌سازی

`VerticalTabs` برای صفحهٔ تنظیماتی است که قرار است بزرگ شود. تب افقی وقتی از
پنج‌شش تا بگذرد می‌شکند: یا سرریز می‌شود و اسکرول افقی می‌گیرد، یا به خط دوم
می‌رود و دیگر معلوم نیست کدام فعال است.

```jsx
const [ tab, setTab ] = useState( 'general' );

<div className="rk-vtabs-layout">
	<VerticalTabs
		searchable
		active={ tab }
		onSelect={ setTab }
		items={ [
			{ key: 'general', label: 'عمومی', icon: 'settings' },
			{
				key: 'shipping',
				label: 'حمل‌ونقل',
				icon: 'truck',
				items: [
					{ key: 'ship-methods', label: 'روش‌های ارسال' },
					{ key: 'ship-zones', label: 'مناطق ارسال', dirty: true },
				],
			},
			{ key: 'logs', label: 'گزارش‌ها', icon: 'chart', count: 4, countStatus: 'error' },
		] }
	/>

	<div>
		<VerticalTabsPanel tabKey="general" active={ tab }>…</VerticalTabsPanel>
		<VerticalTabsPanel tabKey="ship-zones" active={ tab }>…</VerticalTabsPanel>
	</div>
</div>
```

سلسله‌مراتب عمداً فقط دو سطح است. سطح سوم یعنی کاربر باید سه بار کلیک کند تا
یک تنظیم را ببیند.

#### تصمیمی که کامپوننت نمی‌گیرد

اینکه ذخیره چطور کار کند، معماری است نه ظاهر — و کامپوننت هر دو راه را
می‌پذیرد بی‌آنکه شما را قفل کند:

| | `onSelect` (بدون بارگذاری) | `hrefFor` (ناوبری سمت سرور) |
|---|---|---|
| جابه‌جایی بین تب‌ها | فوری | بارگذاری دوبارهٔ صفحه |
| تغییر ذخیره‌نشده هنگام تعویض تب | می‌ماند | از بین می‌رود |
| فیلدهای POST‌شده | همهٔ تب‌ها | فقط تب فعال |
| سقف `max_input_vars` | با رشد به آن می‌خورید | هیچ‌وقت |

#### سه چیزی که باید سمت PHP رعایت شود

اگر این‌ها را رعایت نکنید، مشکل در سکوت رخ می‌دهد — نه خطایی، نه پیامی.

**۱. ذخیره باید ادغام کند، نه جایگزین.** اگر ذخیره‌کننده مقدار ذخیره‌شده را با
مقدار ارسالی ادغام نکند، هر فرمِ ناقص بقیهٔ تنظیمات را پاک می‌کند:

```php
// خطرناک: هر کلیدی که در POST نباشد پاک می‌شود
update_option( $key, $submitted );

// امن: فقط کلیدهای ارسال‌شده عوض می‌شوند
update_option( $key, array_merge( get_option( $key, [] ), $submitted ) );
```

این حتی وقتی همهٔ پنل‌ها در DOM‌اند هم مهم است: فیلد شرطی، فیلد قفل‌شدهٔ نسخهٔ
حرفه‌ای، و چک‌باکسِ بدون فیلد همراه، همگی می‌توانند از POST غایب باشند.

**۲. دامنهٔ ذخیره را صریح اعلام کنید.** یک فیلد پنهان بگذارید که بگوید کدام بخش
ارسال شده، و ذخیره‌کننده فقط همان را دست بزند:

```php
<input type="hidden" name="rahkar_scope" value="jalali">
```

**۳. برش خوردنِ POST را تشخیص بدهید.** وقتی تعداد فیلدها از `max_input_vars`
(پیش‌فرض ۱۰۰۰) بگذرد، PHP بقیه را **بی‌صدا دور می‌ریزد** — نه خطایی می‌دهد و نه
هشداری. آخرین فیلد فرم را یک نگهبان بگذارید:

```php
// آخرین فیلد فرم
<input type="hidden" name="rahkar_sentinel" value="1">

// در ذخیره‌کننده
if ( ! isset( $_POST['rahkar_sentinel'] ) ) {
	// POST بریده شده — چیزی ذخیره نکنید و خطا نشان بدهید
	return new WP_Error( 'truncated', 'تعداد فیلدها از سقف سرور گذشت.' );
}
```

نگهبان باید آخرین فیلد باشد، چون PHP از انتها می‌برد.

#### `attachFormGuard` — پیاده‌سازی آمادهٔ قدم‌های ۳ و ۴

قدم‌های ۳ و ۴ رفتار عمومی فرم‌اند، نه منطق یک پلاگین خاص — پس همین‌جا
پیاده‌سازی شده‌اند. یک ماژول جاوااسکریپت بدون هیچ وابستگی که به هر `<form>`
وصل می‌شود، چه مارک‌آپش را PHP چاپ کرده باشد چه ری‌اکت.

**به‌صورت فایل مستقل هم ساخته می‌شود.** `build/form-guard.js` حدود ۲ کیلوبایت
است و `build/form-guard.asset.php` آرایهٔ `dependencies` خالی دارد. پس صفحه‌ای
که کامل سمت سرور رندر می‌شود و فقط نگهبان را می‌خواهد، لازم نیست react و
wp-components را بیاورد:

```php
Rahkar_UI::enqueue_form_guard();   // ~۲ کیلوبایت، بدون هیچ وابستگی
```

```js
// در دسترس روی window، بدون هیچ بیلدی سمت پلاگین
const guard = window.rahkarUI.formGuard( form, { … } );
```

اگر پلاگین‌تان بیلد جاوااسکریپت دارد و کل دیزاین سیستم را هم می‌خواهد،
مسیر معمول هم کار می‌کند:

```js
import { attachFormGuard } from 'rahkar-ui';

const guard = attachFormGuard( document.getElementById( 'rahkar-settings' ), {
	sentinelName: 'rahkar_sentinel',
	onDirtyChange: ( scopes ) => {
		// نقطهٔ «ذخیره‌نشده» را روی تب عمودی روشن کن
		setDirtyTabs( scopes );
	},
} );

// پس از ذخیرهٔ موفق (مثلاً در پاسخ AJAX)
guard.reset();
```

هر پنل بخش خودش را اعلام می‌کند تا نگهبان بداند تغییر کجا افتاده:

```html
<section data-rk-scope="jalali"> … فیلدهای این تب … </section>
```

فیلدی که نباید هرگز غیرفعال شود — `nonce`، شناسهٔ بخش، فیلدهای ساختاری — با
`data-rk-keep` علامت بخورد:

```html
<?php wp_nonce_field( 'rahkar_save' ); ?>
<input type="hidden" name="rahkar_scope" value="jalali" data-rk-keep>
```

| متد | کار |
|---|---|
| `isDirty()` | آیا تغییر ذخیره‌نشده‌ای هست؟ |
| `dirtyScopes()` | کدام بخش‌ها دست‌خورده‌اند |
| `pendingNames()` | دقیقاً چه فیلدهایی در ارسال بعدی POST می‌شوند |
| `reset()` | پس از ذخیرهٔ موفق، وضعیت «دست‌نخورده» از نو ثبت می‌شود |
| `detach()` | برداشتن شنونده‌ها |

اگر جاوااسکریپت اجرا نشود هیچ چیز نمی‌شکند: فرم مثل قبل همهٔ فیلدها را ارسال
می‌کند. یعنی این یک لایهٔ بهبود است، نه یک وابستگی.

در [صفحهٔ نمایشی](demo/index.html)، بخش «تب عمودی» این را زنده نشان می‌دهد:
یک فیلد را عوض کنید و ببینید فهرست «چه چیزی واقعاً POST می‌شود» چطور رشد
می‌کند — و با برگرداندن مقدار به حالت اول، دوباره خالی می‌شود.

#### توصیه برای پلاگینی که رشد می‌کند

۱. تب عمودی با `onSelect` و پنل‌های ماندگار — جابه‌جایی فوری و حفظ تغییرات.
۲. ذخیرهٔ ادغامی و دامنه‌دار (بند ۱ و ۲ بالا). این رفع باگ است نه بهینه‌سازی.
۳. فقط فیلدهای **تغییرکرده** را بفرستید: با جاوااسکریپت فیلدهای دست‌نخورده را
   هنگام ارسال `disabled` کنید تا در POST نیایند. آن‌وقت حجم POST به تعداد
   تغییرات بستگی دارد نه به بزرگی پلاگین، و سقف `max_input_vars` عملاً بی‌اثر
   می‌شود. اگر جاوااسکریپت کار نکند، همه‌چیز مثل قبل ارسال می‌شود.
۴. نگهبانِ برش (بند ۳) را از همان روز اول بگذارید.

وقتی از چند صد فیلد گذشتید، قدم بعدی REST است: هر بخش با یک `PATCH` جدا ذخیره
شود. آن‌وقت `max_input_vars` اصلاً در مسیر نیست، چون بدنه JSON است نه فرم.

### مودال

`Modal` روی مودال وردپرس سوار است، پس تلهٔ فوکوس، بازگرداندن فوکوس هنگام بستن،
بستن با Esc و قفل اسکرول صفحه رایگان به‌دست می‌آید.

`ConfirmModal` جایگزین `confirm()` مرورگر است. `confirm()` نمی‌تواند بین «حذف
رکوردهای قدیمی» و «حذف همیشگی همه‌چیز» فرق بگذارد — هر دو یک کادر خاکستری با دو
دکمهٔ یکسان‌اند. اینجا کار مخرب دکمهٔ قرمز می‌گیرد و پیامد برگشت‌ناپذیر در کادر
جدا دیده می‌شود:

```jsx
const [ asking, setAsking ] = useState( false );

<Button variant="destructive" onClick={ () => setAsking( true ) }>
	حذف همه گزارش‌ها
</Button>

{ asking && (
	<ConfirmModal
		tone="danger"
		title="حذف همه گزارش‌ها"
		message="همه گزارش‌های ثبت‌شده پاک می‌شوند؛ شامل خطاهای ارسال پیامک و ایمیل."
		consequence="این کار برگشت‌پذیر نیست و تاریخچه بازیابی نمی‌شود."
		confirmLabel="حذف همیشگی"
		isBusy={ deleting }
		onConfirm={ purge }
		onCancel={ () => setAsking( false ) }
	/>
) }
```

`consequence` را فقط وقتی بدهید که کار واقعاً برگشت‌ناپذیر است؛ اگر همه‌جا
بیاید، دیگر کسی نمی‌خواندش. برای کار پرریسکِ برگشت‌پذیر `tone="warning"` بدهید.

### آیکون

```jsx
<Icon name="settings" size="md" />          // تزئینی — از دید صفحه‌خوان پنهان
<Icon name="alert" label="هشدار" />         // معنادار — با برچسب
```

۲۵ آیکون در [`src/icons/sprite.svg`](src/icons/sprite.svg) به‌صورت اسپرایت است و
با `<use>` خوانده می‌شود، پس هر آیکون فقط یک‌بار دانلود می‌شود. نشانی اسپرایت را
PHP هنگام enqueue داخل `window.rahkarUI.spriteUrl` می‌گذارد؛ خارج از وردپرس با
`setSpriteUrl()` دستی تعیینش کنید.

---

## توکن‌ها

همهٔ مقادیر ظاهری در [`src/tokens/tokens.css`](src/tokens/tokens.css) به‌صورت
متغیر CSS تعریف شده‌اند و معادل جاوااسکریپتی‌شان در
[`src/tokens/tokens.js`](src/tokens/tokens.js) است. هیچ کامپوننتی مقدار دستی
ندارد.

| گروه | پیشوند | نمونه |
|---|---|---|
| رنگ برند | `--rk-color-brand-*` | `--rk-color-brand-700` (رنگ اصلی) |
| خنثی | `--rk-color-neutral-*` | `--rk-color-neutral-200` |
| وضعیت | `--rk-color-{success,error,warning,info}` | + پسوند `-bg` و `-border` |
| معنایی | `--rk-color-{surface,text,border,focus}-*` | `--rk-color-text-muted` |
| تایپوگرافی | `--rk-font-*`، `--rk-line-height-*` | `--rk-font-size-md` |
| فاصله | `--rk-space-*` | `--rk-space-2` = ۱۶px |
| شعاع | `--rk-radius-*` | `--rk-radius-md` = ۳px |
| سایه | `--rk-shadow-*` | `--rk-shadow-xs` |

### پالت برند

رنگ‌ها از پالت رسمی راهکار می‌آیند، نه از مقدار جای‌گذار:

| توکن برند | نقش در دیزاین سیستم |
|---|---|
| `#0f6e56` (accent) | `--rk-color-brand-700` — دکمهٔ اصلی، سوییچ روشن، نوار وضعیت کارت |
| `#e1f5ee` (accent-soft) | `--rk-color-brand-50` — پس‌زمینهٔ قاب آیکون ماژول |
| `#1a1a18` (text) | `--rk-color-neutral-900` → `--rk-color-text` |
| `#6b6b66` (text-muted) | `--rk-color-neutral-500` → `--rk-color-text-muted` |
| `#9a9a95` (text-faint) | `--rk-color-neutral-400` → `--rk-color-text-disabled` |
| `#f5f4ef` (surface) | `--rk-color-neutral-50` → `--rk-color-surface-sunken` |
| `#ffffff` (bg) | `--rk-color-neutral-0` → `--rk-color-surface` |
| `rgba(26,26,24,.12/.22)` | `--rk-color-border` / `--rk-color-border-strong` |

بقیهٔ پله‌های برند (۱۰۰ تا ۹۰۰) با نگه‌داشتن فام ۱۶۵° از رنگ تأکید مشتق شده‌اند.
کنتراست همهٔ ترکیب‌های متن روی رنگ واقعیِ رندرشده سنجیده شده و از حد WCAG AA
(نسبت ۴٫۵) رد می‌شود؛ کمترین مقدار ۴٫۵۱ برای نشان‌های ۱۱ پیکسلی است.

دو نکته که ممکن است به چشم نیاید:

- رنگ «موفق» عمداً سبزِ برگی (`#2f7d32`، فام ۱۲۲°) است نه سبز برند (۱۶۵°). اگر
  هم‌فام بودند، نشان «فعال» با تأکید برند اشتباه گرفته می‌شد.
- `#9a9a95` روی سفید کنتراست ۲٫۸۳ دارد که زیر حد است، پس فقط برای متن **غیرفعال**
  استفاده شده — جایی که WCAG استثنا قائل می‌شود. برای متن معنادار به کار نبرید.

اگر خواستید رنگ را عوض کنید، ده مقدار `--rk-color-brand-*` را بازنویسی کنید و
بقیهٔ سیستم از طریق نقش‌های معنایی خودش را تطبیق می‌دهد:

```css
.rk-root {
	--rk-color-brand-700: #0f6e56;
	--rk-color-brand-800: #0b5945;
	/* ... */
}
```

یا در زمان اجرا:

```js
import { applyTokenOverrides } from 'rahkar-ui';
applyTokenOverrides( { 'color-brand-700': '#0f6e56' } );
```

### نشان برند

`assets/brand/logo-rahkarnet.svg` — نشانی‌اش در `window.rahkarUI.logoUrl` و در
PHP با `Rahkar_UI::logo_url()` در دسترس است. عمداً داخل اسپرایت آیکون‌ها نرفته:
نشان گرادیان و رنگ ثابت دارد و آیکون‌های ست تک‌رنگ و `currentColor`ـی هستند.
گرادیانِ نشان تنها استثنای قاعدهٔ «بدون گرادیان» است و نباید در کامپوننت‌ها تکرار
شود. جزئیات در [`assets/brand/README.md`](assets/brand/README.md).

مقیاس فاصله بر پایهٔ ۸ پیکسل است (`space-1` = ۸، `space-2` = ۱۶ …) با دو نیم‌پلهٔ
`space-05` = ۴ و `space-025` = ۲ برای جزئیات.

---

## صفحهٔ نمایشی

[`demo/index.html`](demo/index.html) همهٔ کامپوننت‌ها، رنگ‌ها، مقیاس تایپ و فاصله
و کل ست آیکون را کنار هم رندر می‌کند. مستقیم از `src/` می‌خواند، پس به build
نیازی ندارد — ولی باید روی http باز شود (نه `file://`) وگرنه اسپرایت آیکون
به‌خاطر CORS لود نمی‌شود:

```bash
npm run demo      # → http://localhost:8080/demo/
```

اگر لاراگون/آپاچی دارید، این هم کار می‌کند:
`http://localhost/rahkar-ui/demo/`

---

## ساختار پوشه

```
src/
├── tokens/       tokens.css + tokens.js  (منبع یگانهٔ حقیقت)
├── styles/       base.css + index.css (نقطهٔ ورود استایل)
├── components/   یک پوشه برای هر کامپوننت: JS + CSS + index (۱۹ کامپوننت)
├── icons/        sprite.svg + Icon.js
└── utils/        cx.js + formGuard.js
assets/brand/     نشان برند
php/              بارگذارندهٔ مشترک + نمونهٔ اتصال
demo/             صفحهٔ نمایشی داخلی
assets/fonts/     وزیرمتن متغیر + fonts.css + OFL.txt
webpack.config.js خروجی library روی window و حذف کپی چپ‌به‌راست
```

`assets/fonts/fonts.css` عمداً بیرون از باندل است: بارگذارندهٔ PHP آن را فقط
وقتی enqueue می‌کند که فایل woff2 واقعاً کنارش باشد.

---

## مهاجرت پلاگین موجود

اگر پلاگینی دارید که رابط کاربری خودش را ساخته، [`MIGRATION.md`](MIGRATION.md)
نگاشت کلاس‌به‌کلاس، ترتیب پیشنهادی کار، و تله‌هایی که باید حواستان باشد را دارد.

---

## نسخه‌گذاری و همگام‌سازی

نسخه در سه جا باید یکی بماند: `package.json`، `VERSION` در `src/index.js`، و
آرگومان اول `Rahkar_UI::register()` در هر پلاگین. چون بارگذارنده بر اساس همین
عدد تصمیم می‌گیرد کدام نسخه لود شود، بالا نبردن آن یعنی نسخهٔ جدید شما هرگز
انتخاب نمی‌شود.

دوتای اول را `npm version` خودش هم‌تراز می‌کند:

```bash
npm version patch   # ۰٫۳٫۰ → ۰٫۳٫۱ در هر دو فایل
npm version minor   # ۰٫۳٫۰ → ۰٫۴٫۰
npm run build
```

اگر دستی عوضشان کردید و از هم جدا افتادند، `npm run build` شکست می‌خورد. یعنی
دو لایه: یکی که کار را می‌کند و یکی که جلوی اشتباه را می‌گیرد.

سومی دست شماست.

### `build/manifest.json`

هر بیلد این فایل را تولید می‌کند:

```json
{
  "version": "0.2.0",
  "assetHash": "a20ae7244ff903f48d42",
  "files": { "index.js": "…", "index.css": "…", "sprite.svg": "…" },
  "components": [ "Badge", "Button", … ],
  "builtAt": "…"
}
```

**اسکریپت همگام‌سازی پلاگین باید `assetHash` را مقایسه کند، نه `version` را.**

دلیلش یک تلهٔ واقعی است: `version` فقط وقتی عوض می‌شود که کسی یادش بماند بالا
ببردش. اگر کامپوننتی اضافه شود و نسخه دست‌نخورده بماند، سینک هیچ دلیلی برای
آوردن بیلد تازه نمی‌بیند و پلاگین در سکوت CSS قدیمی را اجرا می‌کند — بدون خطا،
بدون هشدار. تنها نشانه‌اش این است که کلاس‌های کامپوننت تازه هیچ اثری ندارند.

`assetHash` هش محتوایی است که webpack تولید می‌کند و با هر تغییر واقعی عوض
می‌شود، چه نسخه بالا رفته باشد چه نه.

```php
$local  = json_decode( file_get_contents( $vendor . '/build/manifest.json' ), true );
$source = json_decode( file_get_contents( $ui_path . '/build/manifest.json' ), true );

if ( ( $local['assetHash'] ?? '' ) !== $source['assetHash'] ) {
    // بیلد تازه را کپی کن
}
```

`components` هم برای بررسی سلامت مفید است: اگر کدی از کامپوننتی استفاده می‌کند
که در این فهرست نیست، یعنی بیلد وندورشده عقب است.

## لایسنس و علامت تجاری

این دیزاین سیستم برای محصولات وردپرسی **راهکارنت** ساخته شده و فقط برای همان‌ها
نگهداری می‌شود. به استفاده‌کننده‌ی بیرونی پشتیبانی داده نمی‌شود و API آن بدون
اعلام قبلی تغییر می‌کند.

- **کد:** Copyright © ۲۰۲۶ راهکارنت، منتشرشده با لایسنس
  [GPL-2.0-or-later](LICENSE). این لایسنس اجباری است، نه انتخابی: کد روی
  `@wordpress/components` ساخته شده که GPL است، و داخل افزونه‌هایی می‌رود که در
  مخزن وردپرس منتشر می‌شوند. هر کاری که از این کد مشتق شود هم باید با همین
  لایسنس و به‌صورت متن‌باز منتشر شود.
- **نام و لوگو:** لایسنس کد هیچ حقی روی نام‌های «Rahkar» و «Rahkarnet» یا لوگوی
  راهکارنت (`assets/brand/`) نمی‌دهد. این‌ها علامت تجاری راهکارنت‌اند و استفاده
  از آن‌ها برای معرفی محصول دیگر، یا به شکلی که تأیید راهکارنت را القا کند، بدون
  اجازه‌ی کتبی مجاز نیست.
- **فونت:** وزیرمتن اثر صابر راستی‌کردار است، با لایسنس SIL Open Font License 1.1
  ([`assets/fonts/OFL.txt`](assets/fonts/OFL.txt)).
