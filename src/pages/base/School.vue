<template>
    <div class="school">
        <table class="cont" :model="school" >
            <tr>
                <td>校园名称</td>
                <td><el-input v-model="school.name" placeholder=""></el-input></td>
            </tr>
            <tr>
                <td>校园介绍</td>
                <td><el-input v-model="school.logopath" placeholder=""></el-input></td>
            </tr>
            <tr>
                <td>校园地址</td>
                <td><el-input v-model="school.address" placeholder=""></el-input></td>
            </tr>
            <tr>
                <td>校园电话</td>
                <td><el-input v-model="school.telephone" placeholder=""></el-input></td>
            </tr>
            <tr>
                <td>版权信息</td>
                <td><el-input v-model="school.copyright" placeholder=""></el-input></td>
            </tr>
        </table>
        <div class="btn">
            <el-button type="primary" size='small' @click='saveOrUpdate(school)'>保存</el-button>
        </div>
        {{school}}
    </div>
</template>
<script>
    import axios from '@/http/axios'
    export default {
        data(){
            return {
                school:{},
            }
        },
        created(){
            this.findById();
        },
        methods:{
            //修改后保存
            saveOrUpdate(){
                let url= '/school/saveOrUpdate'
                axios.post(url,this.school).then(({data:result})=>{
                    if(result.status = 200){			
						//2. 提示成功
						this.$notify({
                            title: '成功',
                            message: result.message,
                            type: 'success'
                        });
                        //3.刷新
                         this.findById();
                    }else{
                        this.$notify.error({
                            title: '错误',
                            message: result.message
                        });
                    }
                }).catch((error)=>{
                    this.$notify.error({
                            title: '错误',
                            message: result.message
                    });
                })
            },
            //查询默认校园信息
            findById(){
                let url = '/school/findById?id=1'
                axios.get(url).then(({data:result})=>{
                    this.school= result.data;
                    
                }).catch((error)=>{
                    this.$notify.error({
                            title: '错误',
                            message: result.message
                    });
                })
            }
        }
    }
</script>
<style>
    .school{
        height: 450px;
    }
    .cont{
        margin: 10px;
        
        border-collapse: collapse;
    }
    .cont tr td{
        width: 200px;
        height: 40px;
        text-align: center;
        font-size: 15px;
        border: 1px solid #000;
    }
    .cont tr td:nth-child(2){
        width: 900px;  
        text-align: left;
    }h
    .cont tr td:nth-child(2) input{
        width: 900px;
        height: 100%;
    }
    .btn{
        float: right;
        margin-right: 20px;
    }
</style>
