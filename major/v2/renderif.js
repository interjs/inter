import{

    syErr,
    ParserWarning,
    isFalse,
    isObj,
    getId,
    consW,
    isAtag,
    err,
    isCallable,
    isTrue,
    valueType,
    isBool
    

} from "./helpers.js"




export function renderIf(obj){

    // This function is a replacement
    // for Inter.renderIf()
    // Inter.renderIf() was removed since version 2.0.0.

    if(!isObj(obj)){


        syErr(`
        
        The argument of renderIf must be a  plain Javascript object.
        
        `)

    }

    if(new.target!==void 0){

        syErr(`
        
        renderIf is not a constructor, do not call it with
        the new keyword.
        
        `)


    }else{

        const{
            in:IN,
            data,
            
        }=obj;

        if(!(typeof IN==="string")){

            syErr(`
            The value of "in" property in renderList function must be a string.
            
            `)

        };

        if(!isObj(data)){

            syErr(`
            The value of "data" property in renderList function must be a plain Javascript object.

            `)

        }

        
        const theContainer=getId(IN);
        const els=new Set();

function parseAttrs(container){

         let index=-1;

        for(const child of container.children){

            index++;

            const setting={
                target:child,
                if:void 0,
                else:void 0,
                ifNot:void 0,
                i:index,
                root:container
            }


           const sibling=child.nextElementSibling,
                 previous=child.previousElementSibling;

            
            if(child.children.length>0){

                parseAttrs(child)
                

            }

            if(child.hasAttribute("_ifNot")){
                
                
                if(child.hasAttribute("_if") && child.hasAttribute("_else")){

                    ParserWarning(`
                    The parser found an element with _ifNot attribute and one more conditional attribute,
                    it's forbidden.
                    
                    `)

                }

                setting.ifNot=child.getAttribute("_ifNot");

                if(setting.ifNot in data){

                    child.removeAttribute("_ifNot");

                    els.add(setting);

                }else{

                    
                    ParserWarning(`
                    
                    The conditional rendering parser found
                    an element with the _notIf attribute and the value
                    of this attribute is not a conditional property in data object.

                    {
                        element: ${child.nodeName.toLowerCase()},
                        _ifNot:${setting.ifNot},
                        data:${Object.keys(data)}
                    }
                    
                    `)
                }


            }

        else if(child.hasAttribute("_else") && !previous.hasAttribute("_if")){


                ParserWarning(`
                                
                The parser found an element with an "_else" attribute,
                but there is not an element by attribute "_if" before it.

                `)

                return false;

            };
            

             if(child.hasAttribute("_if")){
                
                if(child.hasAttribute("_else")){

                    ParserWarning(`
                    
                    The parser found an element which has simultaneousilly
                    the "_if" and "_else" attribute. It's forbidden.
                    
                    `)

                    return false;

                }

                setting.if=child.getAttribute("_if");
                child.removeAttribute("_if");

                if(!(setting.if in data)){

                    ParserWarning(`
                    
                    The conditional rendering parser found
                    an element with the _If attribute and the value
                    of this attribute is not a conditional property in data object.

                    {
                        element: ${child.nodeName.toLowerCase()},
                        _if:${setting.if},
                        data:${Object.keys(data)}
                    }
                    
                    `);

                    setting.if=void 0;

                }

                                
                

            }  if(setting.if && sibling && sibling.hasAttribute("_else")){

             
                
                if(sibling.hasAttribute("_if")){

                    ParserWarning(`
                    
                    The parser found an element which has simultaneousilly
                    the "_if" and "_else" attribute. It's forbidden.
                    
                    `)

                    return false;
                }

                setting.else=sibling;
                sibling.removeAttribute("_else");

   


            } if(setting.if){

                els.add(setting)


                

            }


        }
    }

    parseAttrs(theContainer)

        const reactor=parseConditionalRendering(data,els);

        

        return reactor;
    

}



}


function parseConditionalRendering(data,els){

    const toArray=Array.from(els);

    function run(){

        for(let el of toArray){

            const{
                target,
                if:IF,
                else:ELSE,
                ifNot,
                i,
                root
            }=el;


            if(ifNot){

                const current=root.children[i];

                if(isFalse(data[ifNot]) && !target.isSameNode(current)){


                    if(isAtag(current)){

                        root.replaceChild(current, target)


                    }else{

                        root.appendChild(target);

                    }



                }else{

                    if(target.parentNode==root){

                        root.removeChild(target);

                    }

                }

            }
            

            else if(isFalse(data[IF])){

                
                

              if(target.parentNode==root && !ELSE){   

             root.removeChild(target)

             

              }else if(ELSE){

                if(root.children[i] && root.children[i].isSameNode(ELSE)){

                }else{

                    if(target.parentNode==root){

                root.replaceChild(ELSE,target);

                    }

                }

              }



            }else{
                
                
                 if(root.children[i]){

                    const el=root.children[i];

                    
                     if(el.isSameNode(target)){
                       
                        if(ELSE && ELSE.parentNode!=null){


                            root.removeChild(ELSE)

                        }
                        
                    }
                    else if(ELSE && ELSE.parentNode!=null){

                        

                        root.replaceChild(target,ELSE)

                        

                    }
                    
                    else{

                    root.insertBefore(target,el);

                    }

                } 
         

                else{

                    root.appendChild(target)

                }


            }


    

    }
    
}

run();

const observer=new Map();

const reactor=new Proxy(data,{

    set(target, prop, value){

        if(!(prop in data)){
 
            consW(`
            "${prop}" was not defined 
            as a conditional property.
            
            `)

            return false;

        }

        if(!isBool(value)){

            err(`
            The values of all conditional properties must be either true or false,
            and not ${valueType(value)}
            `);

            return false;

        }

        Reflect.set(target, prop, value);

        run();

        if(observer.size==1){


            const callBack=observer.get("callBack");

            callBack(prop, value);


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
    configurable:!1
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

                cond=isCallable(cond) ? cond.call(data) : cond;

                if(!isBool(cond)){

                    err(`
                    All the values of conditional properties must be either true or false,
                    and not ${cond}.
                    
                    `)

                }

                if(!(prop in this)){

                    consW(`
                    
                    "${prop}" was not defined as conditional property.
                    
                    `)

                };


                    data[prop]=cond;

                

            };



            run();

        },
        enumerable:!1,
        configurable:!1

    }
})

return reactor;

}
