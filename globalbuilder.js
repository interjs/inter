 const fs=require("fs");

 const   __dir="./core",
        __files=["helpers.js", "ref.js", "renderif.js", "toattrs.js","template.js", "renderlist.js", "ajax.js"],
        __exportStatement=/export/g;

        
    
let __content=``;

for(const __file of __files){

    __content+=fs.readFileSync(`${__dir}/${__file}`);
    

};

__content=__content.replace(__exportStatement,"");


const __data=`
(function(){
    
/**
 * Interjs 
 * MIT LICENSED BY - Denis Power
 * Repo - https://github.com/interjs/inter
 * 2021-2022
 * 
 * 
 * 
 */

 ${__content}

 window.Ref=Ref;
 window.renderIf=renderIf;
 window.toAttrs=toAttrs;
 window.renderList=renderList;
 window.template=template;
 window.Backend=Backend;

})();

`

fs.writeFileSync("./inter.js", __data);

console.log("The task was completed succefully.")





 


 
 
