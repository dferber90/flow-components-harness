/* global
	props: true,
	stampit: false
*/

props = stampit().enclose(function () {
	'use strict';
	
	var props = {};

	var init = function (key) {
		props[key] = {
			value: undefined,
			dep: new Tracker.Dependency()
		};
	};

	var exists = function (key) {
		return _.has(props, key);
	};

	this.getProperty = function (key) {
		props[key].dep.depend();
		return props[key].value;
	};

	this.setProperty = function (key, value) {
		if (!exists(key)) init(key);

		props[key].value = value;
		props[key].dep.changed();
	};

	this.reset = function () {
		props = {};	
	};
});

