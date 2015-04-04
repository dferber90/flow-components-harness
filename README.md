# Flow Components Harness

A visual testing tool for [Flow Components](https://github.com/meteorhacks/flow-components).

## Guide


## Setup

Create a separate package for each component you want to test.
The separate package will contain the tests for the component under test.

Make sure the package containing the tests
 - is set to `debugOnly: true`.
 - registers a dependency on this package.



## Usage

Add new tests using BDD.

Load the component in the block `before` with `this.load(..)`.

### Methods within Spec

`this.subtitle(String)`
`this.style(Object)`
`this.load(String, Object, Object)`
`this.setOption(String, Literal|Object|Function)`


### It

`it.radio`
`it.boolean`
`it.text`
