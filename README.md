# Interjs
Inter is a Javascript library designed to build interactive front-end web applications.
It's: **simple**, **intuitive** and **powerful**.

# If you know Javascript, you already know Inter

````html 
<div id="example">
  <p>Hey, { message }</p>
</div> 

````

```javascript
toHTML({
in:"example",
data:{
message:"i program in Inter!"
},
react:"change"
})
```

# No complex setup

You will not need to do any complex configuration to be up and running in Inter, just import the
lib in top of your page in a script tag, and start building even the most complex web apps.

```html
<script src="https://cdn.jsdelivr.net/gh/DenisPower1/inter@1.0.1/Inter.js"><script>
```

# There is no directives

Directives are good for simple interactivities, but in complex situations
it's weaknesses is obvious, rather than use directives,  *Inter* use just the *Javascript*
that you already Know.

```html
<div id="conditional-rendering">
  <p>Hey</p>
</div>
```
```javascript
// A reactive object
const reactive={
rendered:false
}

Inter.renderIf({
in:"conditional-rendering",
watch:reactive,
conditions:[{
index:0,
render(){
if(reactive.rendered){

return template({
elements:[{
tag:"p", text:"I'm a conditional tag!"
}]
})
}
}
}]
})
```
Go to the console and set:

```javascript
reactive.rendered=false;
```

And you'll see the magic!

# You rarely touch in the *DOM*

Almost every dom manipulation in an Inter app are handled by Inter, you  must just focus in your application logic, this way your code base will be:

* Simpler
* Intuitive
* Maintanaible

# Reactivity

*Inter* is super reactive.

# Compatibility

*Inter* just supports the modern browsers, it's mean that no Internet Explorer support.

# Lincense

*Inter* was realesed under the MIT LICENSE.

# Guide

To get an in-depth guide just read the official tutorial at [tutorial](http://interjs.epizy.com/v1/tutorial/instalacao)

