// this is from respondly:ui-harness

/* global BDD: false */

'use strict';


/*
Initialize common meta data and function extensions
on each [Spec] model at creation.
*/
BDD.specCreated(function (spec) {
	extendModel('spec', spec);
});


/*
Initialize common meta data and function extensions
on each [Suite] model at creation.
*/
BDD.suiteCreated(function (suite) {
	extendModel('suite', suite);
});


var extendModel = function (type, model) {
	model.meta = {};
	model.meta.type = 'regular';
	model.meta.style = {};
};


/*
	Update the [this] context that is passed to the
	"describe" function
*/
BDD.beforeDescribe(function (context) {
	if (Meteor.isClient) {
		context.subtitle = function (value) {
			this.suite.meta.subtitle = value;
		};

		context.style = function (style) {
			this.suite.meta.style = style;
		};
	}
});
