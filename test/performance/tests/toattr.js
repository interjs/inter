import {Perf} from "./perf.js"

const inst=new Perf();

inst.test({

  run(){
  // Register performance.
    
    toATTR({
      in:"id",
      data:{
      bt:{
      disabled:null,
      class:null,
      title:null,
      onclick(){
      
        this.class="Button clicked!"
        
      }  
      }
      }
    })
  
  },
  log(){
  
    console.log("The register is done!")
    
  }
  
})

inst.test({

  run(){
  //Update performance.
    
    bt.disabled=true;
    bt.title="Updated!"
  
  },
  log(){
  
    console.log("The Update is done!")
  
  }
  
})
