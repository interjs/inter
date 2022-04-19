import{
    syErr,
    isObj,
    getId,
    consW,
    isCallable,
    validDomEvent

} from "./helpers.js"

 export function toAttrs(obj){


    

    if(new.target!==void 0){

        syErr(`
        toAttrs is not a constructor,
        do not call it with the "new" keyword.
        
        `)

    }

    if(!isObj(obj)){
        
        syErr(`
        The argument of "toATTR()" function must be an object.
        `)

    }

  const{
      in:IN,
      data,
      
  }=obj;

  if(!(typeof IN=="string")){

    syErr(`
    
    The "in" property in toAttrs() function must be a string.
    
    `)

  }
  if(!isObj(data)){

    syErr(`

    The "data" property in toAttrs() function must be an object.
    `)

  }
      
  
  const root= getId(IN)
          

  return findAttrManager(root,data);


 
}

 function findAttrManager(rootElem, attrManagers){
   
    const keys=Object.getOwnPropertyNames(attrManagers);
    const children=rootElem.getElementsByTagName("*");
    const reactors=Object.create(null);

    for(let child of children){
        
        if(child.attributes.length==1){
          
            
            const theAttr=child.attributes[0].name;
          
            for(let key of keys){
        
            const pattern=new RegExp(`{...${key}}`);

            if(pattern.test(theAttr)){

                
              const copy=Object.assign({},attrManagers[key])
              child.removeAttribute(theAttr);   

              const reactor=spread(child,copy,key,attrManagers[key]);

              

              reactors[Object.keys(reactor)[0]]=Object.values(reactor)[0];
              
       
        
        }
    }
    }




    
    }

    return reactors;
 }

    function spread(el,attrs, attrManager, original){

    //We are considering them specials
    // because we can not reset them with the setAttribute function.
    const specialAttrs=new Set(["value", "currentTime"]);
        
        function runUpdate(value, attrName){

            value=!attrName.startsWith("on") ? isCallable(value) ? attrValue.call(attrs) : value : value;

            if(value==void 0){

                if(!attrName.startsWith("on")){

                    el.removeAttribute(attrName);

                }else{

                    el[attrName]=void 0;
                }

            }else if(!attrName.startsWith("on") && !specialAttrs.has(attrName)){

                  el.setAttribute(attrName,value);

                }else if(specialAttrs.has(attrName)){

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

                    el[attrName]=function(e){

                        v.call(original,e)
                    }
                }else{

                    consW(`
                    
                    "${attrName}" doesn't seem to be a valid dom event.
                    
                    `)

                }

            }

        }
            }


        
        function defineReactivity(attrName){
            
            Object.defineProperty(original,attrName,{
                set(v){
                
                    runUpdate(v, attrName)

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
            
            attrValue=!attrName.startsWith("on") ? isCallable(attrValue) ? attrValue.call(attrs) : attrValue : attrValue;

            if(attrValue!=void 0 && !specialAttrs.has(attrName) && !attrName.startsWith("on")){
           
            el.setAttribute(attrName,attrValue);

              }else if(attrValue!=void 0 && specialAttrs.has(attrName)){

                el[attrName]=attrValue;


              } else{
                
                if(attrName.startsWith("on")){
               if(validDomEvent(attrName)){
                if(!isCallable(attrValue)){

                    syErr(`
                    
                    The value of "${attrName}" must be a function.

                    `)

                }

                el[attrName]=function(e){

                     attrValue.call(original,e);
               
                   }
                
               
               }else{

                syErr(`
                
                "${attrName}" doesn't seem to be a valid dom event.
                
                `)

               }
              }

            }
           }

        for( const[attrName, attrValue] of Object.entries(attrs)){
             
            
            spreadAttrs(attrName, attrValue);
             defineReactivity(attrName);
            
        }

        //</>//

        Object.defineProperties(original, {

            setAttrs:{
                 set(attrs){

                if(!isObj(attrs)){

                    syErr(`
                    
                    The argument of [Attribute manager].setAttrs
                    must be an object.
                    
                    `)

                };

                for(const [attr, value] of Object.entries(attrs)){

                    if(!(attr in this)){

                        consW(`
                        
                         The attribute manager "${attrManager}" 
                         does not manage an attribute named "${attr}",
                         all the attributes must be defined in the "${attrManager}" manager
                         object.
                        
                        `);

                        continue;

                    };

                    this[attr]=value;

                }

            },
            configurable:!1

        },

        [Symbol.toStringTag]:{
            value:()=>"Manager"
        }

        })

        return {
            [attrManager]:original
        };
        
        }
    