import{
    
    DOMMUTATION,
    syErr,
    isCallable,
    isDefined,
    isObj,
    array,
    hasProp,
    ParserWarning
    

} from "./helpers.js"


import{
    renderList as list
} from "./renderlist.js"



export function template(obj){



       if(!isObj(obj)){


           syErr(`
           
           The argument of template function must be a plain object.
           
           `)

       }


    const{
        elements
    }=obj;
    

    if(!array.is(elements)){

        syErr(`
        
        elements must be an array.

        IN: template() function.
        
        `)

    }
    
     

     function createChildren(father, childrenArray){
    

        

        for(let child of childrenArray){
            
            
            let{
                tag,
                text,
                attrs={},
                events={},
                renderList,
                styles={},
                children=[],
            }=child;
        
            tag=isCallable(tag) ? tag() : tag;
        
            if(tag==void 0){
        
                continue;
        
            }
        
            const _child=document.createElement(tag);
            _child._events=Object.create(null);
        

 

             Object.entries(attrs).forEach((attr)=>{
                 
                const[name,value]=attr;
        
                if(isDefined(value)){
                    
        
                    if(isCallable(value)){
        
                    _child.setAttribute(name,value());
                    
                }else{
               
                    _child.setAttribute(name,value);
        
                }
        
                }
        
             })
        
             Object.entries(events).forEach((ev)=>{
        
                const[name,handler]=ev;
        
                if(!name.startsWith("on")){
        
                    syErr(`
                    
                    Every HTML events must start with on. And
        
                    "${name}" does not.
        
        
                    `)
        
                }

                if(!(name in HTMLElement.prototype)){

                    /**
                     *
                     * @name - is not a recognised HTML event.
                     * 
                     *
                     */
    
                     ParserWarning(`
                     
                     "${name}" is not a recognised HTML event.
                     
    
                     `)
    
                }
        
        
        
                if(isDefined(handler)){
        
                    _child[name]=handler;
                    _child._events[name]=handler;
        
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

        if((isDefined(text) 
        && !hasProp(renderList) && children.length==0
        )){
         
            if(isCallable(text)){

            _child.appendChild(

                document.createTextNode(TEXT())
            )

        }else{

            _child.appendChild(

                document.createTextNode(text)

            )

        }
    }

    
        father.appendChild(_child);

        if(children.length>0 && !hasProp(renderList)){

        createChildren(_child,children);
        new DOMMUTATION(_child);
        }else if(hasProp(renderList) ){

            
            const{
                each,
                do:_DO,
            }=renderList;

            list({
                in:_child,
                data:each,
                do:_DO
            })

        }
    }

    }


    
     
    
    
        let{
            tag,
            text,
            attrs={},
            events={},
             renderList={},
            styles={},
            children=[],
        }=elements[0];
    
        tag=isCallable(tag) ? tag() : tag;
    
        if(tag==void 0){
    
            return false;
    
        }
    
        
    
        const container=document.createElement(tag);
         container._events=Object.create(null);
         
    
         Object.entries(attrs).forEach((attr)=>{
             
            const[name,value]=attr;
    
            if(isDefined(name)){
    
                if(isCallable(value)){
    
                container.setAttribute(name,value());
                
            }else{
           
                container.setAttribute(name,value);
    
            }
    
            }
    
         })
    
         Object.entries(events).forEach((ev)=>{
    
            const[name,handler]=ev;
    
            if(!name.startsWith("on")){
    
                syErr(`
                
                Every HTML events must start with "on". And
    
                ${name} does not.
    
    
                `)
    
            }
            if(!(name in HTMLElement.prototype)){

                /**
                 *
                 * @name - is not a recognised HTML event.
                 * 
                 *
                 */

                 ParserWarning(`
                 
                 "${name}" is not a recognised HTML event.


                 `)

            }
    
            container[name]=(ev)=>{handler(ev)};
            container._events[name]=handler;
            
    
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


    
         if(isDefined(text)){
        
            if(isCallable(text)){
            container.appendChild(
    
            document.createTextNode(text)
    
            )
            }else{
    
                container.appendChild(
    
                    document.createTextNode(text)
    
                )
    
            }
         }
    
         if(children.length>0 && !hasProp(renderList)){
    
       createChildren(container, children);

       new DOMMUTATION(container);
    
        }else  if(hasProp(renderList)){

            const{
                each,
                do:_DO
            }=renderList;

            list({
                in:container,
                data:each,
                do:_DO
            });

        }
    
        

     
    
     return  container;
    
    
    
        }


