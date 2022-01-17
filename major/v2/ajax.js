import {

    err,
    syErr,
    isObj,
    consW,
    isCallable,
    valueType,
    isDefined

} from "./helpers.js"


function toObj(obj){

    /**
     * We will try to convert obj(if it's actually a JSON Object) to a plain object,
     * if it fails we must return the obj argument.
     * 
     */

    if(obj!==void 0){

        try{


            return JSON.parse(obj);

        }catch(e){


            return obj;

        }


    }

}


export function Backend(){

    if(new.target===void 0){


        err(`Backend is a constructor, call it with the new key word.`)


    }



}


Backend.prototype={

   get [Symbol.toStringTag](){

       return "Ajax";

   },

   request(obj){

       if(!isObj(obj)){


       }

       const{
           type,
           path,
           events={},
           timeout,
           withCredentials,
           body,
           headers={},
           security
       }=obj;

       const reactorHandler=new Map();



       function call(){

       const req=new XMLHttpRequest();
       const method=type.toUpperCase();
       const allowedEvents=new Set([
           "onprogress",
           "ontimeout",
           "onabort"
       ])

       
       const _thisInReactor={

          get status(){

            return req.status;

          },

          get statusText(){

            return req.statusText;

          },

          get headers(){

            return req.getAllResponseHeaders();

          },

          isObj(){

            try{

                JSON.parse(req.responseText);

                return true;

            }catch(e){

                return false;

            }

          }

       }       

       
     
       if(method=="GET"){

           if(isObj(security) && Object.keys(security).length==2){

               if(security.username && security.password){

           req.open(method,path,!0,security.username,security.password);

           }else{

               req.open(method,path,!0);

               consW(`
               
               Invalid "security" object, security object must have the username and passoword 
               properties.
               
               `)

           }

       }else{


           req.open(method, path, !0);

       }
               


           

       }else{


           
           if(isObj(security) && Object.keys(security).length==2){

               if(security.username && security.password){

               req.open(method,path,!0,security.username,security.password);

           }else{

               req.open(method,path,!0);

               consW(`
               
               Invalid "security" object, security object must have the username and passoword 
               properties.
               
               `)

           }


       }
      

       }

       
       if(!isObj(headers)){


           syErr(`
           
           the headers property must be an object, and
           you defined it as : ${valueType(headers)}.
           
           `)


       }


       Object.entries(headers).forEach(([header,value])=>{

          req.setRequestHeader(header,value);


       })

       Object.entries(events).forEach(([name,handler])=>{

           if(allowedEvents.has(name)){

               if(name!=="onprogress"){

                   req[name]=()=>{

                       handler();
                   }

               }else{

                   req.onprogress=(ev)=>{

                       handler.call(
                           {
                             abort(){

                               req.abort();

                             }  
                           }
                           ,ev.loaded*100/ev.total);

                   }

               }

           }

       })


       req.onreadystatechange=function(e){

           if(this.readyState==4){


            if(this.status==200){


                if(reactorHandler.has("okay")){

                    reactorHandler.get("okay").call(_thisInReactor,toObj(this.responseText))

                }


            }else{

                if(reactorHandler.has("error")){

                    reactorHandler.get("okay").call(_thisInReactor, toObj(this.responseText));

                }

            }


           }else{

            /**
             *  
             * If it runs probably because there was an internet connection error
             * like: "no internet"
             * 
             * The request was not sent to the server, the error reactor must be called.
             * 
             */


             if(reactorHandler.has("error")){
             
                const _this={

                    isObj:()=>false,
                    get statusText(){

                        return "No Internet connection"

                    },

                    get status(){

                        return 0

                    },

                    get headers(){

                        return new String();

                    },

                }

                reactorHandler.get("error").call(_this, new String());

             }


           }

       }

       if(typeof withCredentials=="boolean"){

        req.withCredentials=withCredentials;
        

       }

       if(typeof timeout=="number"){

        req.timeout=timeout;

       }


       if(method=="GET"){

        req.send(void 0);

       }else{

        if(isDefined(body)){

            req.send(body);

        }

       }

   }



       const reactors={


           okay(fn){

            if(!isCallable(fn)){

                syErr(`
                
                The argument of okay reactor must be a function
                and you defined ${valueType(fn)} as its argument
                
                `)

            }

            reactorHandler.set("okay", fn);
            //Starting the request...
            call();



           },

           error(fn){

            if(!isCallable(fn)){


                syErr(`
                
                The argument of error reactor must be a function, and you
                defined ${valueType(fn)} as its argument.
                
                `)


            }


            reactorHandler.set("error", fn);
            //Starting the request...
            call();


           },

           
           response(okay,error){

            if(arguments.length<2){

                syErr(`
                
                response reactor must have two arguments and you only
                defined ${arguments.length}.
                
                `)

            }
            if(!isCallable(okay) && !isCallable(error)){


                syErr(`
                
                The two arguments of response handler must be functions.
                
                
                `)

            }

            reactorHandler.set("okay", okay);
            reactorHandler.set("error", error);
            //Starting the request...
            call();

           }

       }

       return reactors;
       

   }

}


Object.freeze(Backend.prototype);