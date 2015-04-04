# Flow Components Harness

A visual testing tool for [Flow Components](https://github.com/meteorhacks/flow-components).

This tool lets you test Flow Components visually.
Inspired by [Respondly's UI Harness](https://github.com/Respondly/meteor-ui-harness).

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



# License
The MIT License (MIT)

Copyright (c) 2015 Dominik Ferber

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
