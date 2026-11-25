(function(){
function get(scope, expr){
  expr = expr.trim();
  if (expr === 'true') return true; if (expr === 'false') return false;
  var path = expr.split('.'), v;
  for (var i = scope.length - 1; i >= 0; i--) { if (scope[i] && path[0] in scope[i]) { v = scope[i]; break; } }
  if (v === undefined) return undefined;
  for (var j = 0; j < path.length; j++) { if (v == null) return undefined; v = v[path[j]]; }
  return v;
}
var ONE = /^\{\{([^}]*)\}\}$/;
function interp(str, scope){ return str.replace(/\{\{([^}]*)\}\}/g, function(_, e){ var v = get(scope, e); return v == null ? '' : String(v); }); }
function proc(node, scope){
  if (node.nodeType === 3) { if (node.nodeValue.indexOf('{{') > -1) node.nodeValue = interp(node.nodeValue, scope); return; }
  if (node.nodeType !== 1) return;
  var tag = node.tagName;
  if (tag === 'SC-IF') {
    var m = ONE.exec(node.getAttribute('value') || ''), ok = m ? get(scope, m[1]) : false;
    var frag = document.createDocumentFragment();
    if (ok) { while (node.firstChild) frag.appendChild(node.firstChild); Array.prototype.slice.call(frag.childNodes).forEach(function(n){ proc(n, scope); }); }
    node.parentNode.replaceChild(frag, node); return;
  }
  if (tag === 'SC-FOR') {
    var lm = ONE.exec(node.getAttribute('list') || ''), list = lm ? get(scope, lm[1]) || [] : [], as = node.getAttribute('as') || 'item';
    var out = document.createDocumentFragment();
    list.forEach(function(item){
      var o = {}; o[as] = item;
      var f = document.createDocumentFragment();
      Array.prototype.forEach.call(node.childNodes, function(ch){ f.appendChild(ch.cloneNode(true)); });
      Array.prototype.slice.call(f.childNodes).forEach(function(n){ proc(n, scope.concat([o])); });
      out.appendChild(f);
    });
    node.parentNode.replaceChild(out, node); return;
  }
  Array.prototype.slice.call(node.attributes).forEach(function(a){
    if (a.name.indexOf('hint-') === 0) { node.removeAttribute(a.name); return; }
    if (a.value.indexOf('{{') < 0) return;
    if (/^on/.test(a.name)) {
      var mm = ONE.exec(a.value), fn = mm ? get(scope, mm[1]) : null;
      node.removeAttribute(a.name);
      if (typeof fn === 'function') node.addEventListener(a.name.slice(2), fn);
      return;
    }
    node.setAttribute(a.name, interp(a.value, scope));
  });
  Array.prototype.slice.call(node.childNodes).forEach(function(n){ proc(n, scope); });
}
window.DCLite = { mount: function(C, props){
  var tpl = document.getElementById('dc-tpl'), root = document.getElementById('dc-root');
  var c = new C(props), mounted = false;
  function render(){
    var f = document.importNode(tpl.content, true);
    var vals = c.renderVals ? c.renderVals() : {};
    Array.prototype.slice.call(f.childNodes).forEach(function(n){ proc(n, [vals]); });
    root.replaceChildren(f);
    if (mounted && c.componentDidUpdate) c.componentDidUpdate();
  }
  c._onState = render;
  render(); mounted = true;
  if (c.componentDidMount) c.componentDidMount();
}};
})();
