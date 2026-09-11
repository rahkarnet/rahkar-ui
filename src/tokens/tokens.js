/**
 * rahkar-ui — معادل جاوااسکریپتی توکن‌ها
 *
 * دو خروجی دارد:
 *   1) `tokens`     — ارجاع به متغیر CSS (`var(--rk-…)`). برای استایل درون‌خطی
 *                     در ری‌اکت از این استفاده کنید تا بازنویسی توکن‌ها اثر کند.
 *   2) `rawTokens`  — مقدار واقعی (hex/px). فقط جایی که به مقدار محاسبه‌شده نیاز
 *                     دارید (نمودار، canvas، تولید تصویر) از این استفاده کنید.
 *
 * این فایل باید با `src/tokens/tokens.css` هم‌گام بماند.
 */

const cssVar = ( name, fallback ) =>
	fallback ? `var(--rk-${ name }, ${ fallback })` : `var(--rk-${ name })`;

export const rawTokens = {
	color: {
		brand: {
			50: '#e1f5ee',
			100: '#c8eae1',
			200: '#a1d9ca',
			300: '#6fc3ae',
			400: '#38a88c',
			500: '#1e8a6f',
			600: '#147d63',
			700: '#0f6e56',
			800: '#0b5945',
			900: '#073e30',
		},
		neutral: {
			0: '#ffffff',
			25: '#faf9f6',
			50: '#f5f4ef',
			100: '#ebeae3',
			200: '#dedcd3',
			300: '#c5c3b9',
			400: '#9a9a95',
			500: '#6b6b66',
			600: '#54544f',
			700: '#3d3d39',
			800: '#2a2a27',
			900: '#1a1a18',
		},
		success: '#2f7d32',
		successBg: '#eaf3ea',
		successBorder: '#b3d3b4',
		error: '#b42318',
		errorBg: '#fdecea',
		errorBorder: '#f2b0a9',
		warning: '#a75d06',
		warningBg: '#fdf3e4',
		warningBorder: '#eecb96',
		info: '#1f5fa8',
		infoBg: '#e9f1fa',
		infoBorder: '#aecdea',
		border: 'rgba(26, 26, 24, 0.12)',
		borderSubtle: 'rgba(26, 26, 24, 0.07)',
		borderStrong: 'rgba(26, 26, 24, 0.22)',
	},
	fontFamily:
		'"Vazirmatn", "Vazirmatn RD", -apple-system, "Segoe UI", "Tahoma", "Iranian Sans", sans-serif',
	fontWeight: { regular: 400, medium: 500, bold: 700 },
	fontSize: {
		'2xs': 11,
		xs: 12,
		sm: 13,
		md: 14,
		lg: 16,
		xl: 18,
		'2xl': 22,
		'3xl': 28,
	},
	space: {
		0: 0,
		'025': 2,
		'05': 4,
		1: 8,
		15: 12,
		2: 16,
		3: 24,
		4: 32,
		5: 40,
		6: 48,
		8: 64,
		10: 80,
	},
	radius: { none: 0, sm: 2, md: 3, lg: 4, full: 999 },
	controlHeight: { sm: 28, md: 34, lg: 40 },
	duration: { instant: 60, fast: 120, normal: 180 },
};

export const tokens = {
	color: {
		brand: {
			50: cssVar( 'color-brand-50' ),
			100: cssVar( 'color-brand-100' ),
			200: cssVar( 'color-brand-200' ),
			300: cssVar( 'color-brand-300' ),
			400: cssVar( 'color-brand-400' ),
			500: cssVar( 'color-brand-500' ),
			600: cssVar( 'color-brand-600' ),
			700: cssVar( 'color-brand-700' ),
			800: cssVar( 'color-brand-800' ),
			900: cssVar( 'color-brand-900' ),
		},
		surface: cssVar( 'color-surface' ),
		surfaceSunken: cssVar( 'color-surface-sunken' ),
		text: cssVar( 'color-text' ),
		textMuted: cssVar( 'color-text-muted' ),
		textInverse: cssVar( 'color-text-inverse' ),
		border: cssVar( 'color-border' ),
		borderStrong: cssVar( 'color-border-strong' ),
		success: cssVar( 'color-success' ),
		error: cssVar( 'color-error' ),
		warning: cssVar( 'color-warning' ),
		info: cssVar( 'color-info' ),
	},
	font: {
		family: cssVar( 'font-family' ),
		familyMono: cssVar( 'font-family-mono' ),
		weightRegular: cssVar( 'font-weight-regular' ),
		weightMedium: cssVar( 'font-weight-medium' ),
		weightBold: cssVar( 'font-weight-bold' ),
		size: {
			'2xs': cssVar( 'font-size-2xs' ),
			xs: cssVar( 'font-size-xs' ),
			sm: cssVar( 'font-size-sm' ),
			md: cssVar( 'font-size-md' ),
			lg: cssVar( 'font-size-lg' ),
			xl: cssVar( 'font-size-xl' ),
			'2xl': cssVar( 'font-size-2xl' ),
			'3xl': cssVar( 'font-size-3xl' ),
		},
		lineHeight: {
			tight: cssVar( 'line-height-tight' ),
			normal: cssVar( 'line-height-normal' ),
			loose: cssVar( 'line-height-loose' ),
		},
	},
	space: {
		0: cssVar( 'space-0' ),
		'025': cssVar( 'space-025' ),
		'05': cssVar( 'space-05' ),
		1: cssVar( 'space-1' ),
		15: cssVar( 'space-15' ),
		2: cssVar( 'space-2' ),
		3: cssVar( 'space-3' ),
		4: cssVar( 'space-4' ),
		5: cssVar( 'space-5' ),
		6: cssVar( 'space-6' ),
		8: cssVar( 'space-8' ),
		10: cssVar( 'space-10' ),
	},
	radius: {
		none: cssVar( 'radius-none' ),
		sm: cssVar( 'radius-sm' ),
		md: cssVar( 'radius-md' ),
		lg: cssVar( 'radius-lg' ),
		full: cssVar( 'radius-full' ),
	},
	shadow: {
		none: cssVar( 'shadow-none' ),
		xs: cssVar( 'shadow-xs' ),
		sm: cssVar( 'shadow-sm' ),
		md: cssVar( 'shadow-md' ),
		lg: cssVar( 'shadow-lg' ),
		focus: cssVar( 'shadow-focus' ),
	},
	motion: {
		durationFast: cssVar( 'duration-fast' ),
		durationNormal: cssVar( 'duration-normal' ),
		easing: cssVar( 'easing' ),
	},
	zIndex: {
		base: cssVar( 'z-base' ),
		sticky: cssVar( 'z-sticky' ),
		dropdown: cssVar( 'z-dropdown' ),
		overlay: cssVar( 'z-overlay' ),
		modal: cssVar( 'z-modal' ),
		toast: cssVar( 'z-toast' ),
	},
};

/**
 * بازنویسی توکن‌ها در زمان اجرا (مثلاً برای تم رنگی سفارشی یک پلاگین).
 *
 * @param {Object}      overrides نگاشت نام توکن (بدون پیشوند --rk-) به مقدار.
 * @param {HTMLElement} target    عنصر هدف؛ پیش‌فرض ریشهٔ سند.
 */
export function applyTokenOverrides( overrides, target ) {
	const el =
		target ||
		( typeof document !== 'undefined' ? document.documentElement : null );
	if ( ! el ) {
		return;
	}
	Object.entries( overrides ).forEach( ( [ key, value ] ) => {
		el.style.setProperty(
			key.startsWith( '--' ) ? key : `--rk-${ key }`,
			String( value )
		);
	} );
}

export default tokens;
