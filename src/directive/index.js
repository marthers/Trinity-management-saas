import {directives} from './directive';
console.log(directives)
const importDirective = Vue => {
/**
 * 输入框只能输入数字的指令
 */
    Vue.directive('numberOnly',directives.numberOnly);
}
export default importDirective;