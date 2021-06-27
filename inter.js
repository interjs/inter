/**
 * Inter.
 * Version: 1.1.2
 * 2021 -  by Denis Power.
 * https://github.com/DenisPower1/inter
 * A Javascript framework to build interactive frontend applications.
 * 
 * 
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


function hasOwn(key){

    return key in this; 

}


function isDefined(v){
  return   v!==void 0  && v!=null;
}

function isBoolean(v){
    
    return v==true || v==false;
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
if(theId== void 0){
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

function setAttr(el,attr, value){

    
    if(el==void 0){
      return undefined;
    }else{
 
        return el.setAttribute(attr, value)
}
}

function getAttr(el, attr){
   if(el==void 0){
         return undefined;
   }else{
    return el.getAttribute(attr);
}
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

//Special for routing.
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
                A valid pathName must start with /.
                `)
            }
        }
    }
	if(isButtonOrAnchor(child) && hasAttr(child,"useHash")){
	child.onclick=(ev)=>{
		ev.preventDefault();
		const routeTo=getAttr(child, "useHash");
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

// Special for reativeTemplate.

function nodeCloner(root){
const clone=CreatEL(root.nodeName);

for(let child of root.children){
    const childClone=child.cloneNode(!0);
    
    Object.entries(child).forEach(pr=>{
        const[prop, value]=pr;
        const transformed=prop.replace("_","");
        childClone[transformed]=value;
        if(prop.startsWith("_")){
            //For consistence clone.
            childClone[prop]=value;
        }
        
     
    })
    if(hasUndeepChild(child)){
        let index=-1;
        for(let son of child.children){
            index++;
            const sonClone=son.cloneNode(!0);
            Object.entries(son).forEach(cl=>{
                const[prop, value]=cl;
                const transformed=prop.replace("_","");
                sonClone[transformed]=value;
            })
            childClone.replaceChild(sonClone, childClone.children[index]);
        }
    }
    clone.appendChild(childClone);
}
return clone;
}
function notEqual(first,second){
 
    return !(Object.is(first,second));
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

//As Inter store a lot of data in memory, it can cause memory lack, so let's manage it.

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
        return true;
    }catch(e){
        return false;

    }

}


//ES200 feaures, they are not so old  to include them without checking if they are supported.

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
 * OLD TEMPLATE
 * <div>
 * <p>Hey, are you fine?</p>
 * <input type="text">

 * </div>
 * 
 * NEW TEMPLATE
 * 
 * <div>
 * <input type="text">
 * </div>
 * 
 */
const greaterAttrs=(one,two)=>{
    
const first=one.attributes.length;
const second=two.attributes.length;
return first>second ? first : second;
}
  function noTextTag(first,second){
    
const noTextTag={
    video:!0,
    audio:!0,
    input:!0,
    textarea:!0,
    
};
const FirstTag=lowerCase.call(first.nodeName);
const secondTag=lowerCase.call(second.nodeName);

   return hasOwn.call(noTextTag,FirstTag) && !notEqual(FirstTag,secondTag);     

  }
  function notSameText(node1,node2){
    
        return !(Object.is(node1.textContent,node2.textContent))
  }

 function oneHasChildAndOtherNot(first,second){
     if(hasUndeepChild(first) && !hasUndeepChild(second) ||
     !hasUndeepChild(first) && hasUndeepChild(second)
     ){
         return true;
     }
 }


function makeChange(newChild,oldChild){
    
    if(noTextTag(newChild,oldChild)){
        
     const length=greaterAttrs(newChild,oldChild);
     const newChildAttrs=newChild.attributes;
     const oldChildAttrs=oldChild.attributes;
     for(let i=0; i<length; i++){
         /**
          * brand
          * <input type="text">
          * 
          * Old
          * 
          * <input type="text" placeholder="Yes">
          * 
          */
         const brand=newChildAttrs[i];
         const old=oldChildAttrs[i];
        
             if(!hasAttr(newChild,old.name)){
                         
                   oldChild.removeAttribute(old.name);
             }else{
                 if(notEqual(old.value,brand.value)){
                     
                     if(old.name!="value"){
                         setAttr(oldChild,old.name,brand.value);
                     }else{
                         oldChild.value=brand.value;
                     }
                 }
             }
         

     }
    }else{
/**
 *<p></p>
 *<p></p>
 * <button></button>
 *
 */
        //Any diff, we can rerender it.
        
        const newChildAttrs=newChild.attributes;
        const oldChildAttrs=oldChild.attributes;
        if(notSameText(newChild,oldChild)){
          
    
            oldChild.parentNode.replaceChild(newChild,oldChild);

        }else{
            
          if(newChildAttrs.length!=oldChildAttrs.length){
         
              oldChild.parentNode.replaceChild(newChild, oldChild);
          }else{
            
              for(let brand of newChildAttrs){
                
                
                if(!hasAttr(oldChild,brand.name)){
    
                    oldChild.parentNode.replaceChild(newChild,oldChild);
                    break;
                }
                if(hasAttr(oldChild, brand.name) && notEqual(getAttr(oldChild, brand.name), brand.value)){
                     oldChild.parentNode.replaceChild(newChild, oldChild);
                     break;
                }
              }
          }
        }
        }
    
}
function isTag(supposedTag){
if( supposedTag == void 0){
    return false;
}else{
    return supposedTag.nodeType==1;;
}
}
function hasSibling(tag){

    if(isTag(tag.previousElementSibling)){
           return true;
    }else{
        return false;
    }
}
function applyChange($new,$old){
    const oldChildren=$old.children;
    const newChildren=$new.children;
    
    
    const length=$new.children.length;

    for(let i=length-1; i>-1; i--){
        const newChild=newChildren[i];
        const oldChild=oldChildren[i];

      
    
       
    if(notSameTag(newChild,oldChild) && isTag(newChild) && isTag(oldChild)){
        
        
            oldChild.parentNode.replaceChild(newChild,oldChild);
        
        continue;
    }
    if(hasUndeepChild(newChild)){
    for(let n=newChild.children.length-1; n>-1; n--){
        
        const newGrandSon=newChild.children[n];
        const oldGrandSon=oldChild.children[n];
      
        makeChange(newGrandSon, oldGrandSon)
    }
    continue;
    }
    if(!notSameTag(newChild,oldChild) && isTag(newChild) && isTag(oldChild)){
           makeChange(newChild,oldChild);  
    }
    }
}

const parser={
    applyChange(n,o){
    return applyChange(n,o);
    },
    has(root){
   return has(root);
    },
    change($new,$old){

        
        if(hasUndeepChild($new) && hasUndeepChild($old)){
          
            
        this.applyChange($new,$old);
    
        
      
      

    }
    
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
   if(new.target!==void 0){
       SyntaxErr(`
       You must not create an instance for whileLoading() function. 
       `)
   }
   if(!isPlainObject(obj)){
       SyntaxErr(`
         The value passed as argument in the method 
         whileLoading() must be any object.
       
       `)
   }else{

    /**
     * wileLoading({
     * 
     * elements:[{
     * tag:"div", children:[{
     * 
     * tag:"img", attrs:{
     * src:"loader.gif"
     * }
     * },{
     * 
     * tag:"h3", text:"Page loading..."
     * }]
     * }]
     * })
     */

    const{
      elements,  
      
    }=obj;
    let elArr=[...elements]
   let root=null;
  
   
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
               events={},
               attrs={},
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
               if(!isCallable(text)){
               childElement.appendChild(TEXT(text));
               }else{
                   childElement.appendChild(TEXT(text()))
               }
           }
           _el.appendChild(childElement);
       })
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
function objShareKeys(target,source){

    //I created this because Object.assign() does not resolve the problem in Inter.renderIf();

    const targetKeys=Object.getOwnPropertyNames(target);

    for(let key of targetKeys){
        source[key]=target[key];
    }
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

//Note: render  is just usual for reative template.
/**
 * templates({
 * elements:[{
 * tag:"p", text:"Conditional", render:this.render,
 * }
 * }]
 * })
 * 
 */
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
          styles={},
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
          htmlElement.rerender=true;
      });
      Object.values(handlers).forEach(handler=>{
         if(isCallable(handler)){
          htmlElement.rerender=true;
            return handlers[handler].call(htmlElement);
         }
      })
      Object.entries(styles).forEach(style=>{
        const[styleName,styleValue]=style;
        if(isCallable(styleValue)){
            if(isDefined(styleValue())){
                htmlElement.style[styleName]=styleValue();
            }
        }else{
            if(isDefined(styleValue)){
                htmlElement.style[styleName]=styleValue;
            }
        }
            })
    if(!isEmptyArray(children)){
      /**
       *children:[{}]
       */
      children.forEach((child, i)=>{
          const{
              tag:_tag,
              text:_text,
              attrs:_attrs={},
              events:_events={},
              render,
              handlers:_handlers={},
              styles:_styles={},
              children=[],
          }=child;
          const childElement=CreatEL(_tag);
        
        if(!notEqual(render, true) || !notEqual(render, false)){
            
            childElement.render=render;
            childElement.index=i;
        
        }

            
          Object.entries(_attrs).forEach(att=>{
              
              const[attName,attValue]=att;
            
              if(isCallable(attValue)){
                  if(isDefined(attValue())){
                   
                  setAttr(childElement,attName, attValue());
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
              childElement[`_${evName}`]=evValue; //Reative template
              childElement.rerender=true; // Reative listining.
          })
          
          Object.values(_handlers).forEach(handler=>{
             
              if(isCallable(handler)){
                  childElement.rerender=true;
                  return _handlers[handler].call(childElement);
              }
          })
          Object.entries(_styles).forEach(sty=>{
              const[styleName,styleValue]=sty;
              childElement.style[styleName]=isCallable(styleValue) ? styleValue() : styleValue;
          })
          
          if(isDefined(_text)){
              if(!isCallable(_text)){
            
              childElement.appendChild(TEXT(_text));
          }else{
              childElement.appendChild(TEXT(_text()))
          }}
          Array.from(children).forEach((grandson, ind)=>{
            const{
                tag,
                text,
                render,
                attrs:$attrs={},
                events:$events={},
                handlers:$handlers={},
                styles:$styles={},
            }=grandson;
        
            const grand_son=CreatEL(tag);
            if(!notEqual(render,true) || !notEqual(render, false)){
                grand_son.render=render;
                grand_son.index=ind;
            }
            Object.entries($attrs).forEach($attr=>{
                const[name,value]=$attr;
                
                if(isCallable(value)){
                    if(isDefined(value())){
                        setAttr(grand_son,name,value());
                    }
                }else{
                    if(isDefined(value)){
                    
                        setAttr(grand_son,name,value);
                    }
                }
            })
            Object.entries($events).forEach($ev=>{
                const[name,value]=$ev;
                
                grand_son[name]=value;
                grand_son[`_${name}`]=value;
                grand_son.rerender=true;
            })
            Object.values($handlers).forEach(value=>{
               
                if(isCallable(value)){
                    grand_son.rerender=true;
                    value()
                }

            })
            Object.entries($styles).forEach(sty=>{
                const[styleName,styleValue]=sty;
                grand_son.style[styleName]=isCallable(styleValue) ? styleValue() : styleValue;
            })
            if(isDefined(text)){
                if(isCallable(text)){
                    grand_son.appendChild(TEXT(text()));
                }else{
                    grand_son.appendChild(TEXT(text));
                }
            }
            if(lowerCase.call(grand_son.tagName)!="null" && lowerCase.call(grand_son.tagName)!="undefined"){
                childElement.appendChild(grand_son);
            }
        })
          if(lowerCase.call(childElement.tagName)!="null" && lowerCase.call(childElement.tagName)!="undefined"){
            
          htmlElement.appendChild(childElement)
          }
      })
     
    }
    if(isDefined(text)){
        if(!isCallable(text)){
        htmlElement.appendChild(TEXT(text));
    }else{
        htmlElement.appendChild(TEXT(text()))
    }}
    if(lowerCase.call(htmlElement.tagName)!="null" && lowerCase.call(htmlElement.tagName)!="undefined"){
     tags.push(htmlElement);
    }
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
    window.history.pushState(null, null,`/#${pathname}`);
    event.fire("URLCHANGED")
    return false;
}
if(pathname!="/" && atualUrl=="/"){
    window.history.pushState(null, null, `/#${pathname}`);
    event.fire("URLCHANGED")
    return false;
}else{
    window.history.replaceState(null, null,`/#${pathname}`);
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

//ajax based in promise

function BACKEND(){


}

const toUpperCase=String.prototype.toUpperCase;



BACKEND.prototype.request=function(obj){
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

   if(isPlainObject(obj)){

   }
    

    const{
           type,
           path,
           events={},
           headers={},
           body,
           security={},
           withCridentials,
       }=obj;
      
 
       let theRequest=new XMLHttpRequest();
      
       function REQUEST(){
      
       if(isTrue(withCridentials)){
           theRequest.withCredentials=true;
       }
       
       
       const method=toUpperCase.call(type);
    if(emptyOBJ(security) || !isDefined(security)){
       theRequest.open(method,path,true);
    }else{
        if(isPlainObject(security)){
            theRequest.open(method,path,true,security.username,security.password);
        }
    }
       Object.entries(headers).forEach(header=>{
           const[name,value]=header;
           theRequest.setRequestHeader(name,value);
       });
       Object.entries(events).forEach(event=>{

           const[evName,evValue]=event;
           if(evName=="onerror" || evName=="onload"){
               SyntaxErr(`
               You can not listen for "${evName}" event in backend.request(), it's ilegal.
               `)
           }
           if(isCallable(evValue)){
               theRequest[evName]=evValue.call(theRequest);
           }
       })
    
       theRequest.onload=function(){
          //Parsing the response.
           let response=null;
             try{
               JSON.parse(response);
               response=JSON.parse(this.responseText)  
               if(isCallable(back_R_OBJ.okay)){
                back_R_OBJ.okay.call(theRequest,response);

               } 
            }catch(e){
                 response=this.responseText;
                 if(isCallable(back_R_OBJ.okay)){
                    back_R_OBJ.okay.call(theRequest,response);
                   }
                }
               
        }
           theRequest.onerror=function(){
            if(isCallable(back_R_OBJ.error)){
            back_R_OBJ.error.call(theRequest);
           }
           }
        
           
       if(method=="GET" || method=="DELETE"){
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
         The argument in okay respons method must be a function.
         `)
     }else{
         back_R_OBJ._set("okay",fn);
         REQUEST();
     }
    },
    error(fn){
     if(!isCallable(fn)){
         SyntaxErr(`
         The argument in error response method must be a function.
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
         The arguments in backend.request().response() must be functions.
         `)
       
    }else{
        
         
     
         back_R_OBJ._set("okay",okay);
         back_R_OBJ._set("error",error)
         REQUEST();
     }
    
}

   
}
}
const backend=new BACKEND();

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
      const shared=Object.assign(Object.create(null),data);
      Object.getOwnPropertyNames(data).forEach(prop=>{
          Object.defineProperty(data,prop,{
              get(){
                
                  return shared[prop];
              }
          })
          if(isCallable(data[prop])){
             shared[prop]=data[prop].call(data);
             
          }
      })
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
                 shared[key]=value;
                  
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
              return Reflect.get(Target,key,pro)
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
           
        
        if(father.getElementsByTagName("*").length!=value.getElementsByTagName("*").length){
            
            parent.replaceChild(value,father);
            
           
            return;
        }   
   let root=parent.children[ind].children;
   const target=value.children;
   

    
   for(let el=target.length-1; el>-1; el--){

       if(hasUndeepChild(target[el])){
        
       const targetChildren=target[el].children;
       const rootChildren=root[el].children;
       if(targetChildren.length!=rootChildren.length){
           root[el].parentNode.replaceChild(target[el],root[el]);
       }else{
           for(let p=rootChildren.length-1; p>-1;p--){
              
              
               if(deeplyNotIqualElements(rootChildren[p],targetChildren[p])){
                   
                   rootChildren[p].parentNode.replaceChild(targetChildren[p],rootChildren[p]);
               }
            
           }
           continue
       }

       }else{
           if(deeplyNotIqualElements(root[el],target[el])){
        
           }
       }


 if(isDefined(root[el]) && isDefined(target[el]) && !hasUndeepChild(target[el]) &&
 deeplyNotIqualElements(root[el],target[el]) ){
     
if(!hasUndeepChild(target[el])){

    root[el].parentNode.replaceChild(target[el],root[el])  
   
}
   
 
}

}
   }else{
    
       const child=parent.children[ind];
      if(deeplyNotIqualElements(child,value)){
        parent.replaceChild(value,child)
      }
   }



    }
    function deeplyNotIqualElements(target,toCompare){
       
       let returnValue=false;
      const ta_attributes=target.attributes;
      const to_attributes=toCompare.attributes;
    const render=toCompare.rerender;
    
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



     // Special for Inter.for()

function makeReactive(obj, call){


 const share=Object.assign({},obj)   
const properties=Object.keys(obj);

properties.reduce(($,key)=>{
  
Object.defineProperty(obj,[key],{
set(value){
  share[key]=value;
 
 call()
 
  
},
get(){
    return share[key];
}
})
    
},[])

}



definePro(Inter, "for", (obj)=>{
    let{
    in:IN,
    do:DO,
    data,
    react,
   
}=obj;


let pro=null;

if(isArray(data)){

function proSetup(){
    
     
    pro=new Proxy(data,{
        set(target,key,value,prot){
            
           target[key]=value;
           
            if(isPlainObject(value)){
              makeReactive(value,Work)
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
        makeReactive(v, Work)
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
  

  Object.defineProperty(pro, "concat",{
   value:(value)=>{
       //the proxy does not work for concat() method, reason why I did this polyfill
       if(!isArray(value)){
     pro.push(value);
     if(isPlainObject(value)){
        makeReactive(value,Work)
    }
    
     return [...data];
   }else{
       for(let item of value){
       pro.push(item);

       }
       Work()
       return [...data];
   }},
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
         
     makeReactive(_obj, Work);

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
     
        [...data].forEach((item, i)=>{
            var value=DO.call(pro,item, i);
              
     
        for(let el of value){
          
            
            root.appendChild(el);
        }
      
    
    })
    someRef.set(IN);
    return false;
}
    if(someRef.has(IN)){
    
    data.forEach((el, i)=>{
    

      let _value=DO.call(pro,el,i);
  
    if(isDefined(root.children[i])){

      for(let _el of _value){
      
        calculateUpdate(_el,root,i)
      }
    }
    if(!isDefined(root.children[i])){
    
    if(data.length>root.children.length){
       for(let v of _value){


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

function ROUTER(obj){
if(!isPlainObject(obj)){
SyntaxErr(`
The argument of ROUTER() must be an object.
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
        Route name must start with /.
        `)
    }

    if(!isCallable(routeAction)){
        SyntaxErr(`
        Route action must be a function.
        `)
    }
   
    if(routeName.includes("/*")){
       
    const sub=routeName.replaceAll("*","(:?[\\s\\S]+)");
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
if(!isUsingHash()){
    let done=false;
    const atualPath=window.location.pathname;
    
Object.keys(organizedRoutes).some(orgRoute=>{
    let reg=new RegExp();
    if(reg.compile(orgRoute).test(atualPath)){
        done=true;
        organizedRoutes[orgRoute]();
        
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
        
                 StoreNotFoundRoute.get();
        
                }else{
                    consoleWarnig(`
                    You should always create a notfound route with "*" property.
                    `)
                }
        }
        } 

 event.listen("URLCHANGED",()=>{
    if(!isUsingHash()){
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
 
          StoreNotFoundRoute.get();
 
         }else{
             consoleWarnig(`
             You should always create a notfound route with "*" property.
             `)
         }
 }
     }    
    })


window.onpopstate=()=>{
    if(!isUsingHash()){
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
    
             StoreNotFoundRoute.get();
    
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
      Oh no man, the state that you're register already exist "${state}".
      
      `)
    }
    if(arguments.length<2){
        consoleWarnig(`
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
     * backend.upload({
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
        You must define the element to check its existence in the storage.
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
window[attrManager]=emptyObj[attrManager];

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
     *
     */
    if(!isPlainObject(obj)){
        SyntaxErr(`
        The argument in "toATTR()" function must be an object.
        `)
    }else{
  const{
      in:IN,
      data,
      
  }=obj;
  
  const root= getId(IN)
               

  if(!isPlainObject(data)){
SyntaxErr(`
data in toATTR() must be an object.
`)
  }else{
      
   findDynamicAttrs(root,data);
  }      
    }
}



//A major feature in Inter v1.1
// REATIVE TEMPLATE BY DEFAULT.
/**
 * const obj={};
 * 
 * reativeTemplate({
 * react:obj,
 * in:"container",
 * render(){
 * let self=this,
 * return  template({
 * elements:[{
 * tag:"div", children:[{
 * tag:"p", text:this.numero, 
 * 
 * },{
 * tag:"button", text:"Contar", events:{
 * onclick(){
 * self.numero++;
 * }
 * }
 * }]
 * 
 * }]
 * })
 * 
 * }
 * })
 * })
 * 
 * }
 * 
 * })
 * 
 */
 

function notSameNode(old,brand){
    
    /**
     * O
     *<div>
     *<h1></h1>
     *<input>
     * <p>...</p>
     * 
     *</div>
     *
     * N 
     *<div>
     *<h1></h1>
     *<input>
     * <p>.</p>
     * 
     *</div>
     * 
     */

    const oldIndex=old.index;
    const brandIndex=brand.index;

return  notEqual(oldIndex, brandIndex)



}


function reativeTemplate(obj){
    if(new.target!==void 0){
        SyntaxErr(`
        "reativeTemplate" is not a construtor, do not invoke it with "new" keyword.
        `)
    }
    if(!isPlainObject(obj)){
        SyntaxErr(`
        The argument in reativeTemplate function must be an object.
        `)
    }else{
        const{
            react,
            in:IN,
            render,
            
        }=obj;
        const root=getId(IN);
     
    
         const pro =new Proxy(react,{
            set(...args){
                
                Reflect.set(...args)
                const node=render.call(pro)
                
                for(let i=0; i<node.length;i++){
                   
            RTCOMPARISION(node[i],root,i);
                }
            
            },
            
            deleteProperty(...args){
              Reflect.deleteProperty(...args)
              const node=render.call(pro)
                
              for(let i=0; i<node.length;i++){
                 
          RTCOMPARISION(node[i],root,i);
              }
            }
        })
        const mustBeRemoved=array.create(null);
        const grandRemoved=array.create(null);
        for(let o of render.call(pro)){
            if(!hasUndeepChild(o)){
                SyntaxErr(`
                Reative template must be wrapped in a container.
                `)
            }
            for(let child of o.children){
                const render=child.render;
                
             
                 if(!notEqual(render, false)){
                 
                mustBeRemoved.push(child);     
                
                 }else{
                    if(hasUndeepChild(child)){
                        for(let grandSon of child.children){
                            const rend=grandSon.render;
                            if(!notEqual(rend, false)){
                             grandRemoved.push({
                                 parent:child,
                                 el:grandSon
                             })
                            }
                        }
                    }
                 }
                }
            for(let removeGrand of grandRemoved){
                const{
                    el,
                    parent
                }=removeGrand;
                parent.removeChild(el);
            }
            for(let removeChild of mustBeRemoved){
                
            
                
                 o.removeChild(removeChild);
            }
            root.appendChild(o);
            }
        
        }
}



function tagName(tag){
    return lowerCase.call(tag.nodeName);
}


 function notSameTag(tag1,tag2){
     return !(Object.is(tag1.nodeName, tag2.nodeName))
}



function RTCOMPARISION(_new,root,p){
    
   
    
    const old=root.children[p];
    if(notSameTag(_new,old)){
      
        root.replaceChild(_new, old);
        return false;

    }
   
    let cloneNode=nodeCloner(_new);
    const newDOmCollection=array.create(_new.children);
    
  let $new=nodeCloner(_new); 

  
    let transformed=false;
    /**
     * <div>
     * <p rende=true ind=0></p>
     * <p></p>
     * <p render="false" ind=1></p>
     * <button></button>
     * </div>
     * 
     * OLD
     * 
     * <div>
     * <p></p>
     * <p></p>
     * <button></button>
     * </div>
     * 
     * 
     */

      
       function check(){
       const length=newDOmCollection.length;
       const theOneRemoved=array.create(null);
       const theOneAdded=array.create(null);
       
       const grandAdded=array.create(null);
       const oldGrandRemoved=array.create(null);
       
      
       for(let i=0; i<length; i++){
       
         const brand=newDOmCollection[i];
         const oldChild=old.children[i] == void 0 ? old.children[old.children.length-1] : old.children[i] ;
         const render=brand.render;
      
        if(hasUndeepChild(cloneNode.children[i])){
           
           
            for(let u=0; u<brand.children.length; u++){
                
                const oldGrand=()=>{
                if(oldChild===void 0){
                    return void 0;
                } 
                
                if(oldChild.children[u]==void 0){ 
                  return  oldChild.children[oldChild.children.length-1]}
                    else{
                       return  oldChild.children[u];
                    }
            }
                const brandGrand=brand.children[u];
                const rend=brandGrand.render;
                if(!notEqual(rend,true)){
                   
                    if(oldGrand() ==void 0 || notSameNode(brandGrand, oldGrand())){
               
                   grandAdded.push({
                       id:u,
                       el:brandGrand,
                       parent:oldChild==void 0 ? old.children[old.children.length-1] : oldChild,
                   })
                   transformed=true;
                    }
                    
                    
                } else{
                    if(!notEqual(rend, false)){
                       
                        if(oldGrand()!==void 0  && !notSameNode(brandGrand, oldGrand())){
                         
                            oldGrandRemoved.push({
                                el:oldGrand(),
                                parent:oldChild==void 0 ? old.children[old.children.length-1] : oldChild,
                            })
                          
                        }
                    }
                }
            }
        }
      
       
    

        if(!notEqual(render, true)){
           
              if(oldChild==void 0 || notSameNode(brand,oldChild)){
               
                 theOneAdded.push({
                     id:i,
                     el:brand,
                 })
                
              transformed=true;

           
         }
        }else{
        
            if(!notEqual(render, false)){
              
          if(oldChild!==void 0 && !notSameNode(oldChild,brand) ){
    
            theOneRemoved.push({
                  el:oldChild,
                  id:i,
              });
         
            transformed=true;
            }
         }         

        }
        
       
    
}
    for(let remove of theOneRemoved){
        const{
            el,
        
        }=remove;
    
        old.removeChild(el);
        
    
        

    }

    for(let re of oldGrandRemoved){
const{
    el,
    parent
}=re;

parent.removeChild(el);
    }
    for(let added of grandAdded){
        const{
            el,
            id,
            parent,
        }=added;
       
           if(parent.children[id]==void 0){
               parent.appendChild(el);
           }else{
           
               const reference=parent.children[id];
               parent.insertBefore(el, reference);
             
           }
         
    }



     for(let add of theOneAdded){
         const{
             id,
             el,
         }=add;
        
            
         if(old.children[id]==void 0){
             old.appendChild(el);
         }else{
           
           
         
            old.insertBefore(el, old.children[id]);
         
           
            
         }
       
        
     }
      
     
  
   
    }
  
       
check()  

if(!transformed){
    
 
const length=$new.children.length
    for(let i=0;  i<length; i++ ){
  
const child=$new.children[i];
if(child==void 0){
    continue;
}

const render=child!==void 0 ? child.render : undefined;

//Do not use hasUndeepChild() here, because won't work properly.
if(child.children.length>0){

    for(let son of child.children){
       const rend=son.render
       
      if(!notEqual(rend, false)){
        
          child.removeChild(son);
      }
    }
}
if(render==void 0){
    continue;
}

if(render==false){
    
    $new.removeChild(child)
    i--;

}
    
}

    
  
}else{
    let length=cloneNode.children.length;
   for(let i=0; i<length; i++ ){
        const child=cloneNode.children[i];
       const render=child.render;
       
       if(!notEqual(render, false)){
           
           cloneNode.removeChild(child);
           i--;
           length--;
       }else{
        if(hasUndeepChild(child)){
            for(let son of child.children){
                const rend=son.render;
                if(!notEqual(rend, false)){
                    child.removeChild(son);
                }
            }
        }
       }
   }
   
}



parser.change(transformed ? cloneNode : $new, old)

}


/**
 * <div _istrue="mostrarContainer">
 * //Many children here
 * </div>
 * <div _default>
 * //Default container
 * 
 * </div>
 * renderContainer({
 * in:"root",
 * data:{
 *mostrarContainer:false, 
 *},
 * react:"gerenc"
 * })
 * 
 */

 
function reativeAttributes(root){
 const children=root.children;
 const theEls=array.create(null);
 const removed=array.create(null);
 let index=-1;
 for(let child of  children){
   index++;
   
  
    if(hasAttr(child, "_istrue")){
        if(hasAttr(child, "_default")){
            SyntaxErr(`
            A container can not have two reative attributes.
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
                 A container can not have two reative attributes.
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

 return theEls;
}


function renderContainer(obj){
    if(new.target!==void 0){
        SyntaxErr(`
        "renderContainer" is not a constructor, do not call it
        with the "new" keyword.
        `)
    }
    if(!isPlainObject(obj)){
        SyntaxErr(`
        The argument in "renderContainer" must be a n object.
        `)
    }else{
const{
    in:IN,
    data,
    react,
}=obj;
const reatives=reativeAttributes(getId(IN));

const _react=Object.assign({}, data);
const share=Object.assign({}, data);
const dataKeys=Object.getOwnPropertyNames(data);
for(let key of dataKeys){
    
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
            The value in ${react}.register must be an array.
            `)
        }
        if(just){
            SyntaxErr(`
            You can only register the properties once.
            `)
        }
        if(isEmptyArray(value)){
            SyntaxErr(`
            The array is empty.
            `)
        }else{
            
            for(let prop of value){
                if(!hasOwn.call(data,prop)){
                    consoleWarnig(`
                    There is not a property called "${prop}"
                    in ${react}
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
                            _global[react][re]=v;
                        }
                        
                    }
                }
            })
            Object.seal(this);
        }
    }
})

function checkEls(){
    
    for(let re of reatives){
    
        const{
            cond,
            ifTrue,
            default:Default,
            index
        }=re;
        
         const root=getId(IN);
         const rootChildren=root.children;
        
        if(hasOwn.call(_react, cond)){
            const own=isCallable(_react[cond]) ? _react[cond]() : _react[cond];
            if(!isBoolean(own)){
                consoleWarnig(`
            The values of properties in data object, in renderContainer(), must be
            only boolean(true/false), and in property "${cond}" you defined
            "${own}" as its value.
                `)
            }
        if(!notEqual(own, true) && isDefined(Default)){
         
            if(rootChildren[index]==void 0){
                root.appendChild(ifTrue);
                continue;
            }
            if(rootChildren[index].isSameNode(ifTrue)){
                //DO nothing
            }else{
                if(rootChildren[index].default){
                    root.replaceChild(ifTrue,Default);
                    continue;
                }else{
                
                    root.insertBefore(ifTrue, rootChildren[index]);
                }
            }
        }else{
       if(!notEqual(own, false) && isDefined(Default)){
      
        if(rootChildren[index]==void 0){
            root.appendChild(Default);
            continue;
        }
        if(rootChildren[index].isSameNode(Default)){
            //Do nothing
        }else{
            if(rootChildren[index].istrue){
                root.replaceChild(Default, ifTrue);
                continue;
            }
            else{
                root.insertBefore(Default, rootChildren[index]);
            }
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
    if(ifTrue.parentNode!==null){
        root.removeChild(ifTrue);
    }   
     
        }
        }

    

        }
    }
    _global[react]=_react;

}
checkEls();


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
_global.getValue=getValue;
_global.backend=backend;
_global.event=event; 
_global.whileLoading=whileLoading
_global.app=app;
_global.template=template;
_global.toATTR=toATTR;
_global.reativeTemplate=reativeTemplate;



  //Import just the code needed

  if(typeof module!="undefined" && typeof module.exports=="object"){
    exports.renderContainer=renderContainer;
    exports.whileLoading=whileLoading;
    exports.reativeTemplate=reativeTemplate;
    exports.toATTR=toATTR;  
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
  

  }


 
})();
 


