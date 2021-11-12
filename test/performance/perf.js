/**
 * Perf - Performance tester module.
 * 
 *  Denis Power (https://github.com/DenisPower1/inter)
 * 
 */



    /**
     * 
     *  const inst=new Perf();
     * 
     *  inst.test({
     *  run(insight){
     * 
     *  // The code here.
     * 
     * },
     * log(){
     * 
     * console.log("Performance test finished.
     * ")
     * 
     * }
     * 
     * }) 
     * 
     */


     const obj={

        is(obj){

            return Object.prototype.toString.apply(obj,void 0)=="[object Object]";

        }

     }

     function isTrue(v){

        const conv=Boolean(v);

        return conv===true;

     }

     function PERF(){


        if(new.target==void 0){

            new SyntaxError(`
            
            "Perf" is a constructor, so you must call it with the "new" keyword. 

            `)

        }

        /**
         * The testing method.
         * 
         */
     this.test=function(o){

        if(!obj.is(o)){

            new SyntaxError(`
            
            The argument of [ Perf instance ].test() method must be an object.

            `)

        }

        const{ /** Denis Power */run, log }=o;

        if(typeof run !="function"){

            new SyntaxError(`
            
            The value of run property must be a function.
            
            `)

        }

       console.time();
   
       run();

        console.timeEnd();
      

    if(typeof log=="function"){
        
            log()

   }

       


       

     }

     }


     PERF.prototype={

      set toString(v){

         return null

      },

      toString(){

         return "[object Perf]"

      }



     }



     export const Perf=PERF;
