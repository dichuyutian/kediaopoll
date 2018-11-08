<template>
    <div class="course">
         <!-- <el-input
                style="width:180px"
                size="small"
                placeholder="请输入关键字"
                v-model="params.keywords"
                clearable >
            </el-input> -->
        <div class="btns">
           
            <el-button size="mini" type="primary" @click="toAddCourse">添加</el-button>
            <el-button size="mini" type="danger" @click="batchDeleteCourse(values
            )">批量删除</el-button> 
        </div>
        <div class="table" v-loading='loading'>
			<el-table :border='true' size='small' :data="courses" style="width: 100%" @selection-change="selsChange">
                <el-table-column
                    type="selection"
                    width="55" >
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="课程名称"
                    >
                </el-table-column>
                <el-table-column
                    prop="period"
                    label="课程周期"
                    >
                </el-table-column>
                <el-table-column
                    prop="description"
                    label="课程简介"
                    >
                </el-table-column>
                <el-table-column label="操作" width='60'>
                    <template slot-scope='{row}'>
                        <i class="fa fa-trash" @click='deleteCourse(row.id)'></i>
                        <i class="fa fa-pencil" @click="updateCourse(row)"></i>
                    </template>
                </el-table-column>
	        </el-table>
		</div>
         <!-- 模态框 -->
        <el-dialog :title="courseDialog.title" :visible.sync="courseDialog.visible" >
			{{courseDialog.form}}
		  <el-form :model="courseDialog.form" label-position="top">
		    <el-form-item label="课程名称:" label-width="120px">
		      <el-input v-model="courseDialog.form.name" autocomplete="off"></el-input>
		    </el-form-item>
		     <el-form-item label="课程周期:" label-width="120px">
		      <el-input v-model="courseDialog.form.period" autocomplete="off"></el-input>
		    </el-form-item>
			 <el-form-item label="课程简介:" label-width="120px">
		         <el-input
					  type="textarea"
					  :rows="4"
					  placeholder="请输入内容"
					  v-model="courseDialog.form.description">
				</el-input>             
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='small' @click='closecourseDialog'>取 消</el-button>
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
                courses:[],
                values:[],
                loading:false,
                courseDialog:{
                    title:'修改课程信息',
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
            this.findAllCourse();
        },
        methods:{
            //获取多选框改变事件
            selsChange(values){
                this.values = values;
            },
            //关闭模态框
            closecourseDialog(){
                this.courseDialog.form = {};
                this.courseDialog.visible = false;
            },
            //关键字搜索

            //添加
            toAddCourse(){
                this.courseDialog.form = {};
                this.courseDialog.title = '添加课程';
                this.courseDialog.visible = true;

            },
            //批量删除
            batchDeleteCourse(rows){    
                let ids  = this.values.map((item)=>{
					return item.id;
                })
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(()=>{
                   let url = '/course/batchDelete';
                    axios.post(url,{ids})
                    .then(({data:result})=>{
                        this.$notify({
                            title: '成功',
                            message: result.message,
                            type: 'success'
                            });
                        this.findAllCourse();
                    }).catch(()=>{
                            this.$notify.error({
                                title: '错误',
                                message: '删除异常'
                            });
                    });
                }).catch(()=>{

                });
            },
            //修改课程信息
            updateCourse(row){
                this.courseDialog.form = row;
                this.courseDialog.visible = true;
                this.courseDialog.title = '修改课程信息';
            },
            //删除 课程
            deleteCourse(id){
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(()=>{
                    let url = '/course/deleteById?id='+id;
                    axios.get(url)
                    .then(({data:result})=>{
                        this.$notify({
                            title: '成功',
                            message: result.message,
                            type: 'success'
                            });
                        this.findAllCourse();
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
                let url= '/course/saveOrUpdate'
                axios.post(url,this.courseDialog.form).then(({data:result})=>{
                   	
                        //1. 关闭模态框
						this.closecourseDialog();		
						//2. 提示成功
						this.$notify({
                            title: '成功',
                            message: result.message,
                            type: 'success'
                        });
                        //3.刷新
                        this.findAllCourse();
                    
                }).catch((error)=>{
                    this.$notify.error({
                            title: '错误',
                            message: result.message
                    });
                })
            },
            //关键字查询
            findquery(){
                let url = '/course/query';
                axios.get(url,{
                    params:this.params
                }).then(({data:result})=>{
                    this.courses = result.data;
                }).catch((error)=>{
                     this.$notify.error({
                            title: '错误',
                            message: result.message
                    });
                })
            },
            //查询课程信息 
            findAllCourse(){
                // this.loading = true;
                let url = '/course/findAllCourse';
                axios.get(url).then(({data:result})=>{
                    this.courses = result.data;
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
    .course{
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
