import{

    syErr,
    ParserWarning,
    isFalse,
    isObj,
    getId,
    consW,
    array,
    isAtag,
    err,
    isCallable
    

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
        
        renderIf is not a constructor.
        
        `)


    }else{

        const{
            in:IN,
            data,
            
        }=obj;

        let index=-1;
        const theContainer=getId(IN);
        const children=theContainer.children;
        const els=new Set();


        function deepIfs(el){

            
            

                //Nested children.

                const nodes=el.children;

                let _index=-1;
                for(let node of nodes ){

                    

                    _index++;
                    

                    if(node.children.length>0){

                        deepIfs(node);

                    }

                    const setting={
                        target:node,
                        if:void 0,
                        else:void 0,
                        ifNot:void 0,
                        i:_index,
                        root:node.parentNode,
                    }
             
                    

            let sibling=node.nextElementSibling;

                        
            if(node.hasAttribute("_ifNot")){
                 
                setting.ifNot=node.getAttribute("_ifNot");

                if(setting.ifNot in data){

                    node.removeAttribute("_ifNot");

                    els.add(setting);

                }else{

                    ParserWarning(`
                    
                    The conditional rendering parser found
                    an element with the _notIf attribute and the value
                    of this attribute is not a conditional property in data object.

                    {
                        element: ${node.nodeName.toLowerCase()},
                        _ifNot:${setting.ifNot},
                        data:${Object.keys(data)}
                    }
                    
                    `)
                }


            }
                        
       else if(node.hasAttribute("_else") && !node.hasAttribute("_if")){


                ParserWarning(`
                                
                It was found an element with an "_else" attribute,
                but there is not an element by attribute "_if" before it.

                `)

                       }

                        if(node.hasAttribute("_if")){

                            
                            if(node.hasAttribute("_else")){

                                ParserWarning(`
                                
                                It was found an element which has simultaneousilly
                                the "_if" and "_else" attribute. It's forbidden.
                                
                                `)
            
                                return false;
            
                            }
                            setting.if=node.getAttribute("_if");

                            if(!(setting.if in data)){

                                ParserWarning(`
                    
                                  The conditional rendering parser found
                                  an element with the _if attribute and the value
                                  of this attribute is not a conditional property in data object.

                                 {
                                 element: ${node.nodeName.toLowerCase()},
                                 _if:${setting.if},
                                 data:${Object.keys(data)}
                                 }
                    
                    `)

                      
                            setting.if=void 0;
                     
                 }

                            node.removeAttribute("_if");

                            
                     
                    
                        }

              if(setting.if && sibling && sibling.hasAttribute("_else")){


                
                if(sibling.hasAttribute("_if")){
            
                    ParserWarning(`
                    
                    It was found an element which has simultaneousilly
                    the "_if" and "_else" attribute. It's forbidden.
                    
                    `)
                    return false;
                }

                
                            
                            setting.else=sibling;

                            sibling.removeAttribute("_else");

            


                        }if(setting.if){

                            els.add(setting);

                        }






                    

            

            }
            

        }

        for(let child of children){

            index++;

            const setting={
                target:child,
                if:void 0,
                else:void 0,
                ifNot:void 0,
                i:index,
                root:theContainer
            }


           const sibling=child.nextElementSibling;
            
            if(child.children.length>0){

                deepIfs(child)
                

            }

            if(child.hasAttribute("_ifNot")){
                 
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

        else if(child.hasAttribute("_else") && !child.hasAttribute("_if")){


                ParserWarning(`
                                
                It was found an element with an "_else" attribute,
                but there is not an element by attribute "_if" before it.

                `)

                return false;

            };
            

             if(child.hasAttribute("_if")){
             
                if(child.hasAttribute("_else")){

                    ParserWarning(`
                    
                    It was found an element which has simultaneousilly
                    the "_if" and "_else" attribute. It's forbidden.
                    
                    `)

                    return false;

                }

                setting.if=child.getAttribute("_if");

                if(!(setting.if in data)){

                    ParserWarning(`
                    
                    The conditional rendering parser found
                    an element with the _notIf attribute and the value
                    of this attribute is not a conditional property in data object.

                    {
                        element: ${node.nodeName.toLowerCase()},
                        _ifNot:${setting.ifNot},
                        data:${Object.keys(data)}
                    }
                    
                    `);

                    setting.if=void 0;

                }

                child.removeAttribute("_if");
                
                

            }  if(sibling && sibling.hasAttribute("_else")){


                
                if(sibling.hasAttribute("_if")){

                    ParserWarning(`
                    
                    It was found an element which has simultaneousilly
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


        const reactor=parseConditionalRendering(data,els);

        

        return reactor;
    }

    



}


function parseConditionalRendering(data,els){

    const toArray=array.create(els);

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

const reactor=new Proxy(data,{

    set(...args){

        if(!(args[1] in data)){
 
            consW(`
            ${args[1]} was not defined 
            as a conditional property.
            
            `)

            return false;

        }

        Reflect.set(...args)

        run();

        if(observer.has(args[1])){



            observer.get(args[1]).call({

                stopObserving(){

                    observer.delete(args[1])

                }

            }, args[2]);

        }

    },

    deleteProperty(...args){

        return false;

    }

})

const observer=new Map();

Object.defineProperties(reactor,{ 
    "observe":{

    value(prop, fn){

        if(observer.has(prop)){

            return false;
        }

        else if(!(prop in this)){

            consW(`
            
            "${prop}" is not a conditional property.

            `)

        }else if(typeof fn!=="function"){

            consW(`
            
           The second argument of [renderIf reactor].observe(),
           must be a function.
            
            `)

        }else{

                observer.set(prop, fn);

                return true;

        }

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


            for(const [prop, cond] of Object.entries(conditions)){

                if(!(prop in this)){

                    consW(`
                    
                    "${prop}" was not defined as conditional property.
                    
                    `)

                };

                if(isCallable(cond)){

                data[prop]=cond.call(data);

                }else{

                    data[prop]=cond;

                }

            };



            run();

        },
        enumerable:!1,
        configurable:!1

    }
})

return reactor;

}
