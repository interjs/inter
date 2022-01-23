
import {

    consW,
    isObj,
    syErr,
    array,
    isDefined,
    isCallable,
    getId,
    hasProp,
    ParserWarning,
    
     


}  from "./helpers.js"



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


     

         return array.create(refs); 

     

}



/**
 * 
 * We are considering them as special attributes
 * because we must not use the settAttribute method
 * to set them.
 * 
 */

const specialAttrs=new Set([
        "currentTime", "value",
    ]);



function refParser(p,refs,name,rparse){


    
    /**
     *  There will be time
     *  that we can write something like this:
     * 
     *  <div>
     * 
     * <strong>Hi</strong>, { name }! Are you fine?
     * </div>
     * 
     * If we run this code in an app that
     * uses Inter v1, the reference will not
     * be parsed. And we must solve this in v2.
     * 
     * Usually the browser interprets space as a childNode,
     * in the above code, the div container has
     * two childNodes,a tag(strong) and a text.
     * 
     * 
     */
    
     function getTextNodes(el){

    
        

        let _childNodes=new Set();
    
        if(el.hasChildNodes())
        
        for(let child of el.childNodes){
    
            if(child.nodeType==3 && child.textContent.trim().length>0 && hasRefs(child.textContent)){
               
                _childNodes.add(child)
    
                 
            }
    
    
        }
    
        return array.create(_childNodes);
    
        
     }
    
        const children=p.getElementsByTagName("*");
        const notUsed=new Set();
        const used=new Set();
    
        function rChild(parentNode){
    
            
            function runRef(node){
    
                for(let r in refs){
    
                    const pattern=new RegExp(`{\\s*${r}\\s*}`)
                    
                    if(node.textContent.trim().length>0 &&
                     pattern.test(node.textContent)  
                    ){
                    
                       const register={
                           target:node,
                           text:node.textContent,
                           refs:refs,
       
                   };
    
                   rparse.add(register);
    
                   if(notUsed.has(r)){
    
                      notUsed.delete(r);
                      used.add(r)
    
                   }else if(!used.has(r)){
                    
                    used.add(r)
    
    
                   }
    
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
        
        for(let child of children){
    
            
            const _register={
                target:child,
                attrs:Object.create(null),
                refs:refs
            }
    
            for(let attr of child.attributes){
    
                 for(let r in refs){
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
                    if(notUsed.has(r)){
                        notUsed.delete(r)
                    }
    
                    if(!used.has(r)){
    
                        used.add(r)
    
                    }
                    
                  }else{
    
                    if(!used.has(r)){
                    notUsed.add(r);
                    }
    
                  }
    
                 
            }
            }
    
    
            if(hasProp(_register.attrs)){
    
                rparse.add(_register, true);
    
                // The true argument says to the parser
                // to register the reference as an attribute reference.
    
            }
    
            if(child.childNodes.length>0){
          
              const nodes=child.childNodes;
              
              for(let node of nodes){
    
                if(node.hasChildNodes()){
                   
                    rChild(node);
                    continue;
    
                
    
                }
    
                
    
                for(let r in refs){
    
                    const pattern=new RegExp(`{\\s*${r}\\s*}`)
                    
                 if(node.textContent.trim().length>0 &&
                  pattern.test(node.textContent)  
                 ){
                 
                    
                    const register={
                        target:node,
                        text:node.textContent,
                        refs:refs
    
                }
    
                if(notUsed.has(r)){
    
                    notUsed.delete(r);
    
                }
    
                if(!used.has(r)){
    
                    used.add(r);
    
                }
    
                rparse.add(register)   
                
                
    
            }else{
    
                if(!used.has(r)){
                notUsed.add(r)
                }
    
            }
        }
    
        
    
              }
    
                
    
    
    
            }else{
    
                
    
            const text=child.textContent;
            
            const register={
                target:child,
                text:text,
                refs:refs
                
            };
            
            for(let r in refs){
    
                const pattern=new RegExp(`{\\s*${r}\\s*}`)
    
                if(pattern.test(text)){
    
                rparse.add(register);
                    
                    if(notUsed.has(r)){
    
                        notUsed.delete(r);
    
                    }
    
                
                    
                    
    
                }
    
            }
           
           
          
    
        }
    
    }
    
    if(notUsed.size>0){
    
        
        ParserWarning(`
        
        It was not found ${notUsed.size} ${notUsed.size==1 ? "reference" : "references"}
        you are trying to register.
    
        {${Array.from(notUsed)}}
        
        `)
    
        notUsed.clear();
        used.clear();
    
    }
    
    
    
    rparse.update(name)
    
    
    
    
    }
    
    


export function toRef(obj){

    if(new.target!=void 0){

        syErr(`
        
        Do not call toREF with the new keyword.

        `)

    }else{

        if(!isObj(obj)){

            syErr(`
            
            The argument of toREF must be a plain object.

            `)

        }else{

            const{
                in:IN,
                refs,
                data,
                react
            }=obj;
            
            if(isDefined(data)){

                consW(`
               The data property in the argument of the toREF function
                will be removed in version 2.1.0, use the refs property instead. 

                `)

            }

            
  
            const source=isObj(refs) ? refs : isObj(data) ? data : null;
            
            for(let r in source){

                if(isCallable(source[r])){

                    source[r]=source[r].call(source);

                }

            }

            const store={
                attrs: new Set(), // Attribute reference.
                text:new Set(), // Text reference.
                specialAttrs: new Set(),               
                refs:void 0,
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


                    for(let special of array.create(this.specialAttrs)){

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

                            
                            const pattern=new RegExp(`{\s*${ref}\s*}`, "g");
                             
                            special.target[sp[0]]=sp[1].replace(pattern, this.refs[ref]);


                        }
                        
                        



                    }

                },
                update2(){
            
                    // This is the attribute reference updater.
            
                    for(let a_r of  array.create(this.attrs)){
            
                        let{
                            target,
                            attrs,
                            
                        }=a_r;

               
            
                        for(let[name,v] of Object.entries(attrs)){
            
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
            
                        

                    for(let t_r of  array.create(this.text)){
            
                        let{
                            target,
                            text,
                            
                            
                        }=t_r;

                        // Returns the ref's Names
                         // in the string "text".                  
                        const refNames=getRefs(text);
                        

                    for(let refName of refNames){
            
                        
                        
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
            
            refParser(getId(IN),source,IN, store);

            
            
            const reactor=new Proxy(source,{

                set(t,k,v,p){

               if(store.specialAttrs.has(k)){

                store.updateSpecialAttrs();

               }
               
                    if(isCallable(v)){

                        let returned=v.call(p);
                
                        Reflect.set(t,k,returned,p);

                    }else{
      
                   Reflect.set(t,k,v,p);
                    
                }

                
                   if(!(k in t)){
                    
                    // Dynamic ref.

                    refParser(getId(IN),source, IN,store)



                   }else{
                   store.update();
                   return true;

                   }

                   

                },

                get(...args){

                    if(args[1] in source){


                   return Reflect.get(...args);

                    

                }else{


                    /**
                     * There is an attempt to get
                     * a property that was not registered as reference.
                     * We should return undefined.
                     */

                     return void 0;

                }
            }

            })

            

            Object.defineProperty(reactor, "setRefs",{

                set(o){

                    if(isObj(o)){

                        
                        for(let[refName,refValue] of Object.entries(o)){

                            
                            if(isCallable(refValue)){

                                source[refName]=refValue.call(reactor);

                            }else{
                           
                            source[refName]=refValue;

                            }

                        }

                        

                        store.update();

                    }

                }

            })


            if(react){

            window[react]=reactor;
            
        }else{

            return reactor;

        }


        
        }

    }

}


