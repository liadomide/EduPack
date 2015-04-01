# EduPack rough HowTo

You need a functioning installation of TVB either from git (https://github.com/the-virtual-brain/tvb-pack) or the official release (http://thevirtualbrain.org/tvb/zwei/app). We recommend to use the release version so far. EduPack has been tested with TVB 1.3.


## Quick installation

The easiest way is to get the TVB release and then move the cloned Edupack into TVB's directory structure:

```
unzip TVB_MacOS_1.3_x64_web.zip
git clone git@github.com:BrainModes/EduPack EduPack
rsync -av EduPack/tvb-framework/tvb/interfaces /Applications/TVB_Distribution/tvb.app/Contents/Resources/lib/python2.7/tvb

unzip TVB_Linux_1.3_x64_web.zip
git clone git@github.com:BrainModes/EduPack EduPack
rsync -av EduPack/tvb-framework/tvb/interfaces TVB_Distribution/tvb_data/tvb
```

## Manual

Copy the following files from EduPack:

* EduPack.git/tvb-framework/tvb/interfaces/web/ (EduPack base path)
 * static/js/edupack
 * static/style/base.css
 * static/style/edupack.css
 * static/style/img/edupack
 * static/style/img/nav/icon_nav_edu*
 * templates/genshi/edupack_template.html
 * templates/genshi/base_template.html
 * templates/genshi/footer.html

and have to be copied to your TVB installation base path:

* Linux: TVB_Distribution/tvb_data/tvb/interfaces/web
* OS X: /Applications/TVB_Distribution/tvb.app/Contents/Resources/lib/python2.7/tvb/interfaces/web
* Windows: accordingly

```
EDU_BASE=./EduPack.git/tvb-framework/tvb/interfaces/web
TVB_BASE=./TVB_Distribution/tvb_data/tvb/interfaces/web
rsync -av $EDU_BASE/static/js/edupack $TVB_BASE/static/js/
rsync -av $EDU_BASE/static/style/{base.css,edupack.css} $TVB_BASE/static/style/
rsync -av $EDU_BASE/static/style/img/edupack $TVB_BASE/static/style/img/
rsync -av $EDU_BASE/static/style/img/nav/icon_nav_edu* $TVB_BASE/static/style/img/nav/
rsync -av $EDU_BASE/templates/genshi/{base_template.html,edupack_template.html,footer.html} $TVB_BASE/templates/genshi/
```

## Then start TVB

EduPack resides under a new icon down to the right in the TVB menu. First click "Project" or "Simulator" and then the EduPack icon and it will interactively guide you through the use of TVB.


## Help us make it better

Please tell us how we can improve EduPack. If you have specific comments or found a bug, please use GitHub Issues or fork this repo and send a pull request with your improvements.
