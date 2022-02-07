
// Helpers function.


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
    
            const hasChildren=p.childNodes.length>0;
    
            return hasChildren;
    
        }else{


            return false;

        }
    
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
    
    
    function ARRAY(){
    
        if(new.target==void 0){
    
            throw new Error("ARRAY must be called with the 'new' keyword")
    
        }
    
        this.create=itens=>{
    
            return itens==void 0 ? new Array() : Array.from(itens);
    
    
        },
        this.is=function(a){
    
            return Array.isArray(a);
    
        },
    
        this.distroy=function(arr){
    
            if(this.is(arr)){
    
                let length=arr.length;
    
                while(length--){
    
                    arr.pop();
    
                }
    
            }
    
        },
    
        this.isEmpty=function(arr){
    
            if(this.is(arr) && arr.length==0){
    
                return true;
    
            }else{
    
                 return false;
    
            }
    
        }
    
    
    }

    export const array=new ARRAY();
    
     export function DOMMUTATION(el){
    
        this.target=el;
        this.mutated=false;
        
        for(let method of ["appendChild","replaceChild","removeChild"]){
    
            this.mutate(method);
    
        };
    
        for(let method of [
            {native:"appendChild", _new:Symbol.for("_add")},
            {native:"replaceChild", _new:Symbol.for("_replace")},
            {native:"removeChild", _new:Symbol.for("_remove")}
        ]){
            this.intermethods(method);
        }
    
        //let's now say to the Observer that the actual
        // element is mutated.
    
        this.mutated=true;
    
    }
    
    
    
    DOMMUTATION.prototype.mutate=function(method){
    
        if(this.target && !this.mutated){
        
            
    
            Object.defineProperty(this.target, [method],{
    
                value(){
    
                    consW(`
                    
                    Inter is working on [${this}], and Inter mutated it,
                    so that you can not mudify it. 
    
                    `)
    
                }
    
            })
    
        }
    }
        DOMMUTATION.prototype.intermethods=function(obj){
    
            if(this.target &&!this.mutated){
    
                   
                Object.defineProperty(this.target, obj._new, {
    
                    value(){
    
                      Node.prototype[obj.native].call(this,...arguments);        
    
                    }
    
                })
    
            }
    
        }
    
    
    
    
    
    
 function  type(val){
    
        // All Javascript objects.
    
         const isAnobject=(
            
            isDefined(val) &&
            
            Object.prototype.toString.call(val).startsWith("[object")
             
             );
    
    
             if(isAnobject){
    
              return ( Object.prototype.toString.call(val).replace("[object","")
              .replace("]","").replace(/\S/g,"").toLowerCase()
              
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