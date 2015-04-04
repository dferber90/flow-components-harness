Package.describe({
	name: 'dferber:flow-components-harness',
	version: '0.0.1',
	summary: 'UI tests for Flow Components using BDD style syntax.',
	git: '',
	documentation: 'README.md',
	debugOnly: true
});

Package.onUse(function (api) {
	api.use(['meteor-platform']);
	api.use([
		'meteorhacks:flow-components',
		'reactive-var',
		'random',
		'reactive-dict',
		'less',
		'underscore',
		'dferber:ti',
		'richsilv:stampit'
	], 'client');
	api.use(['respondly:bdd'], ['client', 'server']);
	api.versionsFrom('1.0.4.1');
	api.addFiles([
		'lib/head.html',
		'lib/props.js',
		'lib/bdd/bdd.js',
		'lib/bdd/it.js',
		'lib/FlowComponentsHarness.html',
		'lib/flow-components-harness.js',
		'lib/style.less'
	], 'client');
});
