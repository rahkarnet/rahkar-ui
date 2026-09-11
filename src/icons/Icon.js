/**
 * Icon — آیکون
 *
 * از اسپرایت بیرونی (`sprite.svg`) با `<use>` استفاده می‌کند تا هر آیکون فقط
 * یک‌بار دانلود شود. نشانی اسپرایت را PHP هنگام enqueue داخل
 * `window.rahkarUI.spriteUrl` می‌گذارد؛ اگر نبود، مقدار پیش‌فرض نسبی به کار
 * می‌رود (مفید برای صفحهٔ نمایشی و تست).
 */

import cx from '../utils/cx';

const DEFAULT_SPRITE = 'sprite.svg';

let spriteUrl = null;

/**
 * تعیین دستی نشانی اسپرایت. اگر PHP آن را ست نکرده باشد، قبل از رندر صدا بزنید.
 *
 * @param {string} url نشانی کامل فایل sprite.svg
 */
export function setSpriteUrl( url ) {
	spriteUrl = url;
}

/**
 * @return {string} نشانی فعلی اسپرایت.
 */
export function getSpriteUrl() {
	if ( spriteUrl ) {
		return spriteUrl;
	}
	if ( typeof window !== 'undefined' && window.rahkarUI?.spriteUrl ) {
		return window.rahkarUI.spriteUrl;
	}
	return DEFAULT_SPRITE;
}

export default function Icon( {
	name,
	size = 'md',
	label,
	className,
	...props
} ) {
	if ( ! name ) {
		return null;
	}

	// آیکون بدون برچسب، تزئینی است و باید از دید صفحه‌خوان پنهان بماند.
	const decorative = ! label;

	return (
		<svg
			{ ...props }
			className={ cx(
				'rk-icon',
				size !== 'md' && `rk-icon--${ size }`,
				className
			) }
			role={ decorative ? 'presentation' : 'img' }
			aria-hidden={ decorative ? 'true' : undefined }
			aria-label={ label || undefined }
			focusable="false"
		>
			{ ! decorative && <title>{ label }</title> }
			<use href={ `${ getSpriteUrl() }#rk-${ name }` } />
		</svg>
	);
}

/** فهرست آیکون‌های موجود — برای صفحهٔ نمایشی و اعتبارسنجی. */
export const ICON_NAMES = [
	'power',
	'settings',
	'check',
	'close',
	'plus',
	'alert',
	'info',
	'refresh',
	'trash',
	'chevron-down',
	'chevron-left',
	'chevron-right',
	'search',
	'external',
	'shield',
	'gauge',
	'package',
	'truck',
	'receipt',
	'chart',
	'lock',
	'key',
	'copy',
	'download',
	'plug',
];
