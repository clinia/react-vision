# [2.0.0-beta.7](https://github.com/clinia/react-vision/compare/v2.0.0-beta.6...v2.0.0-beta.7) (2020-05-11)


### Bug Fixes

* build size ([0c17f12](https://github.com/clinia/react-vision/commit/0c17f122583b8902c84e9c005e95ab070d3a317b))


### Features

* connectGeocoder and connectQuerySuggestions connectors ([54e8ff1](https://github.com/clinia/react-vision/commit/54e8ff13c742f3f19ac87bba8c3b947321f9666b))



# [2.0.0-beta.6](https://github.com/clinia/react-vision/compare/v2.0.0-beta.5...v2.0.0-beta.6) (2020-05-05)


### Bug Fixes

* build ([c36f0a0](https://github.com/clinia/react-vision/commit/c36f0a0d55ca728d78b232b79386bc0495f554d0))


### Features

* **widget:** sort by widget ([b9c1a24](https://github.com/clinia/react-vision/commit/b9c1a243f3f5b6b689c5f7e591cd9381e93cee57))



# [2.0.0-beta.5](https://github.com/clinia/react-vision/compare/v2.0.0-beta.4...v2.0.0-beta.5) (2020-04-24)


### Features

* **filters:** refinement list widget and connector ([2d4b55c](https://github.com/clinia/react-vision/commit/2d4b55cd8e1cb528537d91efa93f1e7097957e67))
* **filters:** toggle widgets and connector & menu, menu select widget and connector ([739c22b](https://github.com/clinia/react-vision/commit/739c22b9064337256989d5334a77c630e6e3baeb))



# [2.0.0-beta.4](https://github.com/clinia/react-vision/compare/v2.0.0-beta.3...v2.0.0-beta.4) (2020-04-22)


### Features

* **dom:** added a new parameter to disable rendering on the server ([e67d546](https://github.com/clinia/react-vision/commit/e67d546072bb879a85cfa8ca37b20fbcdb45b3db))
* **maps:** added mapbox integration and react mappings ([#35](https://github.com/clinia/react-vision/issues/35)) ([f4d5ceb](https://github.com/clinia/react-vision/commit/f4d5ceb204c03786291a726eba7d254ed798ee40))



# [2.0.0-beta.3](https://github.com/clinia/react-vision/compare/v2.0.0-beta.2...v2.0.0-beta.3) (2020-04-21)


### Bug Fixes

* **dom-maps:** wrong mappinf of clinia _geoPoint in maps provider extend bounds ([0e24d54](https://github.com/clinia/react-vision/commit/0e24d54b2d19fd6b3c86879342ef1776179c5f15))



# [2.0.0-beta.2](https://github.com/clinia/react-vision/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2020-04-21)


### Bug Fixes

* **maps:** wrong type mapping from clinia _geoPoint to google LatLng ([0dee1f8](https://github.com/clinia/react-vision/commit/0dee1f87b24ce2c10f19fb62f9ccbbf343dfd6e9))



# [2.0.0-beta.1](https://github.com/clinia/react-vision/compare/v2.0.0-beta.0...v2.0.0-beta.1) (2020-04-20)



# [2.0.0-beta.0](https://github.com/clinia/react-vision/compare/v1.1.0...v2.0.0-beta.0) (2020-04-20)


### Bug Fixes

* Fix location style class to lowercase ([#31](https://github.com/clinia/react-vision/issues/31)) ([0fc2706](https://github.com/clinia/react-vision/commit/0fc270691cac90afc98372444c513555fda2e191))


### Features

* Propagate onchange event in autocomplete if user click on suggestion ([#32](https://github.com/clinia/react-vision/issues/32)) ([e508191](https://github.com/clinia/react-vision/commit/e508191a1890516aec2493ced777ef5c3216f309))
* **connectors:** current refinements, pagination, state results and stats ([9e7789b](https://github.com/clinia/react-vision/commit/9e7789bd5588a84bdd0a27207ad094ad2ca3dbb1))
* **dom:** higlight, clear refinements, per page, pagination, stats ([d0bcd4b](https://github.com/clinia/react-vision/commit/d0bcd4bb9aa905604870a0d4e1dce724fab314a1))



# [1.1.0](https://github.com/clinia/react-vizion/compare/v1.0.0...v1.1.0) (2020-01-30)


### Bug Fixes

* integration tests ([5aeb511](https://github.com/clinia/react-vizion/commit/5aeb5118dabde0224451d6ca6defee4be4f08efc))
* lint issues ([f1f1e42](https://github.com/clinia/react-vizion/commit/f1f1e425103657df8c8294030a7665fbcee84763))
* lint issues ([163558a](https://github.com/clinia/react-vizion/commit/163558af731e4d0c9271e90dd4e342aa336d3b73))
* Removed indexes around Header component ([#27](https://github.com/clinia/react-vizion/issues/27)) ([c02a98d](https://github.com/clinia/react-vizion/commit/c02a98d9267668e309255c62a7db60fbb1c3fbe9))
* type-check issues ([4a2a548](https://github.com/clinia/react-vizion/commit/4a2a548a73fef11f80e8b3fdd06046ab4fbfaa70))


### Features

* Unified places endpoint ([#28](https://github.com/clinia/react-vizion/issues/28)) ([d0e861a](https://github.com/clinia/react-vizion/commit/d0e861ae02ae7e752a02b5ae91eaa9be54da603a))
* Update vizion widgets with demo ([#30](https://github.com/clinia/react-vizion/issues/30)) ([325254e](https://github.com/clinia/react-vizion/commit/325254eca5e379630fb4372c0adb1ada30947a6b))



# 1.0.0 (2019-11-28)


### Bug Fixes

* bundle size ([0b12f88](https://github.com/clinia/react-vizion/commit/0b12f8861e3b902690d2713b1d442e3578357e17))
* export connecotrs, components & widgets in respective packages ([9583c9f](https://github.com/clinia/react-vizion/commit/9583c9fd03bd04aff04c008a24799a92d4a62832))
* Fix metadata access in connectInfiniteHits + connectGeo ([#14](https://github.com/clinia/react-vizion/issues/14)) ([5f2919f](https://github.com/clinia/react-vizion/commit/5f2919fe2b21d53e0b886d8cad8ef421866df45b))
* lint issues ([dc38070](https://github.com/clinia/react-vizion/commit/dc38070a6771ad859aae970b89763029c27d0ad1))
* packages versions & storybook stories ([0d1f139](https://github.com/clinia/react-vizion/commit/0d1f13966674b6a916d5888edf746e13ee66a20e))
* type-check & tests ([08c1623](https://github.com/clinia/react-vizion/commit/08c1623c860f8748c158f36e5087bc03718d3b5e))


### Features

* Added index to react-native example ([#25](https://github.com/clinia/react-vizion/issues/25)) ([6ab50bf](https://github.com/clinia/react-vizion/commit/6ab50bf43ab3a1a728a551674b0c30078c6a1c32))
* Added location autocomplete to react-native example ([#18](https://github.com/clinia/react-vizion/issues/18)) ([2972880](https://github.com/clinia/react-vizion/commit/2972880697843edf59a25260f16e4ea2d1766424))
* Added map to react-native-example [CS-1203] ([#11](https://github.com/clinia/react-vizion/issues/11)) ([5ac2934](https://github.com/clinia/react-vizion/commit/5ac293429e55bef251fc679eaa14c4ef5ebe98aa))
* Added react-native-example project ([#8](https://github.com/clinia/react-vizion/issues/8)) ([d7e9c35](https://github.com/clinia/react-vizion/commit/d7e9c3558bf14a9bcc8c759de7588f240245e7bf))
* adding loading state to hits ([#20](https://github.com/clinia/react-vizion/issues/20)) ([86fbd49](https://github.com/clinia/react-vizion/commit/86fbd49a5cd476b2a3ad4cd4e6ff42ebfc651a8c))
* autocomplete component + story ([#13](https://github.com/clinia/react-vizion/issues/13)) ([2fef874](https://github.com/clinia/react-vizion/commit/2fef874fc9f55ed54de7c62a6322982d7bef5652))
* autocomplete connector & index widget ([#9](https://github.com/clinia/react-vizion/issues/9)) ([a792202](https://github.com/clinia/react-vizion/commit/a792202b62666155d5a21ed3a954509ab2f900a6))
* e2e tests ([#10](https://github.com/clinia/react-vizion/issues/10)) ([960e127](https://github.com/clinia/react-vizion/commit/960e12789b82ef6f0aa3bff29d677477ba3bf849))
* Enabled documentation generation using jsdoc ([#24](https://github.com/clinia/react-vizion/issues/24)) ([629a66b](https://github.com/clinia/react-vizion/commit/629a66bac2763154ede984064cf882ce904c6865))
* geo search widgets (maps, marker, redo, control) ([#15](https://github.com/clinia/react-vizion/issues/15)) ([510548b](https://github.com/clinia/react-vizion/commit/510548b78e2b5722542af4585faabe05a8301d8e))
* geoSearch connector ([#12](https://github.com/clinia/react-vizion/issues/12)) ([624dc10](https://github.com/clinia/react-vizion/commit/624dc104c001369cf2742e5e3f532640fe961ce6))
* location + map example ([#21](https://github.com/clinia/react-vizion/issues/21)) ([ef68ab3](https://github.com/clinia/react-vizion/commit/ef68ab33f26186d7e96f3d1922027cf4166fa0fc))
* location connector ([#16](https://github.com/clinia/react-vizion/issues/16)) ([1a26f59](https://github.com/clinia/react-vizion/commit/1a26f5933a47af43ca9230cf5144787a10243ab7))


### Reverts

* Revert "correcting test file format" ([f473b0e](https://github.com/clinia/react-vizion/commit/f473b0edd30d2248528435c067c41780a6f26ff5))



