const inst=new Perf();



Inter.for({
         in:"list",
         data:["Inter","Laravel","Express","Django"],
         do(name){
      
            return template({
                elements:[{
                    tag:"li", text:name, 
                    
                }]
            })

         },
         react:"list"
     })    


inst.test({
   
    run(){

list.splice(2,1,"Yes")
        
  
    },
    log(){

console.log("done!")

    }
})
