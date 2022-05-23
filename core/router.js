
import {

    syErr,
    err,
    consW,
    isCallable

} from "./helpers.js"




 class UrlParser{
  
    get url(){
       
        return UrlInfo.get("path").replace(/\s/g, "");
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


const call=Symbol.for("callBack");

// The request obj

 const req={

     [call]:void 0,

    get url(){

        return UrlInfo.get("path");

    },

    has(route){

      
        const reg=/\((:?[\s\S]+)\)|\*/g

        

      return reg.test(route);

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
 

  function RoutingSystem(){

 
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


    function start(hand=()=>{}){

        if(started){

            consW( `
            
            The router was already started.

            `)

            return false;

        }

        const canStart=Object.keys(handler).length>0;

        if(canStart){

            started=true;

            const inst=new RoutingSystem();

            inst.createRouter((req)=>{

                let found=false;

                if(isCallable(hand)){      

                 hand(req.url);
         
            }
                

                for(let[route,_handler] of Object.entries(handler)){
                    
            

            
                    if(req.url==route){
                       
                        

                        const varAndParam=Object.freeze({
                            var:Object.create(null),
                            param:Object.create(null),
                            url:req.url
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
                                url:req.url

                            })

                            _handler(varAndParam);
                           


                           }else{


                            const varAndParam={
                                var:req.getVar(route),
                                param:Object.create(null),
                                url:req.url
                            };



                            

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

          err( `
          
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

    function route(routeName,routeHandler){
      
        if(started){

            consW( `
            
            You already started the router, so you
            can not add more routes to it.
            
            `)

            return false;

        }
        

        const isTring=typeof routeName == "string";

        if(arguments.length<2){

            syErr( `
            
            [Router instance].route() method accepts two arguments,
            and you defined: ${arguments.length}.


            `)

        }

        if(!isTring){

        syErr( `
            
            The first argument of [Router instance].route()
            must be a string.

            [INTERFY INSTANCE].route("/routename", ()=>{})

            `)

        }

        if(!isCallable(routeHandler)){

            syErr( `
            
            
            The second argument of [Router instance].route()
            must be a function.

            `)

        }
        if(!routeName.startsWith("/") && routeName!="*"){


            syErr( `
            
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



 let created=false;


 // The internal RoutingSystem prototype.

RoutingSystem.prototype={

createRouter(fn){
 
    if(!created){
    
    created=true;

    
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
}


}

     /**
      * Used to change the url.
      * 
      * 
      */

   function setPath(pathName){

        if(!started){

            err(`
            
            The router was not started yet, start it firt.

            `)

        }

        const isTring=typeof pathName==="string";

        if(!isTring){
        
            syErr( `
        
        The pathName in [ Router instance ].setPath(pathName)
         must be a string.
        
        `)
    
        }
    
     
    
    
      if(!pathName.startsWith("/")){
    
        syErr(`
        A pathName must start with a slash(/).
    
         You used:
       
         [INTERFY INSTANCE ].setPath("${pathName}")    
       
         `)
    
      }
    
      _setPath(pathName);
    
      UrlInfo.set("path", pathName);
      
       
      req[call](req);
    
    };
    
    /**
     * Used to change the url.
     * 
     */

   function setPathWIthHash(pathName){

        if(!started){

            err( `
            
            The router was not started yet, start it first.

            `)

        }
    
        const isTring=typeof pathName==="string";

     if(!isTring){
    
    consW(`
        
        The pathName in [ Router instance ].setPathWIthHash(pathName)
         must be a string.
        
        `)
    
     }
    
        if(!pathName.startsWith("/")){
    
            syErr(`

            A pathName must start with a slash(/).
        
             You used:
           
              [ Router instance ].setPathWithHash(${pathName})    
           
             `)
        
          }
    
          _setPath(pathName,true);
        
          UrlInfo.set("path", pathName);
           
          req[call](req);
    
    };


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


export function Router(){

    if(new.target===void 0){

        syErr(`
        
        Router is a constructor, call it only with
        the "new" keyword.
        
        `)

    };

}

Router.prototype={
    constructor:Router,
    [Symbol.toStringTag]:()=> "InterRouter",
    route:route,
    start:start,
    setPath:setPath,
    setPathWIthHash:setPathWIthHash
    



}





