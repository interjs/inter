import{
    syErr,
    isObj,
    getId,
    consW,
    isCallable,
    validDomEvent,
    ParserWarning,
    defineReactorNameInToString,
    validStyleName,
    err

} from "./helpers.js";

function runReservedAttrNameWarning(attrName){


    consW(`${attrName} is a reserved Attribute's name.`)

}


/**
 * We must not use the Object.assign method if we
 * won't to loose the reactivity of the sourceObject property.
 * 
 */

function addPropOf(sourceObject){

    const theFirstKey=Object.keys(sourceObject)[0]; /* The reactor name */
    const theValueOfTheKey=Object.values(sourceObject)[0]; /*  The reactor object */

    const handler={
 
        to(targetObject){
  
             targetObject[theFirstKey]=theValueOfTheKey;
              
             defineReactorNameInToString(theValueOfTheKey, "AttrManager_Reactor")


        }
    };

    return handler;


}

function isDifferent(targetEl, attrName, newAttrValue){

    const oldAttrValue=targetEl.getAttribute(attrName);

    return !Object.is(newAttrValue, oldAttrValue)


}

function spreadStyleAttrs(target, styleObj){

    for(const [prop, value] of Object.entries(styleObj)){

        if(validStyleName(prop)){

            target.style[prop]=value;

            defineReactiveStyleProp(styleObj, prop, target);

        }else{

            consW(`"${prop}" is not a valid style's name.`)
            delete styleObj[prop];
            

        }

    }

  defineSetStylesProp(styleObj, target);


}


function defineReactiveStyleProp(styleObj, styleProp, target){

    Object.defineProperty(styleObj, styleProp, {
        get(){

            return target.style[styleProp]

        },
        set(value){

            if(value!==target.style[prop]){

                target.style[styleProp]=value;

            }

        }
    })

}


function defineSetStylesProp(styleObj, target){

    Object.defineProperty(styleObj, "setStyles", {
        set(o){

            if(!isObj(o)){

                syErr(`The value of the "setStyles" property must be a plain javascript object.`)

            };

            for(const [styleName, styleValue] of Object.entries(o)){

                if(!validStyleName(prop)){

                    consW(`"${styleName}" is not a valid styles' name.`);
                    continue;

                }

                setStyle(target, styleName, styleValue);

            }

        }

    })

}

function setStyle(target, styleName, styleValue){

    if(styleValue!=void 0){

    
    target.style[styleName]=styleValue;

    }else{

        target.style[styleValue]=null;

    }

}


function runStyleImmutabilityError(){

    err(`
                
    When you define a plain Javascript object as the value of the "style" property, it becomes
    immutable, it means that you can not delete or change this property directly, you must work with
    its properties.
    
    `)

};

function runCanNotRedifineStylePropAsObjError(){

    err(`
    
      You can not redifine the "style" property's value as plain Javascript object.
    
    `)

}

export function toAttrs(obj){
    
   if(new.target!==void 0){

        syErr(`
        toAttrs is not a constructor,
        do not call it with the "new" keyword.
        `)

    }

    if(!isObj(obj)){
        
        syErr(`
        The argument of "toAttrs()" function must be an object.
        `)

    }

    const  {
      in:IN,
      data
    }=obj;

  if(!(typeof IN=="string")){

    syErr(`
    
    The "in" property value in toAttrs() function must be a string.
    
    `)

  }

  if(!isObj(data)){

    syErr(`

    The "data" property value in toAttrs() function must be an object.
  
    `)

  }
      
  
  const root=getId(IN)
          

  return findAttrManager(root,data);


 
}

 function findAttrManager(rootElem, attrManagers){
   
    const keys=Object.getOwnPropertyNames(attrManagers);
    const children=rootElem.getElementsByTagName("*");
    const reactors=Object.create(null);
    

    for(const child of children){
        
        if(child.attributes.length==1){
          
            
            const theAttr=child.attributes[0].name;
          
            for(const key of keys){
        
            const pattern=new RegExp(`{...${key}}`);

            if(pattern.test(theAttr)){

              child.removeAttribute(theAttr);   

              const reactor=spread(child,key,attrManagers[key]);

              addPropOf(reactor).to(reactors);
                  
              break;
       
        
        }else{

            const isAnAttrManager=/{(:?\.){3}(:?[\s\S]+)}/.test(theAttr);
            const hasMoreThanThreeDots=/{(:?\.){4,}(:?[\s\S]+)}/.test(theAttr);
            const attr=theAttr.replace(/{(:?\.){3}/, "").replace("}", "");
            

            if(hasMoreThanThreeDots){

                ParserWarning(`
                
                "${theAttr}" is an invalid syntax for the attribute manager.
                The attribute manager must have only three dots.

                Ex: {...managername}
                
                `)

            }
            if(isAnAttrManager && !attrManagers.hasOwnProperty(attr)){

            // The attribute manager <key> was not defined in toAttrs function,
            // but there is a reference to it in the template.

            ParserWarning(`
            
            The attribute manager parser found a manager named "${attr}" but
            you did not defined it in the toAttrs function.
            
            `)
            

        }

    }
    }
    }




    
    }

    

    return reactors;

 }

    function spread(el/*manager target*/, attrManager/*Manager name*/, attrs/*Manager object*/){

    //We are considering them as specials
    //because we can not reset them with the setAttribute function.
    const specialAttrs=new Set(["value", "currentTime"]);
    const reservedAttrsName=new Set(["setAttrs"])
    let immutableStyle=false;

        
        function runUpdate(value, attrName){

            value=isCallable(value) ? value.call(attrs) : value;

             if(attrName==="style" && immutableStyle){

                runStyleImmutabilityError();


              }else if(attrName==="style" && isObj(value) && !immutableStyle){

               runCanNotRedifineStylePropAsObjError();             

              }else if(value==void 0){

                if(!attrName.startsWith("on")){

                    el.removeAttribute(attrName);

                }else{

                    el[attrName]=void 0;
                }

            }else if(!attrName.startsWith("on") && !specialAttrs.has(attrName) && isDifferent(el,attrName,value)){

                  el.setAttribute(attrName,value);

                }else if(specialAttrs.has(attrName)){
                    
                    /**
                     * Here in special attributes we must not check for difference,
                     * because even setting them with the same value can affect the interface.
                     */

                    el[attrName]=value;
                }
                
                else{

                    if(attrName.startsWith("On")){
                    
                    if(validDomEvent(attrName)){

                    if(!isCallable(value)){

                        syErr(`
                        The value of "${attrName}" event, must be a function.
                        `)
                    }

                    el[attrName]=e=>value.call(original,e);
                    

                }else{

                    consW(`
                    
                    "${attrName}" doesn't seem to be a valid dom's event.
                    
                    `)

                }

            }

        }
            }


        
        function defineReactivity(attrName){
            
            Object.defineProperty(attrs,attrName,{

                set(value){
                
                    runUpdate(value, attrName)

                },

                get(){

                   if(attrName.startsWith("on")){

                       consW(`
                       "${attrName}" seems to be an event listener, 
                       and you can not get the value of an event.
                       `)

                   }if(!specialAttrs.has(attrName)){
          
                     return el.getAttribute(attrName);

                     
                      
                   }else{

                    return el[attrName];

                   }
                }
            })
        
        
        }
        



        //<>//

         // Spreading the attributes.

         
         function spreadAttrs(attrName, attrValue){

              if(reservedAttrsName.has(attrName)){ runReservedAttrNameWarning(attrName); return false   }
            
            attrValue=!attrName.startsWith("on") ? isCallable(attrValue) ? attrValue.call(attrs) : attrValue : attrValue;

            if(attrValue!=void 0 && !specialAttrs.has(attrName) && !attrName.startsWith("on")){
           
                 if(attrName==="style" && isObj(attrValue)){

                    spreadStyleAttrs(el,attrValue);
                    
                   /*The style property must not be changed directly, we must only change its property*/
                    immutableStyle=true;

                 }else{

                 
                el.setAttribute(attrName,attrValue);

                 }

              }else if(attrValue!=void 0 && specialAttrs.has(attrName)){

                el[attrName]=attrValue;


              }else{
                
              if(attrName.startsWith("on")){

               if(validDomEvent(attrName)){

                if(!isCallable(attrValue)){

                    syErr(`
                    
                    The value of "${attrName}" must be a function.

                    `)

                }

                el[attrName]=e=>attrValue.call(attrs,e);
                
               
               }else{

                syErr(`
                
                "${attrName}" doesn't seem to be a valid dom's event.
                
                `)

               }
              }

            }
           }

        for(const [attrName, attrValue] of Object.entries(attrs)){
             
            
             spreadAttrs(attrName, attrValue);
             defineReactivity(attrName);
            
        }

        //</>//


        Object.defineProperty(attrs, "setAttrs", {

                set(__attrs){


                if(!isObj(__attrs)){

                    syErr(`
                    
                    The argument of [Attribute manager].setAttrs
                    must be an object.
                    
                    `)

                };

                for(const [attr, value] of Object.entries(__attrs)){

                    if(!(attr in this)){

                        consW(`
                        
                         The attribute manager "${attrManager}" 
                         does not manage an attribute named "${attr}",
                         all the attributes must be defined in the attrManager
                         object.
                        
                        `);

                        continue;

                    };

                    if(reservedAttrsName.has(attr)){

                        runReservedAttrNameWarning(attr);

                        continue

                    }

                    this[attr]=value;

                }

            },
            enumerable:!1



        })

        return {
            [attrManager]:attrs
        };
        
        }
    