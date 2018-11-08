<template>
    <div class="clazz">
         <!-- <el-input
                style="width:180px"
                size="small"
                placeholder="请输入关键字"
                v-model="params.keywords"
                clearable >
         </el-input> -->
        <div class="btns">
           
            <el-button size="mini" type="primary" @click="toAddClazz">添加</el-button>
            <el-button size="mini" type="danger" @click="batchDeleteClazz(values
            )">批量删除</el-button> 
        </div>
        <div class="table" v-loading='loading'>
			<el-table :border='true' size='small' :data="clazzs" style="width: 100%" @selection-change="selsChange">
                <el-table-column
                    type="selection"
                    width="55" >
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="班级名称"
                    >
                </el-table-column>
                <el-table-column
                    prop="description"
                    label="班级简介"
                    >
                </el-table-column>
                <el-table-column
                    prop="charge.name"
                    label="班主任"
                    >
                </el-table-column>
                
                <el-table-column label="操作" width='60'>
                    <template slot-scope='{row}'>
                        <i class="fa fa-trash" @click='deleteClazz(row.id)'></i>
                        <i class="fa fa-pencil" @click="updateClazz(row)"></i>
                    </template>
                </el-table-column>
	        </el-table>
		</div>
         <!-- 模态框 -->
        <el-dialog :title="clazzDialog.title" :visible.sync="clazzDialog.visible" >
			{{clazzDialog.form}}
		  <el-form :model="clazzDialog.form" label-position="left">
		    <el-form-item label="所属年级:" label-width="120px">
		      <el-select v-model="clazzDialog.form.gradeId" autocomplete="off">
                  <el-option :key='index' v-for='(c,index) in grades' :label="c.name" :value="c.id"></el-option>
              </el-select>
		    </el-form-item>
		     <el-form-item label="班级名称:" label-width="120px">
		      <el-input v-model="clazzDialog.form.name" autocomplete="off"></el-input>
		    </el-form-item>
             <el-form-item label="所属班主任:" label-width="120px">
		      <el-select style='width:100%' v-model="clazzDialog.form.chargeId" placeholder="请选择班主任">
		        <el-option :key='index' v-for='(c,index) in teachers' :label="c.name" :value="c.id"></el-option>
                </el-select>
		    </el-form-item>
			 <el-form-item label="班级介绍:" label-width="120px">
		      <!-- <el-input v-model="clazzDialog.form.hiredate" autocomplete="off"></el-input> -->
                <el-input
					  type="textarea"
					  :rows="4"
					  placeholder="请输入内容"
					  v-model="clazzDialog.form.description">
				</el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='small' @click='closeclazzDialog'>取 消</el-button>
		    <el-button size='small' type="primary" @click='saveOrUpdate'>确 定</el-button>
		  </div>
		</el-dialog>
        <!-- 模态框结束 -->
    </div>
</template>
<script>
    //import axios from '@/http/axios'
    import getAxios from '@/http/getAxios'
	let axios = getAxios();
    export default {
        data(){
            return {
                clazzs:[],
                teachers:[],
				grades:[],
                values:[],
                loading:false,
                clazzDialog:{
                    title:'修改班级信息',
                    form:{      
                        
                    },
                    visible:false
                },
                params:{}
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
            this.findAllUsers();
			this.findAllGrades();
            this.findAllClazz();
        },
        methods:{
            //获取多选框改变事件
            selsChange(values){
                this.values = values;
            },
            //关闭模态框
            closeclazzDialog(){
                this.clazzDialog.form = {};
                this.clazzDialog.visible = false;
                this.$refs.clazzForm.resetFields();
            },
            //关键字搜索

            //添加
            toAddClazz(){
                this.clazzDialog.form = {};
                this.clazzDialog.title = '添加班级';
                this.clazzDialog.visible = true;

            },
            //批量删除
            batchDeleteClazz(rows){    
               
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(()=>{
                    let ids  = this.values.map((item)=>{
					return item.id;
                    })
                    let url = '/clazz/batchDeleteClazz';
                    axios.post(url,{ids})
                    .then(({data:result})=>{
                        this.$notify({
                            title: '成功',
                            message: result.message,
                            type: 'success'
                            });
                        this.findAllClazz();
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
            updateClazz(row){
                let clazz = _.clone(row);
				clazz.gradeId = clazz.grade.id;
				clazz.chargeId = clazz.charge.id;
				delete clazz.grade;
				delete clazz.charge;
				this.clazzDialog.form = clazz;
                this.clazzDialog.visible = true;
                this.clazzDialog.title = '修改班级信息';
            },
            //删除教师
            deleteClazz(id){
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(()=>{
                    let url = '/clazz/deleteClazzById?id='+id;
                    axios.get(url)
                    .then(({data:result})=>{
                        this.$notify({
                            title: '成功',
                            message: result.message,
                            type: 'success'
                            });
                        this.findAllClazz();
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
                let url= '/clazz/saveOrUpdateClazz'
                axios.post(url,this.clazzDialog.form).then(({data:result})=>{
                   	
                        //1. 关闭模态框
						this.closeclazzDialog();		
						//2. 提示成功
						this.$notify({
                            title: '成功',
                            message: result.message,
                            type: 'success'
                        });
                        //3.刷新
                        this.findAllClazz();
                   
                }).catch((error)=>{
                    this.$notify.error({
                            title: '错误',
                            message: result.message
                    });
                })
            },
            //关键字查询
            findquery(){
                let url = '/clazz/query';
                axios.get(url,{
                    params:this.params
                }).then(({data:result})=>{
                    this.clazzs = result.data;
                }).catch((error)=>{
                     this.$notify.error({
                            title: '错误',
                            message: result.message
                    });
                })
            },
            //查询教师信息 
            findAllClazz(){
                // this.loading = true;
                let url = '/clazz/findAllVM';
                axios.get(url).then(({data:result})=>{
                    this.clazzs = result.data;
                }).catch((error)=>{
                    this.$notify.error({
                            title: '错误',
                            message: result.message
                    });
                })
            },
            findAllGrades(){
				axios.get('/grade/findAll')
				.then(({data:result})=>{
					this.grades = result.data;
				});
			},
			findAllUsers(){
				axios.get('/user/findAll')
				.then(({data:result})=>{
					this.teachers = result.data;
				});
			}
        }
    }
</script>
<style>
    .clazz{
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
