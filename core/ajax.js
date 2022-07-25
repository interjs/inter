import {

    err,
    syErr,
    isObj,
    consW,
    isCallable,
    valueType,
    isDefined,
	isArray

} from "./helpers.js";


function stringify(data){
	
	
	if(isObj(data) || isArray(data)){
		
		return JSON.stringify(data)
		
	}else if(typeof data==="number"){
		
		return String(data);
		
	}else{
		
		
		return data;
		
	}
	
	
}

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


function openRequest(req, method,path, username, userpassword ){


        req.open(method, path, true, username, userpassword);

}


export function Backend(){

    if(new.target===void 0){


        err(`Backend is a constructor, call it with the new keyword.`)


    }



}


Backend.prototype={

   get [Symbol.toStringTag](){

       return "Ajax";

   },

   request(obj){

       if(!isObj(obj)){

        syErr(`
        
        The argument of [Backend instance].request method
        must be only an object, and you defined "${valueType(obj)}"
        as its argument.
        
        `)


       }

       const{
           type,
           path,
           events={},
           timeout,
           withCredentials,
           body=null,
           headers={},
           security
       }=obj;

       const unSupportedRequestType=new Set(["connect", "trace"]);

       if(!isDefined(type) || typeof type!=="string"){

        syErr(`
        
        You must define the type of request, in Ajax with the "type" option and
        it must be a string.
        
        `)

       }

       if(!isDefined(path) || typeof path!=="string"){

        syErr(`
        
        You must define the path where the request will be sent, with the "path" option and 
        it must be a string.
        
        `)

       };

       if(unSupportedRequestType.has(path.toLowerCase())){

        err(`
        
        "${type}" is an unsupported request type in Ajax.
        
        `);

        

       }

       const reactorHandler=new Map();
       let requestOpened=false;



       function call(){

       const req=new XMLHttpRequest();
       const method=type.toUpperCase();
       const allowedEvents=new Set([
           "onprogress",
           "ontimeout",
           "onabort"
       ])

       
       const _AjaxResponse={

          get status(){

            return req.status;

          },

          get statusText(){

            return req.statusText;

          },

          get headers(){

            return req.getAllResponseHeaders();

          },

          get data(){

            return toObj(req.responseText);

          },

          get [Symbol.toStringTag](){

            return "AjaxResponse";

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

       
     
           
           if(isObj(security) && Object.keys(security).length>=2){

            if(security.username && security.password){

                openRequest(req, method, path, security.username, security.password);

                requestOpened=true;

            }else{

                consW(`
               
                Invalid "security" object, security object must have the username and passoword 
                properties.
                
                `)

            }
            
           }

           if(!requestOpened){

            openRequest(req, method, path)

            requestOpened=true;



           }


       
       if(!isObj(headers)){


           syErr(`
           
           the "headers" property must be an object, and
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

                    const Arg={abort:()=>req.abort(), progress:ev.loaded*100/ev.total}

                       handler(Arg);

                   }

               }

           }else{

            consW(`
            
            There's not any event named "${name}" in Ajax request.
            
            `)

           }

       })


       req.onreadystatechange=function(e){

           if(this.readyState==4){


            if(this.status==200){


                if(reactorHandler.has("okay")){

                    reactorHandler.get("okay")(_AjaxResponse)

                }


            }else{

                if(reactorHandler.has("error")){

                    reactorHandler.get("okay")(_AjaxResponse);

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
             
                const _resp={

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

                    get data(){

                        return void 0;

                    },

                    get [Symbol.toStringTag](){

                        return "AjaxResponse";

                    }

                }

                reactorHandler.get("error")(_resp);

             }


           }

       }

       if(typeof withCredentials=="boolean"){

        req.withCredentials=withCredentials;
        

       }

       if(typeof timeout=="number"){

        req.timeout=timeout;

       }


       req.send(stringify(body));


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