/**
 * 
 *  THIS FILE USE the Inter(server) module.
 * 
 *  CREATED BY DENIS POWER(https://github.com/DenisPower1).
 * 
 * 
 *  2021.
 * 
 */

 const Inter=require("./server").Inter;

 


 Inter.server((re)=>{

  const ext=re.urlExt;

      if(re.url=="/"){
        re.setHeaders={
            "Content-Type":"text/html"
        };

       
      
          re.sendFile(`./inter-test.html`);
        return false;

      }

      if(ext=="txt"){

        re.setHeaders={
          "Content-Type":"plain/text"
        };

        re.sendFile(`./${re.url}`)

      }

    if(ext=="css" || ext=="js"){
     
       // It is either a css or js file.

        re.setHeaders={
            "Content-Type":ext == "js" ? "text/Javascript" : "text/plain"
        };

        re.sendFile(`./${re.url}`);

    }else{

       
       
        if(ext=="html"){

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
