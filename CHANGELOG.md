# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

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
