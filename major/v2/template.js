import{
    
    createText,
    validTagOption,
    validStylesOrEventsOptions,
    syErr,
    isCallable,
    isDefined,
    isObj,
    ParserWarning,
    consW,
    validDomEvent,
    validStyleName,
    isBool,
    valueType,
    isFalse
    

} from "./helpers.js"




export function template(obj){

    

if(isObj(obj)){


    const temp=Symbol.for("template");

        return {

            [temp]:!0,
            element:obj,
            
        };




}else{

    syErr(`
    
    The argument of the template function must be a plain Javascript object,
    but you defined ${valueType(obj)} as its argument.
    
    `)

}


}




/**
 * Exported(in modularized version) internal function.
 * 
 */

         export function toDOM(obj, isChild){

    

            let {
                tag,
                text,
                renderIf,
                attrs={},
                events={},
                styles={},
                children=[],
                update=false,
                updateChildren=false,
            }=obj;

            
            
            
            tag=isCallable(tag) ? tag() : tag;

            if(isDefined(renderIf) && !isChild){

                

              ParserWarning(`
              
              You can not conditionally render a container in template
              function.
              
              `)

              return false;

            };

              if(!validTagOption(tag)){

                syErr(`
                
                "${valueType(tag)}" is an invalid tag's name, in template function.
                
                `)

              };

              if(!validStylesOrEventsOptions(events) || !validStylesOrEventsOptions(styles)){

                syErr(`
                
                The "events" and "styles" options in template function must be both plain Javascript objects.               
                `);

              }

              if(!isBool(update) || !isBool(updateChildren)){

                syErr(`
                
                The "update" and "updateChildren" in template function must be only boolean(true/false).
                
                `)

              }




              const container=document.createElement(tag);
              container.template=Object.assign(obj,{

                update:update,
                updateChildren:updateChildren,
                target:container

              }) // For diffing task.

              Object.entries(attrs).forEach((attr)=>{

                let [name, value]=attr;

                const setAttr=(attrValue)=>{
                    
                    if(isDefined(attrValue) && !isFalse(attrValue)){

                        if(name!=="value"){

                            container.setAttribute(name, attrValue)

                        }else{

                            container[name]=attrValue;

                        }

                    }

                }

                if(isCallable(value)){

                    value=value();

                    setAttr(value);


                }else{

                    setAttr(value);

                }

              })

               Object.entries(events).forEach(event => {

                const [name, handler]=event;

                     if(validDomEvent(name)){

                        if(isCallable(handler)){

                            container[name]=handler;
                            

                        }else{

                            ParserWarning(`
                            
                            The event "${name}" was not created because
                            its handler is not a function, in tempate function.
                            
                            `)

                        }

                     }else{

                        ParserWarning(`
                        
                        "${name}" doesn't seem to be a valid dom event.
                        
                        `)

                     }

                   
               });

               Object.entries(styles).forEach(style=>{

                const [name, value]=style;

                

                if(validStyleName(name)){

                    let styleValue=isCallable(value) ? value() : value;

                    if(isDefined(styleValue)){
                        
                        container.style.setProperty(name, styleValue);
                        

                    }

                }else{


                    ParserWarning(`
                    
                    "${name}" doesn't seem to be a valid style name.

                    `)

                }


               });

               if(isDefined(text) && children.length==0){


                const textContent=isCallable(text) ? createText(text()) : createText(text);

                container.appendChild(textContent);


               }else if(isDefined(text) && children.length>0){

                    consW(`
                    
                    It was found an element with both the text property and children property,
                    and in this case Inter ignores the text property.
                    
                    `);

                    createChildren(container, children);

                

               }else{

                if(children.length>0){


                    createChildren(container, children);

                }

               }

               


               return container;






}

function createChildren(root, children){


    for(let child of children){

        let {
            tag,
            text,
            attrs={},
            events={},
            styles={},
            children=[],
            renderIf,
            update=false,
            updateChildren=false,
        }=child;

        tag=isCallable(tag) ? tag() : tag;

        if(isDefined(renderIf) && isBool(renderIf)){
            

          if(isFalse(renderIf)){

            continue;

          }

        };


           
          if(!validTagOption(tag)){

            syErr(`
            
            "${tag}" is an invalid tag's name, in template function.
            
            `)

          };

          if(!validStylesOrEventsOptions(events) || !validStylesOrEventsOptions(styles)){

            syErr(`
            
            The "events" and "styles" options in template function must be both plain Javascript objects.               
            `);

          };

          
          if(!isBool(update) || !isBool(updateChildren)){

            syErr(`
            
            The "update" and "updateChildren" in template function must be only boolean(true/false).
            
            `)

          }




          const container=document.createElement(tag);
          container.template=Object.assign(child,{

             update:update,
             updateChildren:updateChildren,
             target:container

          }); //For diffing task.

          Object.entries(attrs).forEach((attr)=>{

            let [name, value]=attr;
            const setAttr=(attrValue)=>{
                
                if(isDefined(attrValue) && !isFalse(attrValue)){

                    if(name!=="value"){

                        container.setAttribute(name, attrValue)

                    }else{

                        container[name]=attrValue;

                    }

                }

            }

            if(isCallable(value)){

                value=value();

                setAttr(value);


            }else{

                setAttr(value);

            }

          })


           Object.entries(events).forEach(event => {

            const [name, handler]=event;

                 if(validDomEvent(name)){

                    if(isCallable(handler)){

                        container[name]=handler;
                        

                    }else{

                        ParserWarning(`
                        
                        The event "${name}" was not created because
                        its handler is not a function, in tempate function.
                        
                        `)

                    }

                 }else{

                    ParserWarning(`
                    
                    "${name}" doesn't seem to be a valid dom event.
                    
                    `)

                 }

               
           });

           Object.entries(styles).forEach(style=>{

            const [name, value]=style;
            

            if(validStyleName(name)){

                let styleValue=isCallable(value) ? value() : value;

                if(isDefined(styleValue)){

                    container.style.setProperty(name, styleValue);
                    

                }

            }else{


                ParserWarning(`
                
                "${name}" doesn't seem to be a valid style name.

                `)

            }


           });

           if(isDefined(text) && children.length==0){


            const textContent=isCallable(text) ? createText(text()) : createText(text);

            container.appendChild(textContent);


           }else if(isDefined(text) && children.length>0){

                consW(`
                
                It was found an element with both the text property and children property,
                and in this case Inter ignores the text property.
                
                `);

                createChildren(container, children);

            

           }else{

            if(children.length>0){


                createChildren(container, children);

            }

           }

           

           root.appendChild(container);


    }


    }


