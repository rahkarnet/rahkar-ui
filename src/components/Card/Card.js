/**
 * Card — کارت ماژول
 *
 * روی `Card` بستهٔ ‎@wordpress/components‎ سوار شده است. سه حالت دارد:
 *
 *   روشن    — ماژول فعال است.
 *   خاموش   — کاربر خاموشش کرده؛ هر وقت بخواهد روشن می‌شود.
 *   مسدود   — پیش‌نیازی برآورده نشده؛ کاربر حتی نمی‌تواند روشنش کند.
 *
 * حالت سوم عمداً از خاموش جداست: اگر یکی بودند، کاربر یک سوییچ غیرفعال
 * می‌دید و هیچ‌جا نمی‌فهمید چرا. `blockedReasons` دلیل را همان‌جا می‌گوید.
 */

import {
	Card as WPCard,
	CardHeader,
	CardBody,
	CardFooter,
} from '@wordpress/components';
import cx from '../../utils/cx';
import Icon from '../../icons/Icon';
import Toggle from '../Toggle/Toggle';
import Badge from '../Badge/Badge';

export default function Card( {
	title,
	description,
	/** نام آیکون از ست rahkar-ui؛ در قاب کوچک کنار عنوان نشان داده می‌شود */
	icon,
	/** حالت روشن/خاموش ماژول */
	enabled = true,
	/** اگر داده شود، سوییچ در سربرگ رندر می‌شود */
	onToggle,
	toggleLabel,
	/**
	 * پیش‌نیازهای برآورده‌نشده. اگر پر باشد، کارت به حالت «مسدود» می‌رود:
	 * سوییچ قفل می‌شود و دلیل‌ها زیر توضیح فهرست می‌شوند.
	 */
	blockedReasons,
	/** نشان وضعیت کنار عنوان: { text, variant } */
	badge,
	/** محتوای پاورقی — معمولاً دکمه‌ها */
	actions,
	/** پاورقی را دوسر می‌چیند (مثلاً متن وضعیت در یک سو و دکمه در سوی دیگر) */
	footerSpaceBetween = false,
	disabled = false,
	className,
	children,
	...props
} ) {
	const isBlocked =
		Array.isArray( blockedReasons ) && blockedReasons.length > 0;
	const isOff = !! onToggle && ! enabled;

	let state = 'on';
	if ( isBlocked ) {
		state = 'blocked';
	} else if ( isOff ) {
		state = 'off';
	}

	return (
		<WPCard
			{ ...props }
			className={ cx( 'rk-card', `rk-card--${ state }`, className ) }
		>
			{ ( title || onToggle ) && (
				<CardHeader className="rk-card__header">
					{ icon && (
						<span className="rk-card__glyph">
							<Icon name={ isBlocked ? 'lock' : icon } />
						</span>
					) }

					<div className="rk-card__heading">
						{ title && (
							<h3 className="rk-card__title">
								{ title }
								{ badge && (
									<Badge variant={ badge.variant }>
										{ badge.text }
									</Badge>
								) }
							</h3>
						) }
						{ description && (
							<p className="rk-card__description">
								{ description }
							</p>
						) }

						{ isBlocked && (
							<ul className="rk-card__blockers">
								{ blockedReasons.map( ( reason, index ) => (
									<li
										className="rk-card__blocker"
										key={ index }
									>
										<Icon name="alert" size="sm" />
										{ reason }
									</li>
								) ) }
							</ul>
						) }
					</div>

					{ onToggle && (
						<div className="rk-card__control">
							<Toggle
								checked={ enabled && ! isBlocked }
								onChange={ onToggle }
								disabled={ disabled || isBlocked }
								aria-label={
									toggleLabel ||
									( typeof title === 'string'
										? title
										: undefined )
								}
							/>
						</div>
					) }
				</CardHeader>
			) }

			{ children && (
				<CardBody className="rk-card__body">{ children }</CardBody>
			) }

			{ actions && (
				<CardFooter
					className={ cx(
						'rk-card__footer',
						footerSpaceBetween && 'rk-card__footer--between'
					) }
				>
					{ actions }
				</CardFooter>
			) }
		</WPCard>
	);
}
