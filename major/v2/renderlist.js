
  import {

    syErr,
    isObj,
    isCallable,
    validInProperty,
    validEachProperty,
    valueType,
    Iterable,
    array,
    isAtag,
    getId,
    consW,
   notSameLength,
   isDefined

} from "./helpers.js";

import{ 

    template,
    toDOM


} from "./template.js"


export function List(options){

    if(new.target!==void 0){

        syErr(`
        
        renderList is not a constructor, do not call
        it with the "new" keyword.
        
        `);

    }

    if(!isObj(options)){

        syErr(`
        
        The options(the argument of renderList) in renderList must be a plain Javascript object.
        
        `)


    }

    const {
        in:IN,
        each,
        do:DO,
        reactive=true
    }=options;

     

    if(!validInProperty(IN)){

        syErr(`
        
        The "in" option in renderList must be either a string
        or an HTMLElement.
        
        `)

    }

    if(!validEachProperty(each)){

        syErr(`
  
        "${valueType(each)}" is not a valid value for the "each" options in renderList.
        The value that are accepted in "each" options, are:

        Array.
        Plain js object.
        Map.
        Set.

         
        `)

    }

    if(!isCallable(DO)){

        syErr(`
        
        The value of the "do" option in renderList, must be only a function.
        
        `)

    }

    let pro;

    function proSetup(){

        if(typeof each!=="number"){

            pro=new Proxy(each, {

                set(target, prop, value){
                  
                    Reflect.set(target, prop, value);

                    updateSystem();

                    if(typeof prop !=="number" && validEachProperty(prop)){

                        

                    }


                },

                get(){


                    Reflect.get(...arguments);

                }
                

            })


        }

    }

    if(reactive){

        proSetup();

    }


    const root=isAtag(IN) ? IN : getId(IN)

    function updateSystem(){

    const i=new Iterable(each);

    


    if(root.children.length>i.source.values.length){

        let length=root.children.length-i.source.values.length

               while(length--){

                root.removeChild(root.children[length]);

               }

    }


    i.each((data, i)=>{

        let temp=DO.call(pro , data, i,pro)

        if(isObj(temp) && (Symbol.for("template") in temp) && isObj(temp.element)){

            const actualEl=root.children[i];

            // The  function is returning the template.

            if(!isAtag(actualEl)){

                root.appendChild(toDOM(temp.element));

            }else{

                
                if(!actualEl.template){
                   
                consW(`
                
                Avoid manipulating what Inter manipulates,
                
                `)

                /**
                 * ActualEl was not rendered by Inter, in
                 * this case we must replace it with an element
                 * rendered by Inter to avoid diffing problems.
                 */

                 root.replaceChild(toDOM(temp.element), actualEl);

                }else{

                    

                    runDiff(temp.element, actualEl.template);

                }
            

            }

        }else{

            syErr(`
            
           The template function is not being returned inside the do method in
           renderList(reactive listing), just return the template function.
            
            `)

        }


    })

    


}

updateSystem()

if(!reactive){

    return updateSystem;

}

}




function runDiff(newTemp, oldTemp){


    /**
     * the update and the UpdateChildren
     * have high priority in the diffing.
     * 
     */

     

     if(!("update" in newTemp) || newTemp.update){

        diff(newTemp, oldTemp)
        

     };



     if(newTemp.children.length===oldTemp.children.length && (!("updateChildren" in newTemp)  || newTemp.updateChildren)){

        
        diffingChildren(newTemp.children, oldTemp.children)

     }

    


}


function diff(newChild, oldChild){

    

     if(newChild.children.length!==oldChild.children.length){

        oldChild.target.parentNode.replaceChild(toDOM(newChild), oldChild.target);

    }else{

        if(newChild.tag!==oldChild.tag){

            alert(`${newChild.tag} ${oldChild.tag}`)

            oldChild.template.target.parentNode.replaceChild(toDOM(newChild), oldChild.target);

            return;

        }

        

        if(newChild.text!==oldChild.text){

            console.log(oldChild.text)

            oldChild.template.target.parentNode.replaceChild(toDOM(newChild), oldChild.target);
               
            return;


        };

        if(notSameLength(newChild.attrs, oldChild.attrs)){

            oldChild.template.target.parentNode.replaceChild(toDOM(newChild), oldChild.target);

            return;

        }

        if(notSameLength(newChild.styles, oldChild.styles)){

            oldChild.template.target.parentNode.replaceChild(toDOM(newChild), oldChild.target);

            return;

        }

        if(isObj(newChild.attrs)){
        for(const [name, value] of Object.entries(newChild.attrs)){

            if(checkProperties(name, value, newChild, oldChild)){

                oldChild.template.target.parentNode.replaceChild(toDOM(newChild), oldChild.target);

                 return;
            
            };

        };

    };


        if(isObj(newChild.styles)){

        for(const [name, value] of Object.entries(newChild.styles)){

            if(checkProperties(name, value, newChild, oldChild)){

                oldChild.template.target.parentNode.replaceChild(toDOM(newChild), oldChild.target);

                return;
           
           };

            

        };
    };

    if(isObj(oldChild.events)){

        for(const _event of Object.keys(oldChild.events)){


            oldChild.template.target[_event]=void 0;

        }

        
          for(const [_event, handler] of Object.entries(newChild.events)){

            oldChild.template.target[_event]=handler;

          };
        


    };
    
};


}


function checkProperties(name, value, oldChild, newChild){

    if(!(name in oldChild.attrs)){

        oldChild.target.setAttribute(name, value);

        return true;

    }

    if(value!==oldChild.attrs[name]){

        
       oldChild.target.setAttribute(name, value);

       return true;
        

    }

    

}

function getGreater(firstArray, secondArray){

    return firstArray.length>secondArray.length ? firstArray : secondArray;

}

function attributeDiffing(target, oldAttributes, newAttributes){

    const _old=Object.keys(oldAttributes),
          _new=Object.keys(newAttributes),
          _greater=getGreater(_old, _new);

    for(let i=0; _greater.length>i ; i++){

        const oldAttr=_old[i],
              newAttr=_new[i];
          
         if(isDefined(oldAttr) && !(oldAttr in newAttributes)){

            target.removeAttribute(oldAttr);

         }     

        if(isDefined(newAttr)){

            if(newAttributes[newAttr]!==oldAttributes[newAttr]){

                target.setAttribute(newAttr, newAttributes[newAttr]);

            }


        }

    }

};

function styleDiffing(target, oldStyles, newStyles){


    const _old=Object.keys(oldStyles),
    _new=Object.keys(newStyles),
    _greater=getGreater(_old, _new);

for(let i=0; _greater.length>i ; i++){

  const oldStyle=_old[i],
        newStyle=_new[i];
    
   if(isDefined(oldStyle) && !(oldStyle in newStyles)){

        target.style.removeProperty(oldStyle)

      

   }     

  if(isDefined(newStyle)){

      if(newStyles[newStyle]!==oldStyles[newStyle]){

          target.style.setProperty(newStyle, newStyles[newStyle])

      }


  }

}

    
}


function eventDeffing(target, oldEvents, newEvents){

    const _old=Object.keys(oldAttributes),
    _new=Object.keys(newAttributes),
    _greater=getGreater(_old, _new);

for(let i=0; _greater.length>i ; i++){

  const oldEvent=_old[i],
        newEvent=_new[i];
    
   if(isDefined(oldEvent) && !(oldEvent in newEvents)){

      target[oldEvent]=void 0;

   }     

  if(isDefined(newEvent)){

    target[newEvent]=newEvents[newEvent];


  }

}



}

function diffingChildren(_new, _old){

    
    

    for(let i=0; i<_new.length; i++){

        

        const newChild=_new[i];
        const oldChild=_old[i];

        const {
            tag:newTag,
            text:newText,
            children:newChildren=[],
            events:newEvents={},
            attrs:newAttrs={},
            styles:newStyles={},
            update=true,
            updateChildren=true
            
        }=newChild;
        
       const {
        tag:oldTag,
        text:oldText,
        children:oldChildren=[],
        events:oldEvents={},
        attrs:oldAttrs={},
        styles:oldStyles={},
        target   

       }=oldChild;

       

            if(!update){

                continue;

            }else if(newChildren.length!==oldChildren.length && updateChildren){

                target.parentNode.replaceChild(toDOM(newChild), oldChild.target);

            }else{

                if(newTag!==oldTag){

                    

             target.parentNode.replaceChild(toDOM(newChild), oldChild.target);

                    continue;

                }

                if(newChildren.length==newChildren && updateChildren){

                    

                    diffingChildren(newChildren, oldChildren);

                }

                if(newText!==oldText){
                    

                target.textContent=oldText;
                       
                    


                };

                
                attributeDiffing(target, oldAttrs, newAttrs);
                styleDiffing(target, oldStyles, newStyles);
                
                

            }
        }
    }