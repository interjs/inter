/** 
 *  Interfy - A Javascript library for robust web front-end routing.
 * 
 *  Github's repo - https://github.com/DenisPower1/interfy
 *  version - 1.0.1
 * 
 *  Created by - Denis Power/ https://github.com/DenisPower1
 * 
 *  IT WAS REALESED UNDER THE MIT LINCENSE.
*/


   (function(){

  

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

    const OBJ_PRO=Object.prototype;

   function isAFunction(target){

     return OBJ_PRO.toString.call(target)=="[object Function]";


   }

     
   function isTring(str){

    return OBJ_PRO.toString.call(str)=="[object String]";
        
        
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

   function InterDetector(){
     
    const ENV_OBJ=globalThis;

    if(ENV_OBJ.Inter){
     
      return !(ENV_OBJ.app.status=="development");  

    }else{

        return false;
    
    }
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

    // If Interfy is being used 
    // With Inter we must check if the app is now
    // in production.
    
     let detected;

     if(void 0 == detected){

        detected=InterDetector();
     }
     
     if(isFalse(detected)){
      
        errs[errType](ms);


     }



   }




  


 class UrlParser{
  
    constructor(){
    
    };
    get url(){
       
        return UrlInfo.get("path");
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
      
      
        

        let parsedUrl=this.prototype.url.replace(/-|_/g, (m,_)=>{
       
            if(m=="_"){
                
                return "d".repeat("down".length); 
            }

            if(m=="-"){

                return "m".repeat("middle".length);

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

             
             returnOBJ[dyP[index]]=_path
            
            
            
            
    })

    
    
   
   return returnOBJ;

        
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
    
    set url(v){

        return false;
    },

     is(pathWithParam){
     
      // For example.  
     // pathWithParam - /profile/(id)/   

      
          const urlSetted=this.url;
          const p=pathWithParam.replace(
              /\(:?([\s\S]+)\)|\*/g, "[\\s\\S]"
          )
       
          const reg=new RegExp();
   
           return reg.compile(p).test(urlSetted) 
   
      
     

     },
     
     getVar(path){
        
      
      return UrlParser.getVar(path);
      

     },
 
    
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

 let created=false;

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
},
setPath(pathName){

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

useHash(pathName){

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
       
          [ INTERFY INSTANCE ].useHash(${pathName})    
       
         `)
    
      }

      _setPath(pathName,true);
    
      UrlInfo.set("path", pathName);
       
      req[call](req);

}

}

window.onpopstate=function(){

    const _Hash=this.location.hash;

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


    

    globalThis.Interfy=INTERFY;
    

  
  
    


})()
