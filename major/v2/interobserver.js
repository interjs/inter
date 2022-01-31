import {

    syErr,
    isCallable,
    array,
    err,
    consW

} from "./helpers.js"


const reactive=Symbol("reactive");

function propIsReactive(obj,prop){

    const descriptor=Object.getOwnPropertyDescriptor;

    /**
     * 
     * The first condition is useful if the "obj" is the target array in reactive listing.
     * And the second condition is useful if the "obj" is the reactive listing reactor or if
     * the "obj" array is being observed through the Proxy.
     * 
     * 
     */

    return (typeof descriptor(obj,prop).set=="function"
    
    || obj instanceof Proxy
    
    )

}

function mutateArray(arr, call){


    const mutationMethods=[
        "push",
        "pop",
        "shift",
        "unshift",
        "splice"
    ];

    

    for(let method of mutationMethods){


        Object.defineProperty(arr, [method], {
            
            value(){

               const items=Array.prototype[method].call(this, ...arguments);

                 call(arr, {
                     method:method,
                     items:items
                 })

            }
        })

    }

    /**
     * We can't mutate
     * the native length property. 
     *
     *
     */

Object.defineProperty(arr, "_length", {

    get(){

        return arr.length;

    },

    set(newLength){

        if(typeof newLength=="number"){

            

            arr.length=newLength;

            call(arr,{
                method:"length",
                items:void 0,
            })


        }else{

            err(`
            
            The value of the _length property must be a number.
            
            `)

        }

    },
    configurable:!0

})

Object.defineProperty(obj, "reactive",{

    /**
     * Indicates that the "obj" array is already being observed.
     * 
     */
    value:reactive

})


}

export class observeArray{


    constructor(target, callback){

        if(new.target==void 0){


            syErr(`
            
            Call observeArray with the new keyword.

            new observeArray(target:Array<any>, callback:Function)
            
            `)

        }

        if(!isCallable(callback)){


            syErr(`
            
            The second argument of observeArray must be a function.
            
            `)

        }

        if(!array.is(target)){

            syErr(`
            
            Inter can not observe the target because it is not an array.
            
            `)

        }
        
        if(reactive in target){

            consW(`
            
            The target in observeArray is already being observed.
            
            `)

        }
        
        else{


            if(propIsReactive(target,"otherArray")){

                //renderList each array.

                err(`
                
                Inter could not observe the target array, because it has already
                a build-in observer method, try to observe a plain array only.
                
                `)



            }else{


                mutateArray(target, callback);
              

            }


        }
        

    }


}