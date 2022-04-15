import{

    isObj,
    syErr,
    err,
    consW,
    getId,
    isDefined,
   


 } from "./helpers.js"

 

 const containerRenderingManagement={

   actualStyle:void 0,
   actualDiv:void 0,
   actualScript:void 0,
   hasContainer:false

 }



 export function container(options){

    /**
     * 
     * {
     * in:string,
     * events:{
     * loading:Function,
     * mounted:Function
     * 
     * }
     * }
     * 
     * 
     */
    
     if(!isObj(options)){

        syErr(`
        
        The argument of the container function must be an object.
        
        `)


     }

     if(!("in" in options) || typeof options.in!=="string"){


        syErr(`
        

        The options argument in container function must have the "in" property, and its value
        must be a string.
        
        `)

     }
        const root=getId(options.in);

        

        return {

         render(pathToContainer, info){

       if(typeof pathToContainer!=="string"){


         syErr(`The argument of render function must be a string`);


       }

       if(!pathToContainer.endsWith(".html")){

         syErr(`
         
         The file extension of the container must be .html
         
         `);

       }

       getTheContainer(pathToContainer, root, info, this);




         }

     

  }



 }

function getTheContainer(pathToContainer, rootEl, info, loader){

   const request=new XMLHttpRequest();

   request.open("GET", pathToContainer, true);

   request.setRequestHeader("Content-type", "text/html");
   request.onreadystatechange=function(){

      if(this.readyState==4 && this.status==200){

         parseStringToLang(this.responseText, rootEl, pathToContainer, info, loader);
      }

   };

   request.onerror=()=>err(`Inter was unable to load the container at "${pathToContainer}"`);

   request.send(null);


}

 function parseStringToLang(__string, __rootEl, __pathToContainer, __info, __loader){

   

   const __styleRule=/<style>(:?[\s\S]+)<\/style>/ig,
         __scriptRule=/<script>(:?[\s\S]+)<\/script>/ig,
         __template=/<container>(:?[\s\S]+)<\/container>/ig;
         
         let __css, __js, __html, __div,__style,__script,__loadCss=false;
         
         __string.replace(__styleRule, (__match)=>__css=__match.replace("<style>", "").replace("</style>",""));
         __string.replace(__scriptRule, (__match)=>__js=__match.replace("<script>", "").replace("</script>", ""));
         __string.replace(__template, (__match)=>__html=__match.replace("<container>", "").replace("</container>",""));
         
          __div=document.createElement("div");
         __style=document.createElement("style");
         __script=document.createElement("script");
         __div.innerHTML=__html;

         function __displayRoot(){

            __rootEl.style.removeProperty("visibility");

         }
         

         if(toUseModule(__js)){

            
            __script.type="module";
            __script.innerHTML=`
            
            const __container={

               get info(){
               
               return ${JSON.stringify(__info)}
               },


            };


            ${__js}
            
            
            `;
            

         }else{

            __script.innerHTML=`
            
            (function(){



               ${__js}

            })();
            
            `

         }

         if(toLoadCss(__css)){

            const __url=getTheCssUrlToLoad(__css);
            
            if(isDefined(__url)){

               __loadCss=true;
               __style=document.createElement("link");
               __style.rel="stylesheet";
               __style.href=__url;
               __style.onload=()=>insertTemplate();
               
               
               
                

               
            }


            

         }else{

            __style.innerHTML=__css;


         }

         if(containerRenderingManagement.hasContainer){

            const __theDiv=containerRenderingManagement.actualDiv,
                  __theStyle=containerRenderingManagement.actualStyle,
                  __theScript=containerRenderingManagement.actualScript;

                  if(__theDiv!=null && __theDiv.parentNode!=null){

                     __theDiv.parentNode.removeChild(__theDiv);

                  };

                  if(__theStyle!=null && __theStyle.parentNode!=null){

                     __theStyle.parentNode.removeChild(__theStyle);

                  }

                  if(__theScript!=null && __theScript.parentNode!=null){

                     __theScript.parentNode.removeChild(__theScript);

                  }

         }else{

            containerRenderingManagement.hasContainer=true;

         }

         function insertTemplate(){
         
            __rootEl.appendChild(__div);
            document.head.appendChild(__script)
         
         }
         


         containerRenderingManagement.actualDiv=__div;
         containerRenderingManagement.actualStyle=__style;
         containerRenderingManagement.actualScript=__script;
         document.head.appendChild(__style);
         
         if(!__loadCss){

            insertTemplate();

         }


         

         
    
       
   

 }


 function toUseModule(jsString){

   

   const rule=/\/\/(:?\s+)*use(:?\s+)*module(\s+)/gi;

   return rule.test(jsString);
   

 }

 function toLoadCss(cssString){


   const rule=/\/\*(:?\s+)*load(:?\s+)*=(:?\s+)*(:?\S+)(:?\s+)*\*\//i
     
   
   return rule.test(cssString);

 }


 function getTheCssUrlToLoad(cssString){

   const rule=/\/\*(:?\s+)*load(:?\s+)*=(:?\s+)*(:?\S+)(:?\s+)*\*\//i;
   let url;

   cssString.replace(rule, (match)=>{

      url=match.replace(/\/\*(:?\s+)*load(:?\s+)*=/i,"").replace(/\*\//, "").trim();

   })

return url;

 }