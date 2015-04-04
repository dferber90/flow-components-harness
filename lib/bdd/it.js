/* global it:false */
'use strict';

it.boolean = function (propName, func) {
	var spec = it(propName, func || function () {});
	var meta = spec.meta;
	meta.type = 'boolean';
	meta.propName = propName;
	return spec;	
};

it.radio = function (propName, options, func) {
	var spec = it(propName, func || function () {});
	var meta = spec.meta;
	meta.type = 'radio';
	meta.propName = propName;
	meta.options = options;
	return spec;
};

it.text = function (propName, func) {
	var spec = it(propName, func || function () {});
	var meta = spec.meta;
	meta.type = 'text';
	meta.propName = propName;
	return spec;
};

/*

// props can contain child-components that are rendered into
// the actual component
it.component = function (propName, func) {
	// 
	var spec = it(propName, func || function () {});
	var meta = spec.meta;
	meta.type = 'component';

};
*/
