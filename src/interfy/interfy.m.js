/** 
 *  Interfy - A Javascript library for robust web front-end routing.
 * 
 *  Github's repo - https://github.com/DenisPower1/interfy
 *  version - 2.1.0
 * 
 *  Created by - Denis Power/ https://github.com/DenisPower1
 * 
 *  IT WAS REALESED UNDER THE MIT LINCENSE.
*/


   
  

    if(typeof window==void 0 && typeof global =="object"
    && typeof process.on=="function"
    ){

        // The actual plataform is node.

     throw new Error(`
     
     Interfy is a client-side Javascript routing library,
     you can only use it in a browser.

     `)

    }
	
	const protocol=window.location.protocol;
	
	if(protocol=="file:"){
		
		throw new Error(`
		
		Interfy can only be used in an "http:" or "https:" protocol.
		
		`)
		
	}


    String.is=function(str){

     return (OBJ_PRO.toString.apply(str, void 0)
         == "[object String]" )


    }

    String.prototype.has=function(reg){

        if((reg instanceof RegExp)){
     

            return reg.test(this);

        }

    }

    String.prototype.trimAll=function(){

        let trimed=this.replace(/\s/g,"");

        return trimed;

    }

    const OBJ_PRO=Object.prototype;

   function isAFunction(target){

     return OBJ_PRO.toString.call(target)=="[object Function]";


   }

     
   



    function hasProp(prop){

        return prop in this;
    
    }

   function isOBJ(obj){
   
    //Plain objects, not native Objects.
    
     Object.prototype.toString.apply(obj, void 0)=="[object Object]";

   }

   function notAnArray(arr){
     
       return !(Array.isArray(arr))
   }


 
   // Explicit boolean  value checking.

   function isTrue(bool){
   
    return  (Object.is(true,bool));

   }

  
   function isFalse(bool){
    
    return (Object.is(false,bool));

   }




   const errs={
       sy(ms){
        const err=new SyntaxError();
        err.message=ms;
        
        throw err;

       },
      err(ms){
          const err=new Error();
          err.message=ms;
          
          throw err;
      },
      wrn(ms){
         
        return console.warn(ms);

      }
    
   }





   function warn(errType, ms){

    const prod=_INTERFY.prototype.production;
     
     if(isFalse(prod)){
      
        errs[errType](ms);


     }



   }




  


 class UrlParser{
  
    constructor(){
    
    };
    get url(){
       
        return UrlInfo.get("path").trimAll();
    }


    static getVar(path){

        const repl=new Array();
        const dyP=new Array();

        
        path.replace(/\/(:?[a-z]+)\/|\/(\d+)/g, (m,_)=>{
         
          repl.push(m);
        })

        path.replace(/\((:?[a-z]+)\)/g, (m,_)=>{
         
         dyP.push(_);
         
        
        })
      
      
        

        let parsedUrl=this.prototype.url.replace(/-|_|\./g, (m,_)=>{
       
            if(m=="_"){
                
                return "d".repeat("down".length); 
            }

            if(m=="-"){

                return "m".repeat("middle".length);

            }

            if(m=="."){

                return "p".repeat("point".length);

            }
            
        });

      
      
      for(let par of repl){

          parsedUrl=parsedUrl.replace(par,"/");

      }

      

        const returnOBJ=Object.create(null);
         
          let index=-1;          
        
         parsedUrl.replace(/(\w+|\d+|[a-z]+)/g ,(__,_)=>{
          
             index++;
             
             let _path=_;
             
             if(_path.includes("mmmmmm")){
             _path=_path.replace(

                /mmmmmm/g, "-"
             );
             }
             if(_path.includes("dddd")){

                _path=_path.replace(
                    /dddd/g, "_"
                )
             }

             if(_path.includes("ppppp")){

                _path=_path.replace(
                    /ppppp/g, "."
                )

             }

             
             returnOBJ[dyP[index]]=_path
            
            
            
            
    })

    
    
   
   return Object.freeze(returnOBJ);

        
    }



 }


function _setPath(path, hash){

    if(hash){
    const hasHash=window.location.hash
        if(hasHash){
            
            const unhash=hasHash.replace(/#/g,"");
            if(unhash==""){
                //Actual path is "/".

                window.history.pushState(null,null,`#${path}`);
            }else{
                window.history.replaceState(null,null,`#${path}`);
            }
        }
    
        else{
            const ACT_PATH=window.location.pathname;

            if(ACT_PATH=="/"){
              
                window.history.pushState(null,null,`#${path}`)

            }else{

                window.history.replaceState(null,null,`#${path}`);
            }
        }

    }else{
       
        const ACT_PATH=window.location.pathname;

        if(ACT_PATH=="/"){
          
            window.history.pushState(null,null,path)

        }else{

            window.history.replaceState(null,null,path);
        }

    }


}




const UrlInfo=new Map();

UrlInfo.set("path", 
void 0);


const call=Symbol.for("callBack");

// The request obj

 const req={

     [call]:void 0,

    get url(){

        return UrlInfo.get("path");

    },

    has(route){

      

      return route.has(/\((:?[\s\S]+)\)|\*/g);

    },
    

     is(pathWithVar){
     
      // For example.  
     // pathWithVar - /profile/(id)/   

      
          const urlSetted=this.url;
          const p=pathWithVar.replace(
              /\((:?[\s\S]+)\)|\*/g, "[\\s\\S]"
          )
       
          const reg=new RegExp();
   
           return reg.compile(p).test(urlSetted) 
   
      
     

     },
     
     getVar(path){
        
      
      return UrlParser.getVar(path);
      

     }
 
    
 }

 Object.preventExtensions(req)
 

  function INTERFY(){

   if(new.target==void 0){

       warn("sy",`
       
       Invoke the [INTERFY CONSTRUCTOR] only
       with the new keyword.

       
       `)
       
   }
 
}


// Since v2.0.0


function runInterator(inte,obj){

    const next=inte.next()
    const arr=next.value;
    
    if(!next.done){
    Object.defineProperty(obj, arr[0],{

        get(){

            return arr[1];

        },
        configurable:!0

    }) 
        
        runInterator(inte,obj)

    }


}

const handler=Object.create(null);
const notFound=new Map();
let started=false;

//The Interfy constructor.

function _INTERFY(){


/**
 * 
 * This method is used to 
 * start the router
 * 
 */
     this.start=function(hand=()=>{}){

        if(started){

            warn("wrn", `
            
            The router was already started.

            `)

            return false;

        }

        const canStart=Object.keys(handler).length>0;

        if(canStart){

            started=true;

            const inst=new INTERFY();

            inst.createRouter((req)=>{

                let found=false;

           if(isAFunction(hand)){         
             hand(req.url);
           }
                

                for(let[route,_handler] of Object.entries(handler)){
                    
            

            
                    if(req.url==route){
                       
                        const varAndParam=Object.freeze({
                            var:Object.create(null),
                            param:Object.create(null),
                        })

                        _handler(varAndParam);

                        found=true;

                        break;
                    
                    }else{
                        if(req.has(route)){
                        
                            if(req.is(route)){

                          const search=window.location.search;
                          found=true;

                           if(search){

                            const p=new URLSearchParams(search);
                            const ro=Object.create(null);
                          
                           

                            runInterator(p.entries(), ro);
                      
                            const varAndParam=Object.freeze({
                                var:req.getVar(route),
                                param:ro,

                            })

                            _handler(varAndParam);
                           


                           }else{


                            const varAndParam={
                                var:req.getVar(route),
                                param:Object.create(null),
                            }

                            _handler(varAndParam);

                           }     
                        

                            }




                    }

                }


                }

                if(!found && notFound.has("notfound")){
                     
                    const nf=notFound.get("notfound");

                    nf(req.url);

                }


            })
         

            

        }

        if(!canStart){

          warn("sy", `
          
          The router can not start, because you did not
          register any route.
          
          `)

        }


     }

     /**
      * 
      * This method is used to
      * to register a router.
      * 
      */

    this.route=function(routeName,routeHandler){
      
        if(started){

            warn("wrn", `
            
            You already started the router, so you
            can not add more routes to it.
            
            `)

            return false;

        }
        

        const isTring=String.is(routeName)

        if(arguments.length<2){

            warn("sy", `
            
            The route method accepts two arguments,
            and you defined: ${arguments.length}.


            `)

        }

        if(!isTring){

            warn("sy", `
            
            The first argument of [ INTERFY INSTANCE ].route 
            must be a string.

            [INTERFY INSTANCE].route("/routename", ()=>{})

            `)

        }

        if(!isAFunction(routeHandler)){

            warn("sy", `
            
            
            The second argument of [ INTERFY INSTANCE ].route
            must be a function.

            `)

        }
        if(!routeName.startsWith("/") && routeName!="*"){


            warn("sy", `
            
            Routes must starts with slash(/).
            it must be "/${routeName}" instead of "${routeName}".

            `)

        }
        
        else{

            if(routeName=="*"){

                if(!notFound.has("notfound")){

                    notFound.set("notfound",routeHandler);

                    return false;

                }

            }

            if(!(routeName in handler)){

                
                

                handler[routeName]=routeHandler;

            }


        }


    }

}

 let created=false;


 // The internal INTERFY INSTANCE method

INTERFY.prototype={

createRouter(fn){
 
    if(!created){
    
    created=true;

if(!isAFunction(fn)){
    
    warn("sy", `
     
    [ INTERFY INSTANCE ].createRouter() accepts only
     a function as its argument, and you defined
     "${ typeof fn }" as its argument.
    
    `)

}else{
    
    req[call]=fn;
    const hash=window.location.hash;
    
    if(hash){
        const take_hash=window.location.hash.replace(/#/g,"");
       UrlInfo.set("path",take_hash);   
      
       req[call](req);
    }else{
        UrlInfo.set("path",
        window.location.pathname
        )
        req[call](req)
    }

}

    }else{
      
        warn("err",`
        The router was already created.
        `)

    }
}


}

// The public Interfy instance methods and properties.

let production=false;

_INTERFY.prototype={

	get [Symbol.toStringTag](){
	
	
		return "Interfy";
	
	
	},
    
     /**
      * Read only property.
      * Get the actual Inter's version
      * installed. 
      *
      */

     get version (){

        return "2.1.0"

     },

     /**
      * Can be used to read and set
      * the status of your router.
      * 
      * Note: It will be deprecated 
      * in next minor release.
      * 
      */

     get production(){

        return production;

     },
     set production(v){

        if(!this.production){

            if(isFalse(v)){

                return;

            }

        if(isTrue(v)){

            production=true;

            console.log(`
            
            You are now using Interfy in production mode.

            `)

        }else{

            throw new TypeError(`
            
            "${v}" is an invalid value for the
            [INTERFY INSTANCE].production, property.
            If you want to turn on the production mode set it to true.
            
            `)

        }
    }
     },

     /**
      * Used to change the url.
      * 
      * 
      */

    setPath(pathName){

        if(!started){

            warn("err", `
            
            The router was not started yet, start it firt.

            `)

        }

        const isTring=String.is 

        if(!isTring(pathName)){
        
            warn("sy", `
        
        The pathName in [ INTERFY INSTANCE ].useHash(pathName)
         must be a string.
        
        `)
    
        }
    
     
    
    
      if(!pathName.startsWith("/")){
    
        warn("sy",`
        A pathName must start with a slash(/).
    
         You used:
       
         [INTERFY INSTANCE ].setPath("${pathName}")    
       
         `)
    
      }
    
      _setPath(pathName);
    
      UrlInfo.set("path", pathName);
      
       
      req[call](req);
    
    },
    
    /**
     * Used to change the url.
     * 
     */

    useHash(pathName){

        if(!started){

            warn("err", `
            
            The router was not started yet, start it firt.

            `)

        }
    
        const isTring=String.is(pathname);

     if(!isTring){
    
        warn("sy", `
        
        The pathName in [ INTERFY INSTANCE ].useHash(pathName)
         must be a string.
        
        `)
    
     }
    
        if(!pathName.startsWith("/")){
    
            warn("sy",`
            A pathName must start with a slash(/).
        
             You used:
           
              [ INTERFY INSTANCE ].useHash(${pathName})    
           
             `)
        
          }
    
          _setPath(pathName,true);
        
          UrlInfo.set("path", pathName);
           
          req[call](req);
    
    },




}

window.onpopstate=function(){

    const _Hash=this.location.hash;
    const _search=this.location.search;

    if(_search){

        const thePath=`${this.location.pathname}${_search}`;

        UrlInfo.set("path", thePath);

        req[call](req);

        return false;

    }

    if(_Hash){
        const thePath=_Hash.replace(/#/g,"");
        
         UrlInfo.set("path",
        thePath=="" ? "/" : thePath
        )

      req[call](req);

    }else{
        const path=this.location.pathname;
   
         UrlInfo.set("path",path);
          
         req[call](req);
    }

}



  export const Interfy=_INTERFY;
  
    

