  # English Version

# Interjs
Inter is a Javascript framework designed to build interactive front-end web applications.
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

*Inter* is super reactive, it means that, when there's a change it just update the necessary part of interface.

# Compatibility

*Inter* just supports the modern browsers, it's mean that no Internet Explorer support.

# Lincense

*Inter* was realesed under the MIT LICENSE.

# Guide

To get an in-depth guide just read the official tutorial at [tutorial](http://interjs.epizy.com/v1/tutorial/pt/instalacao)

# Versão em português

# Interjs

Inter é um framework Javascript projetado para construir aplicações web front-end interativas. Ela é **simples**, **intuitiva** e **poderosa**.

# Se você conhece o Javascript, então você já conhece o Inter

````html 
<div id="exemplo">
  <p>Oi, { mensagem }</p>
</div> 

````

```javascript
toHTML({
in:"exemplo",
data:{
mensagem:"eu programo em Inter!"
},
react:"mudar"
})
```

# Sem configurações complexas

Você não vai precisar fazer nenhuma configuração complexa para começar a usar o Inter, apenas importa a biblioteca numa tag script, e comece a construir até mesmo as aplicações web mais complexas.

```html
<script src="https://cdn.jsdelivr.net/gh/DenisPower1/inter@1.1.2/inter.min.js"><script>
```

# Não há diretivas

Diretivas são boas para interactividades simples, mas em situações complexas as suas fraquezas são óbvias, ao invés de usar diretivas, o *Inter* usa apenas o Javascript que você já conhece.


```html
<div id="renderizacao-condicional">
  <p>Hey</p>
</div>
```
```javascript
// Um objecto reativo.
const reativo={
renderizado:false
}

Inter.renderIf({
in:"renderizacao-condicional",
watch:reativo,
conditions:[{
index:0,
render(){
if(reativo.renderizado){

return template({
elements:[{
tag:"p", text:"Eu sou uma tag condicional"
}]
})
}
}
}]
})
```
Vai para o console e defina:

```javascript
reativo.renderizado=true;
```

E você vai ver a mágica.

# Pequeno

Isso não faz do Inter menos capaz, isso faz com que o Inter sege fácil de aprender e mais performático.

# Você difícilmente vai tocar no DOM.

Quase todas manipulações do Dom em uma aplicação Inter é feita pelo Inter, você deve apenas focar na lógica da tua aplicação, dessa forma tua base de código vai ser :

* Mais simples.
* Intuitiva.
* Sustentável.

# Reatividade.

O *Inter* é muito reativo, isso significa quando há mudança, ele apenas atualiza a parte necessária da intercace.

# Compatibilidade

O *Inter* apenas suporta navegadores modernos, isso significa que não há suporte para o Internet explorer.

# Licensa

*Inter* foi lançado sobre a licença de MIT.

# Guia

Para ter um guia mais aprofundado sobre o Inter, é só ler o tutorial oficial em [tutorial](http://interjs.epizy.com/v1/tutorial/pt/instalacao)
