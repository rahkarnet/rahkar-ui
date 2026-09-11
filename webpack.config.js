/**
 * پیکربندی وبپک — روی پیکربندی پیش‌فرض @wordpress/scripts سوار می‌شود.
 *
 * سه تفاوت با پیش‌فرض:
 *
 * ۱) دو نقطهٔ ورود به‌جای یکی.
 *
 *    `index` کل دیزاین سیستم است و ناگزیر به رانتایم وردپرس وابسته می‌شود:
 *    react-jsx-runtime، wp-components، wp-element، wp-i18n.
 *
 *    `form-guard` فقط `src/utils/formGuard.js` است که هیچ import ای ندارد.
 *    جدا کردنش یعنی صفحه‌ای که کامل سمت سرور رندر می‌شود و فقط به نگهبان فرم
 *    نیاز دارد، مجبور نیست حدود ۱٫۱۵ مگابایت رانتایم وردپرس را بیاورد.
 *    درستی این کار را `build/form-guard.asset.php` نشان می‌دهد: آرایهٔ
 *    dependencies آن باید خالی باشد. اگر نبود، این جداسازی هدفش را برنیاورده.
 *
 * ۲) خروجی به‌صورت library روی window منتشر می‌شود. پیش‌فرض wp-scripts برای
 *    پلاگین‌های بلوک است که فایلشان side-effect دارد (registerBlockType)، ولی
 *    این پکیج یک کتابخانه است: اگر library تعریف نشود، اکسپورت‌ها اصلاً بیرون
 *    نمی‌آیند و پلاگین دیگر نمی‌تواند از آن import کند.
 *
 *    نتیجه: `window.rahkarUI.ui` و `window.rahkarUI.formGuard` — همان الگویی که
 *    خود وردپرس با `window.wp.components` دارد. هر دو زیر `rahkarUI` می‌نشینند
 *    چون PHP پیش از این اسکریپت‌ها، `window.rahkarUI` را با version و
 *    spriteUrl ساخته است.
 *
 *    `library` اینجا روی هر entry جداگانه تعریف شده، نه روی `output`. اگر روی
 *    output بماند، هر دو entry یک نام می‌گیرند و دومی اولی را بازنویسی می‌کند.
 *
 * ۳) RtlCssPlugin حذف شده. این دیزاین سیستم از پایه راست‌به‌چپ نوشته شده؛ یک
 *    کپی «برگردانده‌شده» فقط تله است — اگر کسی اشتباهی enqueue کند، همه چیز
 *    چپ‌به‌راست می‌شود.
 */

const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,

	entry: {
		index: {
			import: './src/index.js',
			library: {
				name: [ 'rahkarUI', 'ui' ],
				type: 'window',
			},
		},
		'form-guard': {
			import: './src/utils/formGuard.js',
			library: {
				name: [ 'rahkarUI', 'formGuard' ],
				type: 'window',
			},
		},
	},

	plugins: defaultConfig.plugins.filter(
		( plugin ) => plugin.constructor.name !== 'RtlCssPlugin'
	),
};
