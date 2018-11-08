import axios from 'axios'
import qs from 'qs'

// 全局配置
axios.defaults.headers.post['Content-Type'] 
	= 'application/x-www-form-urlencoded';
 axios.defaults.baseURL 
     = 'http://120.78.164.247:9999';
//有登陆
// axios.defaults.baseURL 
//     = 'http://120.78.164.247:8888';
    //  axios.defaults.baseURL 
	//  = 'http://39.108.219.54:8888';
//异步请求登录时携带cookie
axios.defaults.withCredentials = true;
axios.interceptors.request.use((config) => {
    if (config.method === 'post') {
      config.data = qs.stringify(config.data,{arrayFormat: 'repeat' });
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// axios.interceptors.response.use(function(response){
//     if(response.data.status == 500 && response.data.message == '尚未登录，请登录！'){
//         //获取vue实例，然后进行跳转
//         window.vm.currentComponent = 'login';
//     }
//     return response;
// })

export default axios;
