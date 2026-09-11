/**
 * VerticalTabs — تب عمودی سلسله‌مراتبی
 *
 * برای صفحهٔ تنظیماتی که قرار است بزرگ شود. تب افقی وقتی از پنج‌شش تا بگذرد
 * می‌شکند؛ تب عمودی با تعداد رشد می‌کند و جست‌وجو هم می‌پذیرد.
 *
 * عمداً دو حالت ناوبری دارد و هیچ‌کدام را تحمیل نمی‌کند:
 *
 *   `hrefFor`  — هر تب یک نشانی (`?tab=jalali`). صفحه دوباره بارگذاری می‌شود،
 *                فقط فیلدهای همان تب رندر و POST می‌شوند. برای وقتی که تعداد
 *                فیلدها از سقف `max_input_vars` رد می‌شود.
 *
 *   `onSelect` — جابه‌جایی بدون بارگذاری. سریع‌تر است و تغییرات ذخیره‌نشده
 *                بین تب‌ها از بین نمی‌روند، ولی همهٔ فیلدها در DOM می‌مانند.
 *
 * انتخاب بین این دو یک تصمیم معماری است نه ظاهری — توضیحش در README،
 * بخش «تب عمودی و ذخیره‌سازی».
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import cx from '../../utils/cx';
import Icon from '../../icons/Icon';

/**
 * آیا این آیتم یا یکی از فرزندانش فعال است؟
 *
 * @param {Object} item   آیتم فهرست.
 * @param {string} active کلید تب فعال.
 * @return {boolean} نتیجه.
 */
function holdsActive( item, active ) {
	if ( item.key === active ) {
		return true;
	}
	return ( item.items || [] ).some( ( child ) => child.key === active );
}

/**
 * فیلتر بازگشتی فهرست بر اساس متن جست‌وجو.
 *
 * گروهی که خودش هم‌خوان است تمام فرزندانش را نگه می‌دارد؛ وگرنه فقط
 * فرزندهای هم‌خوان می‌مانند.
 *
 * @param {Array}  items آیتم‌ها.
 * @param {string} query متن جست‌وجو.
 * @return {Array} آیتم‌های هم‌خوان.
 */
function filterItems( items, query ) {
	const needle = query.trim().toLowerCase();
	if ( ! needle ) {
		return items;
	}

	const matches = ( item ) =>
		String( item.label ).toLowerCase().includes( needle );

	return items.reduce( ( out, item ) => {
		if ( matches( item ) ) {
			out.push( item );
			return out;
		}

		const kids = ( item.items || [] ).filter( matches );
		if ( kids.length ) {
			out.push( { ...item, items: kids } );
		}

		return out;
	}, [] );
}

export default function VerticalTabs( {
	/**
	 * [ { key, label, icon?, count?, countStatus?, dirty?, disabled?,
	 *     items?: [ … ] } ] — یک سطح تودرتو، نه بیشتر.
	 */
	items = [],
	active,
	onSelect,
	/** اگر بدهید، تب‌ها لینک می‌شوند و ناوبری سمت سرور انجام می‌شود */
	hrefFor,
	/** جعبهٔ جست‌وجو بالای فهرست — وقتی تعداد تب‌ها زیاد شد */
	searchable = false,
	/** فهرست با صفحه اسکرول نشود */
	sticky = true,
	label,
	className,
	...props
} ) {
	const [ query, setQuery ] = useState( '' );
	const [ collapsed, setCollapsed ] = useState( () => new Set() );

	const visible = filterItems( items, query );

	const toggleGroup = ( key ) => {
		setCollapsed( ( prev ) => {
			const next = new Set( prev );
			if ( next.has( key ) ) {
				next.delete( key );
			} else {
				next.add( key );
			}
			return next;
		} );
	};

	const renderLeaf = ( item, isChild ) => {
		const selected = item.key === active;

		const inner = (
			<>
				{ item.icon && ! isChild && (
					<Icon name={ item.icon } size="sm" />
				) }
				<span className="rk-vtabs__label">{ item.label }</span>
				{ item.dirty && (
					<span
						className="rk-vtabs__dirty"
						title={ __( 'تغییر ذخیره‌نشده', 'rahkar-ui' ) }
					/>
				) }
				{ undefined !== item.count && (
					<span
						className={ cx(
							'rk-vtabs__count',
							item.countStatus &&
								`rk-vtabs__count--${ item.countStatus }`
						) }
					>
						{ item.count }
					</span>
				) }
			</>
		);

		if ( hrefFor ) {
			return (
				<a
					className="rk-vtabs__item"
					href={ hrefFor( item.key ) }
					aria-current={ selected ? 'page' : undefined }
				>
					{ inner }
				</a>
			);
		}

		return (
			<button
				type="button"
				className="rk-vtabs__item"
				aria-current={ selected ? 'page' : undefined }
				aria-controls={ `rk-vpanel-${ item.key }` }
				id={ `rk-vtab-${ item.key }` }
				disabled={ item.disabled }
				onClick={ () => onSelect && onSelect( item.key ) }
			>
				{ inner }
			</button>
		);
	};

	return (
		<nav
			{ ...props }
			className={ cx(
				'rk-vtabs',
				sticky && 'rk-vtabs--sticky',
				className
			) }
			aria-label={ label || __( 'بخش‌های تنظیمات', 'rahkar-ui' ) }
		>
			{ searchable && (
				<div className="rk-vtabs__search">
					<Icon
						name="search"
						size="sm"
						className="rk-vtabs__search-icon"
					/>
					<input
						type="search"
						value={ query }
						onChange={ ( event ) => setQuery( event.target.value ) }
						placeholder={ __( 'جست‌وجوی تنظیم…', 'rahkar-ui' ) }
						aria-label={ __( 'جست‌وجو در تنظیمات', 'rahkar-ui' ) }
					/>
				</div>
			) }

			{ visible.length === 0 ? (
				<p className="rk-vtabs__empty">
					{ __( 'چیزی پیدا نشد.', 'rahkar-ui' ) }
				</p>
			) : (
				<ul className="rk-vtabs__list">
					{ visible.map( ( item ) => {
						const kids = item.items || [];

						if ( kids.length === 0 ) {
							return (
								<li key={ item.key }>
									{ renderLeaf( item, false ) }
								</li>
							);
						}

						// گروهی که تب فعال را دارد همیشه باز است، حتی اگر
						// کاربر قبلاً بسته بودش — وگرنه تب فعال نامرئی می‌شود.
						const open =
							holdsActive( item, active ) ||
							!! query ||
							! collapsed.has( item.key );

						return (
							<li
								key={ item.key }
								className="rk-vtabs__group"
								data-open={ open ? 'true' : 'false' }
							>
								<button
									type="button"
									className="rk-vtabs__item rk-vtabs__group-toggle"
									aria-expanded={ open }
									onClick={ () => toggleGroup( item.key ) }
								>
									{ item.icon && (
										<Icon name={ item.icon } size="sm" />
									) }
									<span className="rk-vtabs__label">
										{ item.label }
									</span>
									<Icon
										name="chevron-down"
										size="sm"
										className="rk-vtabs__chevron"
									/>
								</button>

								<ul className="rk-vtabs__children">
									{ kids.map( ( child ) => (
										<li key={ child.key }>
											{ renderLeaf( child, true ) }
										</li>
									) ) }
								</ul>
							</li>
						);
					} ) }
				</ul>
			) }
		</nav>
	);
}

/*
 * پنل یک تب.
 *
 * `keepMounted` پیش‌فرض `true` است و این عمدی است. اگر فرم سمت سرور ذخیره
 * می‌شود، فیلدِ رندرنشده اصلاً POST نمی‌شود؛ و اگر ذخیره‌کننده مقدار قبلی را
 * ادغام نکند، همان یک «ذخیره» تنظیمات تب‌های دیگر را پاک می‌کند.
 *
 * فقط وقتی `keepMounted={ false }` بدهید که ذخیره‌سازی‌تان دامنه‌دار باشد
 * (یعنی بداند کدام بخش ارسال شده و بقیه را دست نزند).
 */
export function VerticalTabsPanel( {
	tabKey,
	active,
	keepMounted = true,
	className,
	children,
	...props
} ) {
	const selected = tabKey === active;

	if ( ! selected && ! keepMounted ) {
		return null;
	}

	return (
		<section
			{ ...props }
			className={ cx( 'rk-vtabs-panel', className ) }
			id={ `rk-vpanel-${ tabKey }` }
			aria-labelledby={ `rk-vtab-${ tabKey }` }
			hidden={ ! selected }
		>
			{ children }
		</section>
	);
}
