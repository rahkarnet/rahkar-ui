/**
 * Pagination — صفحه‌بندی
 *
 * وقتی تعداد صفحه‌ها زیاد شود، همه را نشان نمی‌دهد: اول، آخر، و پنجرهٔ اطراف
 * صفحهٔ جاری — بقیه با «…». وگرنه یک جدول گزارش با ۴۰۰ صفحه، نوار صفحه‌بندی‌اش
 * از خود جدول بلندتر می‌شود.
 */

import { __, sprintf } from '@wordpress/i18n';
import cx from '../../utils/cx';
import Icon from '../../icons/Icon';

/**
 * شماره‌های قابل‌نمایش را حساب می‌کند.
 *
 * @param {number} current صفحهٔ جاری (از ۱).
 * @param {number} total   تعداد کل صفحه‌ها.
 * @param {number} window  تعداد صفحه‌های هر طرفِ صفحهٔ جاری.
 * @return {Array<number|string>} شماره‌ها و جای خالی‌ها.
 */
function pageList( current, total, window = 1 ) {
	if ( total <= 7 ) {
		return Array.from( { length: total }, ( _, i ) => i + 1 );
	}

	const pages = new Set( [ 1, total ] );
	for ( let i = current - window; i <= current + window; i++ ) {
		if ( i > 1 && i < total ) {
			pages.add( i );
		}
	}

	const sorted = [ ...pages ].sort( ( a, b ) => a - b );
	const out = [];

	sorted.forEach( ( page, index ) => {
		if ( index > 0 && page - sorted[ index - 1 ] > 1 ) {
			out.push( `gap-${ page }` );
		}
		out.push( page );
	} );

	return out;
}

export default function Pagination( {
	current = 1,
	total = 1,
	onChange,
	/** تابعی که برای هر صفحه نشانی می‌سازد — اگر بدهید، لینک رندر می‌شود نه دکمه */
	hrefFor,
	/** «۱۲۰ رکورد» یا هر خلاصهٔ دیگری کنار شماره‌ها */
	summary,
	className,
	...props
} ) {
	if ( total <= 1 ) {
		return null;
	}

	const go = ( page ) => onChange && onChange( page );

	const step = ( page, label, icon, disabled ) => {
		const shared = {
			className: 'rk-pagination__item',
			'aria-label': label,
			title: label,
		};

		if ( hrefFor && ! disabled ) {
			return (
				<a { ...shared } href={ hrefFor( page ) }>
					<Icon name={ icon } size="sm" />
				</a>
			);
		}

		return (
			<button
				{ ...shared }
				type="button"
				disabled={ disabled }
				onClick={ () => go( page ) }
			>
				<Icon name={ icon } size="sm" />
			</button>
		);
	};

	// یک تابع به‌جای زنجیرهٔ سه‌شرطی: چهار حالتِ «فاصله»، «صفحهٔ جاری»،
	// «لینک» و «دکمه» هرکدام مسیر خودشان را دارند.
	const renderPage = ( page ) => {
		if ( typeof page === 'string' ) {
			return (
				<span key={ page } className="rk-pagination__gap">
					…
				</span>
			);
		}

		if ( page === current ) {
			return (
				<span
					key={ page }
					className="rk-pagination__item"
					aria-current="page"
				>
					{ page }
				</span>
			);
		}

		const pageLabel = sprintf(
			/* translators: %d: page number */
			__( 'صفحهٔ %d', 'rahkar-ui' ),
			page
		);

		if ( hrefFor ) {
			return (
				<a
					key={ page }
					className="rk-pagination__item"
					href={ hrefFor( page ) }
					aria-label={ pageLabel }
				>
					{ page }
				</a>
			);
		}

		return (
			<button
				key={ page }
				type="button"
				className="rk-pagination__item"
				onClick={ () => go( page ) }
				aria-label={ pageLabel }
			>
				{ page }
			</button>
		);
	};

	return (
		<nav
			{ ...props }
			className={ cx( 'rk-pagination', className ) }
			aria-label={ __( 'صفحه‌بندی', 'rahkar-ui' ) }
		>
			{ /* در RTL «قبلی» به راست اشاره می‌کند */ }
			{ step(
				current - 1,
				__( 'صفحهٔ قبل', 'rahkar-ui' ),
				'chevron-right',
				current <= 1
			) }

			{ pageList( current, total ).map( renderPage ) }

			{ step(
				current + 1,
				__( 'صفحهٔ بعد', 'rahkar-ui' ),
				'chevron-left',
				current >= total
			) }

			{ summary && (
				<span className="rk-pagination__summary">{ summary }</span>
			) }
		</nav>
	);
}
