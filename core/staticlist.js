import {

  ParserWarning,
  isDefined,
  isArray,
  isCallable,  
  isObj,
  syErr,
  isEmptyObj,
  err,
  getId,
  valueType

} from "./helpers.js"


function createTypeProp(array, propValue){

    Object.defineProperty(array, "type",{
        get:()=>propValue
    });


}


function toIterable(data){

    if(isArray(data)){

        createTypeProp(data, "Array");

        return data;


    }else if(isObj(data)){

         const array=Object.entries(data);

        createTypeProp(array, "Object");

        return array;

    }else{

        // It is a number.

        const array=new Array();

        for(let i=0; i<data; i++){

            array.push(i);

        };

        createTypeProp(array, "Number");

        return array;

    }


}

function isSupportedData(data){

    return (isArray(data) || isObj(data) || typeof data==="number");

}


export function staticList(options){

    if(!isObj(options)){

        syErr(`
        
        The argument of the "staticList" function must be an object.
        
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
            
            The staticList parsing system found an element with the
            "_forEach" atribute, but its value is an empty string.
            
            `)

        }

        else if(!data.hasOwnProperty(_forEach)){

            ParserWarning(`
            
            "${_forEach}" was not defined as the name of a list.
            
            `)

        }

        else if(isObj(data[_forEach])){

            let {data:iterationData, refs}=data[_forEach];
            const  domParser=new DOMParser();
            let i=-1,  __template=target.innerHTML, parsedTemplate=__template;
             
            if(!isSupportedData(iterationData)){

                syErr(`
                 
                The "data" property in the list named "${_forEach}" must be defined and its value must be either an Array, an Object or
                a number.
                
                `)

             }

            iterationData=toIterable(iterationData);

            if(!isDefined(refs) || !isCallable(refs)){

                syErr(`
                
                The "refs" property in the list named "${_forEach}" must be defined and its value must be a function.
                
                `)

            };

            target.removeAttribute("_forEach");
            target.innerHTML="";

             for(const item of iterationData){

               i++;

               let __refs; 

               if(iterationData.type==="Array"){

                __refs=refs(item, i);

               }else if(iterationData.type==="Object"){

                const [propName, propValue]=item;

                __refs=refs(propName, propValue, i);

               }else{

                //Number.

                __refs=refs(item);

               }

               

               if(!isObj(__refs)){

                syErr(`
                
                The "refs" method must return a plain Javascript object, and not "${valueType(__refs)}".
                
                `)

               }

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