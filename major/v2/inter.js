/**
 * 
 * Inter framework
 * Mit lincesed by Denis Power
 * Version: 2.0.0
 * 2021-2022
 * 
 */









 (function(){

// Helper functions.

 function isObj(o){

// For plain objects.    

  return (Object.prototype.toString.apply(o, void 0)
  =="[object Object]"
  )

 }
 
 function isDefined(t){

    return t!=void 0;


 }

 /**
  * Indirect boolean value checking can cause
  * unexpected result, that's why I am using direct 
  * checking here.
  * 
  */
 function isTrue(v){

    return Object.is(v,true);

 }

 function isFalse(v){

    return Object.is(v,false);

 }


 function isCallable(fn){

    return typeof fn=="function";

 }

 function hasProp(obj){

    if(isObj(obj)){

        return Object.keys(obj).length>0;

    }

 }

 function hasNodeChild(p){

    if("noType" in p && p.nodeType==1){

        const children=p.childNodes.length>0;

        return children;

    }

 }



 function getId(id){

    const el=document.getElementById(id);
    
    if(el==null){

        syErr(`
        
        There's not an element in the document by id "${id}".

        `)

    }else{

        return el;

    }

 }

 function valueType(val){

     if(
        typeof val=="undefined" ||
        typeof val=="symbol" ||
        typeof val=="bigint" ||
        typeof val=="boolean" ||
        typeof val=="function" ||
        typeof val=="number" ||
        typeof val=="string"
    ){


        return typeof val;

    }else{

        /**
         * 
         * @val may be array, plain object or even
         * a native Javascript object,
         * let's check with the Object.type() method.
         * 
         */

         return Object.type(val)


    }


 }


// WARNINGS HELPERS

function syErr(err){

    throw new SyntaxError(err);

}

function err(e){

    throw new Error(e)

}

function consW(w){

    console.warn(w);

}

function ParserWarning(w){

    console.error(`

    Parser error: ${w}
    
    `)

}

//


function ARRAY(){

    if(new.target==void 0){

        throw new Error("ARRAY must be called withe the 'new' keyword")

    }

    this.create=itens=>{

        return itens==void 0 ? new Array() : Array.from(itens);


    },
    this.is=function(a){

        return Array.isArray(a);

    },

    this.distroy=function(arr){

        if(this.is(arr)){

            let length=arr.length;

            while(length--){

                arr.pop();

            }

        }

    },

    this.isEmpty=function(arr){

        if(this.is(arr)){

            return true;

        }else{

             return false;

        }

    }


}

function DOMMUTATION(el){

    this.target=el;
    this.mutated=false;
    
    for(let method of ["appendChild","replaceChild","removeChild"]){

        this.mutate(method);

    }

    for(let method of [
        {native:"appendChild", _new:Symbol.for("_add")},
        {native:"replaceChild", _new:Symbol.for("_replace")},
        {native:"removeChild", _new:Symbol.for("_remove")}
    ]){
        this.intermethods(method);
    }

    //let's now say to the Observer that the actual
    // element is mutated.

    this.mutated=true;

}



DOMMUTATION.prototype.mutate=function(method){

    if(this.target && !this.mutated){
    
        

        Object.defineProperty(this.target, [method],{

            value(){

                consW(`
                
                Inter is working on [${this}], and Inter mutated it,
                so that you can not mudify it. 

                `)

            }

        })

    }
}
    DOMMUTATION.prototype.intermethods=function(obj){

        if(this.target &&!this.mutated){

               
            Object.defineProperty(this.target, obj._new, {

                value(){

                  Node.prototype[obj.native].call(this,...arguments);        

                }

            })

        }

    }


function ATTRMUTATION(target){

    /**
     * Attribute manager.
     * 
     * @setAttribute and @removeAttribute methods.
     * 
     * 
     */


    if(new.target==void 0){


    }else if(!target.attrMutated){

    

        for(let attr of [
         {
            native:"setAttribute", _new:Symbol.for("set")
        },{
            native:"removeAttribute", _new:Symbol.for("remove")
         }
    ]){

        Object.defineProperty(target, attr.native,{
            
            value(){

                err(`
                
                Inter is work on [${this}]'s attributes, so Inter mutated
                it so that you can not mudify it.
                
                `)

            }
        })

    }

    Object.defineProperty(target, attr._new, {

        value(){

            HTMLElement.prototype.removeAttribute.call(this,...arguments);

        }

    })

    // Let's now
    // indicate that the element is mutated, 
    // by setting the attrMutated property to true.

    Object.defineProperty(target,"attrMutated", {
        
        value:true,
        writable:!1,
        configurable:!1
    })
    

}


}




    Object.type=(val)=>{

    // All Javascript objects.

     const isAnobject=(
        
        isDefined(val) &&
        
        Object.prototype.toString.call(val).startsWith("[object")
         
         );


         if(isAnobject){

          return ( Object.prototype.toString.call(val).replace("[object","")
          .replace("]","").replace(/\S/g,"").toLowerCase()
          
          );


         }else{

            /**
             * @val is null.
             * 
             */

             return "null";


         }


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

const array=new ARRAY();




//The app

let appStatus="development";

const app={

    get version(){

        return "2.0.0"

    },

   set status(v) {

    if(this.status.toLowerCase()=="development"){

    
      if(v.toLowerCase()=="production"){



      }else{

        //Error

      }

   }

},

get status(){

    return appStatus;

}

}

//




function toHTML(obj){

    /**
     *  When the developer calls this function
     * we must warn it, from version
     * 2.0.0 we renamed it as toREF(), but
     * we will continue supporting it until
     * v2.1.0
    */ 


    consW(`
    Since version 2.0.0 we renamed
    toHTML to toREF, so starting using toREF instead of
    toHTML. toHTML will be removed in version 2.1.0
    `)

    return toREF(obj);

}


function toREF(obj){

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
 * two childNodes, a tag(strong) and the a text.
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


function hasUndeepChild(e){

    return e.getElementsByTagName("*").length>0

}

function renderIf(obj){

    // This function is a replacement
    // for Inter.renderIf()
    // Inter.renderIf() was removed since version 2.0.0.

    if(new.target!=void 0){



    }else{

        const{
            in:IN,
            cond,
            react,
        }=obj;

        let index=-1;
        const theContainer=getId(IN);
        const children=theContainer.children;
        const els=new Set();


        function deepIfs(el){

            
            

                //Nested children.

                const nodes=el.childNodes;

                let _index=-1;
                for(let node of nodes ){

                    if(node.nodeType==1){

                    _index++;
                    }

                    if(node.hasChildNodes()){

                        deepIfs(node);

                    }

                    const setting={
                        target:node,
                        if:void 0,
                        else:void 0,
                        i:_index,
                        root:node.parentNode,
                    }

                    

                    if(node.nodeType==1){

                    

                        let sibling=node.nextElementSibling;

                        
                        if(node.hasAttribute("_else") && !node.hasAttribute("_if")){


                ParserWarning(`
                                
                It was found an element with an "_else" attribute,
                but there is not an element by attribute "_if" before it.

                `)

                       }

                        if(node.hasAttribute("_if")){

                            
                            if(node.hasAttribute("_else")){

                                ParserWarning(`
                                
                                It was found an element which has simultaneousilly
                                the "_if" and "_else" attribute. It's forbidden.
                                
                                `)
            
                                return false;
            
                            }
                            setting.if=node.getAttribute("_if");
                            node.removeAttribute("_else");

                            
                     
                    
                        }

              if(sibling && sibling.hasAttribute("_else")){


                
                if(sibling.hasAttribute("_if")){
            
                    ParserWarning(`
                    
                    It was found an element which has simultaneousilly
                    the "_if" and "_else" attribute. It's forbidden.
                    
                    `)
                    return false;
                }

                
                            
                            setting.else=sibling;

                            sibling.removeAttribute("_else");

            


                        }if(setting.if){

                            els.add(setting);

                        }






                    }

            

            }
            

        }

        for(let child of children){

            index++;

            const setting={
                target:child,
                if:void 0,
                else:void 0,
                i:index,
                root:theContainer
            }


           const sibling=child.nextElementSibling;
            
            if(child.hasChildNodes()){

                deepIfs(child)
                

            }

            if(child.hasAttribute("_else") && !child.hasAttribute("_if")){


                ParserWarning(`
                                
                It was found an element with an "_else" attribute,
                but there is not an element by attribute "_if" before it.

                `)

                return false;

            }
            

             if(child.hasAttribute("_if")){
             
                if(child.hasAttribute("_else")){

                    ParserWarning(`
                    
                    It was found an element which has simultaneousilly
                    the "_if" and "_else" attribute. It's forbidden.
                    
                    `)

                    return false;

                }

                setting.if=child.getAttribute("_if");
                child.removeAttribute("_if");
                
                

            }  if(sibling && sibling.hasAttribute("_else")){


                
                if(sibling.hasAttribute("_if")){

                    ParserWarning(`
                    
                    It was found an element which has simultaneousilly
                    the "_if" and "_else" attribute. It's forbidden.
                    
                    `)

                    return false;
                }

                setting.else=sibling;
                sibling.removeAttribute("_else");

   


            } if(setting.if){

                els.add(setting)


                

            }

        }


        const reactor=parseConditionalRendering(cond,els);

        

        return reactor;
    }

    



}


function parseConditionalRendering(cond,els){

    const toArray=array.create(els);

    function run(){

        for(let el of toArray){

            const{
                target,
                if:IF,
                else:ELSE,
                i,
                root
            }=el;

            

            if(isFalse(cond[IF])){

                
                

              if(target.parentNode==root && !ELSE){   

             root.removeChild(target)

             

              }else if(ELSE){

                if(root.children[i] && root.children[i].isSameNode(ELSE)){

                }else{

                    if(target.parentNode==root){

                root.replaceChild(ELSE,target);

                    }

                }

              }



            }else{
                
                
                 if(root.children[i]){

                    const el=root.children[i];

                    
                     if(el.isSameNode(target)){
                       
                        // No need to update the interface.
                        
                    }
                    else if(ELSE && ELSE.parentNode!=null){

                        

                        root.replaceChild(target,ELSE)

                        

                    }
                    
                    else{

                    root.insertBefore(target,el);

                    }

                } 
         

                else{

                    root.appendChild(target)

                }


            }


    

    }
    
}

run();

const reactor=new Proxy(cond,{

    set(...args){

        if(!(args[1] in cond)){
 
            

            return false;

        }

        Reflect.set(...args)

        run();

        if(observer.has(args[1])){



            observer.get(args[1]).call({

                stopObserving(){

                    observer.delete(args[1])

                }

            }, args[2]);

        }

    },

    deleteProperty(...args){

        

    }

})

const observer=new Map();

Object.defineProperty(reactor, "observe",{

    value(prop, fn){

        if(observer.has(prop)){

            return false;
        }

        else if(!(prop in this)){

            consW(`
            
            "${prop}" is not a conditional property.

            `)

        }else if(typeof fn!=="function"){

            consW(`
            
           The second argument of [renderIf reactor].observe(),
           must be a function.
            
            `)

        }else{

                observer.set(prop, fn);

        }

    },
    enumerable:!1,
    configurable:!1

})

return reactor;

}

const list=renderList

function template(obj){

    const{
        elements
    }=obj;
    
    
     

     function createChildren(father, childrenArray){
    

        

        for(let child of childrenArray){
            
            
            const{
                tag,
                text,
                attrs={},
                events={},
                renderList,
                styles={},
                children=[],
            }=child;
        
        
            if(tag==void 0){
        
                continue;
        
            }
        
            const _child=document.createElement(tag);
            _child._events=Object.create(null);
        

 

             Object.entries(attrs).forEach((attr)=>{
                 
                const[name,value]=attr;
        
                if(isDefined(value)){
                    
        
                    if(isCallable(value)){
        
                    _child.setAttribute(name,value());
                    
                }else{
               
                    _child.setAttribute(name,value);
        
                }
        
                }
        
             })
        
             Object.entries(events).forEach((ev)=>{
        
                const[name,handler]=ev;
        
                if(!name.startsWith("on")){
        
                    syErr(`
                    
                    Every HTML event must start with on. And
        
                    ${name} does not.
        
        
                    `)
        
                }
        
        
                if(isDefined(handler)){
        
                    _child[name]=handler;
                    _child._events[name]=handler;
        
                }
        
             })
        

        Object.entries(styles).forEach((style)=>{

            const[name,value]=style;

            if(isDefined(value)){

                if(isCallable(value)){

                    _child.style[name]=value()

                }else{

                    _child.style[name]=value;

                }

            }


        })

        if((isDefined(text) 
        && !hasProp(renderList) && children.length==0
        )){
         
            if(isCallable(text)){

            _child.appendChild(

                document.createTextNode(TEXT())
            )

        }else{

            _child.appendChild(

                document.createTextNode(text)

            )

        }
    }

    
        father.appendChild(_child);

        if(children.length>0 && !hasProp(renderList)){

        createChildren(_child,children);
        new DOMMUTATION(_child);
        }else if(hasProp(renderList)){

            
            const{
                each,
                do:_DO,
            }=renderList;

            list({
                in:_child,
                data:each,
                do:_DO
            })

        }
    }

    }


    
     
    
    
        const{
            tag,
            text,
            attrs={},
            events={},
             renderList={},
            styles={},
            children=[],
        }=elements[0];
    
    
        if(tag==void 0){
    
            return false;
    
        }
    
        
    
        const container=document.createElement(tag);
         
    
         Object.entries(attrs).forEach((attr)=>{
             
            const[name,value]=attr;
    
            if(isDefined(name)){
    
                if(isCallable(value)){
    
                container.setAttribute(name,value());
                
            }else{
           
                container.setAttribute(name,value);
    
            }
    
            }
    
         })
    
         Object.entries(events).forEach((ev)=>{
    
            const[name,handler]=ev;
    
            if(!name.startsWith("on")){
    
                syErr(`
                
                Every HTML event must start with "on". And
    
                ${name} does not.
    
    
                `)
    
            }
    
            container[name]=(ev)=>{handler(ev)};
            container.render=true;
            
    
         })
    
    
    
         Object.entries(styles).forEach((style)=>{
    
            const[name,value]=style;
    
            if(isDefined(value)){
    
                if(isCallable(value)){
    
                container.style[name]=value()
    
                }else{
    
                    container.style[name]=value;
    
                }
    
            }
    
    
         })


    
         if(isDefined(text)){
        
            if(isCallable(text)){
            container.appendChild(
    
            document.createTextNode(text)
    
            )
            }else{
    
                container.appendChild(
    
                    document.createTextNode(text)
    
                )
    
            }
         }
    
         if(children.length>0 && !hasProp(renderList)){
    
       createChildren(container, children);

       new DOMMUTATION(container);
    
        }else  if(isDefined(renderList)){

            const{
                each,
                do:_DO
            }=renderList;

            list({
                in:container,
                data:each,
                do:_DO
            });

        }
    
        
    
        
    
    
     
    
     
    
     return  container;
    
    
    
        }


        function makeReactive(obj, call){

            
          

            if("___" in obj && obj["___"]==true){
          
              // The properties of "obj" object are already reactive,
              // so we should ignore any attempt to make them reactive once more.
        
              
              
              return false;
          
            }

          
            
          
          
           const share=Object.assign({},obj)   
          const properties=Object.keys(obj);
          
          for(let key of properties){
          
              
          
              if(key=="defineProps"){
                    
                  delete obj[key];
                  delete share[key];
                  
                  consoleWarnig(`
                  "defineProps" is a reserved property in the objects that are the values
                  of data array in renderList().
                  
                  `)
          
              }
          
          

            
          Object.defineProperty(obj,[key],{
          set(value){

            share[key]=value;
           
           call()
           
            
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

    

        function renderList(obj){

            if(new.target!=void 0){


            }
            else if(!isObj(obj)){


            }else{

                let{
                    in:IN,
                    data,
                    do:DO,
                }=obj;

              let _root;
              let pro;

              
    // The Internal mutation methods.

    const add=Symbol.for("_add");
    const remove=Symbol.for("_remove");  

           if(array.is(data)){


            function proSetup(){
    
     
         pro=new Proxy(data,{
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

    Object.defineProperty(pro, "$$$",{
        enumerable:!1,
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
     runUpdate();

     }


     return removed;
    


   }
}
   )

   Object.defineProperty(pro, "unshift",{

    value(){

        
    const added=Array.prototype.shift.apply(data, arguments);
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
    
    
    runUpdate();

    }

   })

   Object.defineProperty(pro, "splice",{

    value(start, end, ...itens){

        const spliced=Array.prototype.splice.apply(data,arguments);
        

        if(itens.length==0){

            let from=start;
            const to=end;

            for(; from<to; from++){

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

  runUpdate()
  
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


         data=value;

         removeAndAddChildren();

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

if(!array.is(data)){

}

if(!isCallable(DO)){



}else{


    const root=IN.nodeType==1 ? IN :  getId(IN);
    _root=root;
    new DOMMUTATION(root);

    for(let _obj of data){
        
        if(isObj(_obj)){
         
     makeReactive(_obj, runUpdate);

}
}

function runUpdate(){


    data.forEach((item,i)=>{

        const el=DO.call(pro,item,i);

        calculateUpdate(el,_root,i);

    })


}

function removeAndAddChildren(){

   // When the data array is redefined
   // with the otherArray method.


    let len=root.children.length;

    while(len){
        
        len--;

        root[remove](root.children[len]);
    }
    

    data.forEach((item,i)=>{

        const el=DO.call(pro,item,i);

        root[add](el);

    })


}




   function Work(){
  
       
   
    if(data.length<root.children.length){


         let len=root.children.length;

        while(len>data.length){

            len--;

          root[remove](remove.children[len]);

        }

        runUpdate();

        return false;

    }


    
    data.forEach((item, i)=>{
    

  const el=DO.call(pro, item, i);
    

   if(!isDefined(root.children[i])){
    
    
     
        
    

        root[add](el)
           
       
    
    }else{


        /**
         * 
         * If this block run, 
         * the user call renderList more than once 
         *  in the same container, if he called it
         * once, the container probably has children
         * and we have just to look for difference between
         * the old child and the new child.
         * 
         */

        calculateUpdate(el, root, i);

    }
 
    })

   
    
    
    
   
    


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
 
     else if(deeplyNotIqualElements(value, father)){
 
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
         
         if(hasUndeepChild(_new) && hasUndeepChild(_old)){
 
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

 function toATTR(obj){


    

    if(!isObj(obj)){
        
        syErr(`
        The argument of "toATTR()" function must be an object.
        `)

    }else{

  const{
      in:IN,
      data,
      react
      
  }=obj;
  
  const root= getId(IN)
               

  if(!isObj(data)){

syErr(`

data in toATTR() must be an object.
`
)

  }else{
      
  return findAttrManager(root,data,react);



    }





 }
}

 function findAttrManager(rootElem, attrManagers,react){
   
    const keys=Object.getOwnPropertyNames(attrManagers);
    const children=rootElem.getElementsByTagName("*");
    const reactors=Object.create(null);

    for(let child of children){
        
        if(child.attributes.length==1){
          
            const theAttr=child.attributes[0].name;
             
            for(let key of keys){
        
            const pattern=new RegExp(`{...${key}}`);

            if(pattern.test(theAttr)){

              const copy=Object.assign({},attrManagers[key])
              child.removeAttribute(theAttr);

              /**
               * Mutating the @setAttribute and @removeAttribute
               * method on the child element.
               * 
               */

               new ATTRMUTATION(child);

              const reactor=spread(child,copy,key,attrManagers[key]);

              if(!react){

              reactors[Object.keys(reactor)[0]]=Object.values(reactor)[0];
              
              }else{

                globalThis[Object.keys(reactor)[0]]=Object.values(reactor)[0];

              }

                break;
            }
       
        
        }
    }
    }



    return reactors;
    
    }


    function spread(el,attrs, attrManager, original){

    

        //Internal methods
        
        const setAttribute=Symbol.for("set");
        const removeAttribute=Symbol.for("remove");


        //<>//

         // Spreading the attributes.
        for( const[attrName, attrValue] of Object.entries(attrs)){
             

            
                 if(attrValue!=void 0 && !attrName.startsWith("on")){
                
                 el[setAttribute](attrName,attrValue);

                 }else{
                     
                     if(attrName.startsWith("on") && isCallable(attrValue))
                    
                     el[attrName]=function(e){
                          attrValue.call(original,e);
                     }
                     }
                 
                 
                 
            
        }

        //</>//


        for(let attrName of Object.keys(original)){

            
            Object.defineProperty(original,attrName,{
                set(v){
                
                    if(v==void 0){

                        if(!attrName.startsWith("on")){

                            el[removeAttribute](attrName);

                        }else{

                            el[attrName]=void 0;
                        }

                    }else{

                        if(!attrName.startsWith("on") && attrName!=="value"){

                          el[setAttribute](attrName,v);

                        }else if(attrName=="value"){

                            el.value=v;
                        }
                        
                        else{

                            if(!isCallable(v)){

                                syErr(`
                                The value of "${v}" event, must be a function.
                                `)
                            }

                            el[attrName]=function(e){

                                v.call(original,e)
                            }
                        }
                    }
                },

                get(){
                   if(attrName.startsWith("on")){

                       syErr(`
                       "${attrName}" seems to be an event listener, 
                       and you can not get the value of an event.
                       `)

                   }else{

                     return el.getAttribute(attrName)
                      
                   }
                }
            })
        }
        
        
        return {
            [attrManager]:original
        };
        
        }



globalThis.toHTML=toHTML;
globalThis.renderIf=renderIf;
globalThis.renderList=renderList;
globalThis.template=template;
globalThis.toATTR=toATTR;
 })();
