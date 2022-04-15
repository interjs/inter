import{
    syErr,
    isObj,
    getId,
    consW,
    isCallable

} from "./helpers.js"

 export function toAttrs(obj){


    

    if(new.target!==void 0){

        syErr()

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
  
  const root= getId(IN)
          

  if(!isObj(data)){

    syErr(`

     data in toAttrs() must be an object.
    `)

  }
      
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

    
        
        function runUpdate(v, attrName){

            if(v==void 0){

                if(!attrName.startsWith("on")){

                    el.removeAttribute(attrName);

                }else{

                    el[attrName]=void 0;
                }

            }else if(!attrName.startsWith("on") && attrName!=="value"){

                  el.setAttribute(attrName,v);

                }else if(attrName=="value"){

                    el.value=v;
                }
                
                else{

                    if(!isCallable(v)){

                        syErr(`
                        The value of "${v}" event, must be a function.
                        `)
                    }

                    el[attrName]=function(e){

                        v.call(original,e)
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

                       syErr(`
                       "${attrName}" seems to be an event listener, 
                       and you can not get the value of an event.
                       `)

                   }else{

                     return el.getAttribute(attrName)
                      
                   }
                }
            })
        
        
        }
        



        //<>//

         // Spreading the attributes.

         
         function spreadAttrs(attrName, attrValue){
            
            if(attrValue!=void 0 && !attrName.startsWith("on")){
           
            el.setAttribute(attrName,attrValue);

            }else{
                
                if(attrName.startsWith("on") && isCallable(attrValue))
               
                el[attrName]=function(e){

                     attrValue.call(original,e);
               
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
    