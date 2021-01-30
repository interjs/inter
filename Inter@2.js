/**
 * Inter.
 * Version: 2.0.
 * A Javascript library to build interactive interfaces.
 * Created by Denis.
 * You should not modify this code!
 */


//Ainda sendo desenvolvida.


(function(global,exports){

function isJson(v){
     return Object.prototype.toString.call(v)==="[object Json]";
}
function isPlainObject(v){
return Object.prototype.toString.call(v)==="[object Object]";
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
function hasOwn(obj, key){
 return   Object.prototype.hasOwnProperty.call(obj,key);
}
function isDefined(v){
  return   valueType(v)!="undefined" && v!="" && v!=null;
}
function isBoolean(v){
    valueType(v)=="boolean";
}
function SyntaxErr(err){
    throw new SyntaxError(err)
}
function Warning(err){
    throw new TypeError(err)
}

function getId(id){
return document.getElementById(id)
}
function getClass(Class){
    return document.querySelector(`${Class}`);
}
function consoleWarnig(msm){
    console.warn(msm)
}
function TEXT(node){
    return document.createTextNode(node);
}
function hasAttr(el, attr){
    if(el.getAttribute(attr)){
        return true;
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

function emptyValue(el){
return el.value="";
}

var Private=Symbol.for("private")

const watcher={
    obj:Object.create(null),
    set([key, value]){
   
   return   Object.defineProperty(this.obj, [key],{
       value:value, 
       configurable:!0
    })   
    },
    get(key){
    return this.obj[key];
    },
    delete(key){
      return delete this.obj[key];    
    }
}
var cancel=false;
const store=Object.create(null)

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

function ID(html){
    "use strict"
    const el=getId(html);

    if(el==null){
        Warning(`
        You're trying to acess an element by id that does not exist in actual document tree
        `);
    }else{
       return  {
    
           addStyle(styleobj){
               if(!isPlainObject(styleobj)){
               SyntaxErr(`
               The argument passed in the method addstyle()
               must be an object with the proprieties and values to apply.
               `)
               }else{
            nativeStyle(el, styleobj); 
               }
           },
           write(msm){
               if(/<(:?.+)>(:?.+)*<\/(:?.+)>|<(:?.+)>/ig.test(msm)){
                  SyntaxErr(`
                  The value to write must not be an html template.
                  `)

               }else{
               return el.innerHTML=msm;
           }
        
        },
        [Private](strs){
        const t=TEXT(strs);
        el.appendChild(t)
        },
           attr(obj){
             if(!isPlainObject(obj)){
                 SyntaxErr("The argument passed in the method attr() must be an object")
             }else{
                 const{attr}=obj;
                 const{value}=obj;
                setAttr(el, attr, value)
             }

           },
   
       remove(child, obj){
            try{
            const{
                smoth
            }=obj;
            if(smoth){
                Id(child).tag.style.transition="opacity 350ms";
                Id(child).tag.style.opacity="0",
                setTimeout(() => {
                   el.removeChild(Id(child).tag); 
                }, 360);
            }
            }
         catch(e){
             Warning(`
             Something went wrong, probably the element you are trying to remove
             is not child of the container you are deleting it from.
             `)
         }   
        },
       emptyValue(){
if(String.prototype.toLowerCase.call(el.tagName ||el.nodeName)!="input"){
   consoleWarnig(`
   Id().empty() must be only applied in input elements
   `)
}else{
emptyValue(el)
}
       },
           update(obj){
               if(!isPlainObject(obj)){
                   SyntaxErr("The value passed as argument in the method update must be an object");
               }
               if(!/<(:?.+)>(:?.+)*<\/(:?.+)>|<(:?.+)>/ig.test(obj.value)){
                   SyntaxErr(`
                   The value of update must be an html template.
                   `)
               }
               else{
                   const{
                    value,
                    watch_Change,   
                    smoth=false}=obj;
                    if(watch_Change && watcher.get(el)===value){
                        return;
                    }else{
                    watcher.set([el, value]);
                    
                    if(smoth){
                      
                   el.style.transition="opacity 300ms";
                   el.style.opacity="0";
                   setTimeout(() => {
                     
                       el.innerHTML=value;
                       el.style.opacity="1"
                       
                   }, 340);    
                   
                   if(!smoth){
                       el.innerHTML=value
                   }
               };
               
           }
        }
    },

           empty(obj){
               if(isPlainObject(obj)){
                   const{smoth=false}=obj;
                   if(smoth){
                    el.style.transition="opacity 300ms";
                    el.style.opacity="0";
                    setTimeout(() => {
                      el.innerHTML="";
                      el.style.opacity="1";  
                    }, 340);
                   }else{
                       el.innerHTML="";
                   }
               }else{
                   el.innerHTML=""
               }

           },
           cancelEvent(ev){
               const native_Events={
                  click:"onclick",
                  hover:"onmouseover",
                  hoverOut:"onmouseout",
                  send:"onsubmit",
                  playing:"onplaying",
                  scroll:"onscroll", 
                  write:"onkeydown",
                  
               }
              for(let i in native_Events){
                  if(ev===i){
                   el[native_Events[i]]=()=>{
                       return cancel;
                   }
                   return false;   
                  }
              }  
            return el[ev]=()=>{
                return cancel;
            };
           },
           toggleClass(first, second){
            if(arguments.length<2){
            SyntaxErr("You must pass two arguments in the method toggleClass, the first class e the second class");
            }
            
            if(getAttr(el,"class")==first){
           setAttr(el,"class", second)
             return false;  
          
          }else{
            setAttr(el,"class", first)
          return false;
        }
            },
       
           tag:el,
           father:el.parentNode, 
        }
 
 }}
 function CLASS(html){
    const el=getClass(html);

    if(el==null){
        Warning(`
        You're trying to acess an element by class that does not exist in actual document tree
        `);
    }else{
       return  {
           addStyle(styleobj){
               if(!isPlainObject(styleobj)){
               SyntaxErr(`
               The argument passed in the method addstyle()
               must be an object with the proprieties and values to apply.
               `)
               }else{
                 const keys=Object.keys(styleobj);
                 keys.forEach(key=>{
                    el.style[key]=styleobj[key]  
                    
                 })  
               }
            
           },
           write(msm){
            if(/<(:?.+)>(:?.+)*<\/(:?.+)>|<(:?.+)>/ig.test(msm)){
                SyntaxErr(`
                The value to write muste not be an html template.
                `)
            }else{
            return el.innerHTML=msm;
        
        }

        },
        cancelEvent(ev){
            const native_Events={
               click:"onclick",
               hover:"onmouseover",
               hoverOut:"onmouseout",
               send:"onsubmit",
               playing:"onplaying",
               scroll:"onscroll", 
               write:"onkeydown",
               
            }
           for(let i in native_Events){
               if(ev===i){
                el[native_Events[i]]=()=>{
                    return cancel;
                }
                return false;   
               }
           }  
         return el[ev]=()=>{
             return cancel;
         };
        },
        attr(obj){
            if(!isPlainObject(obj)){
                SyntaxErr("The argument passed in the method attr() must be an object")
            }else{
        
                const{attr}=obj;
                const{value}=obj;
               setAttr(el,attr, value);
            }
        },
    
        remove(child, obj){
            try{
            const{
                smoth
            }=obj;
            if(smoth){
                Id(child).tag.style.transition="opacity 300ms";
                Id(child).tag.style.opacity="0",
                setTimeout(() => {
                   el.removeChild(Id(child).tag); 
                }, 320);
            }
            }
         catch(e){
             Warning(`
             Something went wrong, probably the element you are trying to remove
             is not child of the container you are deleting it from.
             `)
         }   
        },
       
     
        father:el.parentNode,
        tag:el,  
        }
 
 }
}
 
  var Id=new Proxy(ID,{
     construct:function(...values){
       SyntaxErr(`You've created an instance for construct,
       and this is a fatal error.
       `)
     }
 });
 var Class= new Proxy(CLASS,{
    construct:function(...values){
      SyntaxErr(`You've created an instance for construct,
      and this is a fatal error.
      `)
    }
})

 class HTML{
     constructor(){}
    forEach(obj){
        if(!isPlainObject(obj)){
            SyntaxErr(`
            The value passed as argument in method forEach()
            must be an object.
            
            `)
        }else{
            const{
               data,
               tag,
               father,      

            }=obj;
            const arr=Array.from(data);
            const root=Id(father).tag;
            arr.forEach(d=>{
              const TXT=TEXT(d);
              const TAG=CreatEL(tag);
              TAG.appendChild(TXT);
              root.appendChild(TAG);

            })
        }
    } 
    addBefore(obj){
   const{
      in:IN,
      element,
      before, 
   }=obj;
   if(!isPlainObject(obj)){

   }else{
       const{
           tag,
           class:Class,
           id,
           href,
           write,
           click,
           hover,
           focus, 
           hoverOut,
           title="",
           text="",
           src="",
           alt="",
           placeholder="",
           value="",
           type=""
       }=element;
       const root=Id(IN).tag;
    switch(tag){
        case"a":
        const _el=CreatEL("a");
    setAttr(_el, "href", href);
    setAttr(_el, "onclick", click);
    setAttr(_el, "id", id);
    setAttr(_el, "class", Class);
    setAttr(_el, "onmouseover", hover);
    setAttr(_el, "onmouseleave", hoverOut);
    _el.appendChild(title)
    root.insertBefore(_el, Id([before]).tag);
      break;
      case"p":
      case"li":
      case"h1":
      case"h2":
      case"h3":
      case"h4":
      case"h5":
      case"h6":
    
     
      const _el2=CreatEL(tag);
    setAttr(_el2, "onclick", click);
    setAttr(_el2, "id", id);
    setAttr(_el2, "class", Class);
    setAttr(_el2, "onmouseover", hover);
    setAttr(_el2, "onmouseleave", hoverOut);
    _el2.appendChild(TEXT(text));
    root.insertBefore(_el2, Id([before]).tag.nextSibling);
    break;
    case"video":
    case"audio":
    const _el3=CreatEL(tag);
    const source=CreatEL("source");
    setAttr(_el3, "onclick", click);
    setAttr(_el3, "id", id);
    setAttr(_el3, "class", Class);
    setAttr(_el3, "onmouseover", hover);
    setAttr(_el3, "onmouseleave", hoverOut);
    setAttr(source, "type", tag=="video"? "video/mp4" : "audio/mp3");
    setAttr(source, "src", src);
    _el3.appendChild(source);
    root.append(_el3);
    break;
    case"img":
    const _el4=CreatEL("img")
    setAttr(_el4, "onclick", click);
    setAttr(_el4, "id", id);
    setAttr(_el4, "class", Class);
    setAttr(_el4, "onmouseover", hover);
    setAttr(_el4, "onmouseleave", hoverOut);
    setAttr(_el4, "src", src);
    setAttr(_el4, "alt", alt);
    root.insertBefore(_el4, Id([before]).tag);
    break;
    case"input":
    const _el5=CreatEL("input");
    setAttr(_el5, "onclick", click);
    setAttr(_el5, "id", id);
    setAttr(_el5, "class", Class);
    setAttr(_el5,"onfocus", focus)
    setAttr(_el5, "onmouseover", hover);
    setAttr(_el5, "onmouseleave", hoverOut);
    setAttr(_el5, "onkeydown", write);
    setAttr(_el5, "placeholder", placeholder);
    setAttr(_el5, "value", value)
    setAttr(_el5, "type", type)
    root.insertBefore(_el5, Id([before]).tag.nextSibling);
    break;
    default:
       SyntaxErr(`ueueueu`) 

};
    
   }
    }
    addContainer(obj){
const{
    in:IN,
    container,
    children,
    id="",
    class:Class="",
}=obj;
const root=getId(IN);
const cont=CreatEL(container);
setAttr(cont, "id", id);
setAttr(cont, "class", Class);
[...children].forEach(el=>{
 const{
     tag,
     click="",
     hover="",
     hoverOut="",
     id="",
     class:Class,
     type="",
     text,
     placeholder="",
     poster="",
     autoplay="",
     controls,
     alt="",
     src,
 }=el;
 switch(tag){
case"button":
const btn=CreatEL(tag);
const txt=TEXT(text);
setAttr(btn, "id", id);
setAttr(btn, "class", Class);
setAttr(btn, "type", type)
setAttr(btn,"onmouseover", hover);
setAttr(btn, "onmouseleave", hoverOut);
setAttr(btn, "onclick", click);
btn.appendChild(txt);
cont.appendChild(btn);
root.appendChild(cont);
break;

    case"p":
    case"li":
    case"h1":
    case"h2":
    case"h3":
    case"h4":
    case"h5":
    case"h6":
    case"figcaption":
    case"span":
    case"strong":
    case"i":

const l=CreatEL(tag);
const Txt=TEXT(text);
setAttr(l, "id", id);
setAttr(l, "class", Class);
setAttr(l,"onmouseover", hover);
setAttr(l, "onmouseleave", hoverOut);
setAttr(l, "onclick", click);
l.appendChild(Txt);
cont.appendChild(l);
root.appendChild(cont)
break;
 
 case"input":
 const inp=CreatEL("input");
 setAttr(inp, "placeholder", placeholder);
 setAttr(inp, "id", id);
 setAttr(inp, "class", Class);
 setAttr(inp, "onclick", click);
 setAttr(inp, "onmouseover", hover);
 setAttr(inp, "onmouseleave", hoverOut);
 cont.appendChild(inp);
 root.appendChild(inp);
 break;
 case"audio":
 case"video":
 const va=CreatEL(tag);
 const sourc=CreatEL("source");
 setAttr(sourc, "autoplay", autoplay);
 setAttr(va, "controls", controls)
 setAttr(va, "poster", poster)
 setAttr(va, "id", id);
 setAttr(va, "class", Class);
 setAttr(va, "onclick", click);
 setAttr(va, "onmouseover", hover);
 setAttr(va, "onmouseleave", hoverOut);
 setAttr(sourc, "src", src);
 setAttr(sourc, "type", type);   
 va.appendChild(sourc);
 cont.appendChild(va);
 root.appendChild(cont);
 break;
 case"img":
 const pic=CreatEL("img");
 setAttr(pic, "src", src);
 setAttr(pic, "alt", alt);
 setAttr(pic, "id", id);
 setAttr(pic, "class", Class);
 setAttr(pic, "onclikc", click);
 setAttr(pic, "onmouseover", hover);
 setAttr(pic, "onmouseleave", hoverOut);
 cont.appendChild(pic);
 root.appendChild(cont);
 break;
 default:
 const elemen=CreatEL(tag);
 setAttr(elemen, "id", id);
 setAttr(elemen, "class", Class);
 setAttr(elemen, "onclick", click);
 setAttr(elemen, "onmouseover", hover);
 setAttr(elemen, "onmouseleave", hoverOut);
 cont.appendChild(elemen);
 root.appendChild(cont);    
}})
    }
   addHTML(obj){
       "use strict"
       if(!isPlainObject(obj)){
         SyntaxErr(`
         The argument passed in the method AddHTML must be a plain object.
         `);  
       }else{
       const{father}=obj;
       const{elements}=obj;
       elements.forEach((el, ind)=>{
           /**
            * Inter.addHTML({
            * father:"html",
            * elements:[
            * {
            * type:"img", src:"Denis.jpg", alt:"Denis'photo"
            * 
            * }
            * ]
            * })
            * 
            */ 
          const{tag}=el;
          const{description=""}=el;
          const{src=""}=el;
          const{alt}=el;
          const{text=""}=el;
          const{href=""}=el;
          const{title=""}=el;
          const{class:Class=""}=el;
          const{id=""}=el; 
          const{click=""}=el;
          const{hover=""}=el;
          const{hoverOut}=el;
          const{placeholder=""}=el;
          const{write}=el;
          const{type}=el;
          const{poster=""}=el;
          const root=Id(father).tag;

          if(!hasOwn(el, tag) && el.tag=="img"){
          const _type=CreatEL(tag);
          const _description=CreatEL("figcaption");
          const descText=TEXT(description);
          _description.appendChild(descText)
           setAttr(_type,"title", title);
         setAttr(_type,"class", Class);
         setAttr(_type,"id", id);
        setAttr(_type,"src", src)
        setAttr(_type, "onclick", click)
        setAttr(_type, "onmouseover", hover)
        setAttr(_type, "onmouseout", hoverOut)
           setAttr(_type,"alt", alt);
           root.appendChild(_type)
           root.appendChild(_description)
           return false;  
        }
        if(!hasOwn(el, tag) && el.tag=="a"){
          const _type=CreatEL(tag);
          const _description=TEXT(description);
          _type.appendChild(_description);
          setAttr(_type,"href", href);
        setAttr(_type,"class",Class);
          setAttr(_type,"title", title);
          setAttr(_type,"id", id);
          setAttr(_type,"onclick", click);
          setAttr(_type,"onmouseover", hover);
          setAttr(_type, "onmouseout", hoverOut);
         root.appendChild(_type);
        return false
        }
        if(!hasOwn(el, tag) && el.tag=="input"){
            const _type=CreatEL(tag);
            setAttr(_type, "type", type);
            setAttr(_type, "id", id);
            setAttr(_type,"class", Class);
            setAttr(_type, "placeholder", placeholder)
            setAttr(_type,"onkeydown", write);
            root.appendChild(_type)
            return false;
            
        }
        if(!hasOwn(el, tag) && el.tag=="button"){
            const _type=CreatEL(tag);
            const T=TEXT(text);
            _type.appendChild(T);
            setAttr(_type, "id", id);
            setAttr(_type, "class", Class);
            setAttr(_type, "onclick", click);
            setAttr(_type, "onmouseover", hover);
            setAttr(_type, "onmouseout", hoverOut);
            root.appendChild(_type);
            return false  
          }
          if(!hasOwn(el, tag) && el.tag=="audio"){
             const _type=CreatEL(tag);
             const _source=CreatEL("source");
            setAttr(_type, "controls", true)
            setAttr(_source, "src", src);
            setAttr(_source, "type", type);
            setAttr(_type, "onclick", click);
            setAttr(_type, "onmouseover", hover);
            setAttr(_type, "onmouseout", hoverOut);
             _type.appendChild(_source)
            root.appendChild(_type)    
            return false;
          }
          if(!hasOwn(el, tag) && el.tag=="video"){
              const _type=CreatEL(tag);
              const _source=CreatEL("source");
            setAttr(_type, "controls", true);
            setAttr(_type, "autoplay", true);
            setAttr(_type, "poster", poster) 
            setAttr(_source, "src", src);
            setAttr(_source, "type", type);
            setAttr(_type, "onclick", click);
            setAttr(_type, "onmouseover", hover);
            setAttr(_type, "onmouseout", hoverOut);
             _type.appendChild(_source)
            root.appendChild(_type)    
            return false;
              
          }

        if(!hasOwn(el, tag) && el.tag!="" && el.tag!=undefined){
           const _type=CreatEL(tag);
           const TXT=TEXT(text);
           _type.appendChild(TXT);
           setAttr(_type,"class", Class);
           setAttr(_type,"id", id);
           setAttr(_type,"title", title);

           root.appendChild(_type)   
           return false
        }
    
        else{
            SyntaxErr(`
           You didn't specify element the type propriety.
            `)
        }           
       })
   }}

   counter(object){
    const{start=1}=object;
    const{end=1000000*1000000}=object;
    const{velocity=100}=object;
    const{in:IN}=object;
    const el=Id(IN).tag;
    store.InterCounter=Number(start);
    let INT=setInterval(() => {
        if(end>store.InterCounter){
      store.InterCounter=store.InterCounter+1;
      el.innerHTML=store.InterCounter;}else{
       clearInterval(INT)
      }
    }, Number(velocity));
      }
      decrement(obj){
          if(!isPlainObject(obj)){
              SyntaxErr(`
              The value passed as argument in method decrement must be an object.
              `)
          }else{
              const{
                  by,
                  in:IN

              }=obj;
              if(!/[1-9]/.test(store.number)){
                return;
                  
              }
              if(isNaN(store.number-Number(by))){ 
                  return;
            }
              store.number=store.number-Number(by);
                Id(IN).tag.innerHTML=store.number; 
           
          }
      }
      setting(el){
        if(!isDefined(el)){
            SyntaxErr("The argument that should be passed in the method setting was not defined");
        }
        
        else{
            let html=Id(el).tag;
            const href=getAttr(html,"href");
            const Class=getAttr(html,"class");
            const id=getAttr(html,"id");
            const title=getAttr(html,"title")
            const name=html.tagName || html.nodeName;
            return {
                tag: name.toLowerCase(),
                id: id=="" || id==null ? "null": id,
                class: Class=="" || Class=="null" ? null: Class,
                href: href=="" || href==null ? "null" : href,
                title: title=="" || title==null ? "null": title,
            }
        }

}
loadStatus(){
    let status=document.readyState;
    return status
    }
    linkWithPhoto(obj){
        if(!isPlainObject(obj)){
            SyntaxErr("The value passed in the method linkWithPhoto must be an object");
        }else{
            const{links}=obj;
            const{append}=obj;
            const html=Id(append).tag
            links.forEach(link=>{
                const{alt}=link;
                const{path}=link;
                const{image}=link;
                const{description}=link
                if(!isDefined(image)){
                    return;
                }else{
                 const caption=CreatEL("figcaption");
                 let captxt=TEXT(description);
                 caption.appendChild(captxt);   
                const a=CreatEL("a");
                 a.setAttribute("href", path);
                 const pic=CreatEL("img");
                 setAttr(pic,"src", image);
                 setAttr(pic,"alt", alt)
                 a.appendChild(pic);
                 a.appendChild(caption);
               html.appendChild(a)
            }})
        }
    }
    prependEachOnly(obj){
        if(isPlainObject(obj)){
    
        }else{
            const{to}=obj;
            const{father}=obj;
            const{data}=obj;
            const{html}=obj;
            const{only}=obj;
            const el=Id(father).tag
            data.forEach(d=>{
                if(d!=only){
                    const m=CreatEL(html);
                    const txt=TEXT(d);
                    m.appendChild(txt);
                    const T=CreatEL(to);
                    T.appendChild(m);
                    el.appendChild(T)
                }
            })
        }
    }
    increment(obj){
        if(!isPlainObject(obj)){
            Err("The argument passed in the method increment must be an object");
        }
        else{
            const{in:IN}=obj;
            const{by}=obj;
            const el=Id(IN).tag;
          
               if(valueType(store.number)=="undefined"){
                  store.number=by 
               return el.innerHTML=store.number;
               }else{
                   store.number=store.number+Number(by);
                   el.innerHTML=store.number
               }
          
           
        }
    };
    linkWithDescription(obj){
       const{
           in:IN,
           links,
       }=obj;
       const root=Id(IN).tag;
       if(!isPlainObject(obj)){

        //error;
       }else{
           [...links].forEach(link=>{
           const{
             path,
             description,
             title,  
           }=link;
             const div=CreatEL("div");
             const a=CreatEL("a");
             const desc=CreatEL("span");
             setAttr(a, "href", path);
             a.appendChild(title);
             desc.appendChild(description);
             div.appendChild(a);
             div.appendChild(desc);
             root.appendChild(div);
           })
       } 
    }
}


var validator={
    url:function(u){
     return   /^(?:http:\/\/|https:\/\/)+(:?[A-Z]{2,8}\.)*(:?[a-z]+)+\.+(:?[a-z]{2,8})+(:?[\s\S])*$/i.test(u);
    },
    email:function(em){
     return   /^(?:[A-Z]+)+(:?[0-9]+)*@+(:?[A-Z]+)\.com$/i.test(em)
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

class DOCUMENT extends HTML{
    constructor(){
        super();
    }
}

const Doc=new DOCUMENT();
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

function Browser(){
    if(new.target=="undefined"){
        SyntaxErr("Do not invoke this function.")
    }
    this.Store=function(key, value){
      if(arguments.length<2){
          consoleWarnig(`
          Some parameter of method Store() were not defined, it must have
          two parameter
          `);
      }else{
      return localStorage.setItem(key, value);    
      }
    }
    this.getStored=function(key){
        if(arguments.length<1){
            consoleWarnig(`
            You did not specify the key to fetch the value!
            `)
        }else{
           return localStorage.getItem(key);
        }
        this.deleteStored=function(key){
            if(arguments.length<1){
                consoleWarnig(`
                
                You did not specify the key to delete from storage!
                `)
            }else{
                return localStorage.removeItem(key)
            }
        }
    }
    this.isOnline=navigator.onLine;
    var that=this;
    this.info=function(){
     const V=navigator.appVersion;
     const Vend=navigator.vendor;
     const P=navigator.platform;
     const L=navigator.language;
     return{
         online: that.isOnline,
         version: V,
         vendor: Vend,
         platform: P,
         language: L
     }   
    }
}

let Nav=new Browser();
Object.defineProperties(Nav,{
    info:{
        writable:false,
        configurable:false,
        enumerable:true
    },
    Store:{
        writable:false,
        configurable:false,
        enumerable:true
    },
    getStored:{
      writable:false,
      configurable:false,
      enumerable:true 
    },
    removeStored:{
  value:function(key){
    if(arguments.length<1){
        consoleWarnig(`
        
        You did not specify the key to delete from storage!
        `)
    }else{
        return localStorage.removeItem(key)
    }
}

    },
    deleteStored:{
        writable:false,
        configurable:false,
        enumerable:true
    }
})

Object.freeze(Nav);

function SEARCHER(){
    this.lookAt=function(arr, value){
if(!isArray(arr) || !isDefined(value)){

SyntaxErr(`The arguments passed in the SEARCHER must be an array and the value to search in the array
respectivily
`)

}
let S=arr.filter(key=>{

    const{
        keyword
    }=key;

let b=String.prototype.toLowerCase.call(keyword);
   return b.indexOf(String.prototype.toLowerCase.call(value))>-1;
})
    return S;
}
this.withPhoto=function(arr, value){
let array=Array.from(arr);
let filtering=array.filter(key=>{

    const{
        keyword
    }=key;

   let b=String.prototype.toLowerCase.call(keyword)
   return b.indexOf(String.prototype.toLowerCase.call(value))>-1;
})
return filtering
}

}

const Search=new SEARCHER();
Object.defineProperties(Search,{
    lookAt:{
        configurable:false,
        writable:false,
        enumerable:true,
    },
     withPhoto:{
         configurable:false,
         writable:false,
         enumerable:true
     }
     

})

Object.preventExtensions(Search)

function Animating(){
    if(new.target=="undefined"){
        SyntaxErr(`Fatal error: you must not invoke ${Animating.name}`);

    }
    this.onChange=function(obj){
    
        if(!isPlainObject(obj)){
            SyntaxErr("The argument passed in the method onChange must be an object.");
        }else{
            const{in:IN}=obj;
            const el=Id(IN).tag
            const{definition:{changePro:Property}}=obj;
            const{definition:{value}}=obj;
            const{definition:{duration}}=obj;
            
            el.style.transition=`${Property} ${duration}`;
           el.style[obj.definition.set]=value
        }
    }
    
}

let AN=new Animating();
const Animate=new Proxy(AN,{
    deleteProperty(...values){
        SyntaxErr(`
        Do not delete any property of Animate object!
        `);
        return false;
    },
    set(Target, key, value, pro){
        if(key!="onChange"){
            consoleWarnig(`
            You shoul not define property in Inter objects
            `);
            return true;
        }
        if(key=="onChange"){
            SyntaxErr(`
            You are doing a fatal error, do not
            try to overwrite built-in methods in Inter!
            
            `)
        }
    }
})

function Scroll(){
    if(new.target=="undefined"){
        SyntaxErr(`You must not invoke ${Scroll.name}`)
    };
    this.to=function(n){
      if(!isDefined(n)){
          SyntaxErr("Oh no, you did not define the value in to() method!");
      }
      if(!isNumber(n)){
          SyntaxErr("The value passed in the to() method must be a number");
      }
      if(isNumber(n) && isDefined(n)){
          return window.scrollTo(0, n);
      }
    };
    var timesChecks=new WeakSet();
    let scrollAtleast=Object.create(null)
    this.atLeast=function(obj){
     
        if(isPlainObject(obj)==false){
            Err("The value passed in the method atLeast must be an object");
        }else{
            const{value}=obj;
            const{action}=obj;
            const atualScroll=document.body.scrollTop || document.documentElement.scrollTop;
            if(atualScroll>=value && !timesChecks.has(scrollAtleast)){
             if(!isCallable(action)){
                 SyntaxErr(`
                 action must be a function!
                 `)
             }else{
             timesChecks.add(scrollAtleast)
              action();

             }
                
                
            }
        }
    }
    this.position=()=>
    {
   const atualScroll=document.body.scrollTop || document.documentElement.scrollTop
return atualScroll
}
}

let Scrolling=new Scroll();
Object.defineProperties(Scrolling,{
    to:{
        enumerable:true,
        configurable:false,
        writable:false,
    },
    atLeast:{
        enumerable:true,
        configurable:false,
        writable:false,
    },
    position:{
        enumerable:true,
        configurable:false,
        writable:false
    }
})
Object.preventExtensions(Scrolling)


Object.defineProperty(INTER, Symbol.hasInstance,{
    value: function(){
        return false;
    },
    enumerable:false,
    configurable:false,
    writable:false,
})

function SERVER(){
//it's simulating constructor here.

}

SERVER.prototype.get=(obj)=>{

if(!isPlainObject(obj)){
    SyntaxErr(`
    The argument in method obj must be an object.
    `)
}else{
    const{
        path,
        error,
        success
    }=obj;
 
    if(!isCallable(error) && !isCallable(success) || !isCallable(error) || !isCallable(success)){
        SyntaxErr(`
        Fatal error: success and error must be a function.
        `)
    }


  let request=new XMLHttpRequest();
  request.open("GET", path, true);
  request.onreadystatechange=()=>{
   if(request.status==200){
     return  success(request.response);
   }else{
    return   error(request.statusText);
   }   
  }
  request.send(null)  
}
}

SERVER.prototype.getTypeofData=(obj)=>{

    if(!isPlainObject(obj)){
        SyntaxErr(`
        The argument in the method getTypeofData must be only an object.
        `)
    }else{
        const{
            path,
            type,
            success,
            error
        }=obj;

        if(!isCallable(success) && !isCallable(error) || !isCallable(success) || !isCallable(error)){
          SyntaxErr(`
          Fatal error: success and error must be functions.
          `)  
        }else{
            let request=new XMLHttpRequest();
            request.open("GET", path, Boolean(1));
            request.onreadystatechange=()=>{
              if(request.status==200 && request.getResponseHeader("content-type")!=type){
                error(request.responseType);
                return false;  
              }
              if(request.status==200 && request.getResponseHeader("content-type")==type){
                console.log("Recieved the right data.")
                return success(request.response);   
              }  
            }
            request.send(null);
        }
    }
}

SERVER.prototype.upload=(obj)=>{
if(!isPlainObject(obj)){
 //throw an error.
}

const{
    path,
    body,
    success,
    error,
    type,
    progress,
}=obj;
if(!isCallable(success) && !isCallable(error) && !isCallable(progress) || ! isCallable(progress)||!isCallable(success) || !isCallable(error)){
 
    SyntaxErr(`
    Fatal error: success and error must be a function.
    `)   

}

if(!body){
    SyntaxErr(`
    You must especify the body of the request to send.
    `)
}
if(!type){

   consoleWarnig(`
   You should set the type of content you're sending to server.
   `) 
}
else{
   

   
 
   let request=new XMLHttpRequest();
   request.open("POST", path, Boolean(1));
  request.onreadystatechange=()=>{
   if(request.status==200){
      return success(); 
   }else{
       return error();
   }   
  }
  request.onprogress=(ev)=>{
return progress(ev.loaded, ev.total);
  }
  request.setRequestHeader("content-type", `${type}; charset=utf8`);
  request.send(body);  
}
}


SERVER.prototype.add=(obj)=>{
  const{
      error,
      success,
      body,
      path
  }=obj;
    if(!isPlainObject(obj)){
      SyntaxErr(`
      Add() argument must be an object.
      `)
  };

  if(!isCallable(error) && !isCallable(success) && !isCallable(error) || isCallable(success)){
   consoleWarnig(`
   success and error must be a function in server.add()
   `)   
  }
  if(!body){
      //error
  }
  if(!isJson(body)){

    //error
  }else{
   let request=new XMLHttpRequest();
   request.open("PUT", path, Boolean(1));
   request.onreadystatechange=()=>{
       if(request.readyState==2 && request.status==200){
           return success();
       }else{
           return error();
       }
   }
   request.send(body);
  }

}
SERVER.prototype.delete=(obj)=>{
    const{
        path,
        success,
        error
    }=obj;
    if(!isPlainObject(obj)){
      //ERROR
    }else{
    let request=new XMLHttpRequest();
    request.open("DELETE", path, Boolean(1));
    request.onreadystatechange=()=>{
        if(request.readyState==4 && request.status==200){
            return success();
        }else{
            return error();
        }
        
    }   
    request.send(null); 
    }
}
let server=Object.freeze(new SERVER);

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
    var root=CreatEL("div");
    setAttr(root,"class", "loading");
    setAttr(root,"id", "loading")
  
   if(Inter.loadStatus!="complete"){
   elArr.forEach(el=>{
       const{
         type,
         text="",
         alt="",
         id="",
         class:Class="",
         description="",
         title="",
         href="",
         src="",
         placeholder="",
        
        
       }=el;
    switch(type){
        case"img":
   const img=CreatEL(type);
      setAttr(img,"src", src);
      setAttr(img,"id", id);
      setAttr(img,"class", Class);
      setAttr(img,"title", title);
      setAttr(img,"alt", alt);
      const Des=TEXT(description);
      const _description=CreatEL("figcaption");
      _description.appendChild(Des);
      root.appendChild(img);
      root.appendChild(_description);
      document.body.appendChild(root);
      break;   
    case"a":
    const a=CreatEL(type);
    const _TXT=TEXT(description);
    a.appendChild(_TXT);
    setAttr(a,"id", id);   
    setAttr(a,"href", href);
    setAttr(a,"class", Class);
    setAttr(a,"title", title)
    root.appendChild(a);
    document.body.appendChild(root)
    break;

    default:
    const html=CreatEL(type);
    const _text=TEXT(text);
     html.appendChild(_text);
     setAttr(html,"id", id);
     setAttr(html,"class", Class);
     setAttr(html,"title", title);
     root.appendChild(html) 
     document.body.appendChild(root);
    }  
   });
   }
 let a=setInterval(()=>{
if(document.readyState=="complete"){
     document.body.removeChild(root)
    clearInterval(a);
}

 },1)
 
}

}

const methods=Symbol("methods")
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
    }
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
        * strings:[{
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
     var root=Id(IN).tag
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
         root.innerHTML=TXT;
         storeRef.addRef(root, TXT); 
           
        }else{
          root.innerHTML=`${storeRef.get(root)}${TXT}`;
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
          
            root.innerHTML=arr.toString().replace(/,/g, "");
           
           
           if(!arr[0]){
               
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

function ELEMENT(){
    //simulate constructor()
  if(new.target=="undefined"){
      SyntaxErr(`
      Fatal error: do not create an instance for ELEMENT function.
      
      `)
  }
}
ELEMENT.prototype.methods=()=>{
   return {
  native:[...Object.keys(ELE)]}}

ELEMENT.prototype.click=(el, action)=>{
 if(!isCallable(action)){
     consoleWarnig(`
     The second argument of click() must be a function.
     `)
 }
    Id(el).tag.onclick=()=>{
      return action()
    }
}

ELEMENT.prototype.hover=(el, action)=>{
    if(!isCallable(action)){
        consoleWarnig(`
        The second argument of hover() must be a function.
        `)
    }
    Id(el).tag.onmouseover=()=>{
        return action();
    }
}

ELEMENT.prototype.write=(el, action)=>{
    
   let html=Id(el).tag.nodeName || Id(el).tag.tagName;
    if(html.toLowerCase()!="input"){
       SyntaxErr(`
       Fatal error: eventlistener write must be only used in input elements
       `)
    }
    if(!isCallable(action)){
        consoleWarnig(`
        The second argument of write() must be a function.
        `)
    }
    Id(el).tag.onkeyup=(ev)=>{
        return action(ev)
    }
}

ELEMENT.prototype.hoverOut=(el, action)=>{
    if(!isCallable(action)){
      consoleWarnig(`
      The second argument of hoverUp() must be a function.
      
      `)  
    }
    Id(el).tag.onmouseout=(ev)=>{
        return action(ev);
    }
}

ELEMENT.prototype.scroll=(el, action)=>{
if(!isCallable(action)){

    consoleWarnig(`
    The second argument of scroll() must be a function
    `)
}
Id(el).tag.onscroll=()=>{
    return action(ev);
}
}

ELEMENT.prototype.play=(el, action)=>{
    let html=Id(el).tag.nodeName || Id(el).tag.tagName
    if(html.toLowerCase()!="audio" || html.toLowerCase()!="video"){
        SyntaxErr(`
        Fatal error: play() must be only used on video ou audio elements.
        `)
    }
    if(!isCallable(action)){
        consoleWarnig(`
        The second argument in play() must a function.
        `)
    }
    Id(el).tag.onplaying=(ev)=>{
        return action(ev);
    }
}

ELEMENT.prototype.pause=(el, action)=>{
    let html=Id(el).tag.nodeName || Id(el).tag.tagName
    if(html.toLowerCase()!="audio" || html.toLowerCase()!="video"){
        SyntaxErr(`
        Fatal error: play() must be only used on video ou audio elements.
        `)
    }
    if(!isCallable(action)){
        consoleWarnig(`
        The second argument in play() must a function.
        `)
    }
    Id(el).tag.onpause=(ev)=>{
        return action(ev);
    }
}


ELEMENT.prototype.send=(el, action)=>{
    let html=Id(el).tag.nodeName || Id(el).tag.tagName;
    if(html.toLowerCase()!="input"){
        SyntaxErr(`
 Fatal error; send() must only used on input elements
        `)
    }
       if(!isCallable(action)){
        consoleWarnig(`
        The second argument in the send() must be a function.
        `)
       }
     Id(el).tag.onsubmit=(ev)=>{
        action(ev);
    }
}

ELEMENT.prototype.load=(el, action)=>{
    if(!isCallable(action)){

 SyntaxErr(`
Second argument in load() must be a function.
 `)

    }
    Id(el).tag.onload=(ev)=>{
        return action(ev);
    }
}


ELEMENT.prototype.focus=(el, action)=>{
    const html=Id(el).tag;
    if(String.prototype.toLowerCase.call(html.nodeName || html.tagName)!="input"){
        SyntaxErr(`
        Fatal error:  EL.focus() must be applied only in inputs elements
        `)
    }
    if(!isCallable(action)){
        consoleWarnig(`
        The second argument in the focus must be a function.
        `)
    };
    html.onfocus=()=>{
        return action();
    }

}

let ELE=new ELEMENT();
Object.defineProperties(ELE,{
    click:{
        enumerable:true,
        value:ELE.click,

    },
    hover:{
        enumerable:true,
        value:ELE.hover,
    },
    hoverOut:{
        enumerable:true,
        value:ELE.hoverOut,
    },
    pause:{
     enumerable:true,
     value:ELE.pause,
    },
    play:{
        enumerable:true,
        value:ELE.play
    },
    send:{
        enumerable:true,
        value:ELE.send,
    },
    scroll:{
        enumerable:true,
        value:ELE.scroll
    },
    write:{
        enumerable:true,
        value:ELE.write,
    },

    methods:{
        enumerable:false,
        value:ELE.methods
    },
    focus:{
        enumerable:true,
        value:ELE.focus
    }

})

let El=Object.create(null);
Object.setPrototypeOf(El,ELE)
Object.freeze(El);
Object.freeze(ELE)

function reactiveInput(obj){

if(!isPlainObject(obj)){

    //throw an error.
}
const{
    input,
    in:IN
}=obj
const el=Id(input).tag

    if(new.target!="undefined"){
 //fire an error

    }
    if(el.tagName.toLowerCase()!="input" || el.nodeName.toLowerCase()!="input"){
        SyntaxErr(
            `
            reactiveInput must be only used in input element.
            `
        )
    }else{
    /**
     * reactiveInput({
     * input:"input",
     * in:"hey"
     * }) 
     */
    const doNothing=[
     "Dead", "ArrowUp","ArrowDown","ArrowRight","ArrowLeft",
     "Shift","F1","F2","F3","F4","F5", "F6", "F7", "F8",
     "F9","F10","F11","F12","Enter","Home","Delete","End",
     "PageUp","PageDown","Insert","NumLock","Tab","ControlAltGraph",
     "ContextMenu","Control","Meta","Del","CapsLock","AltGraph"
    ]
     el.onkeydown=(ev)=>{
        for(let i of doNothing){
            if(ev.key==i){
                return;
            }
        } 
        if(ev.key=="Backspace"){
    
        
    const REACTIVETEXT={
        text:Id(IN).tag.textContent};
      const ARR=[...REACTIVETEXT.text];
      ARR.pop()
      Id(IN).write("")
      let call=ARR[Symbol.iterator]()
        for(let o=0; o<ARR.length; o++){     
        let i=call.next().value
        const _priv=Symbol.for("private");
        Id(IN)[_priv](i)    
    }
              
    
    }
    if(ev.key!="Backspace"){
        const _priv=Symbol.for("private")
    Id(IN)[_priv](ev.key)

}}}}

function slide(obj){
    if(!isPlainObject(obj)){


    }else{
        const{
            in:IN,
            prev,
            next,
            time,
            automatic,
            images,
            width,
            height,
        }=obj
      const id="InterSlider";  
     const photos=Array.from(images);
     var count=1;
  nativeStyle(getId(IN),{
      width:`${width}vw`,
      height:`${height}vh`,
      transition:`ease-in ${time} backgroundImage`,
      backgroundImage:`url(${images[0]})`
  })
     if(automatic){
setInterval(() => {
    if(count<photos.length){
        nativeStyle(getId(IN),{
            backgroundImage:`url(${images[count]})`
        })
    count++
    return false;   
    }else{
        
        nativeStyle(getId(IN),{
            backgroundImage:`url(${images[0]})`
        })
        count=1
        return false;
    }

}, time);

     }

Id(next).tag.onclick=()=>{
    if(count<photos.length-1){   
        nativeStyle(getId(IN),{
            backgroundImage:`url(${images[count+1]})`
        })
    count++;
}

}

Id(prev).tag.onclick=()=>{
    if(count>0){
        nativeStyle(getId(IN),{
            backgroundImage:`url(${images[count-1]})`
        });
    count--;

}

}
    }
}

function URL(){
//simulate constructor here

}

URL.prototype.useHash=(pathname)=>{
const atualUrl=window.location.pathname;
if(!isDefined(pathname)){

};
if(pathname=="/"){
    window.history.pushState(null, null, pathname);
    return false;
}
if(pathname!="/" && atualUrl=="/"){
    window.history.pushState(null, null, "/#/"+pathname);
    return false;
}else{
    window.history.replaceState(null, null, "/#/"+pathname);
return false;
}
}

URL.prototype.setPath=(pathname)=>{
 const atualUrl=window.location.pathname;   
if(!isDefined(pathname)){

    SyntaxErr(`
    set's parameter must not be a null value.
    `)

}
if(pathname=="/"){
    window.history.pushState(null, null, pathname);
    return false;
}
if(pathname!="/" && atualUrl=="/"){
    window.history.pushState(null, null, pathname);
    return false;
}
else{
   window.history.replaceState(null, null, pathname); 
}

}

URL.prototype.routeChange=(boolean, definition)=>{
   const{
       smoth,
       tag,
       error,
   }=definition;
  if(!isPlainObject(definition)){
      //error
  }  
    if(Boolean(boolean)){
window.onpopstate=()=>{
const atualPath=window.location.pathname;
let request=new XMLHttpRequest();
request.open("GET", atualPath, Boolean(1));

request.onreadystatechange=()=>{
 if(request.status==200 && request.readyState==4){
Id(tag).update({
    value:request.response,
    smoth:smoth,
})
 }else{
Id(tag).update({
    value:error,
    smoth:smoth,
})
 }   
}
request.send(null);
}
    }
}
let url=new URL();
Object.defineProperties(url,{
    setPath:{
        enumerable:!0,
        value:url.setPath
    },
    routeChange:{
        enumerable:!0,
        value:url.routeChange,
    }
})


Object.freeze(url)

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
    
        let value=Id([IN]).tag.value;
        return value;   
       
       },
       done(id,prop){
      getId(IN).onkeyup=(ev)=>{
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
    function isInput(el){
        return el.tagName.toLowerCase()=="input" || el.tagName.toLowerCase()=="textarea";
    }
function InputHandler(){
const HandleInput=setInterval(() => {
    if(document.readyState!="complete"){
        return;
    }else{
        clearInterval(HandleInput)
        
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
            allNodes[i].onkeyup=(ev)=>{
                toHTML({
                    in:allNodes[i].getAttribute("in"),
                    data:{
                       [attr]:ev.target.value, 
                    }
                })
            }
        }
    }
     }
       
    }
},100);
}
InputHandler();
//ajax based in promise

function BACKEND(){


}

BACKEND.prototype.get=(path)=>{
return new Promise((resolve, reject)=>{
let request = new XMLHttpRequest();
request.open("GET", path, Boolean(1));
request.onreadystatechange=()=>{
if(request.readyState==4 && request.status==200){
    resolve(request.response);
}else{
    reject(request.response);
}
}

request.send(null)
 }
 
 
 
 )
}

BACKEND.prototype.getTypeofData=(obj)=>{
const{
    type,
    path
}=obj;
return new Promise((resolve, reject)=>{
    let request=new XMLHttpRequest();
    request.open("GET", path, Boolean(1));
    if(request.status==200 && !request.getResponseHeader("content-type")==type){
        reject("You've recived wrong data");
    }
    if(request.status==200 && request.getResponseHeader("content-type")==type){
        resolve(request.response)
    }
    request.send(null)
})
}

BACKEND.prototype.upload=(obj)=>{
const{
    path,
    body,
    progress,
}=obj;
if(!isCallable(progress)){

}
if(!body){
    SyntaxErr(`You did not defined the request body`);
}else{
    return new Promise((resolve, reject)=>{
    let request=new XMLHttpRequest();
    request.open("POST", path, Boolean(1));
  request.onprogress=(ev)=>{
      return progress(ev.loaded, ev.total);
  }
  request.onreadystatechange=()=>{
      if(request.status==200 && request.readyState==4){
        resolve("Data have being uploaded.")  
      }else{
          reject("Something went wrong.")
      }
  }
  request.send(body)
}) 
}
}

BACKEND.prototype.delete=(obj)=>{
    const{
        path,
        body
    }=obj;

    if(!body){
        SyntaxErr("You've to define the request body.")
    }
  return new Promise((resolve, reject)=>{
let request=new XMLHttpRequest();
request.open("DELETE", path, Boolean(1));
request.onreadystatechange=()=>{
    if(request.readyState==4 && request.status==200){
        resolve("File(s) deleted succefully")
    }else{
        reject("Oh, something went wrong.")
    }
}
  })  
}

BACKEND.prototype.add=()=>{
    return new Promise((resolve, reject)=>{
       let request=new XMLHttpRequest();
       request.open("PUT", path, Boolean(1));
       request.onreadystatechange=()=>{
           if(request.readyState==4 && request.status==200){
            resolve("Thing(s) added to database successfully")   
           }else{
               reject("Oh, something went wrong.")
           }
       }

       request.send(body) 
    })
}
const backend=Object.freeze(new BACKEND);

function deleteContainer(el){
    let parent=el.parentNode;
  parent.parentNode.removeChild(parent)
  }

 const on={
     click: function(el, fn){
        el.onclick=()=>{
            fn();
        } 
     },
     loaded:function(){

    },
    hover: function(el, fn){
        el.onmouseover=()=>{
            fn();
        }
    },
        hoverOut: function(el, fn){
         el.onmouseout=()=>{
             fn();
         }  
        },
        write: function(el, fn){
            el.onkeyup=()=>{
                fn();
            }
        },
        playing: function(el, fn){
            el.onplaying=()=>{
                fn();
            }
        },
        focus: function(el, fn){
            el.onfocus=()=>{
                fn();
            }
        },
        
    
    
     }
  

  //Global routing here.
function globalRouting(success, error, obj){
    const{
        setPath,
    }=obj;   

   if(!isCallable(error) || !isCallable(success)){
       //error
   } 
let elarr= document.getElementsByTagName("*");
  for(let i=0; i<elarr.length; i++){
   on.click(elarr[i], ()=>{
     
     if(hasAttr(elarr[i], "routeTo")){
      const get=getAttr(elarr[i], "routeTo");
      setPath? url.setPath(get) : null;
      let request=new XMLHttpRequest();
      const _this=request;
      request.open("GET", get, Boolean(1));
      request.onreadystatechange=()=>{
          if(_this.readyState==4 && _this.status==200){
              success(_this.responseText);
          }else{
              error(_this.responseText);
          }
      }   
     }  
   })
  } 
}

//Caroucel here.

/** caroucel.withPhoto({
 * in:"container",
 * setting:{
 * duration:100,
 * direction:true,
 * automtic:true
 * 
 * }
 * controls:{
 * prev:"prev",
 * next:"next"
 * 
 * }
 * })
 * 
 * caroucel.withText({
 * in:"container",
 * setting:[{
 * text:"Inter is simple",
 * },{
 * text:"Inter is intuitive",
 * },{
 * text:"Inter is full-featured lib."
 * }]
 * duration:2000,
 * automatic:false,
 * direction:"vertical",
 * controls:{
 * prev:"prev",
 * next:"next"
 * 
 * }
 * })
 * 
 *
 */

 function nativeStyle(el,styles){
 Object.entries(styles).forEach(key=>{
     const[pro, value]=key;
   return  el.style[pro]=value;
 })     

 }

 function CAROUCEL(){

 }
CAROUCEL.prototype.withPhoto=(obj)=>{
if(!isPlainObject(obj)){
    SyntaxErr(`
     Fatal error: the argument at caroucel.withPhoto() must be an object.
    `)
}else{
    const{
        in:IN,
        setting,
        controls,
    }=obj;
    const{
        automatic,
        duration,
        direction
    }=setting;
    const{
        prev,
        next
    }=controls;

    const root=getId(IN);
    if(!automatic){
    nativeStyle(root, {
      display:"flex",  
    })
    getId(next).onclick=()=>{

    }    
    }
}
}

//Global event listener.

const constum_attributes=[
    "click",
    "hover",
    "hoverOut",
    "write",
    "playing",
    "focus",
    "send",

]

let event_Obj={
    click:"onclick",
    hover:"onmouseover",
    hoverOut:"onmouseout",
    playing:"onplaying",
    focus:"onfocus",
    send:"onsubmit",
    write:"onkeyup",
}
function Listener() {
 let allNodes=document.getElementsByTagName("*");
 for(let i=0; i<allNodes.length; i++){
for(let costum=0; costum<constum_attributes.length; costum++){ 
    if(hasAttr(allNodes[i],constum_attributes[costum])){
        on[constum_attributes[costum]](allNodes[i], ()=>{
         const fn=getAttr(allNodes[i], constum_attributes[costum]);
         
             setAttr(allNodes[i], event_Obj[constum_attributes[costum]], fn);
         
         
        })
    }
}  
 }
    
}

const List=setInterval(() => {
   if(document.readyState=="complete"){
       Listener();
       clearInterval(List);
   } 
}, 200);

 const globalNativeEventListener={

 }
 const GlobRef={
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
     
         return  GlobRef.ref[allKeys[i]](key);  
       }
   }
}})

 function EVENT(){
     
     this.fire=(evName)=>{
    return GlobalNativeEventListener[evName]="fired"      
 
     };
     this.listen=(evName, callback)=>{
      return GlobRef.add(evName, callback);   
     
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

function toHTML(obj){

      const{
          in:IN,
          data
      }=obj;
      const target=getId(IN).textContent;
      ref[IN]=target;
      const cache={

      }
    Object.entries(data).forEach((key)=>{
      const[pro, value]=key;
    if(cache.text==undefined){
       const txt=ref[IN].replace(`{${pro}}`, value);
       cache["text"]={
       
         transformed:txt   
        }
        
    }else{
     const txt2=cache.text["transformed"].replace(`{${pro}}`, value);
     cache["text"]={
         
         transformed:txt2
     }   
    }

    })
    getId(IN).innerHTML=cache.text["transformed"] 
    
}



const observe={
    change(obj, handler){
    const keys=Object.keys(obj);
    for(let i=0; i<keys.length; i++){
        Object.defineProperty(obj, [keys[i]],{
            set(value){
             if(!isCallable(handler)){
                 SyntaxErr(`
                 Some propriety was changed, but the handler(second function to trigger when this happend) is not actually a function. 
                 `)
             }else{
                 return handler(keys[i], value);
             }
            },
         
        
        })
    }       
    }
}

/**
 * Inter fuzzy search system is really very cool
 *  but I did not implement a pagination system, and of course for fuzzy search system be really 
 * complete it must have a pagination system in  it.
 *
 * pagination({
 * in:"container",
 * data:[{
 * path:"https://exemple.com",
 * description:"exemple is the best website here",
 * title:"exemple",
 * image:"exempleLogo.png",
 * },{
 * path:"https://pro.net",
 * description:"Pro is a it company in Angola",
 * title: "About Pro",
 * image:"pro.png",
 * 
 * }],,
 * surfType:"button"
 * perPage:5
 * })
 *
 */

 //Under development
function pagination(obj){
    const{
        in:IN,
        data,
        perPage
    }=obj;
    const root=getId(IN);
    for(let i=0; i<perPage;i++){
        const child=CreatEL("div");
         setAttr(child, "id", `result${i}`);    
        root.appendChild(child);
        }
    Array.from(data).forEach(d=>{
    
   })
}
//all code
window.observe=observe;
window.toHTML=toHTML;
window.validate=validate;
 window.slide=slide;
 window.Inter=Inter;
 window.server=server;
 window.Id=Id;
 window.Class=Class;
 window.simulate=simulate;
 window.reactiveInput=reactiveInput;
 window.El=El;
 window.Nav=Nav;
 window.Scrolling=Scrolling;
 window.Animate=Animate;
 window.supportInter=supportInter;
 window.url=url;
 window.Search=Search;
 window.getValue=getValue;
 window.backend=backend;
 window.deleteContainer=deleteContainer;
 window.globalRouting=globalRouting;
 window.Listener=Listener;
 window.event=event; 
 window.whileLoading=whileLoading


  //Import just the code needed
    exports.validate=validate;
    exports.slide=slide;
    exports.Inter=Inter;
    exports.server=server;
    exports.Id=Id;
    exports.Class=Class;
    exports.simulate=simulate;
    exports.reactiveInput=reactiveInput;
    exports.El=El;
    exports.Scrolling=Scrolling;
    exports.Animate=Animate;
    exports.supportInter=supportInter;
    exports.Nav=Nav;
    exports.url=url;
    exports.Search=Search;
    exports.getValue=getValue;

Object.defineProperty(exports, "__esModule", {
    value:true,

})
 
})(window, {});
 

/**
 * This is the source code of Inter.
 * Inter is a Javascript library tha helps create a more intuitive understandable and
 * mantainaible code base, and the result is interactive interfaces.
 * Inter 2.0
 *  Created by Denis
 * 2021
 */