<?php
/**
 * نمونهٔ اتصال rahkar-ui به یک پلاگین.
 *
 * این فایل اجرا نمی‌شود؛ الگوی کپی‌کردنی است. فرض بر این است که پکیج داخل
 * پلاگین شما در مسیر `vendor/rahkar-ui/` قرار دارد.
 *
 * @package rahkar-ui
 */

defined( 'ABSPATH' ) || exit;

// ۱) بارگذارنده را include کنید. اگر پلاگین دیگری زودتر این کار را کرده باشد،
//    کلاس دوباره تعریف نمی‌شود (خودِ فایل با class_exists محافظت شده است).
require_once __DIR__ . '/vendor/rahkar-ui/php/class-rahkar-ui.php';

/**
 * ۲) نسخهٔ همراه پلاگین خودتان را ثبت کنید. این فقط «ثبت‌نام» است؛ اگر پلاگین
 * دیگری نسخهٔ بالاتری داشته باشد، آن یکی لود می‌شود.
 */
add_action(
	'plugins_loaded',
	function () {
		Rahkar_UI::register(
			'0.2.0',                                        // نسخهٔ دیزاین سیستم
			plugin_dir_path( __FILE__ ) . 'vendor/rahkar-ui/',
			plugin_dir_url( __FILE__ ) . 'vendor/rahkar-ui/',
			'rahkar-shipping'                                // نام پلاگین شما
		);
	}
);

/**
 * ۳) در صفحه‌های خودتان enqueue کنید — نه همه‌جای پیشخوان.
 */
add_action(
	'admin_enqueue_scripts',
	function ( $hook ) {
		if ( 'woocommerce_page_rahkar-shipping' !== $hook ) {
			return;
		}

		Rahkar_UI::enqueue();

		// اسکریپت خودتان را وابسته به دیزاین سیستم اعلام کنید تا ترتیب لود
		// و ترتیب استایل‌ها درست بماند.
		wp_enqueue_script(
			'rahkar-shipping-admin',
			plugin_dir_url( __FILE__ ) . 'build/admin.js',
			array( Rahkar_UI::handle() ),
			'1.4.0',
			true
		);

		wp_enqueue_style(
			'rahkar-shipping-admin',
			plugin_dir_url( __FILE__ ) . 'build/admin.css',
			array( Rahkar_UI::handle() ),   // بعد از rahkar-ui لود شود
			'1.4.0'
		);
	}
);

/**
 * ۴) ریشهٔ صفحه را با کلاس `rk-root` بسازید تا فونت، جهت و توکن‌ها اعمال شوند.
 */
add_action(
	'admin_menu',
	function () {
		add_submenu_page(
			'woocommerce',
			'حمل‌ونقل راهکار',
			'حمل‌ونقل راهکار',
			'manage_woocommerce',
			'rahkar-shipping',
			function () {
				echo '<div class="wrap"><div id="rahkar-shipping-app" class="rk-root"></div></div>';
			}
		);
	}
);
