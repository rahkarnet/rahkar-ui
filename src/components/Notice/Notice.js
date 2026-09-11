/**
 * Notice — پیام درون‌صفحه‌ای
 *
 * برای «تنظیمات ذخیره شد»، «ماژول روشن شد»، خطای اتصال به سرویس پیامک و مانند
 * این‌ها. روی `Notice` بستهٔ ‎@wordpress/components‎ سوار شده تا `role` درست
 * (`status` یا `alert`) و رفتار دکمهٔ بستن از آنجا بیاید.
 */

import { Notice as WPNotice } from '@wordpress/components';
import cx from '../../utils/cx';
import Icon from '../../icons/Icon';

const GLYPH = {
	success: 'check',
	error: 'alert',
	warning: 'alert',
	info: 'info',
};

export default function Notice( {
	/** success | error | warning | info */
	status = 'info',
	/** تیتر پررنگ بالای متن — برای پیام‌های چندخطی */
	title,
	/** قابل بستن است یا نه. پیام خطا معمولاً نباید خودبه‌خود برود. */
	isDismissible = true,
	onRemove,
	/** دکمه‌های کنار پیام */
	actions,
	className,
	children,
	...props
} ) {
	return (
		<WPNotice
			{ ...props }
			status={ status }
			isDismissible={ isDismissible }
			onRemove={ onRemove }
			className={ cx( 'rk-notice', `rk-notice--${ status }`, className ) }
		>
			<Icon
				name={ GLYPH[ status ] || GLYPH.info }
				className="rk-notice__glyph"
			/>

			<span className="rk-notice__body">
				{ title && (
					<strong className="rk-notice__title">{ title }</strong>
				) }
				{ children }
				{ actions && (
					<span className="rk-notice__actions">{ actions }</span>
				) }
			</span>
		</WPNotice>
	);
}
