
import {
    isObj,
    syErr,
    isDefined,
    isCallable,
    getId,
    consW,
    
    
     


}  from "./helpers.js";



function hasProp(object){

    return Object.keys(object).length>0;


}


function hasRefs(text){


    return /{\s*.*\s*}/.test(text);

}
 

 function getRefs(text){

    /**
     *
     * @text must be a string containing refs.
     * 
     * This function is used in reference computation,
     * it helps Inter making an eficient reference computation.
     * 
     */

     const ref=/{\s*(:?[\w-\s]+)\s*}/g;
     
     
     const refs=new Set();
        

        text.replace(ref, (plainRef)=>{
            
            const refName=plainRef.replace("{","").replace("}","").trim();
            
            refs.add(refName);


        })


     

         return Array.from(refs); 

     

}



/**
 * 
 * We are considering them as special attributes
 * because we must not use the setAttribute method
 * to set them.
 * 
 */

const specialAttrs=new Set([
        "currentTime", "value",
    ]);



function refParser(p,refs,rparse){


    
     function getTextNodes(el){

    
        

        let _childNodes=new Set();
    
        if(el.hasChildNodes())
        
        for(let child of el.childNodes){
    
            if(child.nodeType==3 && child.textContent.trim().length>0 && hasRefs(child.textContent)){
               
                _childNodes.add(child)
    
                 
            }
    
    
        }
    
        return Array.from(_childNodes);
    
        
     }
    
        const children=p.getElementsByTagName("*");
        
    
        function rChild(parentNode){
    
            
            function runRef(node){
    
                for(let r in refs){
    
                    const pattern=new RegExp(`{\\s*${r}\\s*}`)
                    
                    if(!node.ref &&  node.textContent.trim().length>0 &&
                     pattern.test(node.textContent)  
                    ){
                    
                       const register={
                           target:node,
                           text:node.textContent,
                           
       
                   };
    
                   

                   rparse.add(register);
    

    
                }
    
            }
        }
            
             if(parentNode.nodeType==1){

            for(let node of parentNode.childNodes){
    
                if(node.hasChildNodes() && node.nodeType==1){
                  
                    rChild(node);
                    continue;
                     
                }
    
                runRef(node)
    
        }
        } else if(parentNode.nodeType==3){
    
              // Parsing the references
              // in the main container's 
              // text nodes.
    
              runRef(parentNode);
    
              
    
        }
    }
    
    if(getTextNodes(p).length>0){
    
        for(let text of getTextNodes(p)){
    
        rChild(text);
        
    
        }
    
    }
        
        for(const child of children){ 
    
            
            const _register={
                target:child,
                attrs:Object.create(null),
                refs:refs
            }
    
            for(const attr of child.attributes){
    
                 for(const r in refs){
                     const pattern=new RegExp(`{\\s*${r}\\s*}`)
                  if(pattern.test(attr.value)){
                
                    if(!specialAttrs.has(attr.name)){
    
                        
                    _register.attrs[attr.name]=attr.value;
                    
                    }else{
                      
                      rparse.specialAttrs.add({
                          target:child,
                          attr:{
                                [attr.name]:attr.value
                          }
                      })

                      
                        
                    }
                    
                    
                  }
    
                 

            }
            
            }
    
    
            if(hasProp(_register.attrs)){
    
                rparse.add(_register, true);
    
                // The true argument says to the parser
                // to register the reference as an attribute reference.
    
            }
    
            if(child.hasChildNodes()){
          
              const nodes=child.childNodes;
              
              for(const node of nodes){
    
                if(node.hasChildNodes()){
                   
                    rChild(node);
                    continue;
    
                
    
                }
    
                
    
                for(const r in refs){
    
                    const pattern=new RegExp(`{\\s*${r}\\s*}`)
                    
                 if(!node.ref && node.textContent.trim().length>0 &&
                  pattern.test(node.textContent)  
                 ){
                 
                    
                    const register={
                        target:node,
                        text:node.textContent,
                        
    
                }
    
             
      
              rparse.add(register)
                
            }
        }
    }
    
            }else{
    
                
    
            const text=child.textContent;
            
            const register={
                target:child,
                text:text,
                
            };
            
            for(let r in refs){
    
                const pattern=new RegExp(`{\\s*${r}\\s*}`)
    
                if(!child.ref && pattern.test(text)){
    
                rparse.add(register);

                
                    
                    
                    
    
                }
    
            }
           
           
          
    
        
    
    
}
    
    
    
    
    
    

}


    rparse.update()
    
}

    
    


export function Ref(obj){

    if(new.target!=void 0){

        syErr(`
        
        Do not call the Ref function with the new keyword.

        `)

    }else{

        if(!isObj(obj)){

            syErr(`
            
            The argument of Ref must be a plain object.

            `)

        }else{

            const{
                in:IN,
                data,
                
            }=obj;
            
            if(!(typeof IN==="string")){

                syErr(`
                The value of "in" property in the Ref function must be a string.
                
                `)

            };

            if(!isObj(data)){

                syErr(`
                The value of "data" property in the Ref funtion must be a plain Javascript object.
                
                `)

            }

            

  
            
            
            for(const r in data){

                if(r=="setRefs" || r=="observe"){

                    consW(`
                    
                    "${r}" is a reserved property, you can use it
                    as the reference name.
                    
                    `);

                    continue;

                }

                if(isCallable(data[r])){

                    data[r]=data[r].call(data);

                }

            }

            const proxyTarget=Object.assign({}, data);
            const store={
                attrs: new Set(), // Attribute reference.
                text:new Set(), // Text reference.
                specialAttrs: new Set(),     
                observed:new Map(),          
                refs:proxyTarget,
                add(setting,attr){
 
                    // if attr, the parser must register the reference 
                    // as an attribute reference.

                    if(attr){

                        this.attrs.add(setting)

                        if(!this.refs && setting.refs){

                            this.refs=setting.refs;

                        }

                    }else{

                        this.text.add(setting);
                        
                        if(!this.refs && setting.refs){

                            this.refs=setting.refs;
                        }

                    }
            
                     
                  },
                
                updateSpecialAttrs(){


                    for(let special of Array.from(this.specialAttrs)){

                        if(special.target.hasAttribute("value")){

                            special.target.removeAttribute("value");

                        }else{

                            if(special.target.hasAttribute("currentTime")){

                                special.target.removeAttribute("currentTime");

                            }

                        }
                     
                        const  sp=Object.entries(special.attr)[0];

                
                        
                        

                        const refs=getRefs(sp[1]);

                        

                        for(let ref of refs){

                            
                            const pattern=new RegExp(`{\\\s\*\(\:\?${ref}\)\\\s\*}`,"g");
                            special.target[sp[0]]=sp[1].replace(pattern, this.refs[ref]);


                        }
                        
                        



                    }

                },
                update2(){
            
                    // This is the attribute reference updater.
            
                    for(const a_r of  Array.from(this.attrs)){
            
                        let{
                            target,
                            attrs,
                            
                        }=a_r;

               
            
                        for(let [name,v] of Object.entries(attrs)){
            
                            const refNames=getRefs(v);

                            
                            for(let refName of refNames){
            
                                if(refName in this.refs){
                                

                             
                                const pattern=new RegExp(`{\\\s\*\(\:\?${refName}\)\\\s\*}`,"g")
                
                                 v=v.replace(pattern,this.refs[refName]);
                            
                                  
                                 


                                }
                            }
                            
                            
                            
                  
                            if(target.getAttribute(name)!==v){
                            
                                target.setAttribute(name,v);

                            }
            
                            
            
                        }
            
                    

                    }
            
                },
                update(){
            
                    // This is the text reference updater.
            
                    if(this.text.size>0){
            
                        

                    for(const t_r of  Array.from(this.text)){
            
                        let {
                            target,
                            text,
                            
                            
                        }=t_r;

                        // Returns the ref's Names
                         // in the string "text".                  
                        const refNames=getRefs(text);


                    for(const refName of refNames){
            
                        
                        
                        if(refName in this.refs){
                      
                        const pattern=new RegExp(`{\\\s\*\(\:\?${refName}\)\\\s\*}`,"g")
                        
                       if(isDefined(text)){     
                        
                        text=text.replace(pattern, this.refs[refName]);
                      
                    
                     
                    
                        }
                    }

                    }
                        if(isDefined(text)){
                            
                      if(target.textContent!==text){

                        target.textContent=text;
                      }

                        }
            
                
            
            }
                
            }

            // After updating the text reference, let's update the
                // attribute reference.
                
                if(this.attrs.size>0){
            
                    this.update2();
            
                }

                if(this.specialAttrs.size>0){
                    
                    this.updateSpecialAttrs();

                }
            }
            }
            
            

            
            

            refParser(getId(IN),proxyTarget, store);

            const reactor=new Proxy(proxyTarget,{

                set(t,k,v,p){

               const oldValue=t[k];     
               
                    if(isCallable(v)){

                        v=v.call(p);
                
                        Reflect.set(t,k,v,p);

                    }else{
      
                   Reflect.set(t,k,v,p);
                    
                }

                
                if(store.observed.size==1){

                    const callBack=store.observed.get("callBack");

                    callBack(k,v, oldValue);

                    }

                    

               if(store.specialAttrs.has(k)){

                store.updateSpecialAttrs();

               }
                
                   if(!(k in t)){
                    
                    // Dynamic ref.

                    refParser(getId(IN),proxyTarget,store)



                   }else{
                   store.update();
                   return true;

                   }

                   

                },

                get(...args){

                    


                   return Reflect.get(...args);

                    

            }

            })

            

            Object.defineProperties(reactor, {

                setRefs:{

                set(o){

                    if(isObj(o)){

                        
                        for(const [refName,refValue] of Object.entries(o)){

                            if(refName=="observe" || refName=="setRefs"){

                                consW(`
                                
                                "${refName}" is a reserved property, you can not
                                use it as the reference name.
                                
                                `)

                                continue;

                            }

                            const oldRefValue=data[refName];
                            
                            if(isCallable(refValue)){

                            proxyTarget[refName]=refValue.call(reactor);

                            }else{
                           
                            proxyTarget[refName]=refValue;

                            }

                                
                            if(store.observed.size==1){

                                const callBack=store.observed.get("callBack");
            
                                callBack(refName, refValue, oldRefValue);
            
                                }

                        }

                        

                        store.update();

                    }

                }
            },
            observe:{

                value(callBack){

                    if(!isCallable(callBack)){


                        syErr(`
                        
                        The argument of [Reference reactor].observe() must be a function.
                        
                        
                        `)

                    };

                    if(store.observed.size===0){

                        store.observed.set("callBack", callBack);

                        return true;

                    }

                    return false;
                    



                }

            }

            });


            return reactor;

        


        
        }

    }

}

            


