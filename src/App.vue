<template>
    <div id="app">
      <!-- 头部 -->
      <div class="header">

        
          <div class="title">智慧校园 课调系统</div>
      </div>
      <div class="center">
        <div class="left-nav">
          <ul>
            <li :class="{current:currentRoute=='/'}">
              <i class="fa fa-bank"></i>
              <router-link to='/'>首页</router-link>
              <i class="fa fa-angle-right"></i>
            </li>
            <li :class="{current:currentRoute.indexOf('/base')==0}">
              <i class="fa fa-list"></i>
              <router-link to='/base'>基础数据</router-link>
              <i class="fa fa-angle-right"></i>
            </li>
            <li :class="{current:currentRoute.indexOf('/qn')==0}">
              <i class="fa fa-certificate"></i>
              <router-link to='/qn'>问卷管理</router-link>
              <i class="fa fa-angle-right"></i>
            </li>
            <li :class="{current:currentRoute.indexOf('/survey')==0}">
              <i class="fa fa-user"></i>
              <router-link to='/survey'>课调管理</router-link>
              <i class="fa fa-angle-right"></i>
            </li>
            <li :class="{current:currentRoute.indexOf('/statistics')==0}">
              <i class="fa fa-user"></i>
              <router-link to='/statistics'>课调统计</router-link>
              <i class="fa fa-angle-right"></i>
            </li>
            <li :class="{current:currentRoute.indexOf('/setting')==0}" >
              <router-link to='/setting'>系统设置</router-link>
              <i class="fa fa-angle-right"></i>
            </li>
          </ul>
        </div> 
        <div class="content">
          <div class="wrapper">
            <router-view></router-view>
          </div>
       </div>
      </div>
  </div>
</template>

<script>
  import getAxios from '@/http/getAxios'
  let axios = getAxios();
  export default {
      data(){
          return{
            currentRoute:'/',
            user:{}
          }
      },
      created(){
        this.currentRoute = this.$route.path;
      
      },
      watch:{
        '$route':function(to,from){
          this.currentRoute = to.path;
        }
      },
      
  }
</script>

<style>
  *{
    padding: 0;
    margin: 0;
    list-style: none;
    text-decoration: none;
  }
  html{
    font: normal normal 12px '微软雅黑','Microsoft YaHei';
    color: #666;
  }
  a{
    color:#666;
  }
  div{
    box-sizing:border-box;
  }
  .header{
    position: absolute;
    width: 100%;
    height: 60px;
    background-color: teal;
    /* background-image: url('./assets/beijing.jpg'); */
    padding: 0 1em;
  }
  .header .title{
    color: #fff;
    line-height: 60px;
    font-size: 18px;
    float: left;
    margin-left: 30px;
  }
  .header .photo{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-top: 5px;
    margin-right: 1em;
  }
  .header .info{
    float: right;
    cursor: pointer;
  }
  .header .info .u{
    float: right;
    line-height: 20px;
    margin-top: 20px;
  } 
  .header .info .el-dropdown{
    color: #fff;
  }
  .center{
    position: absolute;
    top: 60px;
    bottom: 0;
    width: 100%;
  }
  .center >.left-nav{
    width: 180px;
    height: 100%;
    float: left;
  }
  .center >.left-nav ul li{
    font-size: 17px;
    line-height: 2em;
    text-align: center;
    border-bottom: 1px solid #ccc;
    position: relative;
  }
  .center > .left-nav > ul > li i.fa {
    position: absolute;
    top: 50%;
    margin-top: -.5em;
  }
  .center > .left-nav > ul > li i.fa:last-child {
    right: 1em;
  }
  .center > .left-nav > ul > li i.fa:first-child {
    left: 1em;
  }
  .center > .left-nav > ul>li.current{
    background-color: #f0f0f0;
  }
  .center >.content{

    margin-left: 180px;
    height: 100%;
    background-color: #f0f0f0;
    padding: 1em 1em 0 1em;
    overflow-y: auto;
  }
  .center >.content >.wrapper{
    padding: 10px;
    width: 100%;
    /* height: 100%; */
    border-radius: 5px;
    background-color: #fff;
  }
</style>
