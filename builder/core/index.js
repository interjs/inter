/**
 * 
 * @author Denis Power
 * 
 * 
 * 
 * 
 * BUILDER
 * 
 * This software is restricted to Interjs
 * 
 * 
 */

 

 
const {
     
     createFileNamed,
     createGlobalVars,
     removeImportsAndExport,
     createIIFE

 }=require("./helpers");

 
 class BUILDER{

    constructor(options){

        /**
         * 
         * options
         * 
         * {
         * 
         * files:Array<Object>,
         * vars:Array<String>,
         * version:string
         * 
         * }
         * 
         * 
         */


         if(new.target===void 0){


            throw new SyntaxError(`
            
            BUILDER is a constructor, call it with
            the new keyword.
            
            `)

         }
         

         if(!((options).constructor == ({}).constructor)){

            throw new SyntaxError(`
            
            The value that you defined as argument of BUILDER is not
            a plain Javascript object.
            
            `)

         }

         if(options.files instanceof Array){

            let fileStringfied=`
            `;

            for(let file of options.files){


               require("fs").readFileSync(file, (e,d)=>{

                if(e) throw new Error(`The task could not be completed because of : ${e}  `);

               fileStringfied+=removeImportsAndExport(d); 

               })


            }

         

         options.vars instanceof Array && (()=>{

            createGlobalVars(options.vars, fileStringfied)


         })()

         createIIFE(fileStringfied, options.version);
         const {then, catch:_catch}=createFileNamed("Inter.js", fileStringfied);

         then((ms)=>{

            console.log(ms);

         });

         _catch((err)=>{


            throw new Error(`
            
            The compilation failed because of : ${err}
            
            `)


         })


        }


    }

    static get [Symbol.toStringTag](){

        return "Builder"

    }
         


 }
 
 

 exports.BUILDER=BUILDER;

 
