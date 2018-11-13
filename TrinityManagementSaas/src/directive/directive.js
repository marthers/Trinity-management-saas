import on from '@/libs/tools';
export const directives = {
    numberOny : {
        bind: function(el,binding,vnode) {
            el.handler = function() {
                el.value = el.value.replace(/\D+/, '')
            }
            el.addEventListener('input', el.handler)
        },
        unbind: function(el,binding,vnode) {
            el.removeEventListener('input', el.handler)
        }
    }
}