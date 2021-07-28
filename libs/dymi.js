/**
 * Dymi - The Dynamic CSS loader library for Inter.
 * Created by - Denis Power.
 * 2021.
 * Version - 1.0.0.
 * https://github.com/DenisPower1/dymi
 * Released under the MIT lincense.
 */

/**
 * Dymi - The Dynamic CSS loader library for Inter.
 * Created by - Denis Power.
 * 2021.
 * Version - 1.0.0.
 * https://github.com/DenisPower1/dymi
 * Released under the MIT lincense.
 */

 (function(){

 //Some helpers function.

  function isObject(obj){
  
    return Object.prototype.toString.apply(obj, void 0)=="[object Object]";
   
   
  }
   
   function isArray(arr){
       return Object.prototype.toString.apply(arr, void 0) =="[object Array]";
   }
   
   


    function isDefined(value){
        return !(value==void 0);
    }
   function isTrue(value){
       return value==true;
   }

   function isFalse(value){
       return value==false;
   }

 function notAFunction(fn){
     return !(typeof fn=="function"); 
 }
 
     function hasProperty(object,property){
         
        if(isObject(object)){
             
             return property in object
         }else{
             
             return false;
         }
     }

      function isTring(v){
          
       return Object.prototype.toString.apply(v, void 0)=="[object String]";

      }

      function emptyString(v){

          return v.trim().length==0;
      }


//The types of error used.

const _ERR_TYPE={
    sy_Err(ms){
       const err= new SyntaxError();
       err.message=ms;
       throw err;
    },
    err(ms){
        //normal error.
        const err=new Error();
        err.message=ms;
        throw err;
    },
    wrn(ms){
        console.warn(ms);
    }
}

function warn(errType,ms){
 /**
  * If in Inter, the app is in production mode:
  * 
  * app.status="production";
  * 
  * We should not throw any error. 
  * 
  */ 
 const isOn=framework.isOn;  
  if(!isOn){

    _ERR_TYPE[errType](ms)
  }


};

  

  /**
   * Decteting Inter.
   * https://github.com/DenisPower1/inter
   * 
   */

   //Inter

   const framework={
     detected:false,
     set isOn(v){
         
        // If isOn is setted
         // it probably is true.

       this.detected=true;
     },
     get isOn(){
         return this.detected;
     }
   }
       
   //Inter detector.
       let detected=false;
       const _ENV_OBJ=globalThis;
       const docStatus=document.onreadystatechange;
       function _FN(){
           const obj=typeof _ENV_OBJ=="object" && _ENV_OBJ!=void 0;
        if (obj){
            
            
            const is=isObject(_ENV_OBJ.Inter);
            
            if(is){
                
                if(typeof Inter.for == "function"){
                    console.log("Interjs was detected on this page!");
                    detected=true;
                    if(isObject(_ENV_OBJ.app)){
                        const _In_PR=app.status=="production";
                        if(_In_PR){
                            framework.isOn=true;
                        }
                    }
                    
                }
            }
            }
       }
       if(typeof docStatus=="function"){
           const theFN=docStatus.bind();
           document.onreadystatechange=function(){
              
            if(!detected){
                 _FN();
                
               }
               if(this.readyState=="complete"){
                theFN();
                if(!detected){
                    setTimeout(()=>{
                        //Suspense.
                        _FN();
                    },100);
                }
               }
           }
           

           
       }else{
           document.onreadystatechange=function(){
            if(!detected){
               _FN();
               if(this.readyState=="complete"){
                   
                    setTimeout(()=>{
                        //Suspense.
                        _FN();
                    },100);
                   
               }
           }
       }

       }

   



  const addedStyleCache=new Map();
   
   const private=Object.create(null);
   function EVENTSYSTEM(){
   
   
   }

   EVENTSYSTEM.prototype.called=function(evName,evF){

    if(evName in private){
           const err="wrn";
           const message=`You already defined a function to execute when the style
           named ${evName} is called.
           `
           warn(err,message);
       }
        if(!(evName in private)){
            if(notAFunction(evF)){
           const err="sy_Err";
           const message=`The second argument in dymi.called() must be a function.`;     
                warn(err,message);
               


            }
            if(arguments.length<2){
            const err="sy_Err";
            const message=`dymi.called must have two arguments.`;
            warn(err,message);
            }else{
        
     private[evName]=evF;
            
        }
        }else{
            return false;
        }
   }
  EVENTSYSTEM.prototype[Symbol.for("fire")]=function(evName){
      if(evName in private){
          private[evName]();
      }else{
          const err="wrn";
          const message=`The file named ${evName} was called but it was not found executor for it.`;
          warn(err,message);
      }
  }

  const _eventSytem=new EVENTSYSTEM();
  function STYLE(){

  };

  const styles=Object.create(null);

let styleEL;

  STYLE.prototype={
     
      set register(arr){
          
       const length=Object.getOwnPropertyNames(styles).length;
       if(length==0){   
           
      if(!isArray(arr)){
          const err="sy_Err";
          const message=`The value of dymi.register must be an array.`;
          warn(err,message);
      }else{
          let index=-1;
          for(let obj of arr){
              index++;
              if(!isObject(obj)){
                  const err="sy_Err";
                  const message=`In dymi.register array, it was found a non-object value at index ${index}.`;
                  warn(err,message);
              }else{
                  const{
                      name,
                      path,
                  }=obj;
                  
                  const defined=isDefined(name) && isDefined(path) ? true : false;
                  if(!defined){
                      const err="err";
                      const message=`"name" and "path" properties must be defined in the objects of dymi.register array.`;
                      
                      warn(err,message);
                  }
                  if(!isTring(name) || emptyString(name)){
                    const err="err";
                    const message=`The name of a style must be a string value, with at least a
                    carapter, and in path "${path}", you defined "${name}" as its name.
                    `;
                    warn(err,message);
                  }
                  if(!path.endsWith(".css")){
                    const err="sy_Err";
                    const message=`Every path property must have the .css extension, and the path "${path}"
                    does not have.
                    `;
                    warn(err,message);  
                  }
                  else{
                      if(!(name in styles)){
                      styles[name]=path;
                      }
                  }
              }
          }
      }
      }else{
          return false;
      }
    
    },
      get register(){
         const length=Object.getOwnPropertyNames(styles).length;
         if(length>0){
             return true;
         }else{
              return false;
         }
      },
      callStyle(name){

          if(!isDefined(name)){
              const err="sy_Err";
              const message="You must define the name of the style to call, in dymi.callStyle() function.";
              warn(err,message);
          }else{
            const notHave=!hasProperty(styles,name);
            if(notHave){
             const err="err";
             const message=`It was not found a style called "${name}".`
             warn(err,message);
            }else{
                const fire=Symbol.for("fire");
                 if(styleEL== void 0){
                     const el=document.createElement("link");
                     const headTag=document.head;
                     if(headTag!=void 0){
                     el.rel="stylesheet";
                     el.href=styles[name];
                     el.styleName=name;
                     headTag.appendChild(el);
                     styleEL=el;
                     setTimeout(()=>{
                         //Suspense.
                       _eventSytem[fire](name);
                     },100);


                 }else{
                     const err="err";
                     const message="There's not the head tag on this page, define a head tag.";
                     warn(err,message);
                 }
            }else{
            styleEL.href=styles[name];
            styleEL.styleName=name;
            setTimeout(()=>{
                //suspense.
                _eventSytem[fire](name);

            },100);
            }
        }
    }
      },
      addStyle(name){
        if(!isDefined(name)){
            const err="sy_Err";
            const message="You must define the name of the style to call, in dymi.addStyle() function.";
            warn(err,message);
        }else{
          const notHave=!hasProperty(styles,name);
          if(notHave){
           const err="err";
           const message=`It was not found a style called "${name}".`
           warn(err,message);
          }else{
                 const fire=Symbol.for("fire");
             
                   const el=document.createElement("link");
                   const headTag=document.head;
                   if(headTag!=void 0){
                   el.rel="stylesheet";
                   el.href=styles[name];
                   headTag.appendChild(el);
                addedStyleCache.set(name,el);
                   setTimeout(()=>{
                       //Suspense.
                     _eventSytem[fire](name);
                   },100);


               
            }
      }
  }
},
removeStyle(name){
    if(!isDefined(name)){
        const err="sy_Err";
        const message="You must define the name of the style to call, in dymi.addStyle() function.";
        warn(err,message);
    }else{
      const notHave=!hasProperty(styles,name);
      if(notHave){
       const err="err";
       const message=`It was not found a style called "${name}".`
       warn(err,message);
      }
      if(!addedStyleCache.has(name)){
          const err="wrn";
          const message=`You did not add a style name "${name}", so you can not remove a non-added style.`
          warn(err,message);
      }
      else{
             const fire=Symbol.for("fire");
              const theStyle=addedStyleCache.get(name);
              document.head.removeChild(theStyle);
               addedStyleCache.delete(name);
               
               setTimeout(()=>{
                   //Suspense.
                 _eventSytem[fire](name);
               },100);


           
        
  }
}
},
get hasStyleAdded(){

    return addedStyleCache.size>0;
},
isOn(styleName){
    if(!isDefined(styleName)){
        const err="sy_Err";
        const message="You must define the name of the style to call, in dymi.addStyle() function.";
        warn(err,message);
    }else{
      const notHave=!hasProperty(styles,styleName);
      if(notHave){
       const err="err";
       const message=`It was not found a style called "${styleName}".`
       warn(err,message);
      }else{

      return (styleEL!= void 0 && styleEL.nodeType==1 && styleEL.styleName==styleName 
        || addedStyleCache.has(styleName) 
        
        );

      }
}
  }
}


   

  const dymiClone=new STYLE();
  Object.assign(dymiClone,EVENTSYSTEM.prototype);
  const dymi=new Proxy(dymiClone,{
      setPrototypeOf(...args){
          return false;
      },
      getPrototypeOf(...args){
          return null;
      },
      deleteProperty(...args){
          const err="sy_Err";
          const message=`You can not delete any property of dymi.`
          warn(err,message);
      },
      
        set(...args){
            if(hasProperty(dymi,args[1])){
                Reflect.set(...args)
            }else{
                return false;
            }
        },
    
      defineProperty(...args){
          return false;
      }
  })





  if(typeof module!="undefined" &&  typeof module.exports=="object"){      
    exports.dymi=dymi;
  }

 globalThis.dymi=dymi;

})()
