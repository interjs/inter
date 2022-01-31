
import{

    syErr,
    err,
    isCallable,
    isDefined,
    consW,
    valueType
    

} from "./helpers.js";


  const handler=Symbol("event registery");
  const protected=Symbol("protected events");
  const once=Symbol("Listen once registery")

  export function costumEvent(){


      if(new.target!==void 0){

        syErr(`
        
        costumEvent must be called with the new keyword.
        
        `)

      }


      //Private fields.

      this[handler]=new Map();
      this[protected]=new Set();
      this[once]=new Set();

  }


  costumEvent.prototype={

      get [Symbol.toStringTag](){

          return "costumEvent";

      },

      /**
       * This method is used to listen to an costum
       * event.
       * 
       * Arguments:
       * 
       * @evName => This argument indicates the name of the event.
       * @handler => This arguments indicates the function that will be
       * invoked as soon as the event is fired.
       * 
       * return true if the event was succefully registered, otherwise returns false.
       * 
       */

      listen(evName, evHandler){

          if(arguments.length<2){

              err(`
              
              [costumEvent=>Instance].listen(evName:any, evHandler:object),
              expects two arguments. And it recieved only ${arguments.length}.
              
              `)

          }

       if(!this[handler].has(evName)){

      
          if(isCallable(evHandler)){

              this[handler].set(evName, evHandler);

              return true;

          }else{

              syErr(`
              
              The second argument of costumEvent.prototype.listen()
              must be a function and it recieved: ${valueType(evHandler)}
              
              `)

          }
     

       }else{


          return false;

       }


      },

      /**
       * This method is used to fire a costum Event.
       * 
       *  Arguments:
       * 
       * @evName => This argument indicates the name of the event to fire.
       * @evInfo (optional) => This argument indicates an info related to the event being fired.
       * 
       * returns true if the event was succefully fired, otherwise returns false.
       * 
       */

      fire(evName, evInfo){

      if(this[handler].has(evName)){

          this[handler].get(evName)(evInfo!==void 0 ? evName : void 0);

          if(this[once].has(evName)){

            this[once].delete(evName);

            

          }

          return true;

      }else{

          return false;

      }


      },

      //hasListener
      has(evName){

        if(!isDefined(evName)){

            syErr(`
            
            The argument of [costumEvent=>Instance].has(evName)
            must be not null or undefined.
            
            `)

        }

        if(this[handler].has(evName)){

            return true;

        }else{

            return false;

        }

      },

      listenOnce(evName, _handler){

        if(arguments.length<2){

            err(`
            
            [costumEvent=>Instance].listenOnce(evName, handler)
            must have two argument and it only recieved ${arguments.length} argument.
            
            `)

        }

        if(!isCallable(_handler)){

            err(`
            
            The second argument of [costumEvent=>Instance].listenOnce(evName, handler)
            mus be a function and it recieved ${valueType(_handler)}.
            
            `)

        }

        if(!isDefined(evName)){

            err(`
            
            The event's name must not be null or undefined.
            
            `)

        }

        if(this[protected].has(evName) && isCallable(_handler)){

            err(`
            
            Ops, the listener of "${evName}" event is protected and you
            are trying to listen this event only once, it is impossible! Please do not
            protect this event if you only intend to listen it once.
            
            `)

        }
        if(!this[handler].has(evName)){
        
            this.listen(evName, handler);

            return true;

        }else{

            consW(`
            
            The ${evName} event has already a listener
            
            `);

            return false;

        }

      },

      // removeListener.
      remove(evName){

        if(!isDefined(evName)){

            err(`
            
            The argument of [costumEvent=>Instance].remove(evName)
            must be not null or undefined.
            
            `)

        }
        if(this[protected].has(evName)){

            err(`
            
            You can not delete the listener of ${evName}, it is protected.
            
            `);

            return false;

        }else{

            this[protected].delete(evName);
            this[handler].delete(evName);

            return true;

        }


      },

      //protectListener.
      protect(evName){

        if(!isDefined(evName)){

            err(`
            
            The argument of [costumEvent=>Instance].has(evName)
            must be not null or undefined.
            
            `)

        }
        if(!this[protected].has(evName)){

            this[protected].add(evName);

            return true;

        }else{

            return false;

        }

      }

  }


Object.freeze(costumEvent.prototype);

