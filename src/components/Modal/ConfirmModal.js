/**
 * ConfirmModal — مودال تأیید
 *
 * جایگزین `confirm()` مرورگر. دلیلش فقط ظاهر نیست:
 *
 *   ۱) `confirm()` نمی‌تواند بین «حذف رکوردهای قدیمی» و «حذف همیشگی همه‌چیز»
 *      فرق بگذارد — هر دو یک کادر خاکستری با دو دکمهٔ یکسان‌اند.
 *   ۲) متنش را نمی‌شود راست‌به‌چپ یا با فونت برند نشان داد.
 *   ۳) رشتهٔ فارسی داخل `onsubmit="return confirm('…')"` باید دوبار فرار داده
 *      شود (HTML و JS) و همان‌جاست که نقل‌قول‌ها می‌شکنند.
 *
 * برای کار برگشت‌ناپذیر، `consequence` را بدهید تا پیامد جدا از متن اصلی و
 * پررنگ دیده شود؛ کاربر باید بداند چه چیزی برنمی‌گردد، نه فقط اینکه «مطمئنید؟».
 */

import { __ } from '@wordpress/i18n';
import cx from '../../utils/cx';
import Modal from './Modal';
import Button from '../Button/Button';
import Icon from '../../icons/Icon';

const GLYPH = {
	danger: 'alert',
	warning: 'alert',
	default: 'info',
};

export default function ConfirmModal( {
	title,
	/** متن اصلی پرسش */
	message,
	/**
	 * پیامد برگشت‌ناپذیر — اگر بدهید، در کادر قرمز جدا نشان داده می‌شود.
	 * فقط وقتی که کار واقعاً برگشت‌ناپذیر است؛ وگرنه بی‌اثر می‌شود.
	 */
	consequence,
	/** `danger` برای کار مخرب، `warning` برای کار پرریسک ولی برگشت‌پذیر */
	tone = 'danger',
	confirmLabel,
	cancelLabel,
	onConfirm,
	onCancel,
	/** در حال انجام — دکمهٔ تأیید قفل و چرخان می‌شود */
	isBusy = false,
	children,
	...props
} ) {
	return (
		<Modal
			{ ...props }
			size="sm"
			title={ title }
			onRequestClose={ isBusy ? undefined : onCancel }
			// بستن اتفاقی هنگام کار مخرب، بهتر از تأیید اتفاقی است؛ ولی وقتی
			// درخواست در راه است هیچ‌کدام نباید ممکن باشد.
			shouldCloseOnClickOutside={ ! isBusy }
			shouldCloseOnEsc={ ! isBusy }
			footer={
				<>
					<Button
						variant="secondary"
						onClick={ onCancel }
						disabled={ isBusy }
					>
						{ cancelLabel || __( 'انصراف', 'rahkar-ui' ) }
					</Button>
					<Button
						variant={
							tone === 'danger' ? 'destructive' : 'primary'
						}
						onClick={ onConfirm }
						isBusy={ isBusy }
					>
						{ confirmLabel || __( 'تأیید', 'rahkar-ui' ) }
					</Button>
				</>
			}
		>
			<div className={ cx( 'rk-confirm', `rk-confirm--${ tone }` ) }>
				<span className="rk-confirm__glyph">
					<Icon name={ GLYPH[ tone ] || GLYPH.default } />
				</span>

				<div className="rk-confirm__text">
					{ message && (
						<p className="rk-confirm__message">{ message }</p>
					) }
					{ consequence && (
						<strong className="rk-confirm__consequence">
							{ consequence }
						</strong>
					) }
					{ children }
				</div>
			</div>
		</Modal>
	);
}
