/**
 * Modal — مودال
 *
 * روی `Modal` بستهٔ ‎@wordpress/components‎ سوار شده است. دلیلش رفتار است نه
 * ظاهر: تلهٔ فوکوس، بازگرداندن فوکوس هنگام بستن، بستن با Esc، قفل اسکرول صفحه
 * و نقش‌های aria — چیزهایی که بازنویسی‌شان از صفر معمولاً نصفه‌نیمه از آب درمی‌آید.
 */

import { Modal as WPModal } from '@wordpress/components';
import cx from '../../utils/cx';

export default function Modal( {
	title,
	/** توضیح یک‌خطی زیر عنوان */
	subtitle,
	size = 'md',
	/** محتوای پاورقی — معمولاً دکمه‌ها */
	footer,
	/** پاورقی را دوسر می‌چیند (مثلاً «راهنما» در یک سو و دکمه‌ها در سوی دیگر) */
	footerSpaceBetween = false,
	onRequestClose,
	className,
	children,
	...props
} ) {
	return (
		<WPModal
			{ ...props }
			title={ title }
			onRequestClose={ onRequestClose }
			className={ cx(
				'rk-modal',
				size !== 'md' && `rk-modal--${ size }`,
				className
			) }
			overlayClassName="rk-modal-overlay"
		>
			<div className="rk-modal__body">
				{ /* وردپرس فقط `title` را در سربرگ می‌گذارد، پس زیرعنوان
				     اول بدنه می‌نشیند نه زیر عنوان. */ }
				{ subtitle && (
					<p className="rk-modal__subtitle">{ subtitle }</p>
				) }
				{ children }
			</div>

			{ footer && (
				<div
					className={ cx(
						'rk-modal__footer',
						footerSpaceBetween && 'rk-modal__footer--between'
					) }
				>
					{ footer }
				</div>
			) }
		</WPModal>
	);
}
