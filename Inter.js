/**
 * Inter.
 * Version: 1.0.
 * A Javascript library to build interactive frontend applications.
 * Created by Denis Power.
 */



(function(){

function isJson(v){
     return Object.prototype.toString.call(v)=="[object Json]";
}

function isPlainObject(v){
return Object.prototype.toString.call(v)=="[object Object]";
}

function isArray(arr){
   return Array.isArray(arr);
}

function isNumber(n){
   return valueType(Number(n))=="number";
}

 function isCallable(fn){
  return valueType(fn)=="function"
 }

function valueType(v){
return typeof v;
}

function removeAttrs(el,arr){
    [...arr].forEach(attr=>{
        if(hasAttr(el,attr)){
            el.removeAttribute(attr);
        }
    })
}
function hasOwn(key){

    return key in this; 

}

function isDefined(v){
  return   valueType(v)!="undefined" && v!="" && v!=null;
}

function isBoolean(v){
    valueType(v)=="boolean";
}
function isInput(target){
    const tag=target.tagName;
    return lowerCase.call(tag)=="input" || lowerCase.call(tag)=="textarea";
}
function SyntaxErr(err){
    if(Dev.status=="production" || Dev.status!="development"){
       
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
const theId=document.getElementById(id);
if(!isDefined(id)){
    SyntaxErr(`
    There is not an element by id ${id} in document.
    `)

}else{

return theId;
}
}

function consoleWarnig(msm){

    if(Dev.status=="production" || Dev.status!="development"){
        return;
    }
    
    console.warn(msm)
}

function TEXT(node){
    return document.createTextNode(node);
}
function hasAttr(el, attr){
    if(isElement(el)){
        return el.hasAttribute(attr);
    }
}

function CreatEL(EL){
    return document.createElement(EL)
};

function setAttr(el,atr, value){
    return el.setAttribute(atr, value)
}
 
function getAttr(el, atr){
    return el.getAttribute(atr);
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


//Adding a private destroyAll method in Object constructor.

Object.destroyAll=(obj)=>{
    const keys=Object.keys(obj);
    for(let key of keys){
     delete obj[key];
    }
}

//globalThis is not old enough to include it without checking its support.

const _global=globalThis || function(){
    if(window){
        return window;
    }
    if(self){
        return self;
    }
    if(global){
        return  global;
    }
}

//Special for routing
const validPath=/^\/(:?[\s\S]+)|\/$/;
function isButtonOrAnchor(tag){
return lowerCase.call(tag.nodeName)=="a" || lowerCase.call(tag.nodeName)=="button";
}
function getRoutingTag(){ 
    const children=this.getElementsByTagName("*");
    for(let child of children){
        if(isButtonOrAnchor(child) && hasAttr(child, "setPath")){
            child.onclick=(ev)=>{
                     ev.preventDefault();
            const routeTo=getAttr(child,"setPath");
            if(validPath.test(routeTo)){
            url.setPath(routeTo);         
            }else{
                SyntaxErr(`
                A valid pathName must starts with /.
                `)
            }
        }
    }

}
}

var Dev={
    /**
     * status:"development" 
     *
     */
   
    status:"development"
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
     }
     target.textContent=plainText;
     }
}

}
function ARRAY(){

}

ARRAY.prototype.create=(arr)=>{
if(arr==null){
    return [];
}else{
    return [...arr];
}

}
ARRAY.prototype.shareItens=(root,reciever)=>{
for(let share of root){
    reciever.push(share);
}
}
ARRAY.prototype.destroy=(_array)=>{
   let length=_array.length; 
 while(length--){
     _array.pop();
 }
}
var array=new ARRAY();

//As Inter store a lot of data in memomery, it can cause memory lack, so let's manage it.

const memory={
    handleMemomory:array.create(null),
    refContainer(container){
        //special for reference
        this.handleMemomory.push(container);
      
    },
    hasRefContainer(container){
        let returnValue=null;
    this.handleMemomory.some(cont=>{
    return container==cont ? returnValue=true : returnValue=false;
    })
    return returnValue;
    },
}



const app=new Proxy(Dev, {
    set(Target, key, value, pro){
        if(key=="status" && value=="production"){
            console.log("You're using Inter in production mode.");
            Reflect.set(Target, key, value, pro);
        }
        if(key=="status" && value=="development"){
            console.log("You're using Inter in development mode. When you deploy your app turn on production mode.");
            Reflect.set(Target, key, value, pro);
        }else{
            return false;
        }
    }
})
    



function supportInter(){
    try{
        let map=new Map()
        map.set("Libray", "Inter");
        map.set("Creator", "Denis");
        map.clear();
        return true
    }catch(e){
        return false

    }

}
//ES200 feaures, they are not old enough to include them without checking if they are supported.

function supportOptionalChaining(){
try{
  const creators={

  }
 creators.inter?.name;
 return true;  

}catch(e){
    return false;
}

}

function supportNullishCoalising(){
    try{
      let und=undefined;
      und ?? "not";
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
         if(key!="inputHandler"){
   window.addEventListener("load",(ev)=>{
  if(app.status=="development"){
      console.log("You're using Inter in development mode, when you deploy your app turn on production mode.")
  }
    InputHandler();

    if(isCallable(key)){
        key(ev)
    }else{
        key;
    }
   })
     }else{
         window.addEventListener("load",InputHandler());
         
     };},
     get(){
        //Never triggers
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
     let _el=CreatEL(tag)
        Object.entries(attrs).forEach(attr=>{
            const[attribute,value]=attr;
            setAttr(_el,attribute,value);
        })
        Object.entries(events).forEach(event=>{
            const[ev,trigger]=event;
            _el[ev]=trigger;
        })
        if(isDefined(text)){
            _el.appendChild(TEXT(text))
        }
        if(!isEmptyArray(children)){
            children.forEach(child=>{
                /**
                 *{tag:"p", text:"Oi"}
                 */
                const{
                    tag,
                    text,
                    events={},
                    attrs={},
                }=child;
                const elementChild=CreatEL(tag);
                Object.entries(events).forEach(ev=>{
                    const[evName,evValue]=ev;
                    elementChild[evName]=evValue;
                })
                Object.entries(attrs).forEach(attr=>{
                    const[attrName, attrValue]=attr;
                    setAttr(elementChild,attrName,attrValue);
                })
                if(isDefined(text)){
                    elementChild.appendChild(TEXT(text));
                }
                _el.appendChild(elementChild);
            })
        }
        root.appendChild(_el);
       })
   
       
    }
}



   
    
}



var validator={
    url:function(u){
 return   /^(?:http:\/\/|https:\/\/)+(:?[A-Z]{2,8}\.)*(:?[a-z]+)+\.+(:?[a-z]{2,8})+(:?[\s\S])*$/i.test(u);
    },
    email:function(em){
     return   /^(?:[A-Z]+)+(:?[0-9]+)*@+(:?[A-Z]+)\.[A-Z]+$/i.test(em)
    },
  
 
    
}

var validate=new Proxy(validator,{
    set(Target, key, value, pro){
        if(key=="url" || key=="email"){
        Warning(`
        You must not overwrite built-in methods
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
                You must not delete built-in methods
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
        SyntaxErr(`You can not set any propriety in object Inter,
        this is a fatal action.
        `);
        return false;
    },
    deleteProperty(...values){
        SyntaxErr(`Fatal error: do not try to delete any propriety of Inter object`);
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

function Match(root,valueToCompare){
    let lower=lowerCase.call(root);
   return lower.indexOf(lowerCase.call(valueToCompare))>-1
}

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
    console.log(`There was not found a property called ${query} in target object.`)
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

Object.defineProperty(INTER, Symbol.hasInstance,{
    value: function(){
        return false;
    },
    enumerable:false,
    configurable:false,
    writable:false,
})



function whileLoading(obj){
   if(new.target=="undefined"){
       SyntaxErr(`
       You must not instantate whileLoading() function. 
       `)
   }
   if(!isPlainObject(obj)){
       SyntaxErr(`
         The value passed as argument in the method 
         whileLoading() must be any object.
       
       `)
   }else{

    /**whileLoading({
     * elements[{
     * type:"img", class:"image", src:"loading.gif"
     * },{
     * type:"h3", text:"Page is now laoding", class:"loading_description" 
     * 
     * }]
     * }) 
     * 
     */
    const{
      elements,  
      
    }=obj;
    let elArr=[...elements]
   let root=null;
  
   if(Inter.loadStatus!="complete"){
   elArr.forEach(el=>{
       const{
           tag,
           attrs={},
           events={},
           children,
           
       }=el;
       if(!isDefined(children) || isEmptyArray(children)){
          SyntaxErr(`
          Oh, you must define the children array, and it must not be empty.
          `)
       }
       const _el=CreatEL(tag);
       Object.entries(attrs).forEach(attr=>{
           const[attrName,attrValue]=attr;
           setAttr(_el,attrName,attrValue);
       })
       Object.entries(events).forEach(ev=>{
           const[evName,evValue]=ev;
           _el[evName]=evValue;
       })
       children.forEach(child=>{
           const{
               tag,
               events,
               attrs,
               text,
           }=child;
           const childElement=CreatEL(tag);
           Object.entries(events).forEach(event=>{
               const[eventName, eventValue]=event;
               childElement[eventName]=eventValue;
           })
           Object.entries(attrs).forEach(att=>{
               const[attName, attValue]=att;
               setAttr(childElement, attName, attValue);
           })
           if(isDefined(text)){
               childElement.appendChild(TEXT(text));
           }
           _el.appendChild(childElement);
       })
       root=_el;
       document.body.appendChild(_el);
       
   })
   
   }
 let TheInterv=setInterval(()=>{
if(document.readyState=="complete"){
    clearInterval(TheInterv);
     document.body.removeChild(root)
    
}

 },1)
 
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
function objShareKeys(target,source){

    //I created this because Object.assign() does not resolve the problem in Inter.renderIf();

    const targetKeys=Object.getOwnPropertyNames(target);
    targetKeys.reduce((reciever,key)=>{
   reciever[key]=target[key];
    },source)
}

function hasProperty(obj){
    return Object.getOwnPropertyNames(obj).length>0;
}
function isaNodeElement(supposedElement){

    /**
 *There is already a function that do a work similiar to this, called
*isElement(), but that function does not work as espected in Inter.renderIf() checking,
* that's why I'm doing
 * a strong checking with this one.
     */

    const pattern=/^\[object HTML+(:?[A-Z]+)+Element\]$/i;
    return pattern.test(supposedElement);
}

function hasOnlyAChild(parent){
    return parent.children.length==1;
}
const renderIfCach={
    handle:Object.create(null),
    set(value){
        this.handle[value]=true;
    }
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
        //error
    }else{
        const{
            in:IN,
            watch,
            conditions,
        }=obj;
        

        if(isPlainObject(watch)){
          
            const share=Object.create(null);
            objShareKeys(watch,share);
            Object.keys(watch).forEach(key=>{
                Object.defineProperty(watch,key,{
                    set(value){
                    share[key]=value;
               theWork();
                     
                        
                    },
                    get(){
                    return share[key];
                    }
                })
            })
        }
        
      
        function theWork(){
            const root=getId(IN);
        if(insertedElements.length>0){
        
           insertedElements.forEach(ind=>{
                const theEL=root.children[ind];
                if(isDefined(theEL)){
            root.removeChild(theEL);
                }
                
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
                      root.insertBefore(render()[i],theFirstChild);
                     insertedElements.push(pos);
                    
                 
                       
                      return false;    
                      }
                  }
                  if(isDefined(defined) && isTrue(condition.replace)){
                      root.replaceChild(render()[0],defined);
                      insertedElements.push(pos)
                     
                      return false;
                  }
                 if(isDefined(beforeThis)){
                     root.insertBefore(render()[0],beforeThis);
                     insertedElements.push(pos)
                    
                    
                     
                 }else{
                     const allundeepChildren=root.children.length-1;
                     if(allundeepChildren+1==pos){
                   
                root.appendChild(render()[i]);
                   insertedElements.push(pos)
                     
                     }
           
                     
                    
                     else{
                         SyntaxErr(`The last rendered children in element by id ${IN} is at index ${allundeepChildren} and 
                         to render a children at index ${pos}.
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
        // error
    }else{
       /**
        * semulate.typing({
        * in:"container",
        * setting:[{
        * text:"Hey, i'm Denis the creator of Inter.",
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

function template(obj){
const{
    elements,
}=obj;
if(!isArray(elements)){
    SyntaxErr(`
    The property "elements" must be an array.
    `)
}
let tags=array.create(null);
  elements.forEach(el=>{
      if(!isPlainObject(el)){
          SyntaxErr(`
          The itens of array "elements" must be objects with at least
          "tag" property. 
          `)
      }
      const{
          tag,
          text,
          attrs={},
          events={},
          children=[],
          handlers={},
      }=el;
      const htmlElement=CreatEL(tag);
      Object.entries(attrs).forEach(attr=>{
          const[attrName,attrValue]=attr;
          if(isCallable(attrs[attrName])){
              if(isDefined(attrs[attrName]())){
          setAttr(htmlElement, attrName, attrs[attrName]())
              }
          }else{
              if(isDefined(attrValue)){
              setAttr(htmlElement, attrName, attrValue);
              }
          }
      });
      Object.entries(events).forEach(event=>{
          const[eventName,eventValue]=event;
          htmlElement[eventName]=eventValue;
          if(!hasAttr(htmlElement, "events")){
              setAttr(htmlElement,"events", true);
          }
      });
      Object.keys(handlers).forEach(handler=>{
         if(isCallable(handlers[handler])){
             if(!hasAttr(htmlElement, "handlers") && !hasAttr(htmlElement,"events")){
                 setAttr(htmlElement,"handlers", true);
             }
             return handlers[handler].call(htmlElement);
         }
      })
    if(!isEmptyArray(children)){
      /**
       *children:[{}]
       */
      children.forEach(child=>{
          const{
              tag:_tag,
              text:_text,
              attrs:_attrs={},
              events:_events={},
              handlers:_handlers={},
          }=child;
          const childElement=CreatEL(_tag);
          Object.entries(_attrs).forEach(att=>{
              
              const[attName,attValue]=att;
              if(isCallable(_attrs[attName])){
                  if(isDefined(_attrs[attName]())){
                   
                  setAttr(childElement,attName, _attrs[attName]());
                  }
              }else{
               if(isDefined(attValue)){
              setAttr(childElement,attName,attValue);
               }
              }
          })
          Object.entries(_events).forEach(ev=>{
              const[evName,evValue]=ev;
              childElement[evName]=evValue;
              if(!hasAttr(childElement,"events")){
                  setAttr(childElement,"events", true);
              }
          })
          Object.keys(_handlers).forEach(handler=>{
             
              if(isCallable(_handlers[handler])){
                  if(!hasAttr(childElement,"handlers") && !hasAttr(childElement, "events")){
                      setAttr(childElement,"handlers", true);
                  }
                  return _handlers[handler].call(childElement);
              }
          })
          if(isDefined(_text)){
              childElement.appendChild(TEXT(_text));
          }
         
          if(lowerCase.call(childElement.tagName)!="null"){
             
          htmlElement.appendChild(childElement)
          }
      })
     
    }
    if(isDefined(text)){
        htmlElement.appendChild(TEXT(text));
    }
     tags.push(htmlElement);
    })
   return tags;
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
consoleWarnig("You must define the path of the url.")
};
if(pathname=="/"){
    window.history.pushState(null, null, pathname);
    event.fire("URLCHANGED")
    return false;
}
if(pathname!="/" && atualUrl=="/"){
    window.history.pushState(null, null, `/#/${pathname}`);
    event.fire("URLCHANGED")
    return false;
}else{
    window.history.replaceState(null, null,pathname);
    event.fire("URLCHANGED")

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
    event.fire("URLCHANGED")
    return false;
}
if(pathname!="/" && atualUrl=="/"){
    window.history.pushState(null, null, pathname);
     event.fire("ULRCHANGED")
    return false;
}
else{
   window.history.replaceState(null, null, pathname);
   event.fire("URLCHANGED") 
}

}

const url=Object.freeze(new URL());
      
function GetVALUE(obj){
 const{
     in:IN,
   
 }=obj;  

  if(!isPlainObject(obj)){
SyntaxErr(`
getValue()'s argument must be only an object.
`)
  }else{

   return {
       only(){
    
        let value=getId([IN]).value;
        return value;   
       
       },
       done(id,prop){
      getId(IN).oninput=(ev)=>{
          toHTML({
              in:id,
              data:{
                  [prop]:ev.target.value,
              }
          })
      }
   
    }    
   
}   

}


}



let getValue=new Proxy(GetVALUE, {

    construct(...values){
      SyntaxErr(`
     You've create an instance for getValue, it's forbidden.
     `)
    }});

    /**
     * As my focus on Inter syntax is to let it be really very simple, so 
     * using the getValue() function is not very elegant, reason wy there's the
     *  handleValue diretive 
     * <input type="text" in="mensagem" placeholder="write something" handleValue="message">
     * <p id="mensagem">{message}</p>
     * 
     */
 
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
            Really? handleValue must be only setted in value that recieve value.
            `)
        }else{
            if(!hasAttr(allNodes[i], "in")){
                SyntaxErr(`
                in attribute required.
                `)
            }
            const attr=allNodes[i].getAttribute("handleValue");
            const storeHandlers=array.create(null);
            const findTheOne=getId(getAttr(allNodes[i], "in")).getElementsByTagName("*");
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

//ajax based in promise

function BACKEND(){


}

BACKEND.prototype.get=(obj)=>{
   if(!isPlainObject(obj)){
SyntaxErr(`
The argument of "backend.get()" must be an object
`)
   } 
   const{
       headers={},
       path,
       progress,
       withCredentials,
       timeout,
       ontimeout,
   }=obj;
return new Promise((resolve, reject)=>{

let request = new XMLHttpRequest();
Object.entries(headers).forEach(_header=>{
    const[key, value]=_header;
    request.setRequestHeader(key, value);
})
if(isDefined(timeout)){
if(!isNumber(timeout)){
    SyntaxErr(`The value of timeout property in "backend.get" must be a number.`)
}else{
    request.timeout=timeout;
}
}
request.ontimeout=(ev)=>{
    if(isCallable(ontimeout)){
        return ontimeout();
    }
}
if(isDefined(withCredentials)){
    request.withCredentials=withCredentials;
}
request.open("GET", path, true);
request.onprogress=(ev)=>{
if(isCallable(progress)){
    return progress(ev.total, ev.loaded)
}
}

request.onreadystatechange=()=>{
if(request.readyState==4 && request.status==200){
    resolve(request.responseText);
}else{
    reject(request.status);
}
}

request.send(null)
 }
 
 
 
 )
}



BACKEND.prototype.upload=(obj)=>{
    if(!isPlainObject(obj)){
SyntaxErr(`
The argument of "backend.upload()" must be an object.
`)
    }


else{
    const{
        path,
        body,
        progress,
        headers={},
        withcredentials,
        timeout,
        ontimeout,
    }=obj;
    if(!isDefined(body)){
        SyntaxErr(`You did not defined the request body.`);
    }
    return new Promise((resolve, reject)=>{
    let request=new XMLHttpRequest();
    Object.entries(headers).forEach(_header=>{
        const[key, value]=_header;
        request.setRequestHeader(key, value);
    })
    if(isBoolean(withcredentials)){
        request.withCredentials=withcredentials;
    }
    if(isDefined(timeout)){
        if(!isNumber(timeout)){
          SyntaxErr(`
          The value of timeout property in "backend.upload()" must be a number.
          `)  
        }else{
            request.timeout=timeout;
        }
    }
    request.ontimeout=()=>{
    if(isCallable(ontimeout)){
          return ontimeout();       
    }
}
    request.open("POST", path, true);
  request.onprogress=(ev)=>{
      if(isCallable(progress)){
      return progress(ev.total, ev.loaded);
    }
  }
  
  request.onreadystatechange=()=>{
      if(request.status==200 && request.readyState==4){
        resolve("Data have being uploaded.")  
      }else{
          reject(request.status)
      }
  }
  request.send(body)
}) 
}
}
BACKEND.prototype.delete=(obj)=>{
if(!isPlainObject(obj)){
    SyntaxErr("backend.delete()'s argument must be an object.")
}else{
const{
    timeout,
    ontimeout,
    progress,
    withCredentials,
}=obj;
  return new Promise((resolve, reject)=>{
let request=new XMLHttpRequest();
if(isBoolean(withCredentials)){
    request.withCredentials=withCredentials;
}
if(isDefined(timeout)){
    if(!isNumber(timeout)){
        SyntaxErr(`
        The value of timeout property in "backend.delete()" must be a number.
        `)
    }else{
        request.timeout=timeout;
    }

}
if(isCallable(ontimeout)){
    request.ontimeout=()=>{
        return ontimeout();
    }
}
request.open("DELETE", path, true);
if(!isCallable(progress)){
    request.onprogress=(ev)=>{
        progress(ev.total, ev.loaded)
    }
}
request.onreadystatechange=()=>{
    if(request.readyState==4 && request.status==200){
        resolve("File(s) deleted succefully.")
    }else{
        reject(request.status)
    }
}
  })  
}
}
BACKEND.prototype.update=(obj)=>{
    return new Promise((resolve, reject)=>{
        const{
            body,
            headers,
            path,
            progress,
            withCredentials,
            timeout,
            ontimeout
        }=obj;
        if(!isDefined(body)){
            consoleWarnig("The body of the request must be dfined.")
        }
       let request=new XMLHttpRequest();
       Object.entries(headers).forEach(_header=>{
           const[key, value]=_header;
           request.setRequestHeader(key, value);
       })
       if(isBoolean(withCredentials)){
           request.withCredentials=withCredentials;
       }
       if(isDefined(timeout)){
           if(!isNumber(timeout)){
               SyntaxErr(`The value of timeout must be a number.`)
           }else{
               request.timeout=timeout;
           }
       }
       if(isCallable(ontimeout)){
           request.ontimeout=()=>{
              return ontimeout(); 
           }
       }
       request.open("PUT", path, true);
       if(isCallable(progress)){
           request.onprogress=(ev)=>{
               progress(ev.total,ev.loaded);
           }
       }
       request.onreadystatechange=()=>{
           if(request.readyState==4 && request.status==200){
            resolve("Info(s) added to database successfully")   
           }else{
               reject(request.status)
           }
       }

       request.send(body) 
    })
}
const backend=Object.freeze(new BACKEND());

 const globalNativeEventListener={

 }
 const GlobRef={
     protectedListener:Object.create(null),
     ref:Object.create(null),
     add:function(EvName, fn){
return this.ref[EvName]=fn;
     }
 }
 const GlobalNativeEventListener=new Proxy(globalNativeEventListener,{
    set(Target, key, value, proto){
       
        const allKeys=Object.keys(GlobRef.ref);
        
   for(let i=0; i<allKeys.length; i++){
       if(key==allKeys[i]){
         
         return  GlobRef.ref[allKeys[i]](value);  
       }
   }
}})

 function EVENT(){
     
     this.fire=(evName,evValue)=>{
         if(!isDefined(evName)){
             SyntaxErr(`
             You must define the event's name
             `)
         }
        if(isDefined(evValue)){ 
     GlobalNativeEventListener[evName]=evValue;      
        }else{
            
             GlobalNativeEventListener[evName]="fired";
            
        }
     };
     this.listen=(evName, callback)=>{
         if(!isCallable(callback)){
             SyntaxErr(`
             The second argument of event.listen() must be a function.
             `)
         }
         if(hasOwn.call(GlobRef.ref,evName)){
             return;
         }else{
       GlobRef.add(evName, callback);   
         }
 };
 this.removeListener=(evName)=>{
if(!isDefined(evName)){
    SyntaxErr(`
    You must define the event's name you want to remove the listener
    `)
}
if(!hasOwn.call(GlobRef.ref,evName)){
    consoleWarnig(`
    Ops, you are trying to delete a listener that  does not exist
    `)
}
if(hasOwn.call(GlobRef.protectedListener,evName)){
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
}else{
    consoleWarnig(`The listener of "${evName}" is already protected. `);
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

    add(key,obj){
        return this.handler[key].push(obj);
    },
    
    create(propName){
       if(propName in this.handler){
           
         return false  //doNothing
       } else{
           
return this.handler[propName]=array.create(null);
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
        
   whatToChange.push({text:element[nested].textContent, target:element[nested], parent:parent});
  
}
}
}

}else{
    const match=new RegExp(`{\(\:?\\s+)\*\(\:?${key})\(\:?\\s+)\*}`,"g");
    if(match.test(el.textContent)){
    
whatToChange.push({target:el, text:el.textContent, parent:parent})

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
    
if(!isPlainObject(obj)){
    SyntaxErr(`The argument in toHTML() function must be an object.`)
}else{
      let{
          in:IN,
          data,
          handleValue,
         react,
         
      }=obj;
     if(memory.hasRefContainer(IN)){
Object.destroyAll(HTMLRegistry.handler);
Object.destroyAll(handle_Value_Attr.handle);
Object.destroyAll(refForAttr.storage);
Object.destroyAll(newREF.storage);
Object.destroyAll(StrictRef[private]);

     }else{
         memory.refContainer(IN)
     }

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
   
      var chaves=Object.keys(data);
     if(allChildren.length==0){
         HTMLRegistry.create(IN)
       HTMLRegistry.add(IN,{target:getId(IN), text:getId(IN).textContent}) 
     
       
     }
      for(let all=0; all<allChildren.length; all++){
          HTMLRegistry.create(IN)
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

      if(isDefined(react) && !emptyOBJ(data)){
          const handler=Object.create(null);
   
    Object.defineProperty(handler, [react], {
     
      value:new Proxy(data,{
          set(Target, key,value, pro){
              
              if(key in Target){
                  Reflect.set(Target, key, value, pro);
                 HTMLRegistry.handler[IN].forEach((v, i)=>{
                   
                     const{
                         text,
                       target,
                       attrName,
                       attrValue
                     }=v;
                     
                     if(isDefined(text)){
                 if(text.includes(key)){
                         const has=StrictRef.has(IN);
                         if(has){
                    
                       StrictRef.reConstroy(IN,key,value);
                         }
                }
                }else{
                    const match=new RegExp(`{\(\:?\\s+)\*\(\:?${key})\(\:?\\s+)\*}`,"g");
                    if(match.test(attrValue)){
                        
                    const New=attrValue.replace(match, value)
                    if(New==attrValue){
                        //donNothing
                    }else{
                        if(attrName!="value"){
                            
                    setAttr(target, attrName, New)
                    }else{
                        /**
                         *Special case for value attribute: if I use the settAttr()
                         * to reset the target value, will not work, so the best way
                         * is to set it like this.
                         */
                        target.value=New;
                        
                    }
                }
                }       
            } 
                 })

              }
          },
          get(Target, key, pro){
              if(handle_Value_Attr.has(key)){
                 
            const target=handle_Value_Attr.get(key);
                       return target.value    
              }else{
              return Reflect.get(Target,key,pro)
          }
        }
      }),
      enumerable:!0,
      configurable:!0,
      writable:!0  
    
    })
    window[react]=handler[react]

}
    
    
     if(!emptyOBJ(data) && isDefined(data)){ 
         
         if(!newREF.has(IN)){
             
        
      const target=getId(IN).getElementsByTagName("*");
      const hasChidNoChild=makeSure.length==0 ? true : false;
      let empty=array.create(null);
      let forAttr=array.create(null);
      if(hasChidNoChild){
        
         const text=getId(IN).textContent;
         const theKeys=Object.getOwnPropertyNames(data);
         theKeys.forEach(key=>{
            const match=new RegExp(`{\(\:?\\s+)\*\(\:?${key})\(\:?\\s+)\*}`,"g");
           
            if(match.test(text)){
                
                empty.push({target:getId(IN), text:text, position:null});
                newREF.set(IN, empty);
            }
         })
      }else{
          
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
    }
      
      
      refForAttr.set(IN,forAttr);
      
      
    }
      

    Object.entries(data).forEach((key)=>{
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
    set(key, value/*must be an array of object*/ ){
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
     
    copy:Object.create(null),
     set(key, value){
       
             this.copy[key]=value;
           
              
            
     },
     has(key){
      return  key in this.copy;
     },
     

     }

   

    


    function calculateUpdate(value,parent,ind){
      
        
   let father=parent.children[ind];
       if(containChild(parent.children[ind])){
           
   let root=parent.children[ind].getElementsByTagName("*");
   const target=value.getElementsByTagName("*");
   const getLength=()=>{
     return target.length>root.length ? target : root;  
   }
   
   for(let el=getLength().length-1; el>-1; --el){
       
 if(!isDefined(root[el])){
 
   parent.replaceChild(value,father);
   father=value;
   root=father.getElementsByTagName("*");
   
continue
}
if(!isDefined(target[el]) && isDefined(root[el])){

    parent.replaceChild(value,father);
   continue;
}
 if(isDefined(root[el]) && isDefined(target[el]) && 
 deeeplyNotIqualElements(root[el],target[el]) ){
     

    father.replaceChild(target[el],root[el])  
   
 
   
 
}
}
 
   }else{
       const child=parent.children[ind];
      if(deeeplyNotIqualElements(child,value)){
        parent.replaceChild(value,child)
      }
   }



    }
    function deeeplyNotIqualElements(target,toCompare){

       let returnValue=false;
      const attributes=target.attributes;

      if(hasAttr(toCompare,"events")){
          
          returnValue=true;
      }
      if(hasAttr(toCompare,"handlers") && !returnValue){
        returnValue=true;
        
      }
      if(!returnValue){
      for(let attr of attributes){
          if(!hasAttr(toCompare,attr)){
            returnValue=true;
            break;
          
          }
          if(hasAttr(toCompare,attr)){
            const theAttribute=getAttr(toCompare,attr);
            if(theAttribute!=getAttr(target,attr)){
                returnValue=true;
                break;
            }
          }

      }
    }
      if(!returnValue){ //Run if returnValue is false;
        
      if(target.hasChildNodes && toCompare.hasChildNodes){
          
          String(target.textContent)!==String(toCompare.textContent) ? 
          returnValue=true : returnValue=false;
          
        }
    }
   removeAttrs(toCompare,["events","handlers"]);
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
definePro(Inter, "for", (obj)=>{
    let{
    in:IN,
    do:DO,
    data,
    react,
   
}=obj;



if(isArray(data) && isDefined(react)){
    
  
  const ProxArray=new Proxy(data,{
      set(target,key,value,prot){
          target[key]=value;
        
          Work()
          return true;
         
      },

  }) 
  
  Object.defineProperty(ProxArray, "concat",{
   value:(value)=>{
       //the proxy does not work for concat() method, reason why I did this polyfill
       if(!isArray(value)){
     ProxArray.push(value);
    
     return [...data];
   }else{
       for(let item of value){
       ProxArray.push(item);

       }
       Work()
       return [...data];
   }},
   configurable:!0,

  }) 
  window[react]=ProxArray;
 

}

if(!isArray(data)){
    Warning("Inter warning: data must be an array.")
}
if(!isCallable(DO)){
Warning(" Inter warning: do must be a function");
}else{
    const root=getId(IN);
   function Work(){
     if(data.length<root.children.length){
        
         let undeedChilren=root.children;
         for(let undeep=undeedChilren.length; undeep>data.length; --undeep){
            
             root.removeChild(undeedChilren[undeedChilren.length-1])
         }
         
     }
    if(!someRef.has(IN)){
        [...data].forEach((item, i)=>{
       var value=DO(item, i);
    
        for(let el of value){
            removeAttrs(el,["events","handlers"]);
 
            root.appendChild(el);
        }
      
    
    })
    someRef.set(IN);
    return false;
}
    if(someRef.has(IN)){
    
    data.forEach((el, i)=>{
      let _value=DO(el,i);

    if(isDefined(root.children[i])){

      for(let _el of _value){
      
        calculateUpdate(_el,root,i)
      }
    }
    if(!isDefined(root.children[i])){
    if(data.length>root.children.length){
       for(let v of _value){
      removeAttrs(v,["events","handlers"])
        root.appendChild(v)
           
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
        return this.store[key]=value;
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

function ROUTER(obj){
if(!isPlainObject(obj)){
SyntaxErr(`
The argument of ROUTER must be an object.
`)
}else{
    /**
     * ROUTER({
     * in:"container",
     * routes:{
     * "*":()=>{
     * 
     * }
     * "/Inter/doc":()=>{
     * backend.get({
     * path:"/Inter/doc.json",
     * headers:{}
     * }).then((resp)=>{
     * do something
     * },(error)=>{
     * //do something
     * })
     * },
     * "/Intro":()=>{
     * 
     * },
     * "/Inter/rules/Bestpractices":()=>{
     * 
     * }
     * }
     })
     *
     *
     */
  
     const{
        
         routes
     }=obj;
    const organizedRoutes=Object.create(null);
     Object.entries(routes).forEach(route=>{
         const[routeName,routeAction]=route;
    if(!validPath.test(routeName) && routeName!="*"){
        SyntaxErr(`
        Route name must starts with /.
        `)
    }
    if(!isCallable(routeAction)){
        SyntaxErr(`
        Route action must be a function.
        `)
    }
    if(routeName=="*"){
        StoreNotFoundRoute.set("*", routeAction);
        delete routes[routeName];
    }
    if(routeName.includes("*") && routeName!="*"){
    const sub=routeName.replace(/(:?\*)/g,"(:?[\s\S]+)");
    const theRoute=sub;
    organizedRoutes[theRoute]=routeAction;
    }else{
        const theRoute=`(:?${routeName})`;;
        organizedRoutes[theRoute]=routeAction;
    }

     })

if(!isUsingHash){

    const atualPath=window.location.pathname;
    let done=false;
Object.keys(organizedRoutes).some(orgRoute=>{
    let reg=new RegExp();
    if(reg.compile(orgRoute).test(atualPath)){
        organizedRoutes[orgRoute]();
        done=true;
    }
})
if(!done){
    if(StoreNotFoundRoute.hasNotFound()){

        return StoreNotFoundRoute.get();

        }else{
            consoleWarnig(`
            You should always create a notfound route with "*" property.
            `)
        }
}
   
        }else{
           const atualPath=window.decodeURI(window.location.hash.replace("#",""));
           let done=false;
           Object.keys(organizedRoutes).some(orgRoute=>{
            let reg=new RegExp();
            if(reg.compile(orgRoute).test(atualPath)){
                organizedRoutes[orgRoute]();
                done=true;
            }
        })
        if(!done){
            if(StoreNotFoundRoute.hasNotFound()){
        
                return StoreNotFoundRoute.get();
        
                }else{
                    consoleWarnig(`
                    You should always create a notfound route with "*" property.
                    `)
                }
        }
        } 

 event.listen("URLCHANGED",()=>{
    if(!isUsingHash){
        const atualPath=window.location.pathname;
        let done=false;
    Object.keys(organizedRoutes).some(orgRoute=>{
        let reg=new RegExp();
        if(reg.compile(orgRoute).test(atualPath)){
            organizedRoutes[orgRoute]();
            done=true;
        }
    })
    if(!done){
        if(StoreNotFoundRoute.hasNotFound()){
    
            return StoreNotFoundRoute.get();
    
            }else{
                consoleWarnig(`
                You should always create a notfound route with "*" property.
                `)
            }
    }
 }else{
    const atualPath=window.decodeURI(window.location.hash.replace("#",""));
    let done=false;      
    Object.keys(organizedRoutes).some(orgRoute=>{
     let reg=new RegExp();
     if(reg.compile(orgRoute).test(atualPath)){
         organizedRoutes[orgRoute]();
         done=true;
     }
 })
 if(!done){
     if(StoreNotFoundRoute.hasNotFound()){
 
         return StoreNotFoundRoute.get();
 
         }else{
             consoleWarnig(`
             You should always create a notfound route with "*" property.
             `)
         }
 }
     }    
    })


window.onpopstate=()=>{
    if(!isUsingHash){
        const atualPath=window.location.pathname;
        let done=false;
    Object.keys(organizedRoutes).some(orgRoute=>{
        let reg=new RegExp();
        if(reg.compile(orgRoute).test(atualPath)){
            organizedRoutes[orgRoute]();
            done=true;
        }
    })
    if(!done){
        if(StoreNotFoundRoute.hasNotFound()){
    
            return StoreNotFoundRoute.get();
    
            }else{
                consoleWarnig(`
                You should always create a notfound route with "*" property.
                `)
            }
    }
 }else{
    const atualPath=window.decodeURI(window.location.hash.replace("#",""));
    let done=false; 
    Object.keys(organizedRoutes).some(orgRoute=>{
     let reg=new RegExp();
     if(reg.compile(orgRoute).test(atualPath)){
         organizedRoutes[orgRoute]();
         done=true;
     }
 })
 if(!done){
     if(StoreNotFoundRoute.hasNotFound()){
 
         return StoreNotFoundRoute.get();
 
         }else{
             consoleWarnig(`
             You should always create a notfound route with "*" property.
             `)
         }
 }
     }    
}

}}
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
      Oh no man, that state that you're register already exist ${state}.
      
      `)
    }
    if(arguments.length<2){
        consoleWarnig(`
        input.sateSate() must have two arguments, first is the name of the state 
        and second the value.
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
     * backend.upload({
     * path:"/users",
     * body:send,
     * }).done(()=>{
     * console.log("User uploaded succefully!");
     * }).catch(()=>{
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
function templatehasChanged(old, _new){

return !(Object.is(old,_new));

}
const templateUpdateListener="updateListener";
function STORAGE(){
    const store_Symbol=Symbol("store_Symbol");
    this[store_Symbol]=Object.create(null);
    /**
     *storage.set("active",el);
     *storage.get("active", (setted){
     *
     *     
     })
     */
}
STORAGE.prototype.set=function(key,value){
    const _symbol=Object.getOwnPropertySymbols(this)[0];
    if(arguments.length<2){
        SyntaxErr(`
        storage.set() must have two arguments!
        `)
    }
    if(key in this[_symbol]){
         this[_symbol][key]=value;
        consoleWarnig(`
        there's already an element called "${key}" in storage, and its value
        was overwritten.
        `)
    }
    else{
       
      return this[_symbol][key]=value;  
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
        You must define the element to check it's existence in the storage.
        `)
    }else{
        return hasOwn.call(this[_symbol],key)
    }
}

STORAGE.prototype.delete=function(key){
    const _symbol=Object.getOwnPropertySymbols(this)[0];
    if(!isDefined(key)){
        SyntaxErr(`You must define the key you want to delete from storage.`)
    }
    if(!hasOwn.call(this[_symbol],key)){
         SyntaxErr(`
         You're trying to delete a key that is not in the storage.
         `)
    }else{
     return delete this[_symbol][key];
    }
}
const storage=Object.freeze(new STORAGE());
function updateHTML(obj){
if(!isPlainObject(obj)){
SyntaxErr(`
The argument of "updateHTML()" must be an object.
`)
}else{
    const{
        in:IN,
        template,
    }=obj;
    const root=getId(IN);
   const div=CreatEL("div");
   div.innerHTML=template;
   const divChildren=div.children;
   if(!Match(divChildren[0].tagName,"div")){
   SyntaxErr(`
   The template must be enside a <div> tag.
   `)
   }

if(templatehasChanged(root.innerHTML,divChildren[0].innerHTML)){
    if(hasUndeepChild(root)){
        root.removeChild(root.children[0]);
        }

  event.fire(onbeforeUpdate,IN)      
root.appendChild(divChildren[0]);

event.fire(templateUpdateListener,IN);
}

Object.destroyAll(SHARE.handler);
Object.destroyAll(someRef.copy)
InputHandler()

    getRoutingTag.call(document.body);


}
}

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

const onbeforeUpdate="beforeUpdateListener"
const onbeforeManager={
    handle:Object.create(null),
    add(key, call){
        return this.handle[key]=call;
    }
}
event.listen(onbeforeUpdate,(key)=>{
    if(hasOwn.call(onbeforeManager.handle,key)){
     return onbeforeManager.handle[key]();
    }
})

INTERFACE.prototype.updated=(root,callback)=>{
if(!isCallable(callback)){
SyntaxErr(`
The second argument of interface.updated() must be a function.
`)
}
if(!getId(root)){
SyntaxErr(`
The element you want to monitor the update is not actually a valid HTML element.
`)
}

else{
updaterManager.add(root,callback);
}

}

INTERFACE.prototype.beforeUpdate=(root,callback)=>{
if(!isCallable(callback)){
    SyntaxErr(`
    The second argument of interface.updated() must be a function.
    `)
}
if(!getId(root)){
    SyntaxErr(`
    The element you want to monitor the update is not actually a valid HTML element.
    `)
}else{
onbeforeManager.add(root,callback)
}

}
const updaterManager={
    handle:Object.create(null),
    add(key, call){
      return this.handle[key]=call;
    }

}
event.listen(templateUpdateListener, function(key){
    if(hasOwn.call(updaterManager.handle,key)){
     return updaterManager.handle[key]();
    }
})

const interface=Object.freeze(new INTERFACE());


event.protectListener("URLCHANGED");
event.protectListener("handler");
event.protectListener(templateUpdateListener);
event.protectListener(onbeforeUpdate)

if(typeof window!="undefined"){
window.interface=interface;
window.storage=storage;
window.updateHTML=updateHTML;
window.input=input;
window.form=form;
window.toHTML=toHTML;
window.validate=validate;
 window.Inter=Inter;
 window.simulate=simulate;
window.ROUTER=ROUTER;
 window.supportInter=supportInter;
 window.url=url;
 window.data=data;
 window.getValue=getValue;
 window.backend=backend;
 window.event=event; 
 window.whileLoading=whileLoading
window.app=app;
window.template=template;
}
  //Import just the code needed
  if(typeof module!="undefined" && typeof module.exports=="object"){
    exports.validate=validate;
    exports.Inter=Inter;
    exports.backend=backend
    exports.simulate=simulate;
    exports.supportInter=supportInter;
    exports.data=data;
    exports.url=url;
    exports.input=input;
    exports.getValue=getValue;
    exports.toHTML=toHTML;
    exports.app=app;
    exports.event=event;
    exports.template=template;
    exports.app=app;
    exports.getValue=getValue;
    exports.ROUTER=ROUTER;
    exports.form=form;
    exports.interface=interface;
    exports.input=input;
    exports.storage=storage;
    exports.updateHTML=updateHTML;

  }


 
})();
 
/**
 * This is the source code of Inter.
 * Inter is a Javascript library that helps create a more intuitive understandable and
 * mantainaible code base, and the result is interactive frontend apps.
 * Inter 1.0
 *  Created by Denis Power.
 * 2021
 */

