import{Perf} from "./perf.js"

const inst=new Perf();

// Register performance.

inst.test({

run(){
  
toHTML({
in:"test",
data:{
name:"Inter"
},
react:"say"
})
},
log(){

console.log("Registered")

}


})

// Update performance.

function update(){

inst.test({

run(){

say.name="framework";

},

log(){

console.log("Updated")

}

})

}
