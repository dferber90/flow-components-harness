/* global
	BDD:true,
	props: false,
	ti: false,
	Random: false
*/
/* jshint strict:false */

var __component;
var __componentDep = new Tracker.Dependency();

var dynamicProperties = props();

var Harness = {
	optionFns: [],
	optionFnsDep: new Tracker.Dependency(),

	setOption: function (key, value) {
		if (_.contains(this.optionFns, key)) {
			dynamicProperties.setProperty(key, value);
		} else {
			__component[key] = value;
			__componentDep.changed();
		}

	},

	getOption: function (key) {

		__componentDep.depend();

		if (_.contains(this.optionFns, key)) {
			return dynamicProperties.getProperty(key);
		} else {
			return __component[key];
		}

	},

	initOptionFn: function (key, value) {
		this.optionFns.push(key);
		dynamicProperties.setProperty(key, value);
		this.optionFnsDep.changed();
	},

	clearOptionFns: function () {
		dynamicProperties.reset();
		this.optionFns = [];
		this.optionFnsDep.changed();
	},

	toPrintValue: function (value) {
		var printValue;
		if (_.isBoolean(value)) {
			// "false" is not be displayed if it is not converted to a string
			printValue = value ? 'true' : 'false';
		} else if (_.isFunction(value)) {
			printValue = 'Function';
		} else {
			printValue = value;
		}

		return printValue;
	},

	convertMetaOptions: function (meta) {
		return _.map(meta.options, function (value) {
			return {
				uniqueId: Random.id(),
				propName: meta.propName,
				value: value
			};
		});	
	}

};


var Suite = {

	get: function (suiteId) {
		var rootId = BDD.suite.uid();
		if (suiteId === rootId) return BDD.suite;

		return BDD.suite.findOne({uid: suiteId});
	},

	getCurrent: function () {
		return this.get(Session.get('currentSuite'));
	},

	reset: function () {
		Session.set('currentSuite', BDD.suite.uid());
		__component = false;
		__componentDep.changed();
		Harness.clearOptionFns();
	},

	run: function (suite) {

		// execute before()
		var before = suite.before;

		if (before && before.length) {
			BDD.runMany(before, {
				'this': {
					load: function (componentName, options, optionFn) {
						var d = _.extend({
							id: 'playground',
							component: componentName
						}, options);

						_.each(optionFn, function (value, key) {
							Harness.initOptionFn(key, value);
						});

						__component = d;
						__componentDep.changed();
					},

					setOption: function (key, value) {
						Harness.setOption(key, value);
					}
				},
				'throw': true
			});
		}
	},

	runCurrent: function () {
		this.run(this.getCurrent());
	}
};

// to access the private properties of the 'control under inspection,
// the FlowComponentsHarness has to be a component itself.
FlowComponents.define('FlowComponentsHarness', function () {});

Session.setDefault('currentSuite', BDD.suite.uid());

Template.FlowComponentsHarness.onCreated(function () {
	var self = this;

	self.data.componentInfo = new ReactiveVar();

	this.autorun(function () {
		var info = {
			options: false,
			reactiveOptions: false,
			state: false,
			actions: false
		};

		__componentDep.depend();
		var component = __component;
		var $component;

		try {
			$component = FlowComponents.find(component.component);
		} catch (e) {
			return info;
		}

		var componentData = _.omit(component, 'id', 'component');
		info.options = _.map(componentData, function (value, key) {
			return {key: key, value: Harness.toPrintValue(value)};
		});

		info.reactiveOptions = _.map(Harness.optionFns, function (key) {
			var value = dynamicProperties.getProperty(key);

			return {key: key, value: Harness.toPrintValue(value)};
		});

		info.state = _.map($component.state, function (value, key) {
			return {key: key, value: Harness.toPrintValue(value)};
		});

		info.actions = _.map($component.action, function (value, key) {
			return key;
		});

		self.data.componentInfo.set(info);
	});
});

Template.FlowComponentsHarness.helpers({
	suite: function () {
		return Suite.getCurrent();
	},

	parent: function () {
		var suite = Suite.getCurrent();

		return suite.parent && suite.parent.name;
	},

	isTopLevel: function () {
		var suite = Suite.getCurrent();

		return !suite.parent;
	},

	hasComponent: function () {
		__componentDep.depend();
		return !!__component;
	},

	suites: function () {
		var suites = Suite.getCurrent().suites();

		return _.filter(suites, function (suite) {
			return !suite.isSection;
		});
	},

	sections: function () {
		var suites = Suite.getCurrent().suites();
		return _.filter(suites, function (suite) {
			return suite.isSection;
		});
	},

	specs: function () {
		return Suite.getCurrent().specs();
	},

	componentInfo: function () {
		return ti().data.componentInfo.get();
	},

	equal: function (x, y) {
		return x === y;
	},

	getSpecData: function () {
		var data = this;

		if (data.meta.propName) {
			__componentDep.depend();
			var component = __component;

			switch (data.meta.type) {
			case 'boolean':
				data.meta.value = component[data.meta.propName];
				break;
			case 'radio':
				data.meta.value = component[data.meta.propName];
				break;
			}
		}

		return data;
	}
});


Template.FlowComponentsHarnessPlayground.helpers({
	getStyle: function (style) {
		return _.map(style, function (value, key) {
			return [key, ': ', value].join('');
		}).join(';');
	},

	component: function () {
		__componentDep.depend();
		var c = __component;

		if (!c) return undefined;

		Harness.optionFnsDep.depend();

		_.each(Harness.optionFns, function (key) {
			c[key] = function () {
				return dynamicProperties.getProperty(key);
			};
		});

		return c;
	}
});


Template.FlowComponentsHarness.onCreated(function () {
	this.autorun(function () {
		Suite.runCurrent();
	});
});

Template.FlowComponentsHarness.onRendered(function () {
	var animateClassHeading = 'animated fadeInDown';
	var animateClassList = 'animated fadeInLeft';
	var transitionEnd = [
		'webkitAnimationEnd',
		'mozAnimationEnd',
		'MSAnimationEnd',
		'oanimationend',
		'animationend'
	].join(' ');


	var headingText = this.$('#fch-suite-heading-text');
	headingText.on(transitionEnd, function () {
		headingText.removeClass(animateClassHeading);
	});

	var suiteList = this.$('#fch-suite-list');
	suiteList.on(transitionEnd, function () {
		suiteList.removeClass(animateClassList);
	});

	this.autorun(function () {
		Session.get('currentSuite'); // register the dependency

		headingText.addClass(animateClassHeading);
		suiteList.addClass(animateClassList);
	});
});

Template.FlowComponentsHarness.events({
	'click [data-action="suite/set"]': function () {
		Session.set('currentSuite', this.uid());
	},

	'click [data-action="suite/parent"]': function () {
		Suite.reset();
		Session.set('currentSuite', this.parent.uid());
	},


	'click [data-action="spec/run"]': function () {
		BDD.run(this, {
			this: {
				component: function () {
					__componentDep.depend();
					var component = __component;
					return FlowComponents.find(component.component);
				}
			},
			throw: true
		});
	},

	'click [data-action="component/reset"]': function () {
		__component = false;
		Harness.clearOptionFns();
		__componentDep.changed();
		// suite will automatically rerun because dep changed.
	},

	'click [data-action="property/boolean/set"]': function () {
		var currentValue = Harness.getOption(this.meta.propName);
		Harness.setOption(this.meta.propName, !currentValue);
	},

	'click [data-action="property/radio/set"]': function () {
		Harness.setOption(this.propName, this.value);
	},

	'blur [data-action="property/text/set"], keyup [data-action="property/text/set"]': function (e) { //jshint ignore:line
		var value = e.currentTarget.value;
		Harness.setOption(this.meta.propName, value);
	}
});


Template.FlowComponentsHarnessSpec.helpers({
	booleanValue: function (propName) {
		return Harness.getOption(propName);
	},

	getMetaOptions: function () {
		return Harness.convertMetaOptions(this.meta);
	},

	isRadioChecked: function () {
		return Harness.getOption(this.propName) === this.value;
	},

	getSpecId: function () {
		return Template.parentData(1).uid();
	},

	getOption: function (key) {
		return Harness.getOption(key);
	}
});

Template.FlowComponentsHarnessSpec.events({
	'click [data-action="view/toggle"]': function (e) {
		var caret = $(e.currentTarget).children('.fa');
		var list = $(e.currentTarget).next();

		caret.toggleClass('fa-caret-down fa-caret-up');
		list.toggleClass('hidden');
	}
});
