import jsonp from 'jsonp'
import bus from './eventBus'

//window.data = console.log

export function getRate(from, to){
    if (from.indexOf('货币') != -1 || to.indexOf('货币') != -1){
        return "请选择货币";
    }
    var result = ''
    let url = 'http://api.k780.com/?app=finance.rate&scur=' + from + '&tcur=' + to + '&appkey=27056&sign=6b49962cb830872b09330d98ed79a1f6&format=json'
    jsonp(url, {param:'jsoncallback'}, function(err, data){
        let result = "";
        if (err){
            result = err.message;
        }
        else{
            if (data.success != '1'){
                result = "服务器错误，请稍候尝试"
            }
            else{
                result = Screen.roeRate = Number(data.result.rate);
            }
        }
        bus.$emit("newRate", result)
    })
}