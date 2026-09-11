/**
 * StatTile — کاشی آمار
 *
 * برای «۱۲۰ رکورد»، «۴ خطا»، «۹۸٪ تحویل». عدد را به `value` بدهید و واحد را
 * به `unit`، نه اینکه هر دو را در یک رشته بچسبانید — وگرنه عدد نمی‌تواند
 * تک‌عرض بماند و ستون کاشی‌ها می‌لرزد.
 */

import cx from '../../utils/cx';

export default function StatTile( {
	value,
	label,
	/** توضیح ریز زیر برچسب — بازهٔ زمانی، سقف مجاز */
	hint,
	/** success | warning | error | brand — خالی یعنی خنثی */
	status,
	className,
	...props
} ) {
	return (
		<div
			{ ...props }
			className={ cx(
				'rk-stat',
				status && `rk-stat--${ status }`,
				className
			) }
		>
			<strong className="rk-stat__value">{ value }</strong>
			<span className="rk-stat__label">{ label }</span>
			{ hint && <span className="rk-stat__hint">{ hint }</span> }
		</div>
	);
}
