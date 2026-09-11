/**
 * Table — جدول داده
 *
 * ‎@wordpress/components‎ جدولی ندارد (پیشخوان از `WP_List_Table` سمت PHP
 * استفاده می‌کند)، پس اینجا مارک‌آپ معنایی خودمان است.
 *
 * دو راه استفاده:
 *   ۱) با `columns` و `rows` — جدول را خودش می‌سازد.
 *   ۲) با `children` — `<thead>` و `<tbody>` را خودتان بدهید (مثل وقتی ردیف
 *      بازشونده یا سلول ادغام‌شده دارید).
 */

import cx from '../../utils/cx';

export default function Table( {
	/** [ { key, header, className?, width? } ] */
	columns,
	/** [ { id, cells: { <key>: node } } ] یا آرایه‌ای از آبجکت‌های ساده */
	rows,
	/** ردیف‌های یک‌درمیان کم‌رنگ */
	striped = true,
	/** برجسته‌شدن ردیف زیر اشاره‌گر */
	hover = true,
	/** ارتفاع ردیف کمتر و متن ریزتر — برای فهرست‌های بلند */
	compact = false,
	/** متنی که وقتی هیچ ردیفی نیست نشان داده می‌شود */
	emptyMessage,
	className,
	children,
	...props
} ) {
	const table = (
		<table
			{ ...props }
			className={ cx(
				'rk-table',
				{
					'rk-table--striped': striped,
					'rk-table--hover': hover,
					'rk-table--compact': compact,
				},
				className
			) }
		>
			{ children || (
				<>
					<thead>
						<tr>
							{ columns.map( ( col ) => (
								<th
									key={ col.key }
									scope="col"
									className={ col.className }
									style={
										col.width
											? { width: col.width }
											: undefined
									}
								>
									{ col.header }
								</th>
							) ) }
						</tr>
					</thead>

					<tbody>
						{ rows.length === 0 && emptyMessage ? (
							<tr>
								<td colSpan={ columns.length }>
									{ emptyMessage }
								</td>
							</tr>
						) : (
							rows.map( ( row, index ) => (
								<tr key={ row.id ?? index }>
									{ columns.map( ( col ) => (
										<td
											key={ col.key }
											className={ col.className }
										>
											{ ( row.cells || row )[ col.key ] }
										</td>
									) ) }
								</tr>
							) )
						) }
					</tbody>
				</>
			) }
		</table>
	);

	// قاب بیرونی، چون جدول عریض باید داخل خودش اسکرول بگیرد نه اینکه صفحه را بکشد
	return <div className="rk-table-wrap">{ table }</div>;
}
