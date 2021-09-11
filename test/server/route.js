 * 
 *  THIS FILE USE the Inter(server)  AND THE (variable) modules.
 * 
 *  CREATED BY DENIS POWER(https://github.com/DenisPower1).
 * 
 * 
 *  2021.
 * 
 */
                        
 const Inter=require("./server").Inter;
 const _var=require("./variable")._var;


 Inter.server((re)=>{

      if(re.url=="/"){
        re.setHeaders={
            "Content-Type":"text/html"
        };

       
      
          re.sendFile(`./${_var}.html`);
        return false;

      }

    if(re.url.endsWith(".css") || re.url.endsWith(".js")){
     
       // It is either a css or js file.

        re.setHeaders={
            "Content-Type":"text/plain"
        };

        re.sendFile(`./${re.url}`);

    }else{

       
       
        if(re.url.endsWith(".html")){
       // It is a html file.

            re.setHeaders={
            "Content-Type":"text/html"
        };


        re.sendFile(`./${re.url}`);
    }
    }


 }).host(2000, ()=>{
     console.log("The server has started!!!")
 });
