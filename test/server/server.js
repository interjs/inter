/**
 * THIS MODULE WAS CREATED TO TEST INTER(https://github.com/DenisPower1/inter) AND INTERFY
 * (https://github.com/DenisPower1/interfy) CODEBASE
 * MUST NOT BE USED IN ANY OTHER SITUATION
 * 
 *  THIS CODE WAS CREATED BY DENIS POWER(https://github.com/DenisPower1)
 *  
 *  2021.
 */

 const http=require("http");
 const fs=require("fs");

 const INTER=Object.create(null);
const REQUEST=Object.create(null);
let RE;

Object.isObj=function(obj){

      return (this.prototype.toString.call(obj)=="[object Object]")

}

 Object.defineProperties(REQUEST
      ,{
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
              
              fs.access(`./${fileName}`,(obj)=>{
                //When the file does not exist, the obj argument is an object
                //otherwise it's null.
                const noExist=Object.prototype.toString.call(obj)==["object Error"];
                  
                if(noExist){
                      
                  throw new Error(`
                  ${obj.syscall} does not exits on ${__dirname} directory.
                  `)
                }else{
                      if(!fileName.endsWith("favicon.ico")){
                      fs.readFile(`./${fileName}`, (err,data)=>{
                        
                        if(err){

                            throw err;

                        }else{

                              this.send(data);
                        }

                      })
                }
            }
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
                       The value of host property must be a number.
                       `)

                     }
                        http.createServer((req,res)=>{
                              if(req.method!="GET"){
                                    
                                    throw new Error(`
                                    ${req.method} request is forbidden,
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

 exports.Inter=INTER;
