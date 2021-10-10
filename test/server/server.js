/**
 * A simple and elegant Nodejs module
 * for http routing.
 * 
 * THIS MODULE WAS CREATED TO TEST INTER(https://github.com/DenisPower1/inter) 
 * AND INTERFY
 * (https://github.com/DenisPower1/interfy) CODE.
 * MUST NOT BE USED IN ANY OTHER SITUATION.
 * 
 *  THIS CODE WAS CREATED BY DENIS POWER(https://github.com/DenisPower1)
 *  2021.
 */


 if(typeof window!=="undefined"
 && window.onload
 ){

      // This script must not run in browser.

      new Error(`
      
      The server module can not run in browser, only in node.
      
      `)

 }


const http=require("http");
const fs=require("fs");
const path=require("path");
const INTER=Object.create(null);
const REQUEST=Object.create(null);
let RE;

Object.isObj=function(obj){

      return (this.prototype.toString.call(obj)=="[object Object]")

}

 Object.defineProperties(REQUEST
      ,{
        urlExt:{

  get(){

            // The extension name;

      return path.extname(this.url).replace(/\./,"");
  }

        },    
       status:{
             get(){
              //If the status is read we must return null;

              return void 0;

             },
             set(code){
             
             if(typeof code=="number"){

                  return RE[1].statusCode=code;
             }else{

                  throw new Error(`
                  
                   The status property value must be a number.

                  `)
             }
             
             },
             configurable:!1,

       },
       sendFile:{
      value(fileName){
        if(fileName==void 0){

            return new Error(`
            You did not define the file name to send.
            `)

        }else{

            fs.readFile(fileName, (err,d)=>{

                  if(err){

                        console.error(`The following error occured while
                        trying to read the ${fileName} file.
                        `)

                  }

                  this.send(d)

            })
      
        }
      }
       },
       send:{
             value(data,status){
                  const resp=RE[1];
                  if(data==void 0){

                        throw new Error(`
                        You did not define the the response to send.
                        `)

                  }
                  if(typeof status=="number"){
                    
                    resp.statusCode=status;
                    resp.end(data);
                    
                        
                  }else{

                        // If the status argument was not defined
                        // we assume that it's ok(200).
                        resp.statusCode=200;
                        resp.end(data);
                  }

             }
       },
       setHeaders:{
             set(headers){

                  if(!Object.isObj(headers)){

                        throw new Error(`
                        
                        The [request obj].setHeaders value must be an object.

                        `)
                  }else{

                        const resp=RE[1];
                        
                        Object.entries(headers).forEach((kv,i)=>{
                           const[header,value]=kv;
                           resp.setHeader(header,value);
                        })

                  }
             },
            },
       
             url:{

                   get(){
                     
                        return RE[0].url;
                   },
                   set(u){
                        
                        //Do nothing.
                   }
   
       },
       method:{
             set(m){

             },
             get(){
         
                  return RE[0].method;
             }
       }
 })

 Object.defineProperty(INTER, "server",{
       value:(call)=>{
             

             return {
                   host(n,fn){
                     if(Number.isNaN(Number(n))){
                      
                       throw new Error(`
                       The value of host method must be a number.
                       `)

                     }
                        http.createServer((req,res)=>{
                              if(req.method!="GET"){
                                    
                                    throw new Error(`
                                    "${req.method}" request is forbidden,
                                    this server only accepts GET request.
                                    `)
                              }else{
                                    
                              RE=[req,res];
                              call(REQUEST);
                              }
                        }).listen(Number(n), typeof fn == "function" ? fn : ()=>{} );
                  }
             }
       }
 })

 Object.freeze(INTER);
 Object.preventExtensions(REQUEST);

const Inter=INTER;

exports.Inter=Inter;
