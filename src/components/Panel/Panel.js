/**
 * Panel — بخش تنظیمات
 *
 * روی `Panel`/`PanelBody` وردپرس سوار نشده: آن‌ها آکاردئونی‌اند و سربرگشان
 * دکمهٔ باز/بسته است. چیزی که صفحهٔ تنظیمات لازم دارد یک ظرفِ ساده با تیتر
 * است، و تحمیلِ رفتار آکاردئون به آن، تنظیمات را پشت یک کلیک اضافه قایم می‌کند.
 */

import cx from '../../utils/cx';
import Icon from '../../icons/Icon';

export default function Panel( {
	title,
	description,
	icon,
	/** محتوای گوشهٔ سربرگ — نشان وضعیت یا دکمهٔ کمکی */
	aside,
	/** محتوای پاورقی — معمولاً دکمهٔ ذخیره */
	actions,
	id,
	className,
	children,
	...props
} ) {
	return (
		<section
			{ ...props }
			id={ id }
			className={ cx( 'rk-panel', className ) }
		>
			{ ( title || aside ) && (
				<header className="rk-panel__header">
					<div className="rk-panel__heading">
						{ title && (
							<h2 className="rk-panel__title">
								{ icon && <Icon name={ icon } /> }
								{ title }
							</h2>
						) }
						{ description && (
							<p className="rk-panel__description">
								{ description }
							</p>
						) }
					</div>

					{ aside && (
						<div className="rk-panel__aside">{ aside }</div>
					) }
				</header>
			) }

			<div className="rk-panel__body">{ children }</div>

			{ actions && <div className="rk-panel__footer">{ actions }</div> }
		</section>
	);
}

// زیربخش داخل پنل — گروه‌بندی فیلدها زیر یک سرتیتر کوچک.
export function PanelSection( { title, className, children, ...props } ) {
	return (
		<div { ...props } className={ cx( 'rk-panel__section', className ) }>
			{ title && <h3 className="rk-panel__section-title">{ title }</h3> }
			{ children }
		</div>
	);
}
