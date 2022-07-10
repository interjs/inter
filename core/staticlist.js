import {

  ParserWarning,
  isDefined,
  isANode,
  isArray,
  isCallable,  
  isObj,
  syErr,
  isEmptyObj,
  err,
  getId

} from "./helpers.js"






export function staticList(options){

    if(!isObj(options)){

        syErr(`
        
        The argument of "staticList" function must be an object.
        
        `)

    }

    const {
        in:IN,
        data

    }=options;

    if(typeof IN!=="string"){

        syErr(`
        
        The value of the "in" property in staticList argument must be a string.
        
        `)

    };

    if(!isObj(data)){

        syErr(`
        
        The value of the "data" property in staticList argument must be an object.
        
        `)

    };

    
    if(isEmptyObj(data)){

        err(`
        
        You defined an empty object as the argument of staticList.
        
        `)

    }

    if(isEmptyObj(data)){

        err(`
        
        You defined an empty object as the value of the "data" property in staticList.
        
        `)

    };

    const root=getId(IN);
    const listParser={
        found_forEach:new Set(),
        get [Symbol.toStringTag](){
    
            return "listParser";
    
        },
        find_forEach(node/*HTML Element*/){
    
            const children=node.getElementsByTagName("*");
            
            for(let i=0; i<children.length; i++){
    
                const childNode=children[i];
    
                if(childNode.hasAttribute("_forEach")){
                 
                     this.found_forEach.add({
                         target:childNode,
                         _forEach:childNode.getAttribute("_forEach")
                     });
    
                }
    
            }
    
            for(const item of Array.from(this.found_forEach)){


                list(item);

            }


        }
    }


    listParser.find_forEach(root);

    function list(iterator/*plain object*/){

        const {_forEach, target/*HTML element*/}=iterator;
        

        if(_forEach.trim().length==0){

            ParserWarning(`
            
            the staticList parsing system found an element with the
            _forEach atribute, but its value is an empty string.
            
            `)

        }

        else if(!data.hasOwnProperty(_forEach)){

            ParserWarning(`
            
            "${_forEach}" was not defined as the name of a list.
            
            `)

        }

        else if(isObj(data[_forEach])){

            const {data:iterationData, refs}=data[_forEach];
            const  domParser=new DOMParser();
            let i=-1,  __template=target.innerHTML, parsedTemplate=__template;

            if(!isDefined("refs") || !isCallable(refs)){

                syErr(`
                
                The "refs" property in the list named "${_forEach}" must be defined and its value must be a function.
                
                `)

            };

            if(!isDefined(iterationData) || !isArray(iterationData)){

                 syErr(`
                 
                 The "data" property in the list named "${_forEach}" must be defined and its value must be an array.
                 
                 `)


            }

            target.removeAttribute("_forEach");
            target.innerHTML="";

             for(const item of iterationData){

               i++;

               const __refs=refs(item, i);

               for(const [refName, refValue] of Object.entries(__refs)){


                const rule=new RegExp(`{\\s*${refName}\\s*}`,"g");
                parsedTemplate=parsedTemplate.replace(rule, refValue);

               };

               parsedTemplate=parsedTemplate.replace(new RegExp(`{\\s*_index\\s*}`,"g"),i);

               const producedHTML=domParser.parseFromString(parsedTemplate, "text/html").body.children[0];
               target.appendChild(producedHTML);
               parsedTemplate=__template



             }

        }


        

    }



}