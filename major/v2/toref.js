
import{

    consW,
    isObj,
    syErr,
    array,


} from "./helpers"





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
    
      Object.defineProperty(Node.prototype, "getTextNodes", {
    
        // Read only node property.
    
     get(){
    
        let _childNodes=new Set();
    
        if(this.hasChildNodes())
        
        for(let child of this.childNodes){
    
            if(child.nodeType==3 && child.textContent.trim().length>0){
               
                _childNodes.add(child)
    
                 
            }
    
    
        }
    
        return array.create(_childNodes);
    
        }
    
      })
    
    
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
    
    if(p.getTextNodes.length>0){
    
        for(let text of p.getTextNodes){
    
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
                    
                    if(attr.name!=="value"){
    
                    _register.attrs[attr.name]=attr.value;
                    
                    }else{
                      
                      rparse.specialAttrs.add({
                          target:child,
                          attr:{
                                [attr.name]:attr.value
                          }
                      })
                        rparse.special.add(r);
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
    
    


export function toREF(obj){

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
                private,
                react
            }=obj;
            
            if(isDefined(data)){

                consW(`
               The data property in the argument of the toREF function
                will be removed in version 2.1.0, use the refs property instead. 

                `)

            }

            
  
            const source=isObj(refs) ? refs : isObj(data) ? data : null;
            
            for(r in source){

                if(isCallable(source[r])){

                    source[r]=source[r].call(source);

                }

            }

            const store={
                attrs: new Set(), // Attribute reference.
                text:new Set(), // Text reference.
                specialAttrs: new Set(),
                special: new Set(),
                refs:void 0,
                add(setting,attr){
 
                    // if attr, the parser must register the reference 
                    // as an attribute reference!

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
                noMoreRefs(text){
            
            
                    return !/{\s*.*\s*}/.test(text);
            
                },

                attrValueGetter(refName){

                     let value=Symbol.for("_not_found");

                     for(let a_r of array.create(this.attrs)){


                           let{
                               target,
                               attrs
                           }=a_r;
                           
                           const pattern=new RegExp(`{\\\s\*\(\:\?${refName}\)\\\s\*}`);

                           if(("value" in attrs || "currentTime" in attrs) &&
                           
                           (pattern.test(attrs.value) || pattern.test(attrs.currentTime))
                           
                           ){
                                
                            
                            
                                 
                            if(target.nodeName=="INPUT"){

                                value=target.value;

                            } else if(target.nodeName=="VIDEO"){

                               value=target.currentTime;

                            }
                              
                            /**
                             * We must break the loop
                             *  as soon as we find an attribute reference.
                             * 
                             */

                            break;

                           }
                           
                           


                     }

                     return value;


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
                
                                 v=v.replace(pattern,value);
                            
                                  
                                 


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
                // After updating the text reference, let's update the
                // attribute reference.
            
                if(this.attrs.size>0){
            
                    this.update2();
            
                }

                if(this.special.size>0){
                    this.updateValueAndCurrentTime()
                }
            }
            },
            updateValueAndCurrentTime(){

                for(let s_a of array.create(this.specialAttrs)){

                    const{
                        target,
                        attr
                    }=s_a;

                    let entries=Object.entries(attr)[0],
                    
                    attrName=entries[0],
                    attrValue=entries[1]; 
                    

                    

                    for(let[ref,value] of Object.entries(this.refs)){

                        const pattern=new RegExp(`{\\\s\*\(\:\?${ref}\)\\\s\*}`,"g")

                        attrValue=attrValue.replace(pattern,value);
                          

                        if(this.noMoreRefs(attrValue)){

                            break;

                        }

                    }

                    if(target[attrName]!==attrValue){

                    target[attrName]=attrValue;
                    
                }

                }

            }
            }
            
            refParser(getId(IN),source,IN, store);

            
            
            const reactor=new Proxy(source,{

                set(t,k,v,p){

               if(store.special.has(k)){

                store.updateValueAndCurrentTime();

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
                   }

                   

                },

                get(...args){

                    if(args[1] in source){

                    if(store.attrs.size>0){

                        const returned=store.attrValueGetter(args[1]);
                         const _no=Symbol.for("_not_found");

                         if(returned==_no){

                            // The reference was not registered 
                            // as an attribute reference.

                         return   Reflect.get(...args);

                         }else{

                            // The reference was registered
                            // as an attribute reference.

                            return returned;

                         }


                    }else{

                   return Reflect.get(...args);

                    }

                }else{


                    /**
                     * The user is trying to get
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


            if(!private && react){

            window[react]=reactor;
            
        }else{

            return reactor;

        }


        
        }

    }

}


