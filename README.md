
<p align="center">
<a href="http://interjs.epizy.com">
 <img src="https://github.com/DenisPower1/inter/blob/main/Inter.png"
      width="200" 
      >
      </a>
 
 </p>

<div align="center">
 <span align="center">

<a href="https://github.com/DenisPower1/inter/blob/main/LICENSE">
 <img src="https://github.com/DenisPower1/inter/blob/main/license.svg">


<a href="https://github.com/DenisPower1/inter/blob/main/LICENSE">
 <img src="https://github.com/DenisPower1/inter/blob/main/license.svg"

<a href="https://github.com/DenisPower1/inter/blob/main/LICENSE.md">
 <img src="https://github.com/DenisPower1/inter/blob/Edit/license.svg"
      width="100" 
      >
      </a>
 
  </span>
   <span align="center">

<a href="https://github.com/DenisPower1/inter/">


<a href="https://github.com/DenisPower1/inter/">
<a href="https://github.com/DenisPower1/inter/blob/main/LICENSE.md">


 <img src="https://img.shields.io/github/v/release/DenisPower1/inter.svg"
      width="100" 
      >
      </a>
 
 
 </span>
 
</div>
 
<h1 align="center"> <a href="http://interjs.epizy.com">Interjs</a></h1>


 
 

Inter is a Javascript framework designed to build highly interactive front-end web applications.
It's: **simple**, **intuitive** and **powerful**.
#

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
message:"I program in Inter!"
},
react:"change"
})
```

# No complex setup

You will not need to do any complex configuration to be up and running in Inter, just import the
lib in top of your page in a script tag, and start building even the most complex web apps.

```html
<script src="https://cdn.jsdelivr.net/gh/DenisPower1/inter@1.1.3/inter.min.js"><script>
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
// A reactive object.
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
Go head in the console and set:

```javascript
reactive.rendered=true;
```

And you'll see the magic!

# Small

It does not mean that it is less capable, it means that it is easy to learn and cheaper to parse and download.

# You rarely touch in the *DOM*

Almost every dom manipulation in an Inter app are handled by Inter, you  must just focus in your application logic, this way your code base will be:

* Simpler
* Intuitive
* Maintanaible

# Reactivity

*Inter* is super reactive, it means that, when there's a change it just update the necessary part of the interface.

# Compatibility

*Inter* just supports the modern browsers, it's mean that no Internet Explorer support.

# Lincense

*Inter* was realesed under the MIT LICENSE.

# Guide

To get an in-depth guide just read the official tutorial at [tutorial](http://interjs.epizy.com/v1/tutorial/pt/instalacao)

