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

	if(process.env.NODE_ENV === 'testing' || process.env.NODE_ENV === 'development')
	{
		mix.disableNotifications()
		mix.browserSync('http://localhost:8000')
		require('./specs-watcher');
	}
}
