module.exports = {
  selector: 'textarea',
  skin_url:
    window.Laravel.base_url +
    'vendor/parameters/css/libs/tinymce/skins/lightgray',
  height: 500,
  remove_script_host: false,
  content_css: window.Laravel.base_url + 'vendor/parameters/css/app.css',
  relative_urls: false,
  theme: 'modern',
  plugins: [
    'advlist autolink lists link image charmap print preview hr anchor pagebreak',
    'searchreplace wordcount visualblocks visualchars code fullscreen',
    'insertdatetime media save nonbreaking table contextmenu directionality',
    'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc help'
  ],
  toolbar1:
    'save | undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
  toolbar2:
    'print preview media | forecolor backcolor emoticons | codesample help | code',
  image_advtab: true
}
