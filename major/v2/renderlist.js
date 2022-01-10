
import {

    isObj,
    DOMMUTATION,
    syErr,
    isCallable,
    valueType,
    array,
    isAtag,
    consW,
    getId,
    isDefined,
    hasChildren


} from "./helpers.js"



function makeReactive(obj, call){

            
          

    if("___" in obj && obj["___"]==true){
  
      // The properties of "obj" object are already reactive,
      // so we should ignore any attempt to make them reactive once more.

      
      
      return false;
  
    }

  
    
  
            
          
          
           const share=Object.assign({},obj)   
          const properties=Object.keys(obj);
          
          for(let key of properties){
          
              if(key=="__i__"){

                continue;

              }
          
              if(key=="defineProps"){
                    
                  delete obj[key];
                  delete share[key];
                  
                  consW(`
                  "defineProps" is a reserved property in the objects that are the values
                  of each array in renderList().
                  
                  `)
          
              }
          
          

            
          Object.defineProperty(obj,[key],{

          set(value){

            share[key]=value;
           
           call(this["__i__"]);
           
            
          },
          get(){

              return share[key];

          }
          })

          if(isObj(obj[key])){
          
              makeReactive(obj[key], call);
          
          }    

          }
          
          
          
          
    
          Object.defineProperty(obj, "defineProps",{
          
              set(v){
          
                  if(!isObj(v)){
          
          
                      syErr(`
                      
                    The value of "defineProps" must be an object, and you defined
                    "${valueType(v)}" as its value.
          
                    Must be:
          
                    [The object].defineProps={
          
                      prop:value
          
                    }
                      
          
                      `)
          
                  }
          
              for(let[p,vl] of Object.entries(v)){
          
                  if(!(p in this)){
          
                      share[p]=vl;
          
                  Object.defineProperty(obj, [p],{
                      
                      set(value){
          
                      share[p]=value;
                       
                      call();
           
          
          
                      },
          
                      get(){
          
                          return share[p];
          
                      }
          
                  })
          
                  call();
          
              }
          }
          
          
              }
          
          })
          

  
  }






function reorderIndex(arr, updateFn){


    /**
     * This function must be called
     * everytime the data array
     * is mutated.
     */
    
     

    if(array.is(arr)){

        arr.forEach((obj,i)=>{

            if(isObj(obj)){

            if(("__i__" in obj) ){

                
               obj["__i__"]=i;

            }else{

                

                 Object.defineProperty(obj, "__i__",{

                    value:i,
                    writable:!0,
                    enumerable:!1

                 })

                 makeReactive(obj, updateFn);

            }

        
        }
    

    })

    updateFn();


}

}



export function renderList(obj){

    if(new.target!=void 0){

        syErr(`
        
        renderList is not a constructor(Do not call it with the new keyword).
        
        `)


    }
    else if(!isObj(obj)){


        syErr(`
        
        
        The argument of renderList function must be a plain object and ${valueType(obj)}
        was recieved.

        
        `)


    }else{

        let{
            in:IN,
            each,
            do:DO,
        }=obj;

      let _root;
      //The reactor.
      let pro;

   
// The Internal mutation methods.

const add=Symbol.for("_add");
const remove=Symbol.for("_remove");  

//</>

   if(array.is(each)){


    function proSetup(){


 pro=new Proxy(each,{
set(target,key,value,prot){
    


   target[key]=value;
   
    if(isObj(value)){
      
        makeReactive(value,Work)
  
    }
    
  Work()
    
 
    return true;
   
},

})


// Some Array.prototype method
// mutated for better performance.

if(!("$$$" in pro)){


    /**
     * The $$$ property
     * 
     */

Object.defineProperty(pro, "$$$",{
enumerable:!1,
configurable:!1,
get(){
    
    return true;

},
set(v){

    return false;

}

})

Object.defineProperty(pro, "shift", {

value(){  

const removed=Array.prototype.shift.apply(data, void 0);
const firstNodeElement=_root.children[0];

if(firstNodeElement){

_root[remove](firstNodeElement);


reorderIndex(each, runUpdate);

}


return removed;



}
}
)

Object.defineProperty(pro, "unshift",{

value(){


const added=Array.prototype.unshift.apply(each, arguments);
const _this=this;
if(arguments.length>1){


let i=arguments.length-1;

for(; i>-1; i--){

    

    const el=DO.call(_this,arguments[i],i);

    if(_root.children[0]){
    
        _root.insertBefore(el, _root.children[0]);

    }else{

        _root[add](el);

    }

}

}else if(arguments.length==1){

const el=DO.call(_this, arguments[0], 0);
    

if(_root.children[0]){
    
    _root.insertBefore(el, _root.children[0]);

}else{

    _root[add](el);

}



}





reorderIndex(each, runUpdate);



return added;

}

})

Object.defineProperty(pro, "splice",{

value(start, deleteCount, ...itens){

const spliced=Array.prototype.splice.apply(each,arguments);


if(itens.length==0){

    let from=start;
    const to=deleteCount;

/**
 * 4
 * 1
 * 
 */
    for(let i=0; i<to; i++){

        
        const node=_root.children[from];

        if(node){

        _root[remove](node)

        }

    }

}else{

    

    if(end==0 && itens){

        for(let l=itens.length-1; l>-1; l--){

            const el=DO.call(pro, itens[l], l);

            if(_root.children[start]){

            _root.insertBefore(el,_root.children[start]);

            }else{

                _root[add](el);

            }

        }

    }

}


reorderIndex(each, runUpdate);

return spliced;


}

})


}


//


Object.defineProperty(pro,"otherArray",{
set(value){
   
if(!array.is(value)){

 SyntaxErr(`
 "${value}" is not an array.
 `)

}else{


 each=value;

 

 Work();

for(let v of value){

if(isObj(v)){

makeReactive(v, runUpdate);

}
}



proSetup();

}

},


configurable:!0
})






}

proSetup()

}

function Work(){



    if(each.length<_root.children.length){
    
    
     let len=_root.children.length;
    
    while(len>each.length){
    
        len--;
    
      _root[remove](remove.children[len]);
    
    }
    
    runUpdate();

    
    
    return false;
    
    }
    
    
    
    each.forEach((item, i)=>{
    
    
    const el=DO.call(pro, item, i);
    
    
    if(!isDefined(_root.children[i])){
    
    _root[add](el)
       
    
    
    }else{
    
    
    /**
     * 
     * If this block run, 
     * renderList was called more than once 
     * in the same container, if he called it
     * once, the container probably has children
     * and we have just to look for difference between
     * the old child and the new child.
     * 
     */
    
    calculateUpdate(el, _root, i);
    
    }
    
    })
    
    
    
    
    
    
    
    
    
    }

    function runUpdate(_i){



        if(typeof _i=="number"){
        
        
        const el=DO.call(pro,each[_i],_i);
        
        calculateUpdate(el,_root,_i);
        
        }
        
        setTimeout(()=>{
        
        
        each.forEach((item,i)=>{
        
        if(i!==_i){
        
        const el=DO.call(pro,item,i);
        
        calculateUpdate(el,_root,i);
        
        }
        
        })
        
        },2)
        
        
        
        
        
        }



if(!array.is(each)){


    syErr(`
    
    "each" must be an array in renderList.
    
    `)

}

if(!isCallable(DO)){

syErr(`

"do" must be a function in renderList.

`)

}else{


const root=isAtag(IN) ? IN :  getId(IN);
_root=root;
new DOMMUTATION(root);

let i=-1;

for(let _obj of each){
i++;    
if(isObj(_obj)){
 
    Object.defineProperty(_obj,"__i__",{

        value:i,
        enumerable:!1,
        writable:!0

    })
makeReactive(_obj, runUpdate);

}
}









Work();

}





}

}



function calculateUpdate(value,parent,ind){
      
    let father=parent.children[ind];

    // The Internal mutation method

   const replace=Symbol.for("_replace");
   
        
    if(notSameTagName(father,value)){

     parent[replace](value, father);

     

    } 

    else if(father.getElementsByTagName("*").length!=value.getElementsByTagName("*").length){
         
         parent[replace](value,father);
         
        
         return;
     }
   
let root=parent.children[ind].getElementsByTagName("*");

const target=value.getElementsByTagName("*");



 if(root.length>0 && target.length>0){
    
    let el=-1;

for(let _ of root){

        el++;
    

 if(notSameTagName(target[el], root[el])){

     root[el].parentNode[replace](target[el], root[el]);

     

 }




else if(isDefined(root[el]) && isDefined(target[el])  &&
 deeplyNotIqualElements(root[el],target[el]) ){

     
 root[el].parentNode[replace](target[el],root[el])  
     

    



}



}
}else{


 

 if(oneHasChildAndOtherNot(value, father)){

     parent[replace](value, father);

     

 }

 // There is no container.

 else if(deeplyNotIqualElements(father, value)){

     parent[replace](value, father);

 }

 

}



 }


 function notSameTagName(first,second){

  return  !(first.nodeName==second.nodeName);

 }

 function oneHasChildAndOtherNot(el1,el2){

     const children1=el1.getElementsByTagName("*").length;
     const children2=el2.getElementsByTagName("*").length

     return (children1==0 && children2>0 || 
         children1>0 && children2==0
         );

 }

 function deeplyNotIqualElements(_old,_new){


     

    let returnValue=false;

   const _new_attrs=_new.attributes;
   const _old_attrs=_old.attributes;
   
 

   if(!returnValue){
     
       if(_new_attrs.length!==_old_attrs.length){
         
        returnValue=true;

       }else{

       for(let attr of _old_attrs){
     
       const name=attr.name;
       const value=attr.value;

       if(!_new.hasAttribute(name)){

         returnValue=true;
         break;
       
       }
       else if(_new.hasAttribute(name)){

         const theAttribute=_new.getAttribute(name);
        
         if(theAttribute!==value){
             returnValue=true;
             break;
         }
       }

   }
 }
}
   if(!returnValue){ //Run if returnValue is false;
    
   if(_new.textContent && _old.textContent){
     
     if(hasChildren(_new) && hasChildren(_old)){

         return false;

     }

       _new.textContent!==_old.textContent ? 
       _old.textContent=_new.textContent : void 0;
       
     }

   
 }

 if(!returnValue && (_new._events
    && _old._events
    )){

        

   for(let[name,fn] of Object.entries(_new._events)){

      _old._events[name]=void 0;

     _old[name]=(e)=>{
       
        fn.apply(void 0, e)

     };



   }

   for(let name of Object.keys(_old._events)){

    if(!(name in _new._events)){

        delete _old._events[name];
        _old[name]=void 0;

    }

   }

   

 }


 
 


 return returnValue;
 
}
