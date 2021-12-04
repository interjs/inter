import {Perf} from "./perf.js";

const inst=new Perf();
let reactor;

inst.test({

  run(){
  
reactor=renderContainer({
in:"id",
data:{
one:false,
two:false,
three:false,
four:false,
five:false,
six:false,
seven:false,
eight:false,
nine:false,
ten:true

},
  
private:true
})
    
  },
  
  log(){
  
    console.log("Container rendering done!)
  
  
  }


})

inst.test({

  run(){

reactor.register=[
"one",
"two",
"three",
"four",
"five",
"six",
"seven",
"eight",
"nine",
"ten"

]

},
  
  log(){
  
  console.log("Properties registration done!")
  
  }


})


inst.test({

  run(){
  
  reactor.setRegistered=false;
  reactor.nine=true;
  
  },
  
  log(){
  
  console.log("setRegistered action done!")
  
  }

})

