const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const root=path.join(__dirname,'../preview');
const context=vm.createContext({console,Intl,Date,Math,Number,String,Array,Object,Set,Map,JSON});
for(const name of ['vendor/react.production.min.js','model.js','components.js','app.js']){
  vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),context,{filename:name});
}
const {React,ThreadApp,ThreadModel}=context;
assert.ok(React);assert.ok(ThreadApp);assert.ok(ThreadModel);
const app=new ThreadApp({});
function visit(el,deep=0){
 if(el==null||el===false||typeof el==='string'||typeof el==='number')return;
 if(Array.isArray(el)){el.forEach(x=>visit(x,deep+1));return;}
 assert.ok(React.isValidElement(el),'React element expected');
 assert.ok(el.type,'Defined component type expected');
 assert.ok(deep<55,'Component nesting should be bounded');
 if(typeof el.type==='function'){visit(el.type(el.props),deep+1);return;}
 visit(el.props.children,deep+1);
}
for(const page of ['explore','lineage','scenario','portfolio']){
 app.state.page=page; visit(app.render());console.log('PASS —',page,'React component tree');
}
console.log('All shared React screen trees validated');
