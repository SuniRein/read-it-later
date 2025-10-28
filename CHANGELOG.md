# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.12.2](https://github.com/SuniRein/read-it-later/compare/v0.12.1...v0.12.2) (2025-10-28)


### Bug Fixes

* current tab not update in popup view sometimes, fixed [#59](https://github.com/SuniRein/read-it-later/issues/59) ([d381f6c](https://github.com/SuniRein/read-it-later/commit/d381f6c923f1e8ce3881566a2ce119a4aade936b))

## [0.12.1](https://github.com/SuniRein/read-it-later/compare/v0.12.0...v0.12.1) (2025-10-26)


### Bug Fixes

* **search:** autocomplete supports completing tags in the middle of the input, fixed [#61](https://github.com/SuniRein/read-it-later/issues/61) ([2546761](https://github.com/SuniRein/read-it-later/commit/25467618bc1ebe61fc115e2adab56465929ac348))
* **search:** enable autocomplete for negation tag filter, fixed [#62](https://github.com/SuniRein/read-it-later/issues/62) ([34c3eb4](https://github.com/SuniRein/read-it-later/commit/34c3eb4cb43bd6d341cc7072a79151ef3ba708c3))

## [0.12.0](https://github.com/SuniRein/read-it-later/compare/v0.11.1...v0.12.0) (2025-10-25)


### Features

* **command:** add a shortcut for toggle current page's favorite status, closed [#57](https://github.com/SuniRein/read-it-later/issues/57) ([e5aaa00](https://github.com/SuniRein/read-it-later/commit/e5aaa00daf6324073443f349a18d9b32ed91c80b))
* **favicon:** favicon cache support ([#56](https://github.com/SuniRein/read-it-later/issues/56)), closed [#31](https://github.com/SuniRein/read-it-later/issues/31) ([4df629a](https://github.com/SuniRein/read-it-later/commit/4df629ab770b498bc10ea62c9c2e10a9cc5d0d51))
* **popup/context-menu:** restrict menu position within window bounds ([e958b0f](https://github.com/SuniRein/read-it-later/commit/e958b0f54ecc810546b0d753602686ac650be84f))
* **popup/context-menu:** support pinning item to top, closed [#60](https://github.com/SuniRein/read-it-later/issues/60) ([2deac43](https://github.com/SuniRein/read-it-later/commit/2deac43dc5c80ff18f6de373774f5217e5f78ee1))
* **popup:** update item's url to current page in context menu, closed [#49](https://github.com/SuniRein/read-it-later/issues/49) ([2f20038](https://github.com/SuniRein/read-it-later/commit/2f20038deb12c1bfb65602517dd0c88eaae46de2))
* **search:** support negation filter, closed [#54](https://github.com/SuniRein/read-it-later/issues/54) ([d152aa0](https://github.com/SuniRein/read-it-later/commit/d152aa089ba0906947db04e0044363f924da31e5))


### Bug Fixes

* **search:** auto save search text in real time, fixed [#55](https://github.com/SuniRein/read-it-later/issues/55) ([d90efce](https://github.com/SuniRein/read-it-later/commit/d90efced6d73734e7de28f9c33ef49e28429839c))

## [0.11.1](https://github.com/SuniRein/read-it-later/compare/v0.11.0...v0.11.1) (2025-10-01)


### Bug Fixes

* **search:** make tag search case sensitive, fixed [#52](https://github.com/SuniRein/read-it-later/issues/52) ([ddda7da](https://github.com/SuniRein/read-it-later/commit/ddda7dafe4dad91958c279a6d2d7ced1c3bcdbb6))
* update current tab highlight in popup when current tab changed, fixed [#50](https://github.com/SuniRein/read-it-later/issues/50) ([37ca05e](https://github.com/SuniRein/read-it-later/commit/37ca05e6293e814014148a4f7cf57ee119149d1d))
* use locale-adaptive firefox addon url, fixed [#51](https://github.com/SuniRein/read-it-later/issues/51) ([43dccdd](https://github.com/SuniRein/read-it-later/commit/43dccddb280e9575c5c08fad12b1988b86cbf7b8))

## [0.11.0](https://github.com/SuniRein/read-it-later/compare/v0.10.0...v0.11.0) (2025-09-26)


### Features

* add about page, closed [#13](https://github.com/SuniRein/read-it-later/issues/13) ([61dcece](https://github.com/SuniRein/read-it-later/commit/61dcece763e534bdeecd411e923549d0886d141d))
* **badge:** changed badge color when current tab is favorited, closed [#45](https://github.com/SuniRein/read-it-later/issues/45) ([8bbb0f2](https://github.com/SuniRein/read-it-later/commit/8bbb0f2225c276c33c8c0077c9e2ed95d856306c))
* **command:** add a shortcut for remove current page, closed [#43](https://github.com/SuniRein/read-it-later/issues/43) ([980a900](https://github.com/SuniRein/read-it-later/commit/980a900835b135a2fe048939d3a99a3884192c92))
* design the behaviors when opening an already opened tab page ([#47](https://github.com/SuniRein/read-it-later/issues/47)) ([f581bbe](https://github.com/SuniRein/read-it-later/commit/f581bbe9896205ff07358e99ec82d1852278115e))


### Bug Fixes

* **text:** use sentence case for all English text on the settings page ([5bdc7e5](https://github.com/SuniRein/read-it-later/commit/5bdc7e52f1191936ff9ae947bd037e3d69677fbc))
* **ui:** wrong native clear icon in Chrome for input, fixed [#46](https://github.com/SuniRein/read-it-later/issues/46) ([675ebd0](https://github.com/SuniRein/read-it-later/commit/675ebd088bc142691da2753500ed7ea74f8e1875))

## [0.10.0](https://github.com/SuniRein/read-it-later/compare/v0.9.0...v0.10.0) (2025-08-19)


### Features

* **data:** allow clear browser data, closed [#39](https://github.com/SuniRein/read-it-later/issues/39) ([f430228](https://github.com/SuniRein/read-it-later/commit/f430228ca6791443be6af35ce156e06fcb2701c0))
* filter unclickable urls in firefox when opening random pages ([e90b7c9](https://github.com/SuniRein/read-it-later/commit/e90b7c9a1e72f7b469b4476edee8e7d67ff4319b))
* set restricted urls unclickable in firefox ([340d29b](https://github.com/SuniRein/read-it-later/commit/340d29b2a72e9f524d30bb815658f25756ef6a0b))
* **webdav**: config panel for webdav cloud storage in data page ([5081ed0](https://github.com/SuniRein/read-it-later/commit/5081ed07ec6cbf0258b9841bce0aa37dcd8555ce))
* **webdav:** delete remote files in webdav ([7e59a38](https://github.com/SuniRein/read-it-later/commit/7e59a380ab84a8914274744592ca4cd2b7d02dd1))
* **webdav:** load remote data from webdav ([c486807](https://github.com/SuniRein/read-it-later/commit/c486807cc20d5176bec4c2277e1df5c4e4832761))
* **webdav:** save remote file to local ([cb57aca](https://github.com/SuniRein/read-it-later/commit/cb57aca2dc1eec76e011dbc4ac80d0d47c72ac57))
* **webdav:** upload local data to WebDav backup directory ([04e2146](https://github.com/SuniRein/read-it-later/commit/04e21468373df4c287058d9b23d0b9ebe7070340))
* **webdav:** validate url before connection ([c1b4059](https://github.com/SuniRein/read-it-later/commit/c1b4059e3f9c974d81ce3690dd9d3bd110d76a56))
* **webdav:** validate webdav connection ([ab51979](https://github.com/SuniRein/read-it-later/commit/ab51979a4679d01c39800ef5eec870828a6cfdad))


### Bug Fixes

* disable spellcheck globally ([189d8c4](https://github.com/SuniRein/read-it-later/commit/189d8c4002656491baac780e51cae1853dbde756))

## [0.9.0](https://github.com/SuniRein/read-it-later/compare/v0.8.0...v0.9.0) (2025-08-13)


### Features

* **command:** add a shortcut for open a random page, closed [#27](https://github.com/SuniRein/read-it-later/issues/27) ([d7224b6](https://github.com/SuniRein/read-it-later/commit/d7224b6233cb2dc05a45a33ab5562b073ac1d0b3))
* **command:** add a shortcut for open popup, closed [#26](https://github.com/SuniRein/read-it-later/issues/26) ([3ad3036](https://github.com/SuniRein/read-it-later/commit/3ad3036284cb99e5464eb440e7ba4aa4324d2c9f))
* new button to copy item's url, closed [#28](https://github.com/SuniRein/read-it-later/issues/28) ([f075e49](https://github.com/SuniRein/read-it-later/commit/f075e49df3518d1b43f79cebf7c4f35807744650))
* **setting:** dynamid update settings, no need to save manually, closed [#34](https://github.com/SuniRein/read-it-later/issues/34) ([2569b76](https://github.com/SuniRein/read-it-later/commit/2569b76bac40f2f144382f8703b202785a09b8ea))


### Bug Fixes

* **edit:** auto completion triggered when saving by <Ctrl-Enter> ([e4edc48](https://github.com/SuniRein/read-it-later/commit/e4edc48f8066ec6777da6c43b2b809361dcb15a6))
* **edit:** autofocus invalid due to autofocus of search box ([69c8f49](https://github.com/SuniRein/read-it-later/commit/69c8f4985160f53a487d703785cc02b333905208))
* **i18n:** update nav text in option page when changed locale ([21f7de2](https://github.com/SuniRein/read-it-later/commit/21f7de21e9142f8495d76a1ac8d711c2bf44ba8c))

## [0.8.0](https://github.com/SuniRein/read-it-later/compare/v0.7.0...v0.8.0) (2025-08-11)


### Features

* adjust the order of operator buttons to (edit, star, checkout) ([3fc557c](https://github.com/SuniRein/read-it-later/commit/3fc557c907f78852a59ca149fac909a6b05b2344))
* auto focus on the search box when popup opened ([84649c0](https://github.com/SuniRein/read-it-later/commit/84649c00032b11d122aeb1621c52ee1587813565))
* **badge:** change badge color when current tab is in the page list, closed [#20](https://github.com/SuniRein/read-it-later/issues/20) ([7102cc6](https://github.com/SuniRein/read-it-later/commit/7102cc6727548a7f2063028947826ad189d3ccdf))
* **badge:** update setting option `Show page count` to `Show badge` ([e297e35](https://github.com/SuniRein/read-it-later/commit/e297e35f0813cc462ad4bd2c71d018fef02ea87f))
* **data:** notify if error happened when loaded, closed [#22](https://github.com/SuniRein/read-it-later/issues/22) ([2c03c86](https://github.com/SuniRein/read-it-later/commit/2c03c869f9c1ab52806cd49a83b3f75fc3f17b65))
* **data:** notify when successfully loaded, closed [#21](https://github.com/SuniRein/read-it-later/issues/21) ([f76bb72](https://github.com/SuniRein/read-it-later/commit/f76bb7207ee4345889291c091b556c1e4302b92f))
* **edit:** support autocompletion for tag input, closed [#24](https://github.com/SuniRein/read-it-later/issues/24) ([d92c871](https://github.com/SuniRein/read-it-later/commit/d92c871e5d66c98378ab00b15b28010f37793d7a))
* **search:** support autocompletion for tags in search box, closed [#25](https://github.com/SuniRein/read-it-later/issues/25) ([92675ed](https://github.com/SuniRein/read-it-later/commit/92675ed45711db73804e2d76b642053700b3b9c7))
* support Chinese characters in tags, closed [#23](https://github.com/SuniRein/read-it-later/issues/23) ([d7ea4e8](https://github.com/SuniRein/read-it-later/commit/d7ea4e845cffad4c0c1483998108b60659f075a7))


### Bug Fixes

* **edit:** use <Ctrl-Enter> instead of <Enter> to save for conflict with autocomplete ([d518e76](https://github.com/SuniRein/read-it-later/commit/d518e76d7d4fe7528fe50a61fc145623fdc341ec))

## [0.7.0](https://github.com/SuniRein/read-it-later/compare/v0.6.1...v0.7.0) (2025-08-09)


### Features

* auto focus on the tag input when in editing mode, closed [#17](https://github.com/SuniRein/read-it-later/issues/17) ([1b434f9](https://github.com/SuniRein/read-it-later/commit/1b434f99d57732e0e44149c97dfe181cb846627f))
* **i18n:** add i18n for extension name and description ([2039d8c](https://github.com/SuniRein/read-it-later/commit/2039d8c9d3e516104515c4eaa123ef946d823ee8))
* **i18n:** add zh_CN locales for popup and option page ([b2dd83b](https://github.com/SuniRein/read-it-later/commit/b2dd83be199a968a38b622c53f7bbcd35149024b))
* **i18n:** set default locale according to user's languages preference ([9c3f36b](https://github.com/SuniRein/read-it-later/commit/9c3f36b0a2714be6c53b864d2685d772f352d395))
* **i18n:** set locale for AntDesign components ([d1d70b9](https://github.com/SuniRein/read-it-later/commit/d1d70b9139f6aff7b15ee58edde15af6ffa8bde3))
* **setting:** support update locales in setting page ([756aaac](https://github.com/SuniRein/read-it-later/commit/756aaac9a5200966c1c3ee25f1e2d862f0665efc))


### Bug Fixes

* make clear button in search box more smooth, fixed [#16](https://github.com/SuniRein/read-it-later/issues/16) ([416c39a](https://github.com/SuniRein/read-it-later/commit/416c39a9cb88ee220941ba856dd3c5cf00aaef80))

## [0.6.1](https://github.com/SuniRein/read-it-later/compare/v0.6.0...v0.6.1) (2025-08-07)


### Bug Fixes

* add `lastModified` to sync storage data, fixed [#14](https://github.com/SuniRein/read-it-later/issues/14) ([36a46b2](https://github.com/SuniRein/read-it-later/commit/36a46b25a39f96d0e1a1768ff398bf0f3f20d718))
* page is added to removed page list but not removed from page list ([8a9906a](https://github.com/SuniRein/read-it-later/commit/8a9906a274367aa6708777daf8a7ce7b4af4ff87))

## [0.6.0](https://github.com/SuniRein/read-it-later/compare/v0.5.0...v0.6.0) (2025-08-06)


### Features

* **popup:** add keyboard shortcuts for save (Enter) and cancel (Ctrl+E) in page editing, closes [#3](https://github.com/SuniRein/read-it-later/issues/3) ([f4a6c38](https://github.com/SuniRein/read-it-later/commit/f4a6c38d4aaff87964888cbe858d54c0a5c4fd43))
* **popup:** set displayed tab count upper limit to 999, closes [#5](https://github.com/SuniRein/read-it-later/issues/5) ([ba13a53](https://github.com/SuniRein/read-it-later/commit/ba13a53422380e12fde5d7f0db976489a78717bb))
* **popup:** support restoring removed page items, which only stored in session, closes [#9](https://github.com/SuniRein/read-it-later/issues/9) ([9bea841](https://github.com/SuniRein/read-it-later/commit/9bea84105bd479efe5eb3fefaa331dd93deb62f9))
* **search:** save search text in sessions, closes [#6](https://github.com/SuniRein/read-it-later/issues/6) ([c37c273](https://github.com/SuniRein/read-it-later/commit/c37c273e5260568213abfd95f56ac55554834145))


### Bug Fixes

* favorited filter option now is only saved in session ([34300c4](https://github.com/SuniRein/read-it-later/commit/34300c487fdb131b704b1aca0ed78033248308be))
* **ui:** make 5 icons in the top operation area the same size, fixed [#11](https://github.com/SuniRein/read-it-later/issues/11) ([2197560](https://github.com/SuniRein/read-it-later/commit/2197560619cd8ef7cc984a7787e8bb418940f649))

## [0.5.0](https://github.com/SuniRein/read-it-later/compare/v0.4.0...v0.5.0) (2025-08-03)


### Features

* remove redundant delete operator ([981f48a](https://github.com/SuniRein/read-it-later/commit/981f48ab8456b9cc1778c85adb4013a4f8398002))
* **search:** improve search box interaction with debounced search event, closes [#1](https://github.com/SuniRein/read-it-later/issues/1) ([a5f3f79](https://github.com/SuniRein/read-it-later/commit/a5f3f7922f135e720ebcb4ef829ba02f4e33cefd))


### Bug Fixes

* **description:** unify label capitalization to sentence case in DataPage ([5eabaaf](https://github.com/SuniRein/read-it-later/commit/5eabaafab1ab5f446b1fa6a1a9c3bb6c729cd570))

## [0.4.0](https://github.com/SuniRein/read-it-later/compare/v0.3.1...v0.4.0) (2025-07-14)


### Features

* **data:** remove undeclared keys when loading ([add0282](https://github.com/SuniRein/read-it-later/commit/add028252617f91db2e8e801b160707fcd175eb3))
* **favicon:** add duckduckgo source ([913da23](https://github.com/SuniRein/read-it-later/commit/913da23c8285b17304c7a5dad12f285793c3fd6a))
* **favicon:** add google source ([f432e21](https://github.com/SuniRein/read-it-later/commit/f432e2187dd7a882bf5f7b14d8265521987ef3c0))
* **favicon:** get favicon URL from favicon.im ([c3aeea7](https://github.com/SuniRein/read-it-later/commit/c3aeea714af1e203dd09b834e52f8a00d0e104bf))
* **setting:** option for choosing favicon source ([710d626](https://github.com/SuniRein/read-it-later/commit/710d626facf1c3e33dd6d71487160376ebd92f89))


### Bug Fixes

* **favicon:** avoid favicon squeezed when title too long ([723dce3](https://github.com/SuniRein/read-it-later/commit/723dce3fc7661591493e7a7affb930232b0a1c77))

## [0.3.1](https://github.com/SuniRein/read-it-later/compare/v0.3.0...v0.3.1) (2025-07-13)


### Bug Fixes

* background main must be synchronous ([9be90b4](https://github.com/SuniRein/read-it-later/commit/9be90b439f5ecc22ca2b9ea7b4e6c9a89fdb1ff5))
* only broadcast current tab when popup connect ([d60b057](https://github.com/SuniRein/read-it-later/commit/d60b057c21b148a9160086378ec3fb0ec4f9a045))

## [0.3.0](https://github.com/SuniRein/read-it-later/compare/v0.2.0...v0.3.0) (2025-07-13)


### Features

* make newly added page item at front ([078ca88](https://github.com/SuniRein/read-it-later/commit/078ca886ae46d34c16c047bb6409d59d8f2492b3))
* **meta:** add icons ([dcfd46d](https://github.com/SuniRein/read-it-later/commit/dcfd46db093b9a1eb0abbe77b530b5d5039ed506))
* **meta:** rename browser extension ([a69afe8](https://github.com/SuniRein/read-it-later/commit/a69afe847784cda5f64b26d943ba41b72878cf0b))
* **meta:** set popup title ([733f9e5](https://github.com/SuniRein/read-it-later/commit/733f9e5666b6f3af8b156f9f300aeb5f6fe24301))
* **setting:** option for showing page number ([2fe7c2c](https://github.com/SuniRein/read-it-later/commit/2fe7c2ce11ab53f60540dd72a558dd64bcbb2038))
* **ui:** show page number in popup ([4a86fad](https://github.com/SuniRein/read-it-later/commit/4a86fad8db6141e88da98db9456be0aefd019e29))
* **ui:** show page number on badge ([8115d0c](https://github.com/SuniRein/read-it-later/commit/8115d0c0ff1b7a582c3748af9d8ec80d93f126ea))

## [0.2.0](https://github.com/SuniRein/read-it-later/compare/v0.1.1...v0.2.0) (2025-07-10)


### Features

* support editing page item ([e545629](https://github.com/SuniRein/read-it-later/commit/e545629b29ce882f765f61feff2f104e71fa8270), [8ef36a5](https://github.com/SuniRein/read-it-later/commit/8ef36a5c689a7a66e95d15ac185b9bd6cc22face))
* **filter:** support filtered by tags ([fad4c3f](https://github.com/SuniRein/read-it-later/commit/fad4c3fca5851e9135f27d730a093b349f224f00))
* **ui:** show colorful tags ([b712482](https://github.com/SuniRein/read-it-later/commit/b712482d5836bed2ccd92e1d27c8554d7f0f26cd))


## [0.1.1](https://github.com/SuniRein/read-it-later/compare/v0.1.0...v0.1.1) (2025-07-07)


### Bug Fixes

* **permission:** fix manifest permission name to "tabs" ([b4ca215](https://github.com/SuniRein/read-it-later/commit/b4ca2150c7287c5623b3e2b8a069ca111de4c51c))

## 0.1.0 (2025-07-07)

Initial release.

### Features

- Add current page to page list.
- Check duplicate pages when adding.
- Popup page to manage page list.
- Toggle favorited state of pages.
- Filter pages by favorited state.
- Filter pages by search query.
- **ui**: Highlight current page in the list.
- **setting**: Add setting page for extension.
- **setting**: Configure pagination in the settings.
- **data**: Persist page list in local storage.
- **data**: Save page list as JSON file.
- **data**: Load page list from JSON file.
