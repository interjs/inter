
  import {

    syErr,
    isObj,
    isCallable,
    validInProperty,
    validEachProperty,
    valueType,
    Iterable,
    isAtag,
    getId,
    consW,
   isArray,
   isDefined,
   err,
   isMap,
   isSet,
   isTrue,
   isFalse,
   isNotConfigurable,
   validStyleName,
   validDomEvent,
   ParserWarning
   
   

} from "./helpers.js";

import{ 

    
    toDOM


} from "./template.js"


/**
 *  Reactive system for listing 
 *
 */

 function checkType(arg, call){

    if(isObj(arg)){

        defineReactiveObj(arg, call);

    }else if(isArray(arg)){

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

    if(isNotConfigurable(obj)){

        consW(`
        
        Inter fails to define reactivity
        in a plain Javascript object because it is a no-configurable object.
        
        `);

        return false;

    }

    if(defineProps in obj){

        console.log(obj)

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
            configurable:!0

        })

    };

    Object.defineProperties(obj,{

        defineProps:{

            set(props){

                if(!isObj(props)){

                    syErr(`
                    
                    The value of [List reactor => Object.defineProps] must be
                    only a plain Javascript object, and you
                    defined "${valueType(props)}" as its value.
                    
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

        },
        deleteProps:{
            set(props){

                if(!isArray(props)){

                    syErr(`
                    
                    The value of [List reactor => Object.deleteprops] must be 
                    an array, and you defined "${valueType(props)}" as its value.
                    
                    `)

                };

                for(const prop of props){
                    

                    if(prop in this){

                        delete this[prop];

                    };

                };

                call();

            }
        },
        [reactive]:{
            get(){

                return true;

            }
        }

    })

 }

 function defineReactiveArray(array, call){

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

                Array.prototype[method].apply(this, arguments);

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

 function defineReactiveMap(map, call){

    const reactive=Symbol.for("reactive");

    if(reactive in map){

        return false;

    }

    const mutationMethods=[

        "set",
        "delete",
        "clear"
         

    ];


    

    for(const method of mutationMethods){

        Object.defineProperty(map, method, {

            value(){

                Map.prototype[method].apply(this, arguments);
                if(method=="add"){

                    const value=arguments[1];

                    checkType(value);

                }

                call();

            }

        })

    }

    walkMap(map);

    Object.defineProperty(map, reactive, {

        value:true

    })

    

 }

 function defineReactiveSet(set, call){

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

            value(){

                Set.prototype[method].apply(this,arguments);

                if(method==="add"){

                    checkType(arguments[0]);

                };

                call();

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

 function costumReactor(array, htmlEl, updateSystem){

    if(isNotConfigurable(array)){

        return false;

    }
        

Object.defineProperties(array, {

    shift:{

    value(){  
    
    Array.prototype.shift.apply(array, void 0);
    const firstNodeElement=htmlEl.children[0];
    
    if(firstNodeElement){
    
    htmlEl.removeChild(firstNodeElement);
    
    
    updateSystem();
    
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

        updateSystem();

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
        
    
        
        
        updateSystem();
        
        }


    }
        
         })
        
        



 }


 let defineNewEach;

export function renderList(options){

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

    let {
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

    if(isArray(each)){


        costumReactor(each, root, updateSystem);


    }

    let pro, firstRender=true;
    const costumProps=new Set(["otherArray", "addItems"])

    function proSetup(){

        

        if(typeof each!=="number"){

            if(isNotConfigurable(each)){

                err(`
                
                Inter fails to define the reactivity in the list reactor,
                because the  value(array or plain object) of the each option is not configurable.
                
                `)

            }

            pro=new Proxy(each, {

                set(target, prop, value){
                  
                    if(costumProps.has(prop)){

                        Reflect.set(target, prop, value);
                        return true;    
                    }

                    Reflect.set(target, prop, value);

                    updateSystem();

                    if(typeof prop !=="number" && validEachProperty(value)){

                        

                        checkType(value, updateSystem)

                    }

                    return true;


                },

                get(){


                    return Reflect.get(...arguments);

                },
                defineProperty(){

                    Reflect.deleteProperty(...arguments);

                    updateSystem();

                    return true;

                },

                

            })


        }

    }

    defineNewEach=(newArray)=>{

        each=newArray;
        proSetup();
        updateSystem();
        defineReactorReactiveProps(pro, each, updateSystem);
        

    }

    if(reactive){

        proSetup();

        if(isArray(each)){

        defineReactorReactiveProps(pro, each, updateSystem);

        };

        

    }


    
    
    


    function updateSystem(){

        const i=new Iterable(each);
        

      syncronizeRootChildrenLengAndSourceLength(root, i);
    

      
    i.each((data, index, type)=>{
      

        let newTemp;
            
        
        function checkIterationSourceType(){

       if(type==="array"){

        newTemp=DO.call(pro, data, index, pro);

       }

        else if(type==="object"){

      newTemp=DO.call(pro ,data[0]/*prop*/,data[1]/*value*/,pro);


        }else if(type==="number"){

            newTemp=DO(data)

        }else{

            //The type is set.

        newTemp=DO.call(pro ,data,pro);

        }

    }

    checkIterationSourceType();

             // The  function is returning the template.
        if(isObj(newTemp) && newTemp[Symbol.for("template")] && isObj(newTemp.element)){

            

            const actualEl=root.children[index];

            if(!isAtag(actualEl)){

                
                root.appendChild(toDOM(newTemp.element));

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
    
                     root.replaceChild(toDOM(newTemp.element), actualEl);
    
                    }else{
    
                        
    
                        runDiff(newTemp.element, actualEl.template, actualEl);
    
                    }
    
                }

            if(firstRender && reactive){
            checkType(type!=="object" ? data : data[1] /*obj prop*/, updateSystem);

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




function runDiff(newTemp, oldTemp, oldRoot){


    /**
     * the update and the UpdateChildren
     * have high priority in the diffing.
     * 
     */

     
     const diff={
         children:true
     }



     ContainerDeffing(newTemp, oldTemp, diff)

     if(diff.children && newTemp.children && newTemp.children.length>0 ){

        
        diffingChildren(newTemp.children, oldTemp.children, oldRoot);

     };

     
     

    


}

function isOneAnArrayAndOtherNot(first, second){

    return (

        (isArray(first) && !isArray(second)) || (!isArray(first) && isArray(second))

    );

}

function AreBothArray(first,second){

    return isArray(first)  && isArray(second);

}

function ContainerDeffing(newContainer, oldContainer, diff){

    const {
        tag:newTag,
        text:newText,
        attrs:newAttrs={},
        events:newEvents={},
        styles:newStyles={},
        children:newChildren
    }=newContainer;

    const {
        tag:oldTag,
        text:oldText,
        attrs:oldAttrs={},
        events:oldEvents={},
        events:oldStyles={},
        children:oldChildren,
        target
    }=oldContainer;

    const rootEL=target.parentNode

    

     if(newTag!==oldTag){

        const newElement=toDOM(newContainer);

        rootEl.replaceChild(newElement,target);

        diff.children=false;

        shareProps(oldContainer, newContainer);
        oldContainer.target=newElement


        return true;

     }

     if(isOneAnArrayAndOtherNot(newChildren, oldChildren)){

        const newElement=toDOM(newContainer)

        rootEL.replaceChild(newELement, target);

        diff.children=false;
        shareProps(oldContainer, newContainer);
        oldContainer.target=newElement;

        return true;

     }

     if(AreBothArray(newChildren, oldChildren) && newChildren.length!==oldChildren.length){

        const newElement=toDOM(newContainer)

        rootEL.replaceChild(newElement, target);

        diff.children=false;
        shareProps(oldContainer, newContainer);
        oldContainer.target=newElement;

        return true;

     }

    if(!isDefined(newChildren) && !isDefined(oldChildren)){

        if(newText!==oldText){


            target.textContent=newText;
            
            shareProps(oldContainer, newContainer);

        }
    }

    
attributeDiffing(target, oldAttrs, newAttrs);
eventDeffing(target, oldEvents, newEvents);
styleDiffing(target, oldStyles, newStyles);

shareProps(oldAttrs, newAttrs);
shareProps(oldEvents, newEvents);
shareProps(oldStyles, newStyles);




}

function shareProps(target, source){

    Object.assign(target, source);

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
         
         if(!(oldAttr in newAttributes) || !isDefined(newAttributes[oldAttr]) || isFalse(newAttributes[oldAttr])){

            target.removeAttribute(oldAttr);

            

         }     

        if(isDefined(newAttributes[newAttr]) && !isFalse(newAttributes[newAttr])){

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
    
   if(!(oldStyle in newStyles) || !isDefined(newStyles[oldStyle])){

        target.style.removeProperty(oldStyle)
        _new.splice(i,1);
        if(_new.length==0){

            target.removeAttribute("style");

        }

      

   }     

  if(isDefined(newStyles[newStyle])){

      if(newStyles[newStyle]!==oldStyles[newStyle]){

          if(validStyleName[newStyle]){

          target.style.setProperty(newStyle, newStyles[newStyle])

      }else{

        ParserWarning(`
        
        "${newStyle}" doesn't to seem to be a valid style name.
        
        `)

      }
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
    
   if(!(oldEvent in newEvents) || !isDefined(newEvents[oldEvent])){

      target[oldEvent]=void 0;

   }     

  if(isDefined(newEvents[newEvent])){

    if(validDomEvent(newEvent)){

    target[newEvent]=newEvents[newEvent];

    }else{

        ParserWarning(`
        
        "${newEvent}" doesn't seem to be a valid dom event.
        
        `)

    }

  }

}



}

function diffingChildren(__new, __old, realParent, diff){

    const _new=Array.from(__new),
    _old=Array.from(__old);
    let removed=0;

    for(let i=0; i<_new.length; i++){

        
        
     /**
      * {tag:"h2"}  {tag:"h2"}
      * {tag:null} {tag:null}
      * {tag:"button"} {tag:"button"}
      * 
      */

        const newChild=_new[i],
              oldChild=_old[i],
              __newChild=__old[i];

    
        const {
            tag:newTag,
            text:newText,
            children:newChildren=[],
            events:newEvents={},
            attrs:newAttrs={},
            styles:newStyles={},
            update=true,
            updateChildren=true,
            renderIf:newRenderIf
            
        }=newChild;
        
       const {
        tag:oldTag,
        text:oldText,
        children:oldChildren=[],
        events:oldEvents={},
        attrs:oldAttrs={},
        styles:oldStyles={},
        renderIf:oldRenderIf,
        target   

       }=oldChild;

       

            if(!update){  
            

                if(newChildren.length==oldChildren.length && newChildren.length!==0){
                    

                    diffingChildren(newChildren, oldChildren);

                };


                continue;

            

            }else if(newChildren.length!==oldChildren.length && updateChildren){

                if(target && target.parentNode!=null){

                    const newElement=toDOM(newChild, true);

                     realParent.replaceChild(newElement, target);

                     Object.assign(oldChild, newChild);
                      oldChild.target=newElement
                
            }

                
                continue;

            }else{


                if(newTag!==oldTag){

                        
                    const newELement=toDOM(newChild, true);

                    Object.assign(oldChild, newChild);

                    if(target && target.parentNode!=null){

                        realParent.replaceChild(newELement, target);
                        oldChild.target=newELement;

                    }

                    

                    continue
                    
             
                }

                

                if(isFalse(newRenderIf) && target && target.parentNode!=null){

                    realParent.removeChild(target);

                    if(i<_new.length-1){
                    
                    i--;
                    removed++;

                    }


                    
                    continue;

                }

                
                if(isTrue(newRenderIf)){
                    

                    if(target && target.parentNode==null){

                        
                        const newELement=toDOM(newChild, true);

                        Object.assign(oldChild, newChild);

                        oldChild.target=newELement

                    if(isAtag(realParent.children[i-removed])){

                        realParent.insertBefore(newELement, realParent.children[i-removed]);

                    }else{

                        realParent.appendChild(newELement)


                    }

                    continue;
                    

                }



                if(!target){


                    if(isAtag(realParent.children[i-removed])){

                        const newELement=toDOM(newChild, true);

                        Object.assign(oldChild, newChild);

                        oldChild.target=newELement


                        realParent.insertBefore(newELement, realParent.children[i-removed]);

                    }else{

                        
                        const newELement=toDOM(newChild, true);

                        Object.assign(oldChild, newChild);

                        oldChild.target=newELement
                          
                        realParent.appendChild(newELement)

                    }

                }

                }


                if(newChildren.length==oldChildren.length && newChildren.length!==0){

                    

                    diffingChildren(newChildren, oldChildren, target);

                    continue;

                }

                
                if(oldText!==newText && target){

                    target.textContent=newText
                    oldChild.text=newText



                }

                


                Object.assign(oldChild, newChild)
                oldChild.tag=oldTag
                
               if(target){                
                attributeDiffing(target, oldAttrs, newAttrs);
                styleDiffing(target, oldStyles, newStyles);
                eventDeffing(target, oldEvents, newEvents);
               }
                

            }

            
        }
    }
    
    function syncronizeRootChildrenLengAndSourceLength(root, iterable){

        if(root.children.length>iterable.source.values.length){
    
            let length=root.children.length-iterable.source.values.length
    
                   while(length--){
    
                    root.removeChild(root.children[length]);
    
                   }
    
                }
    
    };

    function defineReactorReactiveProps(reactor,original, updateSystem){

        Object.defineProperties(original, {

            otherArray:{
                set(value){
                    
                    if(!isArray(value)){

                        syErr(`The value of [List reactor].otherArray property must be an object.`)

                    };


                    defineNewEach(value);

                    for(let item of value){

                        checkType(item, updateSystem)

                    }


                },
                get(){

                    return void 0

                },
                configurable:!0
            },
            addItems:{
                value(items, position){


                    if(!isDefined(position) || position>reactor.length-1){

                        for(const item of items){

                         original.push(item);
                            
                         checkType(item, updateSystem);

                        }

                    }

                    if(position==0 || position<0){

                        for(let i=items.length-1; i>-1 ;i-- ){

                            reactor.unshift(items[i]);

                            checkType(items[i], updateSystem);

                        }

                    }

                },
                configurable:!0
            }

        })

    }