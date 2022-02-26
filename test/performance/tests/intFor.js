import{Perf} from "./perf.js"

const inst=new Perf();



Inter.for({
         in:"list",
         data:["Inter","Mithril","Ember"],
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

list.splice(2,1)
        
  
    },
    log(){

console.log("done!")

    }
})
