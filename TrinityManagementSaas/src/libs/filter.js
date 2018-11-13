/**  
      * 过滤字符串函数  
      **/ 
export function filterStr(str)  
{  
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]");  
    var specialStr = "";  
    for(var i=0;i<str.length;i++)  
    {  
        specialStr += str.substr(i, 1).replace(pattern, '');   
    }  
    return specialStr;  
}
// export function stripscript(s) {
//     var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
//     var rs = "";
//     for (var i = 0; i < s.length; i++) {
//       rs = rs + s.substr(i, 1).replace(pattern, '');
//     }
//     return rs;
// }
export  class trimStr{
    constructor(str) {
        this.str = str
    }
    stripscript(s) {
        s = this.str
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
        var rs = "";
        for (var i = 0; i < s.length; i++) {
          rs = rs + s.substr(i, 1).replace(pattern, '');
        }
        return rs;
    }
}