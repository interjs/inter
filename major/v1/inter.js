/**
 * Inter.
 * Version: 1.2.10
 * 2021 - 2022 -  by Denis Power.
 * https://github.com/interjs/inter
 * A Javascript framework to build interactive frontend applications.
 * 
 * 
 */




(function(){


    // Some helpers functions.


function isPlainObject(v){

return Object.prototype.toString.call(v)=="[object Object]";

}

function isArray(arr){

   return Array.isArray(arr);

}

function isNumber(n){

   return typeof (Number(n))=="number";

}

 function isCallable(fn){

  return typeof fn=="function"

 }

function valueType(v){

    if(typeof v=="number" 
    || typeof v=="boolean" 
    || typeof v=="string"
    || typeof v=="symbol"
    || typeof v=="undefined"
    ){

        return typeof v;

    }else{

   return Object.type(v);
  

    }


}


function hasOwn(key){

    return key in this; 

}

function isTag(tag){

    return tag instanceof HTMLElement;


}


function hasRef(text){

    const pattern=/{\s*.*\s*}/.test(text);

    return pattern;

 }


function isDefined(v){

  return   !(v==void 0)  

}



function isBoolean(v){
    
    return v==true || v==false;
}

function isInput(target){

    return (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement);


}


const Dev={

    get status(){

        return _global.app.status;

    }

}

function SyntaxErr(err){

    if(Dev.status=="production"){
       
        return false;

    }else{

    throw new SyntaxError(err)
}

}

function Warning(err){
    if(Dev.status=="production"){
        return;
    }
    if(Dev.status=="development"){
    throw new TypeError(err)
}

}

function getId(id){
    if(document instanceof Document){
const theId=document.getElementById(id);
if(theId== void 0){
    SyntaxErr(`
    There is not an element by id "${id}" on the document.
    `)

}else{

return theId;
}
    }else{
        return void 0;
    }
}


function consoleWarnig(msm){

    if(Dev.status=="production"){
        return;
    }
    
    console.warn(msm)
}

function TEXT(node){
    if(document instanceof Document){
    return document.createTextNode(node);

}else{

    return void 0;
}
}

function hasAttr(el, attr){
    if(el!=void 0){
    if(isElement(el)){
        return el.hasAttribute(attr);
    }
}else{
    return false;
}
}

function CreatEL(EL){
    if(document instanceof Document){
    return document.createElement(EL)
}else{
    return void 0;
}
};

function setAttr(el,attr, value){

    
    if(!isTag(el)){

      return void 0;

    }else{
 
        return el.setAttribute(attr, value)
}

}

function getAttr(el, attr){

    if(!isTag(el)){

         return void 0;

   }else{

    return el.getAttribute(attr);

}

}

function toString(obj){

    return Object.prototype.toString.apply(obj, void 0);

}

/**
 * In some cases, using indirect checking can cause unexpected result, that's why I used 
 * direct checking.
 * 
 */

function isTrue(value){

return value==true;

}

function isFalse(value){

    return value==false;

}


//Adding some methods in Object constructor.

Object.destroyAll=(obj)=>{

    const keys=Object.keys(obj);

    for(let key of keys){

     delete obj[key];

    }

}



Object.type=(obj)=>{

    if(isPlainObject(obj)){

        return "object"

    }
    if(Array.isArray(obj)){

        return "array"

    }

    if(obj==void 0){

        return "null";

    }

}


/**
 * Adding the getTextNodes to the Node.prototype.
 * It will be a read-only property used to get
 * all textNodes of the target, it is used to help
 * the parser to parse the reference in the main element textNodes
 * when the main element has also elementNodes.
 * 
 * <div id="test">
 * { greating }, <strong>Inter!</strong>
 * 
 * </div>
 * 
 * 
 * toHTML({
 * in:"test",
 * data:{
 * greating:"Bonjour"
 * }
 * })
 * 
 * Prior to Inter v1.2.6 the parser could not parse the reference in textNode.
 * 
 */


Object.defineProperty(Node.prototype,"getTextNodes",{

    get(){

        const textNodes=new Set();

        if(this.hasChildNodes()){

            for(let child of this.childNodes){

                if(child.nodeType==3 && hasRef(child.textContent)){

                    textNodes.add(child)

                }

            }

        }

        return array.create(textNodes)

    }

} )


const _global=globalThis ? globalThis : window;

//Special for routing.
const validPath=/^\/(:?[\s\S]+)|\/$/;
function isButtonOrAnchor(tag){

return lowerCase.call(tag.nodeName)=="a" || lowerCase.call(tag.nodeName)=="button";

}





function getRoutingTag(){ 

    const tS=toString(this);

    if(tS=="[object Window]"){

        // No <body> tag.

        return;

    }


    



    const children=this.getElementsByTagName("*");

    for(let child of children){
        if(isButtonOrAnchor(child) && hasAttr(child, "setPath")){
            child.setpath=getAttr(child,"setPath");
            child.removeAttribute("setPath");
            
            child.onclick=function(ev){

                
                     ev.preventDefault();

            const routeTo=this.setpath;
            if(validPath.test(routeTo)){

            url.setPath(routeTo);  

            }else{
                SyntaxErr(`
                A valid pathName must start with /.
                `)
            }
        }


    }

	else if(isButtonOrAnchor(child) && hasAttr(child,"useHash")){
        child.setpath=getAttr(child,"useHash");
        child.removeAttribute("useHash");
        
	child.onclick=function(ev){

        
        ev.preventDefault();
        
		const routeTo=this.usehash;
		if(validPath.test(routeTo)){
			url.useHash(routeTo);
			
		}else{
			 SyntaxErr(`
                A valid pathName must start with /.
                `)
			
		}
		
    
    }
    

		
	}

}

    }







function notEqual(first,second){
 
    return !(Object.is(first,second));

}



const private=Symbol("StrictRed");

const StrictRef={
[private]:Object.create(null),
create(key){
    return this[private][key]=array.create(null);
},
set(key,obj){
     this[private][key].push(obj)
  
    },
get(key){
return this[private][key];

},
has(key){
    return key in this[private];
},

reConstroy(key, pro,value){
 let _key=this.get(key);
 for(let k of _key){
     const{
         text,
         target,
         refs
     }=k;
    
     if(hasOwn.call(refs,pro)){
         refs[pro]=value;
     }
     let plainText=text;
     let references=Object.getOwnPropertyNames(refs);
     for(let r of references){
        const match=new RegExp(`{\(\:?\\s+)\*\(\:?${r})\(\:?\\s+)\*}`,"g");
         plainText=plainText.replace(match, refs[r]);

         if(!hasRef(plainText)){

            //If there's no more reference to parse
            // We should break the loop to avoid unnecessary
            //computation.

            break;

         }

     }
     target.textContent=plainText;
     }
}

}
function ARRAY(){

}

ARRAY.prototype={

    create(arr){
if(arr==null){
    
    return new Array();

}else{

    return Array.from(arr);

}

    },


shareItens(root,reciever){

for(let share of root){
    reciever.push(share);
}

},
destroy(_array){

   let length=_array.length; 
 while(length--){

     _array.pop();

 }

}

}
var array=new ARRAY();

//As Inter store a lot of data in memory, it can cause memory lack, so let's manage it.

const memory={
    
    handleMemory:new Set(),
    
    addCont(container){

        this.handleMemory.add(container);
        
    },

    has(container){


        return this.handleMemory.has(container);

    }


    
    

}





// The default app.status value.

let _status="development"


const app={
    get version(){

        return "1.2.10"

    },

    set status(v){

        if(_status=="production"){

            return void 0;

        }

        if(v=="development"){

            return void 0;

        }

        if(v=="production" ){
        
        console.log(`The app is now in production, every error will be
        hidden.
        `)
        
      _status=v;

    }else{
  
     throw new Error(`
        "${v}" is an invalid value for the app.status property.
     `)

    }
},

get status(){
 
    return _status;

}
}
    
Object.preventExtensions(app);



function supportInter(){

    if(new.target!=void 0){

        SyntaxErr(`
        
        Do not call the "supportInter()" function with the "new" keyword,
        just invoke it like that: supportInter()
        
        `)

    }

    try{
        let map=new Map()
        map.set("framework", "Inter");
        map.set("Creator", "Denis");
        map.clear();
        return true;
    }catch(e){
        return false;

    }

}




  /**
 * Changing the onload method, for inputHandler be more performant.
 * 
 */


 Object.defineProperty(window, "onload", {
     set(key){

   this.addEventListener("load",(ev)=>{
  if(app.status=="development"){
     
    console.log("You're using Inter in development mode, when you deploy your app turn on the production mode.")
  
}
    InputHandler();

    if(isCallable(key)){
    
        key(ev)
    
    }

   })
     }
    
    
 })
 
window.onload=()=>{
    InputHandler();
}


 class HTML{
     constructor(){

     }

  
   addHTML(obj){
       
       if(!isPlainObject(obj)){
         SyntaxErr(`
         The argument passed in the method AddHTML must be a plain object.
         `);  
       }else{
       const{in:IN,
    elements
    }=obj;
    const root=getId(IN);
       elements.forEach((el)=>{
       const{
           tag,
           text,
           children=[],
           attrs={},
           events={}
       }=el;

       if(tag==void 0){

        return false;

       }
      


         let _el=CreatEL(tag)

        Object.entries(attrs).forEach(attr=>{
            const[attribute,value]=attr;
            setAttr(_el,attribute,value);
        })

        Object.entries(events).forEach(event=>{
            const[ev,trigger]=event;
            _el[ev]=trigger;

        root.appendChild(_el);
      
    
    })

    if(text!=void 0 && children.length==0){

        if(isCallable(text)){
       if(text()!=void 0){
        _el.appendChild(
          
                   TEXT(text())


        )

    }
}else{
    

    _el.appendChild(TEXT(text))

    }

   
       
    }

    if(children.length>0){

        createChildren(_el,children)

    }

    root.appendChild(_el)

})



   
    
}
   }
 }


var validator={
    url:function(u){
   if(!isDefined(u)){

    SyntaxErr("The argument of validate.url() method must not be null or undefined.")

   }

 return   /^(?:http:\/\/|https:\/\/)+(:?[A-Z]{2,8}\.)*(:?[a-z]+)+\.+(:?[a-z]{2,8})+(:?[\s\S])*$/i.test(u);
   
},
    email:function(em){
        if(!isDefined(em)){


            SyntaxErr("The argument of validate.email() method must not be null or undefined.")

        }
     return   /^(?:[A-Z]+)+(:?[0-9]+)*@+(:?[A-Z]+)\.[A-Z]+$/i.test(em)
    },
  
 
    
}

var validate=new Proxy(validator,{
    set(Target, key, value, pro){
        if(key=="url" || key=="email"){
        Warning(`
        You can not overwrite built-in methods
        `);
        return false;    
        }else{
        return    Reflect.set(Target, key, value, pro)
        }
    },
    deleteProperty(Target, key){
        if(key=="url" || key=="email"){
            Warning(
                `
                You can not delete built-in methods
                `
            );
            return false;
        }else{
            return Reflect.deleteProperty(Target, key)
        }
    }
})




const INTER=new HTML();
const Inter=new Proxy(INTER,{
  
    set(...values){
        SyntaxErr(`You can not set any property in Inter object,
        this is a fatal action.
        `);
        return false;
    },
    deleteProperty(...values){
        SyntaxErr(`Fatal error: do not try to delete any property of Inter object`);
        return false;
    },
    getPrototypeOf(Target){
        return null;
    },
    setPrototypeOf(...values){
        return false;
    },
  
})

const lowerCase=String.prototype.toLowerCase;



Object.defineProperties(INTER,{

    [Symbol.hasInstance]:{


        get(){

            return false;

        }

    },

    [Symbol.toStringTag]:{

        get(){

            return "Inter";

        }

    }

})


function $DATA(){
    this.query=function(obj){
        /**
         * search.query({
         * in://A array of object.
         * setting:{
         * applyTo://the reciever.
         * value://The value to search;
         * query:keyword,
         * }
         * 
         * })
         * 
         */
if(!isPlainObject(obj)){
SyntaxErr(`
The argument in data.query() must be an object.
`)
}else{
    const{
      in:IN,
      setting,  
    }=obj;
    const{
        applyTo,
        value,
        query
        
    }=setting;
   if(!isPlainObject(setting)){
       SyntaxErr(`
       Setting must be an object.
       `)
   }
    if(!isArray(IN) || !isArray(applyTo)){
        SyntaxErr(`
        The in=>target and the applyTo=>reciever properties must be array.
        `)
    }
let filtered=IN.filter(item=>{
    if(!hasOwn.call(item,query)){
    console.log(`It's was not found a property called "${query}" in target object, in data.query()`)
    }
    const keyword=item[query];
let lower=lowerCase.call(keyword);
   if(lower.includes(lowerCase.call(value))){
       return item;
   }
})

   array.destroy(applyTo)
   if(value==="" ){
       return false;
   }else{
 array.shareItens(filtered,applyTo);
}
}
}
}

const data=new $DATA();

Object.defineProperty(data,"query", {
    enumerable:!0,
    value:data.query,
})

Object.freeze(data)





function whileLoading(obj){
   if(new.target!==void 0){
       SyntaxErr(`
       You must not create an instance for whileLoading() function, call it
       whileLoading(argument(object)). 
       `)
   }
   if(!isPlainObject(obj)){
       SyntaxErr(`
         The argument of whileLoading() function must be an object.
       
       `)
   }else{


    const{
      elements,  
      
    }=obj;

    let elArr=[...elements]

   let root=null;
  
   
   elArr.forEach(el=>{
       const{
           tag,
           text,
           attrs={},
           events={},
           children=[],
           styles={}

           
       }=el;
     
       const _el=CreatEL(tag);

       Object.entries(attrs).forEach(attr=>{
           const[attrName,attrValue]=attr;
           setAttr(_el,attrName,attrValue);
       })
       Object.entries(events).forEach(ev=>{
           const[evName,evValue]=ev;
           _el[evName]=evValue;
       })

       Object.entries(styles).forEach(style=>{

        const [name, value]=style;

        if(isCallable(value)){

            _el.style[name]=value();

        }else{

            _el.style[name]=value;

        }


       })

       if(isDefined(text) && children.length==0){

          if(isCallable(text)){

            _el.appendChild(TEXT(text))

          }else{


            _el.appendChild(TExt(text));

          }

       }

       if(children.length>0){

        createChildren(_el, children);

       }



       root=_el;
       document.body.appendChild(_el);
       
   })
   
   
   document.onreadystatechange=function(){

       if(this.readyState=="complete"){

           this.body.removeChild(root);

       }

   }
 
 
}

}


const storeRef={
    refHandler:Object.create(null),
    has:function(RefName){
  return RefName in this.refHandler;
    },
    get:function(Refname){
        return this.refHandler[Refname]
    },
    addRef:function(RefName, text){
   return this.refHandler[RefName]=text;
    },
    freeAll(){
        return Object.destroyAll(this.refHandler)
    }
}



function isaNodeElement(supposedElement){

  /**
   * This function is being used in:
   * 
   * Inter.renderif()
   * Inter.for()
   * 
   * 
   */

 const pattern=/^\[object HTML+(:?[A-Z]+)+Element\]$/i;
    return pattern.test(supposedElement);
    
}

function hasOnlyAChild(parent){
    return parent.children.length==1;
}


definePro(Inter, "renderIf",(obj)=>{


    /**
     * Inter.renderIf({
     * in:"container",
     * watch:
    * conditions:[{index:0,
     * render(){
     * if(0==0){
     * template({
     * elemets:[{tag:"button", text:"Rendered"}]
     * })
     * }
     * }
     * }]
     * })
     * 
     */


    const insertedElements=array.create(null);
    

    if(!isPlainObject(obj)){
        

        SyntaxErr(`
        
        The argument of Inter.renderIf() method must be
        an object.

        `)

    }else{
        const{
            in:IN,
            watch,
            conditions,
        }=obj;
        

        if(!isPlainObject(watch)){
          
        
           SyntaxErr("You must define the watch proprety and it's value must be an object.") 
               
        
               
            
        }
        
        makeReactive(watch,theWork)
      
        function theWork(){
            const root=getId(IN);
        if(insertedElements.length>0){
        
           insertedElements.forEach((elObj,i)=>{
                const {el, index}=elObj;
               
                root.removeChild(el);
                
                
            })

            array.destroy(insertedElements)
          
        }
    if(!isArray(conditions)){
        SyntaxErr(`
        conditions must be an array.
        `)
    }
    
    [...conditions].forEach((condition,i)=>{
        const{
            render,
            
        }=condition;

       
    
 if(!isDefined(render.call(condition)) && hasOwn.call(insertedElements,String(condition.index))){
          const theElement=root.children[condition.index];
          root.removeChild(theElement);
          delete insertedElements[String(condition.index)];
        }
    
        if(isaNodeElement(render.call(condition))){
             const pos=condition.index;
         
             const defined=root.children[pos];
             if(!isNumber(pos)){
                 SyntaxErr(`
                 The index in Inter.renderIf() must be a number.
                 `)
             }else{
                
                let beforeThis=root.children[pos];
                  if(hasOnlyAChild(root) && !isDefined(condition.replace)){
                      if(pos==0){
                      const theFirstChild=root.children[0];
                      root.insertBefore(render()[0],theFirstChild);
                     insertedElements.push({

                        el:root.children[pos],
                        index:pos

                     });
                    
                 
                       
                      return false;    
                      }
                  }
                  if(isDefined(defined) && isTrue(condition.replace)){
                      root.replaceChild(render()[0],defined);
                      insertedElements.push({
                          el:root.children[pos],
                          index:pos
                      })
                     
                     

                      return false;
                  }
                 if(isDefined(beforeThis)){
                     root.insertBefore(render()[0],beforeThis);
                     insertedElements.push({

                        el:root.children[pos],
                        index:pos,

                     })

                  
                    
                     
                 }else{
                     const allundeepChildren=root.children.length-1;
                     if(allundeepChildren+1==pos){
                   
                root.appendChild(render()[0]);
                
                   insertedElements.push({

                    el:root.children[pos],
                    index:pos

                   })

                  
                   
                     
                     }
           
                     
                    
                     else{
                         SyntaxErr(`Invalid index, it's impossible to render the element at index "${pos}"!
                         `)
                     
                     }
             
        }
    }

         }
  
        

    })
}

    }
   
    
   theWork();
 

})

function TextCleaner(text){
    /**
     * As Javascript engines are more performant nowadays, this will
     * not cause any performance issue.
    */
   
    let _text=[...text];
    _text.pop()
 let newText="";   

 let parser=_text.reduce((acc,value)=>{
  return acc.concat(value);
 },newText)

return parser;

}

class SIMULATE{
    constructor(){
       
    }
   
  typing(obj){
    if(!isPlainObject(obj)){
        
        SyntaxErr(`
        
        The argument of simulate.typing(arg:Object) must be a plain object.
        
        `)
    }else{
       /**
        * semulate.typing({
        * in:"container",
        * setting:[{
        * text:"Hey, I'm Denis the creator of Inter.",
        * speed:100
        * }]
        * }) 
        * 
        *
        */
       
       
     const{
         in:IN,
        setting,
        done
     }=obj;
     
     var root=getId(IN)
     Array.from(setting).forEach(one=>{
       const{
           text,
           speed,
       }=one;
     let txtarr=[...text];
     let i=txtarr[Symbol.iterator]()
    
     
  let Int=setInterval(()=>{
       
    let TXT=i.next().value
      if(TXT!==undefined){
        if(!storeRef.has(root)){
         root.textContent=TXT;
         storeRef.addRef(root, TXT); 
           
        }else{
          root.textContent=`${storeRef.get(root)}${TXT}`;
          storeRef.addRef(root, `${storeRef.get(root)}${TXT}`);  

        }
    }else{
           
           clearInterval(Int)
          if(isCallable(done)){
              return done();
          }
       }
  
      }, Number(speed))
    }  
  
   
    
     )}
}
cleaning(obj){
 
    if(!isPlainObject(obj)){
       SyntaxErr(`
       The value passed as argument in the method cleaning must be an object.
       `)

    }else{
        const{
            in:IN,
            speed,
            done
        }=obj;
        const root=getId(IN)
       
        const arr=[...root.textContent]
        let INT=setInterval(() => {
          arr.pop()  
          
        
           
            root.textContent=TextCleaner(root.textContent);
            
           if(!isDefined(arr[0])){
               
               clearInterval(INT);
               if(storeRef.has(root)){
                   delete storeRef.refHandler[root];
               }
               if(isCallable(done)){
                   done();
               }
           }
            
        }, Number(speed));
    }
}

}

const SIMU=new SIMULATE();
var simulate=new Proxy(SIMU,{
    deleteProperty(...values){
        SyntaxErr(`
        You can not delety any property in
        simulate object
        
        `)
        return false
    },
    defineProperty(...values){
    return false    
    },
    set(...values){
     
          return true
   
    },
    getPrototypeOf(Target){
        return null;
    },
    setPrototypeOf(Target, pro){
    return false;

    }
})

function isEmptyArray(arr){
return arr.length==0;
}





function URL(){
//simulate constructor here

}

URL.prototype.useHash=(pathname)=>{

    if(!validPath.test(pathname)){

        SyntaxErr(`
        pathName must starts with /.
        `)

    }

const atualUrl=window.location.pathname;

if(!isDefined(pathname)){
   
    SyntaxErr("You must define the path of the url.")

};

if(pathname=="/"){
    window.history.pushState(null, null,`/#${pathname}`);
    event.fire("URLCHANGED");
    
    return false;
}
if(pathname!="/" && atualUrl=="/"){
    window.history.pushState(null, null, `/#${pathname}`);
    event.fire("URLCHANGED");
    
    return false;
}else{
    window.history.replaceState(null, null,`/#${pathname}`);
    event.fire("URLCHANGED");
    

}
}

URL.prototype.setPath=(pathname)=>{
 const atualUrl=window.location.pathname;  
 if(!validPath.test(pathname)){
     SyntaxErr(`
     Pathname must starts with /.
     `)
 } 
if(!isDefined(pathname)){

    SyntaxErr(`
    setPath's parameter must not be a null or undefined value.
    `)

}
if(pathname=="/"){
    window.history.pushState(null, null, pathname);
    event.fire("URLCHANGED");
    
    return false;
}
if(pathname!="/" && atualUrl=="/"){
    window.history.pushState(null, null, pathname);
     event.fire("URLCHANGED")
    return false;
}
else{
   window.history.replaceState(null, null, pathname);
   event.fire("URLCHANGED");
   
}

}

const url=Object.freeze(new URL());
      

 
    //For handleValue;
    const SHARE={
        handler:Object.create(null),
         justRegistered(key){
               return key in this.handler        
             }
    }
    
function InputHandler(){
         let container=null;
        
       var allNodes=document.getElementsByTagName("*");

       
     for(let i=0; i<allNodes.length; i++){

    if(hasAttr(allNodes[i], "handleValue")){
        
        if(!isInput(allNodes[i])){
            SyntaxErr(`
            Really? handleValue must be only setted in elements that recieves the value attribute.
            like <input> and <textarea></textarea>.
            `)
        }else{
            if(!hasAttr(allNodes[i], "in")){
                SyntaxErr(`
                in attribute is required.
                `)
            }
            const attr=allNodes[i].getAttribute("handleValue");
            const storeHandlers=array.create(null);
            let findTheOne=getId(getAttr(allNodes[i], "in"));

            if(findTheOne.getTextNodes.length>0){

                for(let textNode of findTheOne.getTextNodes){

                const match=new RegExp(`{\(\:?\\s+)\*\(\:?${attr})\(\:?\\s+)\*}`,"g");

                 if(match.test(textNode.textContent)){

                    const replacer=textNode.textContent.replace(match,"")
                    storeHandlers.push({target:textNode, text:textNode.textContent, input:allNodes[i]})
                    textNode.textContent=replacer;


                 }

                }

            }

            findTheOne=findTheOne.getElementsByTagName("*")

            for(let m=0; m<findTheOne.length; m++){
                const match=new RegExp(`{\(\:?\\s+)\*\(\:?${attr})\(\:?\\s+)\*}`,"g");
                if(match.test(findTheOne[m].textContent)){
                  let target=findTheOne[m];
                  if(containChild(target)){
                      
                      let parent=target.childNodes;
                      for(let node of parent){
                 const match=new RegExp(`{\(\:?\\s+)\*\(\:?${attr})\(\:?\\s+)\*}`,"g");
                   if(match.test(node.textContent)){
                     const replacer=node.textContent.replace(match,"")
                    storeHandlers.push({target:node, text:node.textContent, input:allNodes[i]})
                   node.textContent=replacer;
                            }
                      }
                  }else{
                      const replacer=target.textContent.replace(match, "");
                      storeHandlers.push({target:target, text:target.textContent, input:allNodes[i]})
                      target.textContent=replacer;
                    }
                    
                }}
        
          const IN=getAttr(allNodes[i],"in");
          container=IN;
          if(!SHARE.justRegistered(IN)){
              
          SHARE.handler[IN]=array.create(null);
          array.shareItens(storeHandlers,SHARE.handler[IN]);
          array.destroy(storeHandlers)
          }else{
              array.shareItens(storeHandlers,SHARE.handler[IN])
          }
       
           allNodes[i].oninput=(ev)=>{
            let newArray=SHARE.handler[IN]
           
           for(let child of newArray){
               const{
                   target,
                   text,
               }=child;
               const match=new RegExp(`{\(\:?\\s+)\*\(\:?${attr})\(\:?\\s+)\*}`,"g");
               if(match.test(text)){
               let takeAway=text.replace( match,ev.target.value);
               target.textContent=takeAway;
           }
        }
         }

        
        
    }
   
     }
  
    
    }
    

event.fire( `handler${container}`)

}

function InterpretBuildingTimeRef(obj){
const{
    refName,
    refValue,
    refContainer,
    
}=obj;

const children=getId(refContainer).getElementsByTagName("*");
const match=new RegExp(`{\(\:?\\s+)\*\(\:?${refName})\(\:?\\s+)\*}`,"g");
for(let child of children){
if(hasUndeepChild(child)){
const nodes=child.childNodes;
for(let node of nodes){
  if(match.test(node.textContent)){
      HTMLRegistry.add(refContainer,{
          target:node,
          text:node.textContent,
      });
    const replacer=node.textContent.replace(match,refValue)
    StrictRef.set(refContainer,{
        target:node,
        text:node.textContent,
        refs:{
            [refName]:refValue,
        }
    })  
     node.textContent=replacer;  
}  
}    
}else{
  if(match.test(child.textContent)){
    HTMLRegistry.add(refContainer,{
        target:child,
        text:child.textContent,
    });
    const replacer=child.textContent.replace(match,refValue);
   
    StrictRef.set(refContainer,{
        target:child,
        text:child.textContent,
        refs:{
            [refName]:refValue,
        }
    })  
    child.textContent=replacer;
}  
}
}

//Let's find if there's any reference into attributes values.

for(let lookRef of children){
    const attributes=lookRef.attributes;
    for(let i=0; i<attributes.length; i++){
        if(match.test(attributes[i].value)){
            HTMLRegistry.add(refContainer,{
                target:lookRef,
                attrName:attributes[i].name,
                attrValue:attributes[i].value,
            });
            const replacer=attributes[i].value.replace(match,refValue);
            if(attributes[i].name!="value"){
                setAttr(lookRef, attributes[i].name, replacer);
            }else{
                lookRef.value=replacer;
            }
        }
    }
}

}

//ajax 

function BACKEND(){


}

const toUpperCase=String.prototype.toUpperCase;



BACKEND.prototype.request=function(obj){

const pro=window.location.protocol;



if(pro=="file:"){

    Warning(`
    
    You can not use the backend.request() method
    in an "file:" protocol, use a "http:" or "https:" protocol instead.

    `)

}

    /**
     * type,
     * requestName,
     * events,
     * headers,
     * body
     */
    const back_R_OBJ={
        _set(method,fn){
         this[method]=fn;
        },
       
          okay:null,
          error:null,
          
    }

   if(!isPlainObject(obj)){

       SyntaxErr(`
       
       The argument of backend.request()
       must be an object and not: ${valueType(obj)}

       
       `)

   }
    

    const{
           type,
           path,
           events={},
           headers={},
           body,
           security={},
           timeout,
           withCridentials,
       }=obj;
      

       const _request={

           get [Symbol.toStringTag](){

            // [obejct Ajaxresponse];

            return "Ajaxresponse";

           },

           get status(){

            return theRequest.status;

           },


           get statusText(){

            return theRequest.statusText;

           },

           

           isObj(){

            try{
                JSON.parse(theRequest.responseText);
                return true;

            }catch(e){

                return false;

            }

           },

          get headers(){

            

            return theRequest.getAllResponseHeaders()
            

          },
         


       }

       const AllowedAjaxEvents={
         
         ontimeout:true,
         onabort:true,
         onprogress:true,


       };
 
       let theRequest=new XMLHttpRequest();

       
      
       function REQUEST(){
        
        if(isDefined(timeout)){
      
            
            

            if(!isNumber(timeout)){
    
                consoleWarnig(`
                
    
                The timeout property's value must be a number,
                and you defined ${valueType(timeout)} as its value.
    
                `)
    
            }else{
    
                theRequest.timeout=timeout;
                
    
            }
    
           }
      
       if(isTrue(withCridentials)){

           theRequest.withCredentials=true;

       }
       
       
       const method=toUpperCase.call(type);

    if(emptyOBJ(security) || !isDefined(security)){

       theRequest.open(method,path,true);

    }else{
        if(isPlainObject(security) && security.username && security.password){

            theRequest.open(method,path,true,security.username,security.password);
        
        }
    }
       Object.entries(headers).forEach(header=>{

           const[name,value]=header;
           theRequest.setRequestHeader(name,value);

       });

        Object.entries(events).forEach(event=>{

           const[evName,evValue]=event;
       
           if(!(lowerCase.call(evName) in AllowedAjaxEvents)){

            Warning(`
            
            "${evName}" is an unrecognised backend.request() event.
            `
            )

           }

           

           if(isCallable(evValue) && lowerCase.call(evName) in AllowedAjaxEvents){
                

           

               
               theRequest[evName]=function(ev){

                if(evName=="onprogress"){
                   const percentage=Math.round(ev.loaded*100/ev.total);
                      
                evValue(percentage);
                
               }else{

                evValue();

               }

            }
               
            
           
            }
       })
    
       theRequest.onload=function(){
          //Parsing the response.
           let response=null;
     
         

             try{
               
               response=JSON.parse(this.responseText)
               
               if(this.status!==200){

                if(isCallable(back_R_OBJ.error)){
                     
    
                    back_R_OBJ.error.call(_request,response)
    
               
                }
    
                return false;
                

               }
               
               if(isCallable(back_R_OBJ.okay)){

                back_R_OBJ.okay.call(_request,response);

               } 
            }catch(e){
                 response=this.responseText;

                 if(this.status!==200){

                    if(isCallable(back_R_OBJ.error)){
                         
        
                        back_R_OBJ.error.call(_request,response)
        
                   
                    }
        
                    return false;
                    
    
                   }


                 if(isCallable(back_R_OBJ.okay)){

                    back_R_OBJ.okay.call(_request,response);

                   }
                
               
        }
    }
           theRequest.onerror=function(){
            if(isCallable(back_R_OBJ.error)){

                

            back_R_OBJ.error.call(_request, this.statusText);
           
        }
           }
        
           
           
       if(method=="GET"){

           theRequest.send(null);

       }else{
           if(isDefined(body)){

               theRequest.send(body);

           }
       }
    

       
   }
   
 
   
   
   return {
    okay(fn){
    
     if(!isCallable(fn)){
         SyntaxErr(`
         The argument of okay response method must be a function.
         `)
     }else{
         back_R_OBJ._set("okay",fn);
         REQUEST();
         
     }
    },
    error(fn){
     if(!isCallable(fn)){
         SyntaxErr(`
         The argument of error response method must be a function.
         `)
     }else{
         back_R_OBJ._set("error",fn);
         REQUEST();
         
     }
    },
    response(okay,error){
       if(arguments.length<2){
           SyntaxErr(`
           backend.request().response() must have two arguments.
           `)
       }
       if(!isCallable(okay) || !isCallable(error)){
         SyntaxErr(`
         The arguments of backend.request().response() must be functions.
         `)
       
    }else{
        
         
     
         back_R_OBJ._set("okay",okay);
         back_R_OBJ._set("error",error)
         REQUEST();
     }
    
}

   
}
}
const backend=Object.freeze(new BACKEND());



 const globalNativeEventListener={

 }
 const GlobRef={
     protectedListener:Object.create(null),
     ref:Object.create(null),
     add:function(EvName, fn){
 this.ref[EvName]=fn;
     }
 }
 const GlobalNativeEventListener=new Proxy(globalNativeEventListener,{
    set(Target, key, value, proto){    
   
       if(key in GlobRef.ref){
         
          GlobRef.ref[key](value);  
       }
   
}})

 function EVENT(){
     
     this.fire=(evName,info)=>{
         if(!isDefined(evName)){
             SyntaxErr(`
             You must define the event's name.
             `)
         }
        if(isDefined(info)){ 

            if(this.hasListener(evName)){

        GlobalNativeEventListener[evName]=info;      

        return true;

            }else{

                return false;

            }

        }else{
            
            if(this.hasListener(evName)){

             GlobalNativeEventListener[evName]=void 0;
     
             return true;
             
        }else{

            return false;

        }
    }
     };
     this.listen=(evName, callback)=>{
         if(evName==void 0){

            SyntaxErr("The first argument of event.listen() must be defined(the event's name).")

         }
         if(!isCallable(callback)){
             SyntaxErr(`
             The second argument of event.listen() must be a function.
             `)
         }
         if(hasOwn.call(GlobRef.ref,evName)){
       
            return false;
       
            }else{

       GlobRef.add(evName, callback);   
       return true;

         }
 };

 this.removeListener=(evName)=>{
if(!isDefined(evName)){
    SyntaxErr(`
    You must define the event's name that you want to remove its listener.
    `)
}
else if(!hasOwn.call(GlobRef.ref,evName)){
    consoleWarnig(`
    Ops, you are trying to delete a listener that  does not exist!
    Listener: [${evName}].
    `)

    return false;

}
else if(hasOwn.call(GlobRef.protectedListener,evName)){
    SyntaxErr(`
    The listener of "${evName}" is protected, you can not remove it.
    `)
}
else{
    return delete GlobRef.ref[evName];
}
 };

 this.protectListener=(evName)=>{
if(!hasOwn.call(GlobRef.protectedListener,evName)){
    GlobRef.protectedListener[evName]=true;
    return true;
}else{
    
    consoleWarnig(`The listener of "${evName}" is already protected. `);

    return false;

}
 };

 this.hasListener=(evName)=>{
     if(hasOwn.call(GlobRef.ref, evName)){
         return true;
     }else{
         return false;
     }
 }



}
 
 const event=Object.freeze(new EVENT());

const ref=new Proxy(Object.create(null),{
set(Target, key, value, proto){
    if(key in ref){
      return "Inter here"
    }else{
       return Reflect.set(Target, key, value, proto);
    }
}

})



function definePro(obj, pro, value){
    return Object.defineProperty(obj,pro,{
       value:value,
       enumerable:!0
    })
}

const HTMLRegistry={
    handler:{ 
    
    },
    get(name){

        return this.handler[name];

    },
    has(name){

        

        return (name in this.handler);

    },

    add(key,obj){

        

        return this.handler[key].push(obj);

    },
    
    create(propName){
       if(propName in this.handler){
           
         return false  //doNothing
       } else{
           
 this.handler[propName]=array.create(null);
    }
}
}

function emptyOBJ(obj){

return Object.keys(obj).length==0;

}
function INDETNTIFY(){
    //
}
function containChild(supposedParent){
return supposedParent.getElementsByTagName("*").length>0 ? true : false;     
}
/**
 * It's not usual.
 * <div>
 * <div></p><!--here a button tag--></p></div>
 * </div
 * 
 */

 


INDETNTIFY.prototype.each=(el,key,parent, allWorkIsDone)=>{

if(containChild(el)){
    
const element=el.childNodes;

for(let nested=0; nested<element.length; nested++){
    if(element[nested]=="[object Text]"){
        const match=new RegExp(`{\(\:?\\s+)\*\(\:?${key})\(\:?\\s+)\*}`,"g");
        if(match.test(element[nested].textContent)){
        
   whatToChange.push({text:element[nested].textContent, target:element[nested]});
  
}
}
}

}else{
    const match=new RegExp(`{\(\:?\\s+)\*\(\:?${key})\(\:?\\s+)\*}`,"g");
    if(match.test(el.textContent)){
    
whatToChange.push({target:el, text:el.textContent})

    }
}

if(allWorkIsDone){
   newREF.set(parent,whatToChange);
   
};

/**
 * whatToChange=[{text:"exemple {el}", target:PHTMLELEMENT,parent:parentName},//someOthers];
 * 
 */
}
const whatToChange=array.create(null);  
let indentify=new INDETNTIFY();

const handle_Value_Attr={
    handle:Object.create(null),
    set(ref,target){
       return this.handle[ref]=target;
    },
    get(ref){
        return this.handle[ref];
    },
    has(ref){
        return ref in this.handle;
    }
}

function toHTML(obj){
    


    let reactor;

if(!isPlainObject(obj)){

    SyntaxErr(`The argument of toHTML() function must be an object.`)

}else{

      const{
          in:IN,
          data,
          handleValue,
          private,
         react,
      }=obj;

      if(memory.has(IN)){


        
        Warning(`
        
        You've already registered the references
        in the container where the id is "${IN}"
        
        `)

        return false;


      }
     
      if("setRefs" in data){

        SyntaxErr(`
        
        "setRefs" is a reserved property, you can not use it 
        as a reference's name.
        
        `)

      }

      const shared=Object.assign(Object.create(null),data);
     const _data=Object.assign(Object.create(null),data);
      Object.getOwnPropertyNames(data).forEach(prop=>{
        
          if(isCallable(data[prop])){
              
             shared[prop]=data[prop].call(data);
             
          }
      })


    memory.addCont(IN)

      const makeSure=getId(IN).getElementsByTagName("*")

      const _hasChild= makeSure.length==0 ? false : true;
   
          
       event.listen(`handler${IN}`,()=>{
           const globals=Object.create(null);
           
           if(isPlainObject(handleValue)){
              
               Object.entries(handleValue).forEach(handle=>{
                   const[pro,val]=handle;
                   globals[pro]=val;
               })
               Object.entries(handleValue).forEach((el,id)=>{
                   const[key, value]=el;
                  let refs=SHARE.handler[IN];
                  
                   for(let ref of refs){
                       const{
                           target,
                           text,
                           input
                       }=ref
                       const match=new RegExp(`{\(\:?\\s+)\*\(\:?${key})\(\:?\\s+)\*}`,"g");
                       if(match.test(text)){
                   const New=text.replace(match, value);
                   target.textContent=New;
                   
                       }
                   
                         let change=new Proxy(globals,{
                           get(){
                            return input.value;   
                           },
                           set(Target,property,v,pro){
                            const _match=new RegExp(`{\(\:?\\s+)\*\(\:?${key})\(\:?\\s+)\*}`,"g");
                            const _New=text.replace(_match, v);
                            target.textContent=_New;
                           }
                       })
            
                   window[key]=change;
                    }
               })
             
           }
        })
       
               
      const allChildren=getId(IN).getElementsByTagName("*");
   
      var chaves=Object.keys(shared);
     

if(getId(IN).getTextNodes.length>0){
         
        HTMLRegistry.create(IN)
        
        for(let textNode of getId(IN).getTextNodes){
         
            
			
            
            for(let key of Object.keys(data)){
            const match=new RegExp(`{\(\:?\\s+)\*\(\:?${key})\(\:?\\s+)\*}`,"g");              
            if(match.test(textNode.textContent)){
            
			
                

      HTMLRegistry.add(IN,{target:textNode, text:textNode.textContent})
        
		
        
            }

            

}

        }
		

     }     

      for(let all=0; all<allChildren.length; all++){
          if(!HTMLRegistry.has(IN)){
            HTMLRegistry.create(IN)
          }
          
        for(let key of chaves){
    const el=allChildren[all];
        if(containChild(el)){
            const parent=el.childNodes;
            for(let child of parent){
                
                if(child=="[object Text]");
                const match=new RegExp(`{\(\:?\\s+)\*\(\:?${key})\(\:?\\s+)\*}`,"g");              
                    if(match.test(child.textContent)){
                HTMLRegistry.add(IN,{target:child, text:child.textContent})
                
            
        
    }
    }
}else{
    const match=new RegExp(`{\(\:?\\s+)\*\(\:?${key})\(\:?\\s+)\*}`,"g");
    if(match.test(allChildren[all].textContent)){
    HTMLRegistry.add(IN,{target:allChildren[all], text:allChildren[all].textContent, attrName:null})
}

}
const attrs=allChildren[all].getAttributeNames();
for(let attr=0; attr<attrs.length; attr++){
    
    if(_hasChild){
        
        const match=new RegExp(`{\(\:?\\s+)\*\(\:?${key})\(\:?\\s+)\*}`,"g");
        const Attribute=getAttr(allChildren[all], attrs[attr])
        if(match.test(Attribute)){
            
            HTMLRegistry.add(IN, {target:allChildren[all],attrName:attrs[attr],
                 attrValue:allChildren[all].getAttribute(attrs[attr])});    
        }
      
  }
}
     }   
     
      

      
      
    
/**
 * {text:text, attr:{
 * title:"hey",
 * placeholder:"{something} is placeholder here."
 * }}
 *
 * 
 */   
     

      }

      if(!emptyOBJ(data)){
          const handler=Object.create(null);
   
    Object.defineProperty(handler, "reactor", {
     
      value:new Proxy(_data,{
          set(Target, key,value, pro){
            
              if(key in Target){

                
                
                 shared[key]=typeof value =="function" ? value.call(pro) : value;
                 value=shared[key];

                 Reflect.set(Target,key,value,pro)
                  
                 HTMLRegistry.handler[IN].forEach((v, i)=>{
                   
                     const{
                         text,
                       target,
                       attrName,
                       attrValue
                     }=v;
                     const match=new RegExp(`{\(\:?\\s+)\*\(\:?${key})\(\:?\\s+)\*}`,"g");
                     if(isDefined(text)){
                 if(match.test(text)){
                         const has=StrictRef.has(IN);
                         if(has){
                    
                       StrictRef.reConstroy(IN,key,value);
                         }
                }
                }else{
                   
                    if(match.test(attrValue)){
                        
                    const New=attrValue.replace(match, value)
                    if(New==attrValue){
                        //doNothing
                    }else{
                        if(attrName!="value"){
                            
                    setAttr(target, attrName, New)
                    }else{
                        /**
                         *Special case for value attribute: if I use the settAttr()
                         * to reset the target value, it will not work, so the best way
                         * is to set it like this.
                         */
                        target.value=New;
                        
                    }
                }
                }       
            } 
                 })

              }else{
             const setting={
              refName:key,
              refValue:value,
              refContainer:IN,   
             }
              Reflect.set(Target,key,value,pro)
             InterpretBuildingTimeRef(setting);  
               buildTimeRefIndetifier.set(key);
              }
          },
          get(Target, key, pro){
              if(handle_Value_Attr.has(key)){
                 
            const target=handle_Value_Attr.get(key);
                       return target.value    
              }else{
              return shared[key];
          }
        },
        deleteProperty(target,key,pro){
            if(buildTimeRefIndetifier.has(key)){
                Reflect.deleteProperty(target,key,pro);
                buildTimeRefIndetifier.delete(key);
                HTMLRegistry.handler[IN].forEach((d,i)=>{
                  const{
                      target,
                      text,
                      attrName,
                      attrValue,
                  }=d;
                  const match=new RegExp(`{\(\:?\\s+)\*\(\:?${key})\(\:?\\s+)\*}`,"g");
                  if(isDefined(attrName)){
                      if(match.test(attrValue)){
                          HTMLRegistry.handler[IN].splice(i,1);
                      }
                  }
                  if(isDefined(text)){
                      if(match.test(text)){
                          HTMLRegistry.handler[IN].splice(i,1);
                      }
                  }
                })
            }
        }
      }),
      enumerable:!0,
      configurable:!0,
      writable:!0  
    
    })
   
      Object.defineProperty(handler["reactor"],"setRefs", {

    
        set(v){

            if(!isPlainObject(v)){

                SyntaxErr(`
                
                The value of [ REFERENCE REACTOR ].setRefs must be an object
                and you defined "${valueType(v)}" as its value.

                `)

            }

            for(let[refName,refValue] of Object.entries(v)){

                

                this[refName]=refValue;

            }

        },
        configurable:!1


      })
    
    if(isFalse(private) || !isDefined(private)){
        
        if(isDefined(react)){

       _global[react]=handler["reactor"]
         
}

    }else{
        
        reactor=handler["reactor"];
        
    }

}
    
    
     if(!emptyOBJ(data) && isDefined(data)){ 
         
         if(!newREF.has(IN)){
             
        
      const target=getId(IN).getElementsByTagName("*");
      const hasChidNoChild=makeSure.length==0 ? true : false;
      let empty=array.create(null);
      let forAttr=array.create(null);
            

      if(getId(IN).getTextNodes.length>0){
         
        
        
        for(let textNode of getId(IN).getTextNodes){
         
            
			
            
            for(let key of Object.keys(data)){
            const match=new RegExp(`{\(\:?\\s+)\*\(\:?${key})\(\:?\\s+)\*}`,"g");              
            if(match.test(textNode.textContent)){
            
			
                

      whatToChange.push({target:textNode, text:textNode.textContent})
        
		
        
            }

            

}

        }
		
		if(getId(IN).children.length==0){
			
			newREF.set(IN, whatToChange)
			
			
		}

     }
          
      for(let el=0; el<target.length; el++){

        const keys=Object.getOwnPropertyNames(data);
        for(let key=0; key<keys.length; key++){

          const workIsDone=el==target.length-1 ? true : false;

           indentify.each(target[el],keys[key],IN, workIsDone);
          const attrs=target[el].getAttributeNames();
          for(let attr=0; attr<attrs.length; attr++){
             const Text=getAttr(target[el],attrs[attr]);
             const match=new RegExp(`{\(\:?\\s+)\*\(\:?${keys[key]})\(\:?\\s+)\*}`,"g");
        
              if(match.test(Text)){
                  
                const Targ=target[el];
                const attrText=getAttr(Targ, attrs[attr]);
                const attrName=attrs[attr]
                forAttr.push({target:target[el], attrName:attrName, attrText:attrText});  
              }
          }
                   
        }

    }
    
      
      
      refForAttr.set(IN,forAttr);
      
      
    }
      

    Object.entries(shared).forEach((key)=>{
     let[pro,value]=key
      const cache=newREF.get(IN);
      const attrs=refForAttr.get(IN);
    
       StrictRef.create(IN);
       let Strict=StrictRef.get(IN)
       array.shareItens(cache, Strict);
      for(let c=0; c<cache.length; c++){
		  
		  
        
          const{
              target,
              text,
              
          }=cache[c];

          
          const{
              computed
          }=Strict[c]
          if(!isDefined(computed)){
            const match=new RegExp(`{\(\:?\\s+)\*\(\:?${pro})\(\:?\\s+)\*}`,"g");
            let takeAway=text.replace(match,value)
           
            Strict[c].computed=takeAway;
            Strict[c].refs=Object.create(null);
            Strict[c].refs[pro]=value;
            target.textContent=takeAway;
          }else{
            const match=new RegExp(`{\(\:?\\s+)\*\(\:?${pro})\(\:?\\s+)\*}`,"g");
              const getComputed=computed.replace(match,value);
             
              Strict[c].computed=getComputed;
              Strict[c].refs[pro]=value;
              target.textContent=getComputed;
          }
      
    }
    
      for(let a=0; a<attrs.length; a++){
    
          const{
              target,
              attrName,
              attrText
          }=attrs[a];
          const match=new RegExp(`{\(\:?\\s+)\*\(\:?${pro})\(\:?\\s+)\*}`,"g");
          if(match.test(attrText)){
              
              let sub=attrText.replace(match,value);
        
              setAttr(target,attrName, sub)
              
              if(attrName=="value"){
                handle_Value_Attr.set(pro,target)  
              }
          }
      }
      

    })
    
}}

return reactor;
  
}

const buildTimeRefIndetifier={
    handler:Object.create(null),
    set(key){
    this.handler[key]=true;
    },
    has(key){
       return key in this.handler;
    },
    delete(key){
        delete this.handler[key];
    }
}

let refForAttr={
    storage:Object.create(null),
    set(key, value){
        return this.storage[key]=value;
    },
    get(key){
        return this.storage[key];
    }
}
let newREF={
    storage:Object.create(null),
    set(key, value/*must be an array of objects*/ ){
        this.storage[key]=value;
    },
    get(key){
        return this.storage[key];
    },
    has(key){
        return key in this.storage;
    }
}




 const someRef={
     
    store:new Set(),
     add(key){
       
       if(!(this.store.has(key))){     
     
        this.store.add(key);

       }
           
              
            
     },
     has(key){

     return this.store.has(key);
     

     }

   
    }
    


    function calculateUpdate(value,parent,ind){
      
       let father=parent.children[ind];

       
           
       if(notSameTagName(father,value)){

        parent.replaceChild(value, father);

        return false;

       } 

        if(father.getElementsByTagName("*").length!=value.getElementsByTagName("*").length){
            
            parent.replaceChild(value,father);
            
           
            return;
        }
      
   let root=parent.children[ind].getElementsByTagName("*");
   
   const target=value.getElementsByTagName("*");
   
   
    if(root.length>0 && target.length>0){

        
       /**
         * 
         * If the replaced element has children, we must skip
         * the check for its children.
         * 
         */

         
        /**
         * 
         * WARNING:
         * 
         *  We must not render the target[index]
         *  element directly, this way we avoid
         *  virtual dom problems.
         * 
         */
        
    let nodes=Array.from(target);

   for(let index=0; index<nodes.length; index++ ){
   


    

    if(notSameTagName(nodes[index], root[index])){

        
        let oldChild=root[index];
        

        oldChild.parentNode.replaceChild(nodes[index], oldChild);
 
        
        
        if(oldChild.children.length>0){

            index+=oldChild.getElementsByTagName("*").length;

        }


        

    }

 


 if(isDefined(root[index]) && isDefined(nodes[index])  &&
    deeplyNotEqualElements(root[index],nodes[index]) ){

        
        const oldChild=root[index];    

        oldChild.parentNode.replaceChild(nodes[index], oldChild);
 
        if(oldChild.children.length>0){

            index+=oldChild.getElementsByTagName("*").length;

        }

    
    
 
   
 
}


 
   }

   nodes=new Array();

}else{

  
    

    if(oneHasChildAndOtherNot(value, father)){

        parent.replaceChild(value, father);

        return false;

    }

    // There is no parent elements.

    if(deeplyNotEqualElements(value, father)){

        parent.replaceChild(value, father);
        

    }

}



    }


    function notSameTagName(first,second){

     return  !(first.nodeName==second.nodeName);

    }

    function oneHasChildAndOtherNot(el1,el2){

        const children1=el1.getElementsByTagName("*").length;
        const children2=el2.getElementsByTagName("*").length

        return (children1==0 && children2>0 || 
            children1>0 && children2==0
            );

    }

    function deeplyNotEqualElements(target,toCompare){


        
   
       let returnValue=false;
   
      const ta_attributes=target.attributes;
      const to_attributes=toCompare.attributes;
      const render=toCompare.render;
    
      if(!notEqual(render, true)){
         
          returnValue=true;
          
         
      }
      if(!returnValue){
        
          if(ta_attributes.length!==to_attributes.length){
            
           returnValue=true;
          }else{
      for(let attr of to_attributes){
        
          const name=attr.name;
          const value=attr.value;
          if(!hasAttr(target,name)){
            returnValue=true;
            break;
          
          }
          if(hasAttr(target,name)){
            const theAttribute=getAttr(target,name);
            if(theAttribute!==value){
                returnValue=true;
                break;
            }
          }

      }
    }
}
      if(!returnValue){ //Run if returnValue is false;
       
      if(target.textContent && toCompare.textContent){
        
        if(hasUndeepChild(target) && hasUndeepChild(toCompare)){

            return false;

        }

          target.textContent!==toCompare.textContent ? 
          returnValue=true : returnValue=false;

          
        }

      
    }

  

  

    return returnValue;
    
}

    /**
     * 
     *Inter.for({
         in:"root",
         data:["Denis", "Power"],
         do(el){
          return template({
             elements:[{
                 tag:"li", text:el,
             }] 
          })   
         }
     })
     *
     */


    

  // Special for Inter.for() and Inter.renderIf()

  function defineReactiveArray(arr, call, makeReactive){

    const reactive=Symbol("reactive");

  if(reactive in arr){

    // This array is  already reactive,
    // so we should ignore any attempt to make it reactive once more.

    return false;

  }

  // Mutating methods
  const methods=["push", "unshift", "pop", "shift", "splice", "sort","fill", "reverse"];

  for(let method of methods){

    Object.defineProperty(arr,[method],{
        value(){

            Array.prototype[method].call(this,...arguments);
            //Run the reactive system.
            call();

        }
    })

  }

  if(makeReactive){

    for(let item of arr){

        if(isPlainObject(item)){

            makeReactive(item, call, true)

        }else{

            
       if(isArray(item)){

        defineReactiveArray(item, call,/*make reactive props if it's an array of object */ true )

      }

        }

    }


  }


  }

function makeReactive(obj, call,defineProps){

    /**
     * defineProps => The object must have the reactive property 
     * defineProps ? 
     *  
     *  Yes: true.
     *  otherwise : undefined.
     * 
     *
     */

  const reactive=Symbol("reactive");

  if(reactive in obj){

    // The properties of "obj" object are already reactive,
    // so we should ignore any attempt to make them reactive once more.

    return false;

  }

 const share=Object.assign({},obj)   
const properties=Object.keys(obj);

for(let key of properties){

    if(defineProps){

    if(key=="defineProps"){

        obj["_defineProps"]=obj[key];
        share["_defineProps"]=obj[key]   
        delete obj[key];
        delete share[key];
        key="_defineProps";
     
        consoleWarnig(`
        "defineProps" is a reserved property in the objects which are the values
        of data array in Inter.for(). So Inter redefined it to "${key}".
        
        `)

    }
    }

  
Object.defineProperty(obj,[key],{
set(value){
  share[key]=value;
 
 call()
 
  
},
get(){
    return share[key];
}
})


if(isPlainObject(obj[key])){

    makeReactive(obj[key], call);

}else{

    if(isArray(obj[key])){

        defineReactiveArray(obj[key], call);

        for(let k of obj[key]){

            if(isPlainObject(k)){

                makeReactive(k, call);

            }

        }

    }

}    
}




if(defineProps && !("defineProps" in obj)){
Object.defineProperty(obj, "defineProps",{

    set(v){

        if(!isPlainObject(v)){


            SyntaxErr(`
            
          The value of "defineProps" must be an object, and you defined
          "${valueType(v)}" as its value.

          Must be:

          [The object].defineProps={

            prop:value

          }
            

            `)

        }

    for(let[p,vl] of Object.entries(v)){

        if(!(p in this)){

            share[p]=vl;

        Object.defineProperty(obj, [p],{
            
            set(value){

            share[p]=value;
           call();



            },

            get(){

                return share[p];

            }

        })

        call();

    }
}


    }

})

Object.defineProperty(obj, reactive, {

    value:true,
    configurable:!1,
    writable:!1,

})





}

}

definePro(Inter, "for", (obj)=>{
    let{
    in:IN,
    do:DO,
    data,
    react,
   
}=obj;


let pro=null;
const cond=new Set();

if(isArray(data)){


function proSetup(){
    
     
    pro=new Proxy(data,{
        set(target,key,value,prot){
            
           target[key]=value;
           
            if(isPlainObject(value)){
              makeReactive(value,Work,true)
          }else{

            
    if(isArray(value)){

        defineReactiveArray(value, Work,/*make reactive props if it's an array of object */ true )

    }

          }
            Work()
            
         
            return true;
           
        },
    
    })

   
   Object.defineProperty(pro,"otherArray",{
       set(value){
           
     if(!isArray(value)){
         SyntaxErr(`
         "${value}" is not an array.
         `)
     }else{
 data=value;
Work()

for(let v of value){
    if(isPlainObject(v)){
        makeReactive(v, Work, true)
    }else{

        
    if(isArray(v)){

        defineReactiveArray(v, Work,/*make reactive props if it's an array of object */ true )

    }

    }
}

     

proSetup();

     }

},
   
       get(){
           return null;
       },
       configurable:!0
   })
  

   Object.defineProperty(pro, "addValues", {

    value(arr,ind){


        if(!isArray(arr)){

            SyntaxErr(`
            
            The first argument of [ ARRAY REACTOR ].addValues()
            must be an array.
            
            `)

        }

        if(isEmptyArray(arr)){

            consoleWarnig(`
            
            The first argument of [ ARRAY REACTOR ].addValues()
            is an empty array.

            `)

            return false;

        }

        if(!isDefined(ind) || ind>data.length-1){

            for(let v of arr){

                if(isPlainObject(v)){
                  
                    makeReactive(v, Work, true);
                    
                
                }else{

                    
         if(isArray(v)){

           defineReactiveArray(v, Work,/*make reactive props if it's an array of object */ true )

         }

                }

                data.push(v);

            }

            Work()

        }else if(ind==0 || ind<0 ){

            
            for(let i=arr.length-1; i>-1 ;i-- ){

                if(isPlainObject(arr[i])){
                  
                    makeReactive(arr[i], Work, true);
                  
                
                }else{

                    
             if(isArray(arr[i])){

            defineReactiveArray(arr[i], Work,/*make reactive props if it's an array of object */ true )

                       }

                }

                data.unshift(arr[i]);

            }

            
            Work();

        }else{

            
            for(let v of arr){

                if(isPlainObject(v)){
                  
                    makeReactive(v, Work, true);
                    
                
                }else{

                    
             if(isArray(v)){

           defineReactiveArray(v, Work,/*make reactive props if it's an array of object */ true )

            }

                }

                data.splice(ind,0,v);

            }

            Work()

        }

    


    },

    

    configurable:!0

   })

  Object.defineProperty(pro, "concat",{
   value:(value)=>{

       //the proxy does not work for concat() method, reason why I did this polyfill

       if(!isArray(value)){

       pro.push(value);

     if(isPlainObject(value)){

        makeReactive(value,Work, true)

    }else{

        
    if(isArray(value)){

        defineReactiveArray(value, Work,/*make reactive props if it's an array of object */ true )

    }

    }
    
     return array.create(data);

   }else{
     
    for(let item of value){

       pro.push(item);


       }
       
       return array.create(data);
   }
},
   configurable:!0,


  }) 

  if(isDefined(react)){

  window[react]=pro;
 
}

}

proSetup()
}

if(!isArray(data)){

    Warning("data in Inter.for() must be an array.")
}
if(!isCallable(DO)){

Warning("do in Inter.for() must be a function");

}else{
    const root=getId(IN);

    for(let _obj of data){
        if(isPlainObject(_obj)){
         
     makeReactive(_obj, Work, true);

}else{
    if(isArray(_obj)){

        defineReactiveArray(_obj, Work,/*make reactive props if it's an array of object */ true )

    }
}
}
   function Work(){
  
       
   
    

     if(data.length<root.children.length){
         
     let undeedChilren=root.children;

         
         for(let undeep=undeedChilren.length; undeep>data.length; --undeep){
            
             root.removeChild(undeedChilren[undeedChilren.length-1])
         }
         
     
    }
    if(!someRef.has(IN)){
     
        data.forEach((item, i)=>{
            var value=DO.call(pro,item, i);

             if(!isaNodeElement(value) ){

                

                SyntaxErr(`
                You are not returning the template()
                function in do() method(Inter.for). It is happening where the target id is "${IN}".
				

                `)

            }
        

        for(let el of value){
          
            
            root.appendChild(el);
        }
      
    
    
    })
    someRef.add(IN);
    return false;
}
    if(someRef.has(IN)){
    
    data.forEach((el, i)=>{
    

      let _value=DO.call(pro,el,i);
     
     

    if(!isaNodeElement(_value)){

        SyntaxErr(`
                You are not returning the template()
                function in do() method(Inter.for). It is happening where the target id is "${IN}".
				

                `)

    }
      
  
    else if(isDefined(root.children[i])){

      for(let _el of _value){
        
        calculateUpdate(_el,root, i)
      }
    }else{
     if(!isDefined(root.children[i])){
    
    if(data.length-cond.size>root.children.length){
       for( v of _value){
    

        root.appendChild(v)
        return;           
       }

       
    }
    }
}
    })

   
    
    
    
   
    

}
}
}
Work();
})



const StoreNotFoundRoute={
    store:Object.create(null),
    set(key, value){
         this.store[key]=value;
    },
    hasNotFound(){
        return "*" in this.store
    },
    get(){
        return this.store["*"]();
    }
}
function isUsingHash(){
    return window.location.hash ? true : false;
}


// For router.
let started=false;

function ROUTER(obj){

    if(started){

        consoleWarnig(`
        
        You already created the ROUTER.

        `)

        return false;

    }

    if(this instanceof ROUTER){

        SyntaxErr(`
        
        ROUTER is not an constructor. Just call it like that:

        ROUTER({

            routes:{

                // your app's routes here!

            }

        })

        `)

    }

    if(window.location.protocol=="file:"){

        SyntaxErr(`
        
        The ROUTER must be only used in a http: or https:
        protocol, and you are using it an file: protocol!
        
        `)

    }

if(!isPlainObject(obj)){
SyntaxErr(`
The argument of ROUTER() must be an object.
`)
}else{

   
     const{
        
         routes
     }=obj;
     
    const organizedRoutes=Object.create(null);
     Object.entries(routes).forEach(route=>{
         const[routeName,routeAction]=route;
    if(!validPath.test(routeName) && routeName!="*"){
        SyntaxErr(`
        Route name must start with /.
        `)
    }

    if(!isCallable(routeAction)){
        SyntaxErr(`
        Route action/handler must be a function.
        `)
    }
   
    if(routeName!="*" && routeName.includes("*")){
      
     let sub=routeName.replaceAll("?", "(:?\\?)");   
     sub=sub.replaceAll("*","(:?[\\\s\\\S]+)");
    
    
    const theRoute=sub;
    organizedRoutes[theRoute]=routeAction;
    }else{
     if(routeName!=="*"){
        organizedRoutes[routeName]=routeAction;
    }
	}
     })

if(isCallable(routes["*"])){
	 
        StoreNotFoundRoute.set("*",routes["*"]);
        
		
        
    
	
} 


started=true;

 event.listen("URLCHANGED",()=>{



 const isSearching=_global.location.search;
const s=isSearching;
if(isSearching){

    Object.keys(organizedRoutes).some(orgRoute=>{

        let reg=new RegExp();
        let _orgRoute=orgRoute.replace(/\//,"")
        if(reg.compile(_orgRoute).test(s)){

            organizedRoutes[orgRoute]();
            done=true;
            getRoutingTag.call(document.body)
        }

    })

}
    
    if(!isUsingHash()){
        const atualPath=window.location.pathname;
        let done=false;
    Object.keys(organizedRoutes).some(orgRoute=>{
        let reg=new RegExp();
       
        if(reg.compile(orgRoute).test(atualPath)){
            organizedRoutes[orgRoute]();
            done=true;
			getRoutingTag.call(document.body)
        }
    })

 }else{
    const atualPath=window.decodeURI(window.location.hash.replace("#",""));
   
    Object.keys(organizedRoutes).some(orgRoute=>{
     let reg=new RegExp();
     if(reg.compile(orgRoute).test(atualPath)){
         organizedRoutes[orgRoute]();
         done=true;
		 getRoutingTag.call(document.body)
     }
 })
 if(!done){
     if(StoreNotFoundRoute.hasNotFound()){
 
          StoreNotFoundRoute.get();
 
         }else{
             consoleWarnig(`
             You should always create a notfound route with "*" property.
             `)
         }
 }
     }    
    })


    event.fire("URLCHANGED");

window.onpopstate=()=>{

event.fire("URLCHANGED");

}

}
getRoutingTag.call(document.body);
}
class FORM{
    constructor(){

    }
    each(obj){
        const{
            in:IN,
            do:DO,
        }=obj;
      
        let add=array.create(null);
        let getTheInputs=getId(IN).getElementsByTagName("*");
        for(let input of getTheInputs){
          if(isInput(input)){
              add.push(input)
          }
        }
        for(let m=0; m<add.length; m++){
            DO(add[m],m)
            
        }
    }
        
    
}
let form=new FORM();

function getAllInputs(parent){
 const inputs=array.create(null);
 const children=getId(parent).getElementsByTagName("*");
 for(let i=0; i<children.length; i++){
     const tag=children[i].tagName;
     const input=children[i];
    if(lowerCase.call(tag)=="input" || lowerCase.call(tag)=="textarea"){
    inputs.push({
         input:input, index:i, parent:getId(parent),
     })
    }
 }
 return inputs;   
}
 const storeValue=Symbol.for("privateMethod");
const arrayToStoreState=array.create(null);
const refHandler=Symbol("handler");
const firstTime=Symbol("firstTime");
const storage_For_First_Time=Symbol("storage") 
const for_First_Time=array.create(null);
const input={
     [refHandler]:undefined,
[storeValue]:Object.create(null),
[firstTime]:true,
[storage_For_First_Time]:array.create(null),
setState(state,IN){
  
    if(state in this[storeValue]){
      consoleWarnig(`
      Oh no! The state that you're registering already exist "${state}".
      
      `)
    }
    if(arguments.length<2){
        SyntaxErr(`
        input.sateSate() must have two arguments, first is the name of the state 
        and second the input state container.
        `)
    }else{
        
     const allInputs=getAllInputs(IN);
  
     for(let i=0; i<allInputs.length; i++){
         
      
         const{
             input,
             index, 
             parent,
         }=allInputs[i];
        const cloneInput=input.cloneNode(true)
        arrayToStoreState.push({clonedInput:cloneInput, index:index, parent:parent});
        if(this[firstTime]){
         for_First_Time.push({realInput:input, index:index, parent:parent})
        }
       

    
}


    
       this[storeValue][state]=array.create(null);
       array.shareItens(arrayToStoreState,this[storeValue][state]);
       array.destroy(arrayToStoreState); 
      
       if(this[firstTime]){
        array.shareItens(for_First_Time,this[storage_For_First_Time]);
        array.destroy(for_First_Time);
        this[firstTime]=false;
        }
    

    }
    
},
original(){
 const originals=this[storage_For_First_Time];
 for(let input of originals){
      const{
      realInput,
      index,
      parent
    }=input;
    const children=parent.getElementsByTagName("*");
    parent.replaceChild(realInput,children[index]);
 }   
},
resetState(state,IN){
if(!state in this[storeValue]){
    consoleWarnig(`The state you'e trying to reset does not exist.`)
}
if(arguments.length<2){
    SyntaxErr(`resetState must have two arguments.`);
}
else{
    const allInputs=getAllInputs(IN);
    for(let i=0; i<allInputs.length; i++){
     
     
    
        const{
            input,
            index,
            parent
        }=allInputs[i]
        const cloneInput=input.cloneNode(true)
        arrayToStoreState.push({clonedInput:cloneInput, index:index, parent:parent});

   }
   
      this[storeValue][state]=array.create(null);
      array.shareItens(arrayToStoreState,this[storeValue][state]);
      array.destroy(arrayToStoreState); 
      
   }


},
deleteState(state){
    if(!state in this[storeValue]){
        consoleWarnig(`
        You're trying to delete a state that does not exist.
        `)
    }else{
        return delete this[storeValue][state];
    }
},

constroyState(state){
    if(!state in this[storeValue]){
        consoleWarnig(`
        You're trying to constroy a state that does not exist.
        `)
    }else{
        
        const _state=this[storeValue][state];
        
        for(let state of _state){
            const{
                clonedInput,
                index,
                parent,
            }=state;
          
           const inputs=parent.getElementsByTagName("*");
          parent.replaceChild(clonedInput,inputs[index]);
        }
    }
},
destroyAll(){
    for(let state in this[storeValue]){
       return delete this[storeValue][state];
    }
},

send(callback){
if(!isCallable(callback)){
    SyntaxErr(`
    send's argument must be a function.
    `)
}else{
   const allStates=Object.getOwnPropertyNames(this[storeValue])
    allStates.forEach(state=>{
        const inputs=this[storeValue][state];
        for( let input of inputs){
            callback(input.clonedInput);
        }
    })
    /**
     * const send=new formDATA();
     * input.send((el)=>{
     * send.append(el.name,el);
     * }) 
     * 
     * backend.request({
     * path:"/users",
     * body:send,
     * }).response(()=>{
     * console.log("User uploaded succefully!");
     * },()=>{
     * console.log("Something went wrong!")
     * })
     * 
     */
}
}
 }

 Object.freeze(input);


 


function hasUndeepChild(container){
    return container.children.length>0;
}


function STORAGE(){
    const store_Symbol=Symbol("store_Symbol");
    this[store_Symbol]=Object.create(null);
    this[Symbol("protect")]=new Set();

    /**
     *storage.set("active",el);
     *storage.get("active", (setted){
     *
     *     
     })
     */
}

STORAGE.prototype.set=function(infoName,value){
    const _symbol=Object.getOwnPropertySymbols(this)[0];
    if(arguments.length<2){
        SyntaxErr(`
        storage.set() must have two arguments!
        `)
    }

    const _set=Object.getOwnPropertySymbols(this)[1];
         
    if(this[_set].has(infoName)){

       SyntaxErr(`
       
       The info named "${infoName}" is protect
       and you can not overwritten it.

       `)

   }

    if(infoName in this[_symbol]){
        
     

        this[_symbol][infoName]=value;

        consoleWarnig(`
        there's already an element named "${infoName}" on the storage, and it's value
        was overwritten.
        `)
    }
    else{
       
      return this[_symbol][infoName]=value;  
    }
}

STORAGE.prototype.get= function(key,callback){
const _symbol=Object.getOwnPropertySymbols(this)[0];
if(arguments.length<2){
    SyntaxErr(`
    storage.get() must have two arguments!
    `)
}
if(!isCallable(callback)){
    SyntaxErr(`
    The second argument in storage.get() must be a function.
    `)
}
if(!hasOwn.call(this[_symbol],key)){
    consoleWarnig(`
    You are trying to get an element that is not actually registered in the storage.
    `)
}else{
    const theElement=this[_symbol][key];
    return callback(theElement);
}
}

STORAGE.prototype.has=function(key){
    const _symbol=Object.getOwnPropertySymbols(this)[0];
    if(!isDefined(key)){
        SyntaxErr(`
        You must define the element to check its existence in the storage.
        `)
    }else{
        return hasOwn.call(this[_symbol],key)
    }
}

STORAGE.prototype.delete=function(infoName){
    const _symbol=Object.getOwnPropertySymbols(this)[0];
    if(!isDefined(infoName)){
        SyntaxErr(`You must define the key you want to delete from storage.`)
    }
    if(!hasOwn.call(this[_symbol],infoName)){
         SyntaxErr(`
         You're trying to delete a key that is not in the storage.
         `)
    }else{

        const _set=Object.getOwnPropertySymbols(this)[1];

        if(this[_set].has(infoName)){

            SyntaxErr(`
            
            The info named "${infoName}" is protect
            and you can not delete it from the storage.

            `)

        }


     delete this[_symbol][key];

    }
}



STORAGE.prototype.protect=function(infoName){

    if(infoName==void 0){

        SyntaxErr(`
        
        You must define the info name to protect
        in storage.protect(infoName)

        `)

    }

    if(!this.has(infoName)){

        SyntaxErr(`
        
        The info named ${infoName} is not on the storage yet,
        so register it first and then protect it.
        
        `)
       

    }else{

        const prot=Object.getOwnPropertySymbols(this)[1];

        this[prot].add(infoName);


    }

}

const storage=Object.freeze(new STORAGE());









function isElement(el){
    return el.nodeType==1;
}

function INTERFACE(){

}
INTERFACE.prototype.previous=(el,callback)=>{
if(!isElement(el)){

}
if(!isCallable(callback)){

}else{
  const elements=array.create(null);
  const actuallElements=el.parentNode.children;
  for(child of actuallElements){
      if(!el.isSameNode(child)){
          elements.push(child);
      }else{
          elements.push(child);
          callback([...elements]);
          array.destroy(elements);
          break;
      }
  }  
}
}
INTERFACE.prototype.next=(el,callback)=>{
    if(!isElement(el)){
SyntaxErr(`
The first argument in "interface.next()" must be a valid HTML element.
`)
    }
    if(!isCallable(callback)){
SyntaxErr(`
The second argument in "interface.next()" must be a function.
`)
    }else{
        let started=false;
        const elements=array.create(null);
        const actuallElements=el.parentNode.children;
        for(let child of actuallElements){
            if(el.isSameNode(child) || started){
                elements.push(child);
                if(!started){
                    started=true;
                }
            }
        }

        callback([...elements]);
        array.destroy(elements);
    }
}



const interface=Object.freeze(new INTERFACE());


event.protectListener("URLCHANGED");
event.protectListener("handler");


function InterpretAttrs(el,attrs, attrManager, original){
    
Object.entries(attrs).reduce(($,attr)=>{
     const[attrName, attrValue]=attr;
    
         if(attrValue!=void 0 && !attrName.startsWith("on")){
        
         setAttr(el,attrName,attrValue);
         }else{
             
             if(attrName.startsWith("on") && isCallable(attrValue))
            
             el[attrName]=function(e){
                  attrValue.call(original,e);
             }
             }
         
         
         
    
},{})

Object.entries(original).reduce(($, $attr)=>{
    const[attrName]=$attr;
    
    Object.defineProperty(original,attrName,{
        set(v){
        
            if(v==void 0){
                if(!attrName.startsWith("on")){
                    el.removeAttribute(attrName);
                }else{
                    el[attrName]=void 0;
                }
            }else{
                if(!attrName.startsWith("on")){
            setAttr(el,attrName,v);
                }else{
                    if(!isCallable(v)){
                        SyntaxErr(`
                        The value of "${v}" event, must be a function.
                        `)
                    }
                    el[attrName]=function(e){
                        v.call(original,e)
                    }
                }
            }
        },
        get(){
           if(attrName.startsWith("on")){
               SyntaxErr(`
               "${attrName}" seems to be an event listener, 
               and you can not get the value of an event.
               `)
           }else{
             return getAttr(el,attrName)
              
           }
        }
    })
},{})

const emptyObj=Object.create(null);

Object.defineProperty(emptyObj,[attrManager],{
    value:new Proxy(attrs,{
    set(target,key, propValue,pro){
    
        if(hasOwn.call(target,key)){
            if(propValue==void 0){
                if(key.startsWith("on")){
                el[key]=void 0;
                }else{
               el.removeAttribute(key);   
                }

                return false;
            }
            if(key!="value" && !key.startsWith("on")){
                setAttr(el,key,propValue)
                Reflect.set(target, key, propValue, pro)
                return false;
            }if(key=="value"){
                el.value=propValue;
                Reflect.set(target, key, propValue, pro)
            }else{
                if(key.startsWith("on")){
                    if(!isCallable(propValue)){
                        SyntaxErr(`
                        Oh, the value of "${key}" event, must be a function.
                        `)
                    }
                    
                    el[key]=function(e){
                        propValue.call(target,e);
                    };
                    
                   
                }
            }
        
    
        }
    },
    get(target,key,pro){
        if(key.startsWith("on")){
            SyntaxErr(`"${key}" seems to be an event listener, and you can
            not get the value of an event`)
        }else{
      return el[key];  
    }
},

    })
})

if(!isPlainObject(_global.managers)){

    _global.managers=Object.create(null);

}

_global.managers[attrManager]=emptyObj[attrManager];

}


function findDynamicAttrs(rootElem, attrManager){
   
const keys=Object.getOwnPropertyNames(attrManager);
const children=rootElem.getElementsByTagName("*");
for(let child of children){
    
    if(child.attributes.length==1){
      
        const theAttr=child.attributes[0].name;
         
        for(let key of keys){
    
        const pattern=new RegExp(`{...${key}}`);
        if(pattern.test(theAttr)){
           const copy=Object.assign({},attrManager[key])
           child.removeAttribute(theAttr);
            InterpretAttrs(child,copy,key,attrManager[key]);
            
            break;
        }
   
    
    }
}
}

}

function toATTR(obj){
    /**
     *toATTR({
     * in:"container",
     * data:{
     * inputsAttr:{
     * placeholder:"Hey",
     * type:"text"
     * }
     * }
     *     
     })
     *
     */

    const returnOBJ=Object.create(null);

    if(!isPlainObject(obj)){
        SyntaxErr(`
        The argument in "toATTR()" function must be an object.
        `)
    }else{
  const{
      in:IN,
      data,
      private
      
  }=obj;
  
  const root= getId(IN)
               

  if(!isPlainObject(data)){
SyntaxErr(`
data in toATTR() must be an object.
`)
  }else{
      
   findDynamicAttrs(root,data);



   for(let entries of Object.entries(_global.managers)){
  
    const[manager,attrs]=entries;

    if(isTrue(private)){

        returnOBJ[manager]=attrs;

    }else{

        _global[manager]=attrs;

    }    

   }

  }      

  delete _global.managers;

  return isTrue(private) ? returnOBJ : void 0;

    }





}


const on={
    call:void 0,
    load(call){
     this.call=call;
    },
    fire(){
        this.call();
    }
}


 function request(tag){

   if(!hasAttr(tag,"path")){

       SyntaxErr(`
       
       There is  an "inter-container" tag that does not have the "path" attribute.
       
       `)

   }
   if(!hasAttr(tag,"tag")){

   SyntaxErr(`
   
   There is an "inter-container" tag that does not have the "tag" attribute.

   `)

   }

   const valid_Html_extension=getAttr(tag,"path").endsWith(".html") || getAttr(tag,"path").endsWith(".hml");

   if(!valid_Html_extension){


    SyntaxErr(`
    
    The path attribute value in all "inter-container" tags must end either with the ".html"
    or ".htm" extension.
    
    `)


   }
   

   
   backend.request({
       type:"get",
       path:tag.getAttribute("path"),
   }).response((resp)=>{
    
    
    
    const attrs=tag.attributes;
      
      const forb=/<style>(:?[\s\S])*<\/style>|<script>(:?[\s\S])*<\/script>/g;

      if(forb.test(resp)){

        SyntaxErr(`
        
        In external template must not contain a <style> or <script> tag,
        and one of the mentioned tag was found at path => "${tag.getAttribute("path")}".
        
        `)

      }
      


    const newTag=CreatEL(tag.getAttribute("tag"));
    newTag.innerHTML=resp;
    
    for(let att of attrs){
        
     if(att.name!="path" && att.name!="tag"){
         
        setAttr(
            newTag,
            att.name,
            att.value
        )

    }
}
    tag.parentNode.replaceChild(newTag,tag);
    
     on.call();
   },()=>{
       Warning(`
       Failed to load: ${tag.getAttribute("path")}.
       `)
   })


 }

 
function reativeAttributes(root, load){
    
 const children=root.children;
 const theEls=array.create(null);
 const removed=array.create(null);


 if(isTrue(load)){

    const protocol=window.location.protocol;
    if(protocol=="file:"){
        SyntaxErr(`
        You can not use container rendering with external template in
        a "file:" protocol. Use "http:" or "https:" protocols instead.
        `)
    }else{
     
        const inter_container_tags=root.getElementsByTagName("inter-container");
        
        const length=inter_container_tags.length;
        let current=0;

        on.load(()=>{
            
            if(current<length){
                const tag=inter_container_tags[0];
                 
             request(tag);
             current++;
            }else{
                
                selectTheContainers();


            }
        })

       on.fire()

    }


 }else{

    selectTheContainers();
     
 }

 function selectTheContainers(){

 let index=-1;
 
 for(let child of  children){
   index++;
   
  
    if(hasAttr(child, "_istrue")){
        if(hasAttr(child, "_default")){
            SyntaxErr(`
            A container can not have two reactive attributes.
            `)
        }
      const value=getAttr(child,"_istrue");
      child.istrue=true;
        const config={
            ifTrue:child,
            cond:value.trim(),
            index:index,
        }
        
       
         const sibling=child.nextElementSibling;
         if(isTag(sibling)){  
         if(hasAttr(sibling, "_default")){
             if(hasAttr(sibling,"_istrue")){
                 SyntaxErr(`
                 A container can not have two reactives attributes.
                 `)
             }
             sibling.default=true;
             config.default=sibling;
                 sibling.removeAttribute("_default")
             removed.push(sibling)

               
    }
       }
       child.removeAttribute("_istrue");
       removed.push(child);
       
       theEls.push(config);
    }
    }

for(let re of removed){
    root.removeChild(re);
}

if(event.hasListener("CONTAINERS_HAVE_FINISHED_LOADING")){

    event.fire("CONTAINERS_HAVE_FINISHED_LOADING");
    event.removeListener("CONTAINERS_HAVE_FINISHED_LOADING");

}

}



return theEls;
 
}


function renderContainer(obj){

    let returnValue=void 0;

    if(new.target!==void 0){
        SyntaxErr(`
        "renderContainer" is not a constructor, do not call it
        with the "new" keyword.
        `)
    }
    if(!isPlainObject(obj)){
        SyntaxErr(`
        The argument in "renderContainer" must be an object.
        `)
    }else{

const{
    in:IN,
    data,
    react,
    private,
    load,
    loadState
   
}=obj;

if(!isPlainObject(data)){

    SyntaxErr(`
    
    The data property in renderContainer argument must be an object.

    `)

}




if(isCallable(loadState) && load){
    loadState.call(data,"loading")
}

const reactives=reativeAttributes(getId(IN),isTrue(load));


const _react=Object.assign({}, data);
const share=Object.assign({}, data);
const dataKeys=Object.getOwnPropertyNames(data);
for(let key of dataKeys){

    if(key=="register" || key=="setRegistered"){

        SyntaxErr(`
        
        "${key}" is a reserved property, you can not
        use it as rendering property.

        renderContainer({
            in:"${IN}",
            data:{
                ${key}:${data[key]}
            }
            ...
        })

        `)

    }
    
Object.defineProperty(_react, [key],{
    set(v){
    share[key]=v;
 
    checkEls();

    },
    get(){
       return share[key];
    }
})
}

const registered=array.create(null);
let just=false;
Object.defineProperty(_react, "register",{
    set(value){
        if(!isArray(value)){
            SyntaxErr(`
            The value in [ CONTAINER RENDERING REACTOR ].register must be an array.
            `)
        }
        if(just){
            consoleWarnig(`
            You can only register the properties once.
            `)

            return false;
        }
        if(isEmptyArray(value)){
            SyntaxErr(`
            The value of register property must not be an empty array.
            `)
        }else{
            
            for(let prop of value){

                if(prop=="register" || prop=="setRegistered"){

                    continue;

                }

                if(!hasOwn.call(data,prop)){
                    consoleWarnig(`
                    There is not a rendering property named "${prop}"
                    in container rendering in the element whose the id attribute is "${IN}"
                    `)
                    
                }else{

                    registered.push(prop);
                    just=true;
                }
            }
            
            Object.defineProperty(this, "setRegistered",{
                enumerable:!1,
                configurable:!1,
                set(v){
                    if(!isBoolean(v)){
                        SyntaxErr(`
                        The setRegistered property only accepts
                        boolean value, true or false.
                        `)
                    }else{
                        for(let re of registered){
                            
                        share[re]=v;
                        
                            
                      
                        }
                        checkEls();
                        
                    }
                },
              
            })
            Object.seal(this);
        }
    }
})



function checkEls(){
    
    for(let re of reactives){
    
        const{
            cond,
            ifTrue,
            default:Default,
            index
        }=re;
        
         const root=getId(IN);
         const rootChildren=root.children;

         if(cond=="setRegistered" || cond=="register"){

            continue;

         }
        
        if(hasOwn.call(_react, cond)){
            const own=isCallable(_react[cond]) ? _react[cond].apply(_react, void 0) : _react[cond];
            if(!isBoolean(own)){
                consoleWarnig(`
            The values of properties in data object, in renderContainer(), must be
            only boolean(true/false), and in property "${cond}" you defined
            "${valueType(own)}" as its value.
                `)
            }
        if(!notEqual(own, true) && isDefined(Default)){

            if(Default.parentNode==root){

                root.replaceChild(ifTrue,Default);
                continue;

            }
         
            if(rootChildren[index]==void 0){
                root.appendChild(ifTrue);
                continue;
            }
            if(rootChildren[index].isSameNode(ifTrue)){
                continue;
            }else{
                
                
                    root.insertBefore(ifTrue, rootChildren[index]);
                }
            
        }else{
       if(!notEqual(own, false) && isDefined(Default)){
           
        if(ifTrue.parentNode==root){
            
        root.replaceChild(Default, ifTrue);
        continue;
        }

        if(rootChildren[index]==void 0){
            
            root.appendChild(Default);
            continue;
        }
        if(rootChildren[index].isSameNode(Default)){
        continue
        }

       }
       if(!notEqual(own, true) && !isDefined(Default)){
        
        if(rootChildren[index]==void 0){
            root.appendChild(ifTrue);
        continue;
        }
        if(rootChildren[index].isSameNode(ifTrue)){
            //DO nothing
            
        }
       
            else{
                root.insertBefore(ifTrue, rootChildren[index]);
            }
        }
       }
       if(!notEqual(own,false) && !isDefined(Default)){
           
    if(ifTrue.parentNode==root){
        
        root.removeChild(ifTrue);
    }   
     
        }
        }

    

        }
       
    }
    

    if(load){
    event.listen("CONTAINERS_HAVE_FINISHED_LOADING",()=>{
        checkEls();
       if(isCallable(loadState) && load){
           loadState.call(_react,"ready");
       } 
    });

}
if(!load){
    checkEls();
}
    if(isDefined(react)){
        _global[react]=_react;
    }else{
        
        if(private){
            returnValue=_react;
            
        }
    }
}


return returnValue



    }

    


    function template(obj){

const{
    elements
}=obj;

/**
 * 
 * [{
 * tag:"div", children:[{
 * 
 * tag:"p", children:[{
* tag:"p", children:[{tag:"ul", children:[{tag:"li"}]}] 
*  
* }]
 * 
 * }]
 * }]
 * 
 */


 if(!Array.isArray(elements)){


    SyntaxErr(`
    
    elements in Inter.for() must be an array of object.
    
    `)

 }

 if(elements.length>1){

    consoleWarnig(`
    
    You are creating more than one element without a container in template function, 
    put the created element inside a container like:

    template({
        elements:[{
            //container.
            tag:"div", children:[{

                //The elements here!

            }]
        }]
    })
    
    `)

 }

 let returnELS=array.create(null);

 


    let{
        tag,
        text,
        attrs={},
        events={},
        handlers={},
        styles={},
        children=[],
    }=elements[0];

    tag=isCallable(tag) ? tag() : tag;

    if(tag==void 0){

        SyntaxErr(`
        
        You can not render a container conditionally, in template function.
        
        `)

    }

    

    const container=CreatEL(tag);
     

     Object.entries(attrs).forEach((attr)=>{
         
        const[name,value]=attr;

        if(isDefined(name)){

            if(isCallable(value)){

            setAttr(container,name,value());
            
        }else{
       
            setAttr(container,name,value);

        }

        }

     })

     Object.entries(events).forEach((ev)=>{

        const[name,handler]=ev;

        if(!name.startsWith("on")){

            SyntaxErr(`
            
            Every HTML events must start with "on". And

            "${name}" does not.


            `)

        }


        if(isCallable(handler)){

            container[name]=handler;
            container.render=true;

        }

        

     })

     Object.entries(handlers).forEach((h)=>{


        const[name,handler]=h;

        if(!isCallable(handler)){


       SyntaxErr(`
       
       All handlers properties values must be functions,
       and the value of handler "${name}" is not.

       `)


        }else{

            handler.apply(container, void 0);
            handler.render=true;


        }

     





     })


     Object.entries(styles).forEach((style)=>{

        const[name,value]=style;

        if(isDefined(value)){

            if(isCallable(value)){

            container.style[name]=value()

            }else{

                container.style[name]=value;

            }

        }


     })

     if(isDefined(text) && children.length==0){
    
        if(isCallable(text)){
        container.appendChild(

            TEXT(text)

        )
        }else{

            container.appendChild(

                TEXT(text)

            )

        }
     }

     if(children.length>0){

   createChildren(container, children);

    }



    returnELS.push(container)


 
 
 

 return returnELS;



    }

    function createChildren(father, childrenArray){
    

        

        for(let child of childrenArray){
            
            
            let{
                tag,
                text, 
                attrs={},
                events={},
                handlers={},
                styles={},
                children=[],
            }=child;
        
            
            tag=isCallable(tag) ? tag() : tag;
        
            if(tag==void 0){
        
            continue;
        
            }
        
            const _child=CreatEL(tag);
            
        

 

             Object.entries(attrs).forEach((attr)=>{
                 
                const[name,value]=attr;
        
                if(isDefined(value)){
                    
        
                    if(isCallable(value)){
        
                    setAttr(_child,name,value());
                    
                }else{
               
                    setAttr(_child,name,value);
        
                }
        
                }
        
             })
        
             Object.entries(events).forEach((ev)=>{
        
                const[name,handler]=ev;
        
                if(!name.startsWith("on")){
        
                    SyntaxErr(`
                    
                    Every HTML events must start with on. And
        
                    "${name}" does not.
        
        
                    `)
        
                }


        
        
                if(isDefined(handler)){
        
                    _child[name]=handler;
                    _child.render=true;
        
                }
        
             })
        
             Object.entries(handlers).forEach((h)=>{
        
        
                const[name,handler]=h;
        
                if(!isCallable(handler)){
        
        
               SyntaxErr(`
               
               All handlers properties values must be functions,
               and the value of "${name}"  handler is not.
        
               `)
        
        
                }else{
        
                    handler.apply(_child, void 0);
                    handler.render=true;
        
        
                }


        })

        Object.entries(styles).forEach((style)=>{

            const[name,value]=style;

            if(isDefined(value)){

                if(isCallable(value)){

                    _child.style[name]=value()

                }else{

                    _child.style[name]=value;

                }

            }


        })

        if(isDefined(text) && children.length==0){
         
            if(isCallable(text)){

            _child.appendChild(

                TEXT(text())
            )

        }else{

            _child.appendChild(

                TEXT(text)

            )

        }
    }

        father.appendChild(_child);

        if(children.length>0){

        createChildren(_child,children);
        }
    }

    }


_global.renderContainer=renderContainer;
_global.interface=interface;
_global.storage=storage;
_global.input=input;
_global.form=form;
_global.toHTML=toHTML;
_global.validate=validate;
_global.Inter=Inter;
_global.simulate=simulate;
_global.ROUTER=ROUTER;
_global.supportInter=supportInter;
_global.url=url;
_global.data=data;
_global.backend=backend;
_global.event=event; 
_global.whileLoading=whileLoading
_global.app=app;
_global.template=template;
_global.toATTR=toATTR;






 
})();
 



