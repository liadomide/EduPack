# EduPack rough installation HowTo

You need a functioning installation of TVB either from git (https://github.com/the-virtual-brain/tvb-pack) or the official release (http://thevirtualbrain.org/tvb/zwei/app). We recommend to use the release version so far. EduPack has been tested with TVB 1.3.

## To install EduPack, copy the following files from EduPack.git:

* EduPack.git/tvb-framework/tvb/interfaces/web/ (EduPack base path)
 * static/js/edupack
 * static/style/base.css
 * static/style/edupack.css
 * static/style/img/edupack
 * templates/genshi/edupack_template.html
 * templates/genshi/base_template.html
 * templates/genshi/footer.html

To your TVB installation base path:

* Linux: TVB_Distribution/tvb_data/tvb/interfaces/web
* OS X: /Applications/TVB_Distribution/tvb.app/Contents/Resources/lib/python2.7/tvb/interfaces/web
* Windows: accordingly

For instance,

```
rsync -av EduPack.git/tvb-framework/tvb/interfaces/web/static/js/edupack TVB_Distribution/tvb_data/tvb/interfaces/web/static/js/
rsync -av EduPack.git/tvb-framework/tvb/interfaces/web/static/style TVB_Distribution/tvb_data/tvb/interfaces/web/static/
rsync -av EduPack.git/tvb-framework/tvb/interfaces/web/templates/genshi EduPack.git/tvb-framework/tvb/interfaces/web/templates/
```

or with `--include-from` and the above list...

## Then start TVB

EduPack will be visible under e.g. "Simulator" tab down to the right. For issues or bug reports, pleas e

## Help us make it better

Please tell us how we can improve EduPack. If you have a specific comments or found a bug, please use GitHub Issues or fork this repo and send a pull request with your improvements.
