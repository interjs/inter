
  import {

    syErr,
    isObj,
    isCallable,
    validInProperty,
    validEachProperty,
    valueType,
    Iterable,
    array,
    isAtag,
    getId,
    consW,
   notSameLength,
   isDefined,
   err,
   isMap,
   isSet
   
   

} from "./helpers.js";

import{ 

    template,
    toDOM


} from "./template.js"


/**
 *  Reactive system for listing 
 *
 */

 function checkType(arg, call){

    if(isObj(arg)){

        defineReactiveObj(arg, call);

    }else if(array.is(arg)){

        defineReactiveArray(arg, call);

    }else if(isMap(arg)){

        defineReactiveMap(arg, call);

    }else{

        if(isSet(arg)){

            defineReactiveSet(arg, call);

        }

    }

 }

 function defineReactiveObj(obj, call){

    const reactive=Symbol.for("reactive"),
          defineProps="defineProps",
          setProps="setProps",
          share=Object.assign(Object.create(null), obj);

    if(reactive in obj){

        //The object is already reactive
        //So, we must skip all the task.

        return  false;

    }

    if(defineProps in obj){

        consW(`
        
        "defineprops" is a reserved property,
        do not create a property with this name in the reactor
        of reactive listing.
        
        `);

      delete obj.defineProps;  

    };

    if(setProps in obj){

        consW(`
        
        "setProps" is a reserved property,
        do not create a property with this name in the reactor
        of reactive listing.
        
        `);

        delete obj.setProps;

    };

    for(const prop of Object.keys(obj)){

        Object.defineProperty(obj, prop, {

            set(newValue){

                share[prop]=newValue;

                call();

            },

            get(){

                return share[prop];

            },
            configurable:!1

        })

    };

    Object.defineProperties(obj,{

        defineProps:{

            set(props){

                if(!isObj(props)){

                    syErr(`
                    
                    The value of [Reactor].defineProps must be
                    only a plain Javascript object, and you
                    defined ${valueType(props)} as its value.
                    
                    `);

                };

                for(const [prop, value] of Object.entries(props)){

                    if(!(prop in this) && prop!==defineProps && prop!==setProps){

                        share[prop]=value;

                    }

                };

                call();

            },
            enumerable:!1,
            configurable:!1

            

        },

        setProps:{

            set(props){

                if(!isObj(props)){


                    syErr(`
                    
                    The value of [Reactor].defineProps must be
                    only a plain Javascript object, and you
                    defined ${valueType(props)} as its value.
                    
                    `);

                };

                for(const [prop, value] of Object.entries(props)){

                    if(prop in this && prop!==defineProps && prop!==setProps){

                        share[prop]=value;

                    }

                };

                call();

            },
            enumerable:!1,
            configurable:!1

        }

    })

 }

 function defineReactiveArray(array){

    const reactive=Symbol.for("reactive");

    if(reactive in array){

        return false;

    }

    const mutationMethods=[
        "push",
        "unshift",
        "pop",
        "shift",
        "splice",
        "sort",
        "reverse"
    ];

    for(const method of mutationMethods){

        Object.defineProperty(array, method, {

            value(start, deleteCount, ...items){

                Array.prototype[method].apply(this, ...arguments);

                if(method==="push" || method==="unshift"){

                    for(const arg of arguments){

                         checkType(arg)

                    }

                }else{

                    if(method==="splice" && isDefined(items)){

                        for(const item of items){

                            checkType(item);

                        }


                    }

                }

            }

        })

    };

    walkArray(array);

    Object.defineProperty(array, reactive, {

        value:true,

    })


 };

 function defineReactiveMap(map){

    const reactive=Symbol.for("reactive");

    if(reactive in map){

        return false;

    }

    const mutationMethods=[

        "add",
        "delete",
        "clear"
         

    ];


    

    for(const method of mutationMethods){

        Object.defineProperty(map, method, {

            value(){

                Map.prototype[method].apply(this, ...arguments);
                if(method=="add"){

                    const value=arguments[1];

                    checkType(value);

                }

            }

        })

    }

    walkMap(map);

    Object.defineProperty(map, reactive, {

        value:true

    })

    

 }

 function defineReactiveSet(set){

    const reactive=Symbol.for("reactive");

    if(reactive in set){

        return false;

    }

    const mutationMethods=[

        "add",
        "clear",
        "delete"


    ];

    for(const method of mutationMethods){

        Object.defineProperty(set, method, {

            set(){

                Set.prototype[method].apply(this, ...arguments);

                if(method==="add"){

                    checkType(arguments[0]);

                }

            }

        });

    };

    walkSet(set);

    Object.defineProperty(set, reactive, {

        value:true

    })
    

 }

 function walkMap(map){

    /**
     * The goal here is to iterate through the map collection
     * and if we found an object, an array, a set or even a map, we must make reactive.
     * 
     */

     map.forEach((value)=>{

        checkType(value)


     })


 }

 function walkArray(array){

    for(let item of array){

        checkType(item);

    }

 }

 function walkSet(set){

    set.forEach((value)=>{

        checkType(value)

    })

 }

 function costumReactor(array, htmlEl){

    
        

Object.defineProperties(array, {

    shift:{

    value(){  
    
    Array.prototype.shift.apply(data, void 0);
    const firstNodeElement=htmlEl.children[0];
    
    if(firstNodeElement){
    
    htmlEl.removeChild(firstNodeElement);
    
    
    
    
    }
    
    
    
    
    }

},
    

 unshift:{

        value(){
        
        
        Array.prototype.unshift.apply(array, arguments);
        const _this=this;

        if(arguments.length>1){
        
        
        let i=arguments.length-1;
        
        for(; i>-1; i--){
        
            
        
            const el=DO.call(_this,arguments[i],i);
        
            if(htmlEl.children[0]){
            
                htmlEl.insertBefore(el, htmlEl.children[0]);
        
            }else{
        
                htmlEl.appendChild(el);
        
            }
        
        }
        
        }else if(arguments.length==1){
        
        const el=DO.call(_this, arguments[0], 0);
            
        
        if(htmlEl.children[0]){
            
            htmlEl.insertBefore(el, htmlEl.children[0]);
        
        }else{
        
            htmlEl.appendChild(el);
        
        }
        
        
        
        }
        }
        
        
        
        
        
        
        
        },
        
        
        
         splice:{
        
        value(start, deleteCount, ...items){
        
        Array.prototype.splice.apply(array,arguments);
        
        
        if(items.length==0){
        
            let from=start;
            const to=deleteCount;
        
        /**
         * 4
         * 1
         * 
         */
            for(let i=0; i<to; i++){
        
                
                const node=htmlEl.children[from];
        
                if(node){
        
                htmlEl.removeChild(node)
        
                }
        
            }
        
        }else{
        
            
        
            if(end==0 && items){
        
                for(let l=items.length-1; l>-1; l--){
        
                    const el=DO.call(pro, items[l], l);
        
                    if(htmlEl.children[start]){
        
                    htmlEl.insertBefore(el,htmlEl.children[start]);
        
                    }else{
        
                        htmlEl.appendChild(el);
        
                    }
        
                }
        
            }
        
        }
        
    
        
        
        
        
        }
    }
        
         })
        
        



 }


export function List(options){

    if(new.target!==void 0){

        syErr(`
        
        renderList is not a constructor, do not call
        it with the "new" keyword.
        
        `);

    }

    if(!isObj(options)){

        syErr(`
        
        The options(the argument of renderList) in renderList must be a plain Javascript object.
        
        `)


    }

    const {
        in:IN,
        each,
        do:DO,
        reactive=true
    }=options;

    const root=getId(IN)
     

    if(!validInProperty(IN)){

        syErr(`
        
        The "in" option in renderList must be either a string
        or an HTMLElement.
        
        `)

    }

    if(!validEachProperty(each)){

        syErr(`
  
        "${valueType(each)}" is not a valid value for the "each" options in renderList.
        The value that are accepted in "each" options, are:

        Array.
        Plain js object.
        Map.
        Set.

         
        `)

    }

    if(!isCallable(DO)){

        syErr(`
        
        The value of the "do" option in renderList, must be only a function.
        
        `)

    }

    if(array.is(each)){


        costumReactor(each, root);


    }

    let pro;

    function proSetup(){

        if(typeof each!=="number"){

            pro=new Proxy(each, {

                set(target, prop, value){
                  
                    Reflect.set(target, prop, value);

                    updateSystem();

                    if(typeof prop !=="number" && validEachProperty(value)){

                        checkType(value)

                    }


                },

                get(){


                    Reflect.get(...arguments);

                }
                

            })


        }

    }

    if(reactive){

        proSetup();

    }


    let firstRender=true;
    

    function updateSystem(){

    const i=new Iterable(each);

    


    if(root.children.length>i.source.values.length){

        let length=root.children.length-i.source.values.length

               while(length--){

                root.removeChild(root.children[length]);

               }

    }

    

    i.each((data, i)=>{

        let temp=DO.call(pro , data, i,pro)

        if(isObj(temp) && (Symbol.for("template") in temp) && isObj(temp.element)){

            const actualEl=root.children[i];

            // The  function is returning the template.

            if(!isAtag(actualEl)){

                root.appendChild(toDOM(temp.element));

            }else{

                
                if(!actualEl.template){
                   
                consW(`
                
                Avoid manipulating what Inter manipulates,
                
                `)

                /**
                 * ActualEl was not rendered by Inter, in
                 * this case we must replace it with an element
                 * rendered by Inter to avoid diffing problems.
                 */

                 root.replaceChild(toDOM(temp.element), actualEl);

                }else{

                    

                    runDiff(temp.element, actualEl.template);

                }
            

            }

            if(firstRender && reactive){

            checkType(data, updateSystem);

            }

        }else{

            syErr(`
            
           The template function is not being returned inside the do method in
           renderList(reactive listing), just return the template function.
            
            `)

        }


    })

    


}

updateSystem()

firstRender=false;

if(!reactive){

    return updateSystem;

};


}




function runDiff(newTemp, oldTemp){


    /**
     * the update and the UpdateChildren
     * have high priority in the diffing.
     * 
     */

     




     if(newTemp.children.length===oldTemp.children.length){

        
        diffingChildren(newTemp.children, oldTemp.children)

     }

    


}




function getGreater(firstArray, secondArray){

    return firstArray.length>secondArray.length ? firstArray : secondArray;

}

function attributeDiffing(target, oldAttributes, newAttributes){

    const _old=Object.keys(oldAttributes),
          _new=Object.keys(newAttributes),
          _greater=getGreater(_old, _new);

    for(let i=0; _greater.length>i ; i++){

        const oldAttr=_old[i],
              newAttr=_new[i];
          
         if(isDefined(oldAttr) && !(oldAttr in newAttributes) || !isDefined(newAttributes[oldAttr])){

            target.removeAttribute(oldAttr);

         }     

        if(isDefined(newAttr)){

            if(newAttributes[newAttr]!==oldAttributes[newAttr]){

                target.setAttribute(newAttr, newAttributes[newAttr]);

            }


        }

    }

};

function styleDiffing(target, oldStyles, newStyles){


    const _old=Object.keys(oldStyles),
    _new=Object.keys(newStyles),
    _greater=getGreater(_old, _new);

for(let i=0; _greater.length>i ; i++){

  const oldStyle=_old[i],
        newStyle=_new[i];
    
   if(isDefined(oldStyle) && !(oldStyle in newStyles) || !isDefined(newStyles[oldStyle])){

        target.style.removeProperty(oldStyle)
        _new.splice(i,1);
        if(_new.length==0){

            target.removeAttribute("style");

        }

      

   }     

  if(isDefined(newStyle)){

      if(newStyles[newStyle]!==oldStyles[newStyle]){

          target.style.setProperty(newStyle, newStyles[newStyle])

      }


  }

}

    
}


function eventDeffing(target, oldEvents, newEvents){

    const _old=Object.keys(oldEvents),
    _new=Object.keys(newEvents),
    _greater=getGreater(_old, _new);

for(let i=0; _greater.length>i ; i++){

  const oldEvent=_old[i],
        newEvent=_new[i];
    
   if(isDefined(oldEvent) && !(oldEvent in newEvents) || !isDefined(newEvents[oldEvent])){

      target[oldEvent]=void 0;

   }     

  if(isDefined(newEvent)){

    target[newEvent]=newEvents[newEvent];


  }

}



}

function diffingChildren(_new, _old){

    
    

    for(let i=0; i<_new.length; i++){

     

        const newChild=_new[i];
        const oldChild=_old[i];

        const {
            tag:newTag,
            text:newText,
            children:newChildren=[],
            events:newEvents={},
            attrs:newAttrs={},
            styles:newStyles={},
            update=true,
            updateChildren=true
            
        }=newChild;
        
       const {
        tag:oldTag,
        text:oldText,
        children:oldChildren=[],
        events:oldEvents={},
        attrs:oldAttrs={},
        styles:oldStyles={},
        target   

       }=oldChild;

       
       

            if(!update){

                

                continue;

            }else if(newChildren.length!==oldChildren.length && updateChildren){

                target.parentNode.replaceChild(toDOM(newChild), oldChild.target);

            }else{

                if(newTag!==oldTag){

                    

             target.parentNode.replaceChild(toDOM(newChild), oldChild.target);

                    continue;

                }

                if(newChildren.length==newChildren.length){

                    

                    diffingChildren(newChildren, oldChildren);

                }

                
                if(newText!==oldText){
                    

                target.textContent=newText;
                       
                    


                };

                
                attributeDiffing(target, oldAttrs, newAttrs);
                styleDiffing(target, oldStyles, newStyles);
                eventDeffing(target, oldEvents, newEvents);
                
                

            }
        }
    }