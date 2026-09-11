/**
 * FormRow — ردیف فرم
 *
 * برچسب را خودِ ردیف رندر می‌کند، نه کنترل داخلش. پس به کنترل `label` ندهید و
 * به‌جایش `id` بدهید و همان را به `htmlFor` این ردیف بسپارید:
 *
 *     <FormRow label="سطح گزارش" htmlFor="log-level" help="...">
 *         <Select id="log-level" options={ … } />
 *     </FormRow>
 *
 * اگر هر دو برچسب بدهند، صفحه‌خوان دو برچسب برای یک کنترل می‌خواند.
 */

import cx from '../../utils/cx';
import Icon from '../../icons/Icon';

export default function FormRow( {
	label,
	/** `id` کنترل داخل ردیف */
	htmlFor,
	help,
	error,
	required = false,
	/** برچسب و کنترل زیر هم، نه کنار هم */
	stacked = false,
	className,
	children,
	...props
} ) {
	return (
		<div
			{ ...props }
			className={ cx(
				'rk-form-row',
				stacked && 'rk-form-row--stacked',
				className
			) }
		>
			{ label && (
				<label className="rk-form-row__label" htmlFor={ htmlFor }>
					{ label }
					{ required && (
						<span
							className="rk-form-row__required"
							aria-hidden="true"
						>
							*
						</span>
					) }
				</label>
			) }

			<div className="rk-form-row__control">
				{ children }

				{ help && <p className="rk-form-row__help">{ help }</p> }

				{ error && (
					<p className="rk-form-row__error" role="alert">
						<Icon name="alert" size="sm" />
						{ error }
					</p>
				) }
			</div>
		</div>
	);
}
