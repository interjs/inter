
// Helpers functions.

export function isNotConfigurable(obj){

    return (Object.isFrozen(obj) || Object.isSealed(obj)
    || !Object.isExtensible(obj)
    )


}

export function isObj(o){ 

    // For plain objects.    
    
      return (Object.prototype.toString.apply(o, void 0)
      =="[object Object]"
      )
    
     }
     
 export function isSet(o){

    return o instanceof Set;

 }

 export function isMap(o){

    return o instanceof Map;

 }

 export function isDefined(t){
    
        return t!=void 0;
    
    
     }
    
     /**
      * Indirect boolean value checking can cause
      * unexpected result, that's why I am using direct 
      * checking here.
      * 
      */

 export function isTrue(v){
    
        return Object.is(v,true);
    
     }
    
 export function isFalse(v){
    
        return Object.is(v,false);
    
     }
    
 /*</>*/   

 export function isCallable(fn){
    
        return typeof fn=="function";
    
     }
    
 export function hasProp(obj){
    
        if(isObj(obj)){
    
            return Object.keys(obj).length>0;
    
        }else{

            return false;

        }
    
     }




 export function isAtag(tag){


        return tag instanceof HTMLElement;


     }
    
 export function hasNodeChild(tag){
    
        if(isAtag(tag)){
    
            const hasChildren=tag.childNodes.length>0;
    
            return hasChildren;
    
        }else{


            return false;

        }
    
     }
    
 export  function validDomEvent(eventName){

    return eventName in HTMLElement.prototype;


 }

 export function validStyleName(styeName){

    return styeName in document.createElement("p").style;

 }   

 export function createText(text){


    return document.createTextNode(text);


 }

 export function validTagOption(option){

    return typeof option=="string";


 }

 export function validStylesOrEventsOptions(option){

    return isObj(option);

 }
 
export function getId(id){
    
        if(typeof id!=="string"){

            syErr(`
            
            The id's value must be an string.
            
            `)

        };

        const el=document.getElementById(id);
        
        if(el==void 0){
    
            syErr(`
            
            There's not an element in the document by id "${id}".
    
            `)
    
        }else{
    
            return el;
    
        }
    
     }
    
 export function valueType(val){
    
         if(
            typeof val=="undefined" ||
            typeof val=="symbol" ||
            typeof val=="bigint" ||
            typeof val=="boolean" ||
            typeof val=="function" ||
            typeof val=="number" ||
            typeof val=="string"
        ){
    
    
            return typeof val;
    
        }else{
    
            /**
             * 
             * @val may be an array, a plain object or even
             * a native Javascript object,
             * let's check with the type() function.
             * 
             */
    
             return type(val)
    
    
        }
    
    
     }
    
    
    // WARNINGS HELPERS
    
export function syErr(err){
    
        throw new SyntaxError(`
        
        Inter syntaxError : ${err}
        
        `);
    
    }
    
export function err(e){
    
        throw new Error(`
        
        Inter error: ${e}
        
        `)
    
    }
    
export function consW(w){
    
        console.warn(`
        Inter warning: ${w}
        
        `);
    
    }
    
export function ParserWarning(w){
    
        console.error(`
    
       Inter parser error: ${w}
        
        `)
    
    }
    
    //
    
    
    export function isArray(arg){

        return Array.isArray(arg);

    }
    
    
    
 function  type(val){
    
        // All Javascript objects.
    
         const isAnobject=(
            
            isDefined(val) &&
            
            Object.prototype.toString.call(val).startsWith("[object")
             
             );
    
    
             if(isAnobject){
                 alert(true)
    
              return ( Object.prototype.toString.call(val).replace("[object","")
              .replace("]","").replace(/\s/g,"").toLowerCase()
              
              );
    
    
             }else{
    
                /**
                 * @val is null.
                 * 
                 */
    
                 return "null";
    
    
             }
    
    
        }
    
    

      export  function hasChildren(el){

            if(isAtag(el)){


                return el.getElementsByTagName("*").length>0;

            }else{


                return false;

            }




        }

    export function equal(val1,val2){

        return Object.is(val1,val2);

    }

    export function isBool(val){

        /**
         * 
         * Not use typeof val==="boolean"; due to 1 and 0.
         * 
         */

        return val==true || val==false;

    }


    

    //Just for renderList.

    export function validInProperty(IN){

        

        return typeof IN=="string" 

        


    }


    export function validEachProperty(each){

        return (

            each instanceof Array ||  isObj(each) || each instanceof Map || each instanceof Set ||
            typeof each==="number"

        )


    }

    function toIterable(data){

        const iterable={
         values:new Array(),
         type:void 0,

        };

        if(isArray(data)){

           iterable.values=data;
           iterable.type="array"

        }else if(isObj(data)){

            iterable.values=Object.entries(data);
            iterable.type="object"

        }else if(data instanceof Map){

            data.forEach((value, key)=>{

                iterable.values.push([key, value]);

            });

            iterable.type="object"


        }else if(data instanceof Set){

         iterable.values=Array.from(data);
         iterable.type="set";
         

        }else if(typeof data==="number"){

            for(let i=0; i<data; i++){
                iterable.values.push(i);

            };

            iterable.type="number";



        };

        return iterable;

        

    }

    export function Iterable(data){


      this.source=toIterable(data);
      
      

    }

    Iterable.prototype.each=function(callBack){

        let index=-1;

        for(const data of this.source.values){

            index++;

            callBack(data, index, this.source.type);

        };



    }

    //</>

    export function notSameLength(obj1, obj2){

        if(obj1===void 0 || obj2===void 0) return false;

        return !(Object.keys(obj1).length===Object.keys(obj2).length);


    }
