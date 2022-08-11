

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
   ParserWarning,
   isValidTemplateReturn
   
   

} from "./helpers.js";

import{ 

    
    toDOM


} from "./template.js";


/**
 *  Reactive system for listing. 
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


 
 function exactElToRemove(obj, key, root){

  
if(isObj(obj)){

    _inObj(obj, key, root);

}else if(isSet(obj)){

    _inSet(obj, key, root);

}else{

    _inMap(obj, key, root);

}
  


 }

 function _inObj(obj, key, root){

    const keys=Object.keys(obj);

    keys.some((prop,i)=>{

        if(prop==key){
    
           _exactRemove(root, i);
           
    
        }
    
      })

 }

 function _inSet(set, key, root){

    const obj=Array.from(set);
    

    obj.some((item, i)=>{

        if(item==key){

            _exactRemove(root, i);

        }

    })

 }

 function _inMap(obj, key, root){

    let i=-1;

    obj.forEach((value, prop)=>{

        i++;

        if(prop==key){

            _exactRemove(root, i);

        }

    })

    

 }

 function _exactRemove(root, i){

    const elToRmove=root.children[i];
    
    if(isAtag(elToRmove)){

        root.removeChild(elToRmove);

    }

 }

function createArrayReactor(each, updateSystem){


    if(isNotConfigurable(each)){

        err(`
        
        Inter fails to define the reactivity in the list reactor,
        because the Array  of the each option is not configurable.
        
        `)

    }

    const costumProps=new Set(["otherArray", "addItems"]);

    return new Proxy(each, {

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

    })




}
    
function createObjReactor(each, updateSystem, root){

    if(isNotConfigurable(each)){

        err(`
        
        Inter fails to define the reactivity in the list reactor,
        because the Array  of the each option is not configurable.
        
        `)

    }



    return new Proxy(each, {

        set(target, prop, value){
          

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

        deleteProperty(target, prop){

            if(prop in target){

                exactElToRemove(target, prop, root)
                Reflect.deleteProperty(...arguments);
                updateSystem()
                

                return true;

            }

            consW(`
            You are trying to delete the "${prop}" property in the list
            reactor, but that property does not exist in the list reactor.
            
            `)

        }

    })




}

 function defineReactiveObj(obj, call){

    const reactive=Symbol.for("reactive"),
           reservedProps=new Set(["setProps","defineProps","deleteProps"]),
          share=Object.assign(Object.create(null), obj);

    if(reactive in obj){

        //The object is already reactive
        //So, we must skip all the task.

        return  false;

    }

    if(isNotConfigurable(obj)){

        consW(`
        
        Inter fails to define reactivity
        in a plain Javascript object because it is a non-configurable object.
        
        `);

        return false;

    }


    for(const prop of Object.keys(obj)){

        if(reservedProps.has(prop)){

        delete obj[prop];

        consW(`
        
        "${prop}" is a reserved property,
        do not create a property with this name in the reactor
        of reactive listing.
        
        `);

        

        }

        Object.defineProperty(obj, prop, {

            set(newValue){

                share[prop]=newValue;
                call();
                checkType(newValue, call)

            },

            get(){

                return share[prop];

            },
            configurable:!0

        })

        checkType(obj[prop], call);

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

                    if(!(prop in this) && prop!=="defineProps" && prop!=="setProps"
                    && prop!=="dleteProps" 
                    ){

                        share[prop]=value;
                        Object.defineProperty(this, prop, {
                            set(newValue){

                                share[prop]=newValue;
                                call();
                                checkType(newValue, call);

                            },
                            get(){  return share[prop]  },
                            configurable:!0
                        });

                        checkType(value, call);

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

                    if(prop in this && prop!=="defineProps" && prop!=="setProps"
                    && prop!=="deleteProps"
                    ){

                        share[prop]=value;
                        checkType(value, call);

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
                        delete share[prop];

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
                call();

                if(method==="push" || method==="unshift"){

                    for(const arg of arguments){

                         checkType(arg, call)

                    }

                }else{

                    if(method==="splice" && isDefined(items)){

                        for(const item of items){

                            checkType(item, call);

                        }


                    }

                }

            }

        })

    };

    walkArray(array, call);

    Object.defineProperty(array, reactive, {

        value:true,

    })


 };

 function defineReactiveMap(map, call, listReactor, root){

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

                if(method=="delete" && listReactor)exactElToRemove(this, arguments[0], root);
                Map.prototype[method].apply(this, arguments);
                call();
                
                if(method=="set"){

                    const value=arguments[1];

                    checkType(value, call);

                }

                

            }

        })

    }

    walkMap(map, call);

    Object.defineProperty(map, reactive, {

        value:true

    })

    

 }

 function defineReactiveSet(set, call, listReactor, root){

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

                if(method=="delete" && listReactor)exactElToRemove(this, arguments[0], root);
                Set.prototype[method].apply(this,arguments);
                call();
                if(method==="add"){

                    checkType(arguments[0], call);

                };

                

            }

        });

    };

    walkSet(set, call);

    Object.defineProperty(set, reactive, {

        value:true

    })
    

 }

 function walkMap(map, call){

    /**
     * The goal here is to iterate through the map collection
     * and if we found an object, an array, a set or even a map, we must make it reactive.
     * 
     */

     map.forEach((value)=>{

        checkType(value, call)


     })


 }

 function walkArray(array, call){

    for(const item of array){

        checkType(item, call);

    }

 }

 function walkSet(set, call){

    set.forEach((value)=>{

        checkType(value, call)

    })

 }

 const reactive=Symbol.for("reactive");

 function costumReactor(array, htmlEl, updateSystem, DO, pro){

    if(isNotConfigurable(array)){

        return false;

    }

    //It is already reactive array.
    if(reactive in array){

        return false;

    }


    // Is not returning the template.
    function runError(){

        syErr(`
                
        You are not returning the template function
        in "do" method, renderList, you must only return
        the template function.
        
        `)

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
        

        if(arguments.length>1){
        
        
        let i=arguments.length-1;
        
        for(; i>-1; i--){
        
            
            const temp=DO.call(pro,arguments[i],i, pro);

            if(!isValidTemplateReturn(temp)){
                 
                runError();

            }
            if(htmlEl.children[0]){
            
                htmlEl.insertBefore(toDOM(temp.element), htmlEl.children[0]);
        
            }else{
        
                htmlEl.appendChild(toDOM(temp.element));
        
            }

        
        
        }
        
        }else if(arguments.length==1){
        
        const temp=DO.call(pro, arguments[0], 0, pro);
            
        if(!isValidTemplateReturn(temp)){
                 
            runError();

        }
        
        if(htmlEl.children[0]){
            
            htmlEl.insertBefore(toDOM(temp.element), htmlEl.children[0]);
        
        }else{
        
            htmlEl.appendChild(toDOM(temp.element));
        
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
        
            
        
            if(deleteCount==0 && items){

                for(let l=items.length-1; l>-1; l--){
        
                    const temp=DO.call(pro, items[l], l, pro);
                    
                   if(!isValidTemplateReturn(temp)){
                 
                       runError();

                       }
        
                    if(htmlEl.children[start]){
        
                    htmlEl.insertBefore(toDOM(temp.element),htmlEl.children[start]);
        
                    }else{
        
                        htmlEl.appendChild(toDOM(temp.element));
        
                    }
        
                }
        
            }
        
        }
        
    
        
        
        updateSystem();
        
        }


    },
    [reactive]:{value:true}
        
         })
        
        



 }


 

export function renderList(options){

    

    if(new.target!==void 0){

        syErr(`
        
        renderList is not a constructor, do not call
        it with the "new" keyword.
        
        `);

    }

    if(!isObj(options)){

        syErr(`
        
        The options(the argument of renderList) must be a plain Javascript object.
        
        `)


    }

    let {
        in:IN,
        each,
        do:DO,
        
    }=options;

    const root=getId(IN)
     

    if(!validInProperty(IN)){

        syErr(`
        
        The "in" option in renderList must be a string.
        
        `)

    }

    if(!validEachProperty(each)){

        syErr(`
  
        "${valueType(each)}" is not a valid value for the "each" option in renderList.
        The value that are accepted in "each" option, are:

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


    let pro, firstRender=true;

    function proSetup(){

        

        if(isArray(each)){
            pro=createArrayReactor(each, updateSystem);
            
            costumReactor(each, root, updateSystem, DO, pro);
        }
        else if(isObj(each)){

            pro=createObjReactor(each, updateSystem, root);

        }
        else if(isSet(each)){

            defineReactiveSet(each, updateSystem, true, root);
            pro=each;

        } else{

             if(isMap(each)){

            defineReactiveMap(each, updateSystem, true, root);
            pro=each;

        }

    }

    }

    const defineNewEach=(newArray)=>{

        each=newArray;
        defineReactorReactiveProps(each, updateSystem);
        proSetup();
        updateSystem();
        
        

    }

    function defineReactorReactiveProps(){

        const reactive=Symbol.for("reactive");
    
        if(reactive in each){
          
            return false;
    
        }
    
        Object.defineProperties(each, {
    
            otherArray:{
                set(value){
                    
                    if(!isArray(value)){
    
                        syErr(`The value of [List reactor].otherArray property must be an Array.`)
    
                    };
                      
                    
    
                    defineNewEach(value);
    
                    for(const item of value){
    
                        checkType(item, updateSystem)
    
                    }
    
    
                },
    
                configurable:!0
            },
            addItems:{
                value(items, position){
    
    
                    if(isDefined(position) && (typeof position!=="number")){
    
                        syErr(`
                        
                        The second argument of [LIST REACTOR].addItems must 
                        be a number.
                        
                        `)
    
                    }
    
                    
                    if(!isArray(items)){
    
                        syErr(`
                        
                        The first argument of [LIST REACTOR ].addItems must be an Array.
                        
                        `)
    
                    }
    
                    if(!isDefined(position) || position>this.length-1){
    
                        for(const item of items){
    
                            
                            
                         this.push(item);
                         
                            
                         checkType(item, updateSystem);
    
                        }
    
                        
    
                    }
    
                    if(position==0 || position<0){
    
                        for(let i=items.length-1; i>-1 ;i-- ){
    
                            this.unshift(items[i]);
    
                            checkType(items[i], updateSystem);
    
                        }
    
                    }else{
    
                        for(const item of items){
    
                            this.splice(position, 0, item)
    
                        }
    
                    }
    
                },
                configurable:!0
            },
            
    
        })
    
    
    
    }
    
    if(isArray(each)){
    
        defineReactorReactiveProps();
    
    }

    

        proSetup();

        


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
        if(isValidTemplateReturn(newTemp)){

            

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

            if(firstRender){
            checkType(type!=="object" ? data : data[1] /*obj prop*/, updateSystem);

            }

        

        }else{

            syErr(`
            
           The template function is not being returned inside the "do" method in
           renderList(reactive listing), just return the template function.
            
            `)

        }


    })

    


}

updateSystem()

firstRender=false;




return pro;




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

        rootEL.replaceChild(newElement,target);

        diff.children=false;

        shareProps(oldContainer, newContainer);
        oldContainer.target=newElement


        return true;

     }

     if(isOneAnArrayAndOtherNot(newChildren, oldChildren)){

        const newElement=toDOM(newContainer)

        rootEL.replaceChild(newElement, target);

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

          if(validStyleName(newStyle)){

          target.style[newStyle]=newStyles[newStyle];

      }else{

        ParserWarning(`
        
        "${newStyle}" doesn't seem to be a valid style name.
        
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

function insertBefore(root, index, virtualElement){

    for(let i=0; i<root.children.length; i++){

        const realElement=root.children[i]
        if(realElement.index>index){
            root.insertBefore(virtualElement, realElement);
            break;

        }

    }


}

function diffingChildren(__new, __old, realParent){

    const _new=Array.from(__new),
    _old=Array.from(__old);
    

    for(let i=0; i<_new.length; i++){
        
        
        
     /**
      * {tag:"h2"}  {tag:"h2"}
      * {tag:null} {tag:null}
      * {tag:"button"} {tag:"button"}
      * 
      */

        const newChild=_new[i],
              oldChild=_old[i];
              

    
        const {
            tag:newTag,
            text:newText,
            children:newChildren=[],
            events:newEvents={},
            attrs:newAttrs={},
            styles:newStyles={},
            renderIf:newRenderIf,
            
        }=newChild;
        
       const {
        tag:oldTag,
        text:oldText,
        children:oldChildren=[],
        events:oldEvents={},
        attrs:oldAttrs={},
        styles:oldStyles={},
        target,
        index            

       }=oldChild;

       let theLastElement;

       if(realParent){

       theLastElement=realParent.children[realParent.children.length-1];
       
       }

       if(newChildren.length!==oldChildren.length){

                if(target && target.parentNode!=null){

                    const newElement=toDOM(newChild, true, index);

                     realParent.replaceChild(newElement, target);

                     Object.assign(oldChild, newChild);
                      oldChild.target=newElement
                
            }

                
                continue;

            }else{


                if(newTag!==oldTag){

                        
                    const newELement=toDOM(newChild, true, index);

                    Object.assign(oldChild, newChild);

                    if(target && target.parentNode!=null){

                        realParent.replaceChild(newELement, target);
                        oldChild.target=newELement;

                    }

                    

                    continue
                    
             
                }


                if(isFalse(newRenderIf)){

                    if(target && target.parentNode!=null){

                    realParent.removeChild(target);
                    
                 

                }

            }

                
                if(isTrue(newRenderIf)){
                    

                    if(target && target.parentNode==null){

                        
                        const newELement=toDOM(newChild, true, index);
                             

                        Object.assign(oldChild, newChild);

                        oldChild.target=newELement

                    if(theLastElement.index>index){

                        insertBefore(realParent, index, newELement);

                    }else{

                        

                        realParent.appendChild(newELement)


                    }

                    continue;
                    

                }



                if(!target){


                    if(theLastElement.index>index){

                        const newELement=toDOM(newChild, true, index);

                        Object.assign(oldChild, newChild);

                        oldChild.target=newELement

                        
                        insertBefore(realParent, index, newELement);

                    }else{

                        
                        const newELement=toDOM(newChild, true, index);

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
