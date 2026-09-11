/**
 * سرور ایستای کوچک برای صفحهٔ نمایشی.
 *
 * چرا لازم است: `demo/index.html` اسپرایت آیکون را با `<use href="…svg#id">`
 * می‌خواند و مرورگرها این ارجاع بیرونی را روی `file://` به‌خاطر CORS رد می‌کنند.
 * پس صفحه باید روی http باز شود. هیچ وابستگی‌ای هم لازم نیست.
 *
 *   npm run demo   →   http://localhost:8080/demo/
 */

const http = require( 'http' );
const fs = require( 'fs' );
const path = require( 'path' );

const root = path.resolve( __dirname, '..' );
const port = Number( process.env.PORT ) || 8080;

const TYPES = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.woff2': 'font/woff2',
	'.woff': 'font/woff',
	'.png': 'image/png',
};

const server = http.createServer( ( req, res ) => {
	let urlPath = decodeURIComponent( req.url.split( '?' )[ 0 ] );

	if ( urlPath === '/' ) {
		res.writeHead( 302, { Location: '/demo/' } );
		res.end();
		return;
	}
	if ( urlPath.endsWith( '/' ) ) {
		urlPath += 'index.html';
	}

	const file = path.join( root, urlPath );

	// از بیرون‌رفتن از ریشهٔ پکیج جلوگیری می‌کند
	if ( ! file.startsWith( root ) || ! fs.existsSync( file ) ) {
		res.writeHead( 404, { 'Content-Type': 'text/plain; charset=utf-8' } );
		res.end( 'پیدا نشد: ' + urlPath );
		return;
	}
	if ( fs.statSync( file ).isDirectory() ) {
		res.writeHead( 302, { Location: urlPath + '/' } );
		res.end();
		return;
	}

	res.writeHead( 200, {
		'Content-Type':
			TYPES[ path.extname( file ) ] || 'application/octet-stream',
		'Cache-Control': 'no-store',
	} );
	res.end( fs.readFileSync( file ) );
} );

server.listen( port, () => {
	// eslint-disable-next-line no-console
	console.log( `rahkar-ui: صفحهٔ نمایشی → http://localhost:${ port }/demo/` );
} );
