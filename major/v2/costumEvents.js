
import{

    syErr,
    err,
    isCallable
    

} from "./helpers";


  const handler=Symbol.for("event registery");
  const protected=Symbol.for("protected events");

  function costumEvent(){


      if(new.target!==void 0){

        syErr(`
        
        costumEvent must be called with the new keyword.
        
        `)

      }


      //Private fields.

      this[handler]=new Map();
      this[protected]=new Map();

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
              
              costumEvent.prototype.listen(evName:any, evHandler:object),
              expects two arguments. And it recieved only ${arguments.length}.
              
              `)

          }

       if(!this[handler].has(evName)){

      
          if(isCallable(evHandler)){

              this[handler].set(evName, evHandler);

              return true;

          }else{

              syErr(`
              
              the second argument of costumEvent.prototype.listen()
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

          return true;

      }else{

          return false;

      }


      }

  }


Object.freeze(costumEvent.prototype);

//Under development.