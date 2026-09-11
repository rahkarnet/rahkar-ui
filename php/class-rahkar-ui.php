<?php
/**
 * rahkar-ui — بارگذارندهٔ مشترک بین پلاگین‌ها
 *
 * مسئله: چند پلاگین از خانوادهٔ rahkarwp ممکن است هم‌زمان فعال باشند و هرکدام
 * نسخهٔ خودشان از این دیزاین سیستم را همراه داشته باشند. اگر همه enqueue کنند،
 * استایل‌ها چند بار لود می‌شوند و نسخهٔ قدیمی‌تر ممکن است نسخهٔ جدیدتر را خراب کند.
 *
 * راه‌حل: هر پلاگین فقط خودش را «ثبت» می‌کند. سر وقت enqueue، بین همهٔ نسخه‌های
 * ثبت‌شده بالاترین نسخه انتخاب و فقط همان یک‌بار لود می‌شود.
 *
 * @package rahkar-ui
 */

defined( 'ABSPATH' ) || exit;

/**
 * قرارداد رجیستری (نسخهٔ ۱ — منجمد است و نباید تغییر کند)
 *
 * $GLOBALS['rahkar_ui_registry'] : آرایه‌ای از کاندیداها، هرکدام:
 *     [ 'version' => string, 'path' => string, 'url' => string, 'source' => string ]
 * $GLOBALS['rahkar_ui_loaded']   : بعد از انتخاب، همان کاندیدای برنده.
 * $GLOBALS['rahkar_ui_hooked']   : true اگر قلاب‌ها یک‌بار بسته شده باشند.
 *
 * این سه متغیر عمداً آرایه/بولین سادهٔ گلوبال‌اند و نه پراپرتی کلاس؛ چون اگر
 * پلاگین A نسخهٔ قدیمی همین فایل را زودتر include کرده باشد، تعریف کلاسِ آن
 * برنده می‌شود و کد نسخهٔ جدید اصلاً اجرا نمی‌شود. رجیستریِ گلوبال تنها چیزی
 * است که هر دو نسخهٔ کلاس می‌توانند بخوانند و بنویسند.
 */

if ( ! class_exists( 'Rahkar_UI' ) ) :

	/**
	 * بارگذارندهٔ دیزاین سیستم راهکار.
	 */
	final class Rahkar_UI {

		/**
		 * نسخهٔ خودِ بارگذارنده (نه نسخهٔ دیزاین سیستم).
		 */
		const LOADER_VERSION = '1.0.0';

		/**
		 * شناسهٔ استایل و اسکریپت در وردپرس.
		 */
		const HANDLE = 'rahkar-ui';

		/**
		 * شناسهٔ استایل فونت — جدا، چون مشروط به وجود فایل‌های woff2 است.
		 */
		const FONT_HANDLE = 'rahkar-ui-fonts';

		/**
		 * شناسهٔ نگهبان فرم — جدا، و این جدایی کل نکته است.
		 *
		 * `rahkar-ui` ناگزیر به react و wp-components وابسته است. نگهبان فرم
		 * هیچ وابستگی‌ای ندارد و حدود ۲ کیلوبایت است. صفحه‌ای که کامل سمت سرور
		 * رندر می‌شود و فقط نگهبان را می‌خواهد، نباید حدود ۱٫۱۵ مگابایت رانتایم
		 * وردپرس را بیاورد.
		 */
		const GUARD_HANDLE = 'rahkar-ui-form-guard';

		/**
		 * ثبت یک نسخه از دیزاین سیستم.
		 *
		 * این را در فایل اصلی پلاگین (یا روی قلاب plugins_loaded) صدا بزنید.
		 * صدا زدنش چیزی را enqueue نمی‌کند؛ فقط پلاگین شما را وارد رقابت می‌کند.
		 *
		 * @param string $version نسخهٔ دیزاین سیستمی که همراه پلاگین شماست.
		 * @param string $path    مسیر پوشهٔ پکیج روی دیسک (شامل زیرپوشهٔ build).
		 * @param string $url     نشانی همان پوشه.
		 * @param string $source  نام پلاگین ثبت‌کننده — فقط برای اشکال‌زدایی.
		 * @return void
		 */
		public static function register( $version, $path, $url, $source = '' ) {
			if ( ! isset( $GLOBALS['rahkar_ui_registry'] ) || ! is_array( $GLOBALS['rahkar_ui_registry'] ) ) {
				$GLOBALS['rahkar_ui_registry'] = array();
			}

			$GLOBALS['rahkar_ui_registry'][] = array(
				'version' => (string) $version,
				'path'    => trailingslashit( $path ),
				'url'     => trailingslashit( $url ),
				'source'  => (string) $source,
			);

			self::hook();
		}

		/**
		 * بستن قلاب‌ها — فقط یک‌بار، حتی اگر چند نسخه از این کلاس در گردش باشد.
		 *
		 * @return void
		 */
		private static function hook() {
			if ( ! empty( $GLOBALS['rahkar_ui_hooked'] ) ) {
				return;
			}
			$GLOBALS['rahkar_ui_hooked'] = true;

			// اولویت ۱ تا قبل از enqueue خودِ پلاگین‌ها ثبت شده باشد و بتوانند
			// «rahkar-ui» را به‌عنوان وابستگی اعلام کنند.
			add_action( 'admin_enqueue_scripts', array( __CLASS__, 'register_assets' ), 1 );
			add_action( 'wp_enqueue_scripts', array( __CLASS__, 'register_assets' ), 1 );
		}

		/**
		 * انتخاب برنده: بالاترین نسخه بین کاندیداهایی که فایل‌هایشان واقعاً هست.
		 *
		 * @return array|null کاندیدای برنده یا null اگر هیچ نسخهٔ سالمی نبود.
		 */
		public static function resolve() {
			if ( ! empty( $GLOBALS['rahkar_ui_loaded'] ) ) {
				return $GLOBALS['rahkar_ui_loaded'];
			}

			$registry = isset( $GLOBALS['rahkar_ui_registry'] ) ? $GLOBALS['rahkar_ui_registry'] : array();
			$winner   = null;

			foreach ( $registry as $candidate ) {
				// نسخه‌ای که فایل ساخته‌شده ندارد، اصلاً کاندیدا نیست؛ وگرنه یک
				// پلاگین با build نکرده می‌تواند بقیه را از کار بیندازد.
				if ( ! file_exists( $candidate['path'] . 'build/index.js' ) ) {
					continue;
				}

				if ( null === $winner || version_compare( $candidate['version'], $winner['version'], '>' ) ) {
					$winner = $candidate;
				}
			}

			if ( null !== $winner ) {
				$GLOBALS['rahkar_ui_loaded'] = $winner;
			}

			return $winner;
		}

		/**
		 * ثبت استایل و اسکریپت در وردپرس (بدون enqueue).
		 *
		 * @return bool موفق بود یا نه.
		 */
		public static function register_assets() {
			if ( wp_style_is( self::HANDLE, 'registered' ) ) {
				return true;
			}

			$ui = self::resolve();
			if ( null === $ui ) {
				return false;
			}

			$asset_file = $ui['path'] . 'build/index.asset.php';
			$asset      = file_exists( $asset_file )
				? require $asset_file
				: array(
					'dependencies' => array( 'wp-components', 'wp-element', 'wp-i18n' ),
					'version'      => $ui['version'],
				);

			wp_register_style(
				self::HANDLE,
				$ui['url'] . 'build/index.css',
				array( 'wp-components' ),
				$asset['version']
			);

			wp_register_script(
				self::HANDLE,
				$ui['url'] . 'build/index.js',
				$asset['dependencies'],
				$asset['version'],
				true
			);

			// نشانی اسپرایت آیکون‌ها و نشان برند را به جاوااسکریپت می‌دهیم؛
			// کامپوننت Icon با <use> از همین نشانی اسپرایت می‌خواند.
			wp_add_inline_script(
				self::HANDLE,
				sprintf(
					'window.rahkarUI = Object.assign( window.rahkarUI || {}, %s );',
					wp_json_encode(
						array(
							'version'   => $ui['version'],
							'spriteUrl' => $ui['url'] . 'build/sprite.svg',
							'logoUrl'   => $ui['url'] . 'assets/brand/logo-rahkarnet.svg',
							'baseUrl'   => $ui['url'],
						)
					)
				),
				'before'
			);

			if ( function_exists( 'wp_set_script_translations' ) ) {
				wp_set_script_translations( self::HANDLE, 'rahkar-ui' );
			}

			// نگهبان فرم، جدا و بدون وابستگی. عمداً `rahkar-ui` را به‌عنوان
			// وابستگی اعلام نمی‌کند — اگر می‌کرد، همان باری که می‌خواستیم از
			// دوشش برداریم دوباره روی دوشش می‌افتاد.
			$guard_asset = $ui['path'] . 'build/form-guard.asset.php';

			if ( file_exists( $ui['path'] . 'build/form-guard.js' ) ) {
				$guard = file_exists( $guard_asset )
					? require $guard_asset
					: array(
						'dependencies' => array(),
						'version'      => $ui['version'],
					);

				wp_register_script(
					self::GUARD_HANDLE,
					$ui['url'] . 'build/form-guard.js',
					$guard['dependencies'],
					$guard['version'],
					true
				);
			}

			// فونت وزیرمتن فقط اگر فایلش واقعاً کنار پکیج باشد ثبت می‌شود؛
			// وگرنه ۴۰۴ می‌گرفتیم و زنجیرهٔ جایگزین هم کار خودش را می‌کند.
			if ( file_exists( $ui['path'] . 'assets/fonts/Vazirmatn-Variable.woff2' ) ) {
				wp_register_style(
					self::FONT_HANDLE,
					$ui['url'] . 'assets/fonts/fonts.css',
					array(),
					$asset['version']
				);
			}

			return true;
		}

		/**
		 * enqueue کردن دیزاین سیستم. در صفحه‌های پلاگین خودتان صدا بزنید.
		 *
		 * @return bool موفق بود یا نه.
		 */
		public static function enqueue() {
			if ( ! self::register_assets() ) {
				return false;
			}

			wp_enqueue_style( self::HANDLE );
			wp_enqueue_script( self::HANDLE );

			if ( wp_style_is( self::FONT_HANDLE, 'registered' ) ) {
				wp_enqueue_style( self::FONT_HANDLE );
			}

			return true;
		}

		/**
		 * enqueue کردن فقط نگهبان فرم، بدون کل دیزاین سیستم.
		 *
		 * برای صفحه‌ای که مارک‌آپش را PHP چاپ می‌کند و ری‌اکتی در کار نیست.
		 * استایل‌ها را جداگانه با `enqueue()` یا مستقیم بردارید.
		 *
		 * @return bool موفق بود یا نه.
		 */
		public static function enqueue_form_guard() {
			if ( ! self::register_assets() ) {
				return false;
			}

			if ( ! wp_script_is( self::GUARD_HANDLE, 'registered' ) ) {
				return false;
			}

			wp_enqueue_script( self::GUARD_HANDLE );

			return true;
		}

		/**
		 * شناسهٔ ثبت‌شده — برای اعلام وابستگی در wp_enqueue_script پلاگین خودتان.
		 *
		 * @return string
		 */
		public static function handle() {
			return self::HANDLE;
		}

		/**
		 * شناسهٔ نگهبان فرم.
		 *
		 * @return string
		 */
		public static function guard_handle() {
			return self::GUARD_HANDLE;
		}

		/**
		 * نسخه‌ای که واقعاً لود شده (یا خواهد شد).
		 *
		 * @return string|null
		 */
		public static function version() {
			$ui = self::resolve();
			return $ui ? $ui['version'] : null;
		}

		/**
		 * نشانی اسپرایت آیکون — اگر لازم شد در PHP هم به آن ارجاع بدهید.
		 *
		 * @return string|null
		 */
		public static function sprite_url() {
			$ui = self::resolve();
			return $ui ? $ui['url'] . 'build/sprite.svg' : null;
		}

		/**
		 * نشانی نشان برند.
		 *
		 * @return string|null
		 */
		public static function logo_url() {
			$ui = self::resolve();
			return $ui ? $ui['url'] . 'assets/brand/logo-rahkarnet.svg' : null;
		}

		/**
		 * فهرست همهٔ نسخه‌های ثبت‌شده — برای صفحهٔ «وضعیت سیستم» و اشکال‌زدایی.
		 *
		 * @return array
		 */
		public static function registry() {
			return isset( $GLOBALS['rahkar_ui_registry'] ) ? $GLOBALS['rahkar_ui_registry'] : array();
		}
	}

endif;

if ( ! function_exists( 'rahkar_ui_register' ) ) {
	/**
	 * میان‌بر تابعی برای Rahkar_UI::register().
	 *
	 * @param string $version نسخهٔ دیزاین سیستم همراه پلاگین.
	 * @param string $path    مسیر پوشهٔ پکیج.
	 * @param string $url     نشانی پوشهٔ پکیج.
	 * @param string $source  نام پلاگین ثبت‌کننده.
	 * @return void
	 */
	function rahkar_ui_register( $version, $path, $url, $source = '' ) {
		Rahkar_UI::register( $version, $path, $url, $source );
	}
}
