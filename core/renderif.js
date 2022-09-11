import {

    syErr,
    ParserWarning,
    isFalse,
    isObj,
    getId,
    consW,
    err,
    isCallable,
    isANode,
    valueType,
    isBool,
    isTrue,
    isDefined,
    

} from "./helpers.js";



function getChildNodes(root){

    const nodes=new Array();

    root.childNodes.forEach((node)=>{
        
        if(node.nodeType==1 || node.nodeType==3 && !node.textContent.trim().length==0){
            
            nodes.push(node);

        }

    });

    return nodes;


}


function runReservedPropWarning(prop){

    consW(`${prop} is a reserved property, you can not use it as a conditional property.`)

}


const conditionalAttributeCounter = {
     store: new Set(),
     set( keys ){

    for( const key of keys){    
        
    if(isDefined(key)) this.store.add(key);

    }


     },

     getSize(){ 

    const size = this.store.size;

    this.store.clear();

    return size;

    }


}


function getTagName(elementNode) { return elementNode.nodeName.toLowerCase();   }

function hasMoreThanOneConditionalAttribute(elementNode){

const _ifAttrValue = elementNode.getAttribute("_if"),
      _elseAttrValue = elementNode.getAttribute("_elseIf"),
      _ifNotAttrValue = elementNode.getAttribute("_ifNot"),
      _elseAttr = elementNode.hasAttribute("_elseIf") ? true : void 0;

      conditionalAttributeCounter.set([_ifAttrValue, _elseAttrValue, _ifNotAttrValue, _elseAttr]);

      return conditionalAttributeCounter.getSize();


}

 function hasNoConditionalAttr(elementNode){

    const _ifAttr = elementNode.hasAttribute("_if"),
         _elseIfAttr = elementNode.hasAttribute("_else"),
         _ifNotAttr = elementNode.hasAttribute("_ifNot"),
         _elseAttr = elementNode.hasAttribute("_else");


      return (

        !_ifAttr && !_elseIfAttr && !_ifNotAttr && !_elseAttr

      );


 }




export function renderIf(obj){



    if(!isObj(obj)){


        syErr(`
        
        The argument of renderIf must be a  plain Javascript object.
        
        `)

    }

    if(new.target !== void 0){

        syErr(`
        
        renderIf is not a constructor, do not call it with
        the new keyword.
        
        `)


    }else{

        const {

            in:IN,
            data 

         } = obj;

        if(!(typeof IN === "string")){

            syErr(`

            The value of the "in" property in renderIf function must be a string.
            
            `)

        };

        if(!isObj(data)){

            syErr(`

            The value of the "data" property in renderIf function must be a plain Javascript object.

            `)

        }

        const reservedProps = new Set(["setConds", "observe"]);
        const theContainer = getId(IN);
        const conditionalRenderingCache = new Set();

        for( let [prop, value] of Object.entries(data)){

            if(reservedProps.has(prop)){ runReservedPropWarning(prop); continue }

            value = isCallable(value) ? value.call(data) : value;

            if(!isBool(value)){

                err(`
                
                The value of a conditional property must be boolean(true/false),
                and the value of  "${prop}" property is not boolean.
                
                `)

            }

            data[prop] = value;
  

        }

      function parseAttrs(container){

         let index = -1;

         
         const setting = {
            target: void 0,
            if: void 0,
            else: void 0,
            ifNot: void 0,
            elseIfs: new Set(),
            index: void 0,
            root: container,
            set setParserOptions(obj){

                for( const [option, value ] of Object.entries(obj)){

                    this[option] = value;

                }

            },

            canCache(){

                return this.if || this.ifNot;

            }
        }

        for( const child of container.childNodes ){

            index++;


            child.index = index;

            if(child.nodeType == 3) continue;

            
            if(child.children.length > 0){

                parseAttrs(child)
                

            }

            if(hasMoreThanOneConditionalAttribute(child)){

                ParserWarning(`
                The conditional rendering parser found a/an "${ getTagName(child) }"
                element which has more than one conditional atribute, it's forbidden.

                `)

                continue;

            }

            if(hasNoConditionalAttr(child) && setting.canCache()) conditionalRenderingCache.add(setting);

            if(child.hasAttribute("_ifNot")){
        

            const _ifNot = child.getAttribute("_ifNot");
                

                if(_ifNot in data){

                    child.removeAttribute("_ifNot");
                
                    setting.setParserOptions = {
                        ifNot: _ifNot,
                        target: child,
                        index: index

                    }

                    conditionalRenderingCache.add(setting)

                }else{

                    
                    ParserWarning(`
                    
                    The conditional rendering parser found
                    an element with the _ifNot attribute and the value
                    of this attribute is not a conditional property in the data object.

                    {
                        element: ${child.nodeName.toLowerCase()},
                        _ifNot: ${_ifNot},
                        data: ${Object.keys(data)}
                    }
                    
                    `)
                }


           }

        else if(child.hasAttribute("_else")){


              if(!setting.if){

                ParserWarning(`
                                
                The parser found an element with the "_else" attribute,
                but there is not an element with "_if" or "_elseIf" attribute before it.

                `)

              } else{

                setting.else = child;
                conditionalRenderingCache.add(setting);
                
                

              }   

                

            } else if(child.hasAttribute("_elseIf")){


           if(!setting.if){

            ParserWarning(`
            a/an "${ getTagName(child) }" element has the _elseIf attribute,
            but it was not started with the element with the _if attribute.
            
            `)

           } else {

            setting.elseIfs.add({
                target: child,
                index: index
            })

           }


            } else if(child.hasAttribute("_if")){
                
                const _if = child.getAttribute("_if");


                if(!( _if in data )){

                    ParserWarning(`
                    
                    The conditional rendering parser found
                    an element with the _if attribute and the value
                    of this attribute is not a conditional property in data object.

                    {
                        element: ${child.nodeName.toLowerCase()},
                        _if: ${setting.if},
                        data: ${Object.keys(data)}
                    }
                    
                    `);

                    continue;

                }

                setting.setParserOptions = {
                    if: _if,
                    target: child,
                    index: index
                }

                                
                

            } 


        }
    }

          parseAttrs(theContainer)

        const reactor = runRenderingSystem(conditionalAttributeCounter, data);

        return reactor;
    

}



}


function runRenderingSystem(els, data){

    const toArray=Array.from(els);

    function run(source){

        

        for(const el of toArray){

            const{
                target,
                if:IF,
                else:ELSE,
                ifNot,
                i,
                root
            }=el;

            const current=getChildNodes(root)[i];
            
            if(ifNot){

                if(isFalse(source[ifNot]) && !target.isSameNode(current)){

                    if(isANode(current) || root.textContent.trim().length!==0){

                        insertBefore(root, target);


                    }else{

                        root.appendChild(target);


                    }



                }else{

                    if(target.parentNode==root && isTrue(source[ifNot])){

                        root.removeChild(target);

                    }

                }

            }
            

            else if(isFalse(source[IF])){


              if(target.parentNode==root && !ELSE){   

                root.removeChild(target)          

              }else if(ELSE){


             if(target.parentNode==root){

               
                root.removeChild(target);
                insertBefore(root, ELSE);


                    }

                 }



            }else{
            

               // If true.
                          
                 if(current && current.isSameNode(target)){
                       
                 if(ELSE && ELSE.parentNode!=null){
                       

                    root.removeChild(ELSE)

                    
                }
                
                
                
            } else if(ELSE && ELSE.parentNode!=null){

                        

                 root.removeChild(ELSE);
                 insertBefore(root, target);

                        

                    } else{

                    insertBefore(root, target);
                    

                    }

                } 


    

    }
    
}


function insertBefore(root, target){

    const children=getChildNodes(root),
    lastChild=children[children.length-1];

    if(target.parentNode==null){

    if(lastChild && lastChild.index>target.index){

    for(const child of children){

        

    if(child.index>target.index){

    
      root.insertBefore(target,  child);

      break;

    

   }

}

}else{

  root.appendChild(target);

  }


    }

}

const reservedProps=new Set(["setConds", "observe"]);
const observer=new Map();
const proxyTarget=Object.assign({}, data);

run(proxyTarget);

const reactor=new Proxy(proxyTarget,{

    set(target, prop, value){

        if(!(prop in data) && !reservedProps.has(prop)){
 
            consW(`
            "${prop}" was not defined 
            as a conditional property.
            
            `)

            return false;

        }

        if(!isBool(value) && !reservedProps.has(prop)){

            err(`
                
            The value of a conditional property must be boolean(true/false),
            and the value of  "${prop}" property is not boolean.
            
            `)

            return false;

        }

        Reflect.set(target, prop, value);


        if(!reservedProps.has(prop)){

        run(proxyTarget);

        
        if(observer.size==1){


            const callBack=observer.get("callBack");

            callBack(prop, value);


        }

        }


        return true;

    },

    deleteProperty(...args){

        return false;

    }

})



Object.defineProperties(reactor,{ 
    observe:{

    value(fn){

        if(!isCallable(fn)){

            syErr(`

            The argument of [renderIf reactor].observe()
            must be a function.

            `)

        }

        if(observer.size==0){

            observer.set("callBack",fn);

            return true;

        };

        return false;



    },
    enumerable:!1,
    writable:!1
    },
    setConds:{

        set(conditions){
            
            if(!isObj(conditions)){

                syErr(`
                
                The value of [renderIf reactor].setConds must be only
                a Javascript object, and you defined ${valueType(conditions)}
                as its value.

                `);

            };


            for(let [prop, cond] of Object.entries(conditions)){

                if(reservedProps.has(prop)){ runReservedPropWarning(prop); continue    }

                cond=isCallable(cond) ? cond.call(data) : cond;

            
                if(!isBool(cond)){
                    
                err(`
                
                The value of a conditional property must be boolean(true/false),
                and the value of  "${prop}" property is not boolean.
                
                `)

                }

                if(!(prop in this)){

                    consW(`
                    
                    "${prop}" was not defined as conditional property.
                    
                    `)

                };


                    proxyTarget[prop]=cond;

                

            };



            run(proxyTarget);

        },
        enumerable:!1

    }
})

return reactor;

}
