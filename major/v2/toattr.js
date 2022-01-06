import{
    syErr,
    isObj,
    getId,

} from "./helpers"

 export function toATTR(obj){


    

    if(!isObj(obj)){
        
        syErr(`
        The argument of "toATTR()" function must be an object.
        `)

    }else{

  const{
      in:IN,
      data,
      react
      
  }=obj;
  
  const root= getId(IN)
               

  if(!isObj(data)){

syErr(`

data in toATTR() must be an object.
`
)

  }else{
      
  return findAttrManager(root,data,react);



    }





 }
}

 function findAttrManager(rootElem, attrManagers,react){
   
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

              if(!react){

              reactors[Object.keys(reactor)[0]]=Object.values(reactor)[0];
              
              }else{

                globalThis[Object.keys(reactor)[0]]=Object.values(reactor)[0];

              }

                break;
            }
       
        
        }
    }
    }



    return reactors;
    
    }


    function spread(el,attrs, attrManager, original){

    



        //<>//

         // Spreading the attributes.
        for( const[attrName, attrValue] of Object.entries(attrs)){
             

            
                 if(attrValue!=void 0 && !attrName.startsWith("on")){
                
                 el.setAttribute(attrName,attrValue);

                 }else{
                     
                     if(attrName.startsWith("on") && isCallable(attrValue))
                    
                     el[attrName]=function(e){
                          attrValue.call(original,e);
                     }
                     }
                 
                 
                 
            
        }

        //</>//


        for(let attrName of Object.keys(original)){

            
            Object.defineProperty(original,attrName,{
                set(v){
                
                    if(v==void 0){

                        if(!attrName.startsWith("on")){

                            el.removeAttribute(attrName);

                        }else{

                            el[attrName]=void 0;
                        }

                    }else{

                        if(!attrName.startsWith("on") && attrName!=="value"){

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
        
        
        return {
            [attrManager]:original
        };
        
        }
