import{
    
    createText,
    validTagOption,
    validStylesOrEventsOptions,
    syErr,
    isCallable,
    isDefined,
    isObj,
    array,
    ParserWarning,
    consW,
    validDomEvent,
    validStyleName,
    isBool,
    valueType
    

} from "./helpers.js"




export function template(obj){

    const root="elements";

if(root in obj && array.is(obj.elements)){

    const {elements}=obj;

    if(isObj(elements[0])){

        const temp=Symbol.for("template");

        if(elements.length>1){

            consW(`
            
            You are creating more than one element in template function without a container,
            wrap the elements inside a container.
            
            `)

        }

        

        return {

            [temp]:!0,
            element:{
                tag:elements[0].tag,
                text:elements[0].text,
                events:elements[0].events==void 0 ? {} : elements[0].events,
                attrs:elements[0].attrs==void 0 ? {} : elements[0].attrs,
                styles:elements[0].styles==void 0 ? {} : elements[0].styles,
                children:elements[0].children==void 0 ? [] : elements[0].children,
                update:elements[0].update==void 0 ? true : elements[0].update,
                updateChildren:elements[0].updateChildren==void 0 ? true : elements[0].updateChildren,
                created:elements[0].created

            }
            
        };

    }


}else{

    syErr(`
    
    elements must be an array in template function.
    
    `)

}


}




/**
 * Exported(in modularized version) internal function.
 * 
 */

         export function toDOM(obj){

    

            let {
                tag,
                text,
                events={},
                styles={},
                children=[],
                created,
                update=false,
                updateChildren=false,
            }=obj;

               
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

              tag=isCallable(tag) ? tag() : tag;

              if(!isDefined(tag)){

                syErr(`
                
                You can not conditionally render a container in template
                function.
                
                `)

              };



              const container=document.createElement(tag);
              container.template=Object.assign(obj,{

                update:update,
                updateChildren:updateChildren,
                target:container

              }) // For diffing task.

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
                        
                        "${name}" doesn't seem to be a valid event of the dom.
                        
                        `)

                     }

                   
               });

               Object.entries(styles).forEach(style=>{

                const [name, value]=style;

                if(validStyleName(name)){

                    let styleValue=isCallable(value) ? value() : style;

                    if(isDefined(styleValue)){

                        container.prototype.style.setProperty(name, styleValue);
                        

                    }

                }else{


                    ParserWarning(`
                    
                    "${name}" doesn't seem to be a valid style's name.

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

               
               if(isCallable(created)){

                created(container);

               }


               return container;






}

function createChildren(root, children){


    for(let child of children){

        let {
            tag,
            text,
            events={},
            styles={},
            children=[],
            created,
            update=false,
            updateChildren=false,
        }=child;

           
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

          tag=isCallable(tag) ? tag() : tag;

          if(!isDefined(tag)){

            syErr(`
            
            You can not conditionally render a container in template
            function.
            
            `)

          };



          const container=document.createElement(tag);
          container.template=Object.assign(child,{

             update:update,
             updateChildren:updateChildren,
             target:container

          }); //For diffing task.

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
                    
                    "${name}" doesn't seem to be a valid event of the dom.
                    
                    `)

                 }

               
           });

           Object.entries(styles).forEach(style=>{

            const [name, value]=style;

            if(validStyleName(name)){

                let styleValue=isCallable(value) ? value() : style;

                if(isDefined(styleValue)){

                    container.prototype.style.setProperty(name, styleValue);
                    

                }

            }else{


                ParserWarning(`
                
                "${name}" doesn't seem to be a valid style's name.

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

           
           if(isCallable(created)){

            created(container);

           };

           root.appendChild(container);


    }


    }


