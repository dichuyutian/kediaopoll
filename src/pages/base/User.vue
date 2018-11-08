<template>
    <div class="user">
         <el-input
                style="width:180px"
                size="small"
                placeholder="请输入关键字"
                v-model="params.keywords"
                clearable >
            </el-input>
        <div class="btns">
           
            <el-button size="mini" type="primary" @click="toAddUser">添加</el-button>
            <el-button size="mini" type="danger" @click="batchDeleteUser(values
            )">批量删除</el-button> 
        </div>
        <div class="table" v-loading='loading'>
			<el-table :border='true' size='small' :data="users" style="width: 100%" @selection-change="selsChange">
                <el-table-column
                    type="selection"
                    width="55" >
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="教师姓名"
                    >
                </el-table-column>
                <el-table-column
                    prop="gender"
                    label="性别"
                    >
                </el-table-column>
                <el-table-column
                    prop="birth"
                    label="出生日期"
                    >
                </el-table-column>
                <el-table-column
                    prop="hiredate"
                    label="入职时间"
                    >
                </el-table-column>
                <el-table-column label="操作" width='60'>
                    <template slot-scope='{row}'>
                        <i class="fa fa-trash" @click='deleteUser(row.id)'></i>
                        <i class="fa fa-pencil" @click="updateUser(row)"></i>
                    </template>
                </el-table-column>
	        </el-table>
		</div>
         <!-- 模态框 -->
        <el-dialog :title="userDialog.title" :visible.sync="userDialog.visible" >
			{{userDialog.form}}
		  <el-form :model="userDialog.form" label-position="top">
		    <el-form-item label="教师姓名:" label-width="120px">
		      <el-input v-model="userDialog.form.name" autocomplete="off"></el-input>
		    </el-form-item>
		     <el-form-item label="性别:" label-width="120px">
		      <el-input v-model="userDialog.form.gender" autocomplete="off"></el-input>
		    </el-form-item>
             <el-form-item label="出生日期:" label-width="120px">
		      <!-- <el-input v-model="userDialog.form.birth" autocomplete="off"></el-input> -->
              <el-date-picker
                        v-model="userDialog.form.birth"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
		    </el-form-item>
			 <el-form-item label="入职时间:" label-width="120px">
		      <!-- <el-input v-model="userDialog.form.hiredate" autocomplete="off"></el-input> -->
              <el-date-picker
                        v-model="userDialog.form.hiredate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='small' @click='closeuserDialog'>取 消</el-button>
		    <el-button size='small' type="primary" @click='saveOrUpdate'>确 定</el-button>
		  </div>
		</el-dialog>
        <!-- 模态框结束 -->
    </div>
</template>
<script>
    import axios from '@/http/axios'
    export default {
        data(){
            return {
                users:[],
                values:[],
                loading:false,
                userDialog:{
                    title:'修改年级信息',
                    form:{},
                    visible:false
                },
                params:{
                    
                }
            }
        },
        watch:{
            // 只要params中的任意参数发生改变，就要刷新页面
			params:{
				handler:function(){
					this.findquery();
				},
				deep:true
			}
        },
        created(){
            this.findAllUser();
        },
        methods:{
            //获取多选框改变事件
            selsChange(val){
                this.values = val;
            },
            //关闭模态框
            closeuserDialog(){
                this.userDialog.form = {};
                this.userDialog.visible = false;
            },
            //关键字搜索

            //添加
            toAddUser(){
                this.userDialog.form = {};
                this.userDialog.title = '添加教师';
                this.userDialog.visible = true;

            },
            //批量删除
            batchDeleteUser(){    
                
                //ids获取的另一种方法
                // var ids = [];
                // rows.forEach(element =>{
                //     ids.push(element.id)
                // })
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(()=>{
                    let ids  = this.values.map((item)=>{
					return item.id;
                    })
                    let url = '/user/batchDelete';
                    axios.post(url,{ids})
                    .then(({data:result})=>{
                        this.$notify({
                            title: '成功',
                            message: result.message,
                            type: 'success'
                            });
                        this.findAllUser();
                    }).catch(()=>{
                            this.$notify.error({
                                title: '错误',
                                message: '删除异常'
                            });
                    });
                }).catch(()=>{

                });
            },
            //修改教师
            updateUser(row){
                this.userDialog.form = row;
                this.userDialog.visible = true;
                this.userDialog.title = '修改教师信息';
            },
            //删除教师
            deleteUser(id){
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(()=>{
                    let url = '/user/deleteById?id='+id;
                    axios.get(url)
                    .then(({data:result})=>{
                        this.$notify({
                            title: '成功',
                            message: result.message,
                            type: 'success'
                            });
                        this.findAllUser();
                    }).catch(()=>{
                            this.$notify.error({
                                title: '错误',
                                message: '删除异常'
                            });
                    });
                }).catch(()=>{

                });
            },
            //保存或更新
            saveOrUpdate(){
                let url= '/user/saveOrUpdate'
                axios.post(url,this.userDialog.form).then(({data:result})=>{
                    if(result.status = 200){	
                        //1. 关闭模态框
						this.closeuserDialog();		
						//2. 提示成功
						this.$notify({
                            title: '成功',
                            message: result.message,
                            type: 'success'
                        });
                        //3.刷新
                        this.findAllUser();
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
            //关键字查询
            findquery(){
                let url = '/user/query';
                axios.get(url,{
                    params:this.params
                }).then(({data:result})=>{
                    this.users = result.data;
                }).catch((error)=>{
                     this.$notify.error({
                            title: '错误',
                            message: result.message
                    });
                })
            },
            //查询教师信息 
            findAllUser(){
                // this.loading = true;
                let url = '/user/findAll';
                axios.get(url).then(({data:result})=>{
                    this.users = result.data;
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
    .user{
        margin :10px;
    }
    .btns{
        float:right;
        margin:0 10px 10px 0; 
        
    }
    i.fa{
        margin: 0 .3em;
        cursor: pointer;
    }
    i.fa.fa-trash{
        color: #F56C6C;
    }
</style>
