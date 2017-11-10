if(process.env.NODE_ENV != 'temp-require')
{
	let mix = require('laravel-mix');

	mix.setPublicPath('public');


	mix.js('./resources/assets/js/app.js', 'js')
	.sass('./resources/assets/sass/app.scss', 'css');

	mix.setResourceRoot('/vendor/parameters/');

	if( mix.inProduction()) {
		mix.copy('node_modules/tinymce/skins', 'public/css/libs/tinymce/skins');
		mix.copy('node_modules/tinymce/themes', 'public/css/libs/tinymce/themes');

		mix.copy('node_modules/tinymce/plugins/emoticons/img', 'public/js/plugins/emoticons/img');
		mix.copy('node_modules/tinymce/plugins/codesample/css', 'public/js/plugins/codesample/css');
		mix.copy('node_modules/tinymce/plugins/visualblocks/css', 'public/js/plugins/visualblocks/css');
	}

	if(! mix.inProduction())
	{
		mix.sourceMaps(true)
		mix.disableNotifications()

		if(process.argv.filter(x => x.indexOf('no-browsersync') != -1).length == 0)
			mix.browserSync('http://localhost:8000')

		if(process.argv.filter(x => x.indexOf('no-tests') != -1).length == 0)
			require('./specs-watcher');

	}
}
