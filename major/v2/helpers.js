
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
    
 export  function validDomEvent(eventName){

    return eventName in HTMLElement.prototype;


 }

 export function validStyleName(styeName){

    return styeName in HTMLElement.prototype.style;

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


    export function ObserveArrayMethods(){


        

Object.defineProperty(pro, "shift", {

    value(){  
    
    const removed=Array.prototype.shift.apply(data, void 0);
    const firstNodeElement=_root.children[0];
    
    if(firstNodeElement){
    
    _root[remove](firstNodeElement);
    
    
    reorderIndex(each, runUpdate);
    
    }
    
    
    return removed;
    
    
    
    }
    }
    )
    

    Object.defineProperty(pro, "unshift",{

        value(){
        
        
        const added=Array.prototype.unshift.apply(each, arguments);
        const _this=this;
        if(arguments.length>1){
        
        
        let i=arguments.length-1;
        
        for(; i>-1; i--){
        
            
        
            const el=DO.call(_this,arguments[i],i);
        
            if(_root.children[0]){
            
                _root.insertBefore(el, _root.children[0]);
        
            }else{
        
                _root[add](el);
        
            }
        
        }
        
        }else if(arguments.length==1){
        
        const el=DO.call(_this, arguments[0], 0);
            
        
        if(_root.children[0]){
            
            _root.insertBefore(el, _root.children[0]);
        
        }else{
        
            _root[add](el);
        
        }
        
        
        
        }
        
        
        
        
        
        reorderIndex(each, runUpdate);
        
        
        
        return added;
        
        }
        
        })
        
        Object.defineProperty(pro, "splice",{
        
        value(start, deleteCount, ...itens){
        
        const spliced=Array.prototype.splice.apply(each,arguments);
        
        
        if(itens.length==0){
        
            let from=start;
            const to=deleteCount;
        
        /**
         * 4
         * 1
         * 
         */
            for(let i=0; i<to; i++){
        
                
                const node=_root.children[from];
        
                if(node){
        
                _root[remove](node)
        
                }
        
            }
        
        }else{
        
            
        
            if(end==0 && itens){
        
                for(let l=itens.length-1; l>-1; l--){
        
                    const el=DO.call(pro, itens[l], l);
        
                    if(_root.children[start]){
        
                    _root.insertBefore(el,_root.children[start]);
        
                    }else{
        
                        _root[add](el);
        
                    }
        
                }
        
            }
        
        }
        
        
        reorderIndex(each, runUpdate);
        
        return spliced;
        
        
        }
        
        })
        
        



    }

    //Just for renderList.

    export function validInProperty(IN){

        

        return (

            typeof IN=="string" || IN instanceof HTMLElement

        );


    }


    export function validEachProperty(each){

        return (

            each instanceof Array || each instanceof Map || each instanceof Set
            || each instanceof WeakMap || each instanceof WeakSet || isObj(each)

        )


    }

    function toIterable(data){

        let iterable={
         values:array.create(null),
         type:void 0,
         _forEach(callBack){

            this.values.forEach((val)=>{})

         }

        };

        if(array.is(data)){

           iterable.values=data;

        }else if(isObj(data)){

            iterable.values=Object.entries(data);
            iterable.type=1

        }else if(data instanceof Map){

            data.forEach((value, key)=>{

                iterable.values.push([key, value]);

            });

            


        }else if(data instanceof Set){

         iterable.values=Array.from(data);
         

        }else if(data instanceof Number){

            for(let i=0; i<data; i++){
                iterable.values.push(i);

            };



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

            callBack(data, index);

        };



    }

    //</>

    export function notSameLength(obj1, obj2){

        if(obj1===void 0 || obj2===void 0) return false;

        return !(Object.keys(obj1).length===Object.keys(obj2).length);


    }

    export function isReactivable(target){



    }