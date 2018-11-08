<template>
    <div class="grade">
        <div class="btns">
            <el-button size="mini" type="primary" @click="toAddGrade">添加</el-button>
            <el-button size="mini" type="danger" @click="batchDeleteGrade(values
            )">批量删除</el-button> 
        </div>
        <div class="table" v-loading='loading'>
			<el-table :border='true' size='small' :data="grades" style="width: 100%" @selection-change="selsChange">
                <el-table-column
                    type="selection"
                    width="100" >
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="名称"
                    >
                </el-table-column>
                <el-table-column
                    prop="descriptioin"
                    label="简介"
                    >
                </el-table-column>
                <el-table-column label="操作" width='60'>
                    <template slot-scope='{row}'>
                        <i class="fa fa-trash" @click='deleteGrade(row.id)'></i>
                        <i class="fa fa-pencil" @click="updateGrade(row)"></i>
                    </template>
                </el-table-column>
	        </el-table>
		</div>
        
         <!-- 模态框 -->
        <el-dialog :title="gradeDialog.title" :visible.sync="gradeDialog.visible" >
			{{gradeDialog.form}}
		  <el-form :model="gradeDialog.form" label-position="top">
		    <el-form-item label="年级名称:" label-width="120px">
		      <el-input v-model="gradeDialog.form.name" autocomplete="off"></el-input>
		    </el-form-item>
		    
			<el-form-item label="年级介绍:" label-width="120px">
		        <el-input
					  type="textarea"
					  :rows="4"
					  placeholder="请输入内容"
					  v-model="gradeDialog.form.descriptioin">
				</el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='small' @click='closegradeDialog'>取 消</el-button>
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
                grades:[],
                values:[],
                loading:false,
                gradeDialog:{
                    title:'修改年级信息',
                    form:{},
                    visible:false
                },
                // pramas:{
                //     page:0,
                //     pageSize:10
                // } 
            }
        },
        created(){
            this.findAllgrade();
        },
        methods:{
            //获取多选框改变事件
            selsChange(values){
                this.values = values;
            },
            //关闭模态框
            closegradeDialog(){
                this.gradeDialog.form = {};
                this.gradeDialog.visible = false;
            },
            //添加
            toAddGrade(){
                this.gradeDialog.form = {};
                this.gradeDialog.title = '添加年级';
                this.gradeDialog.visible = true;

            },
            //批量删除
            batchDeleteGrade(rows){    
                let ids  = this.values.map((item)=>{
					return item.id;
                })
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
                   let url = '/grade/batchDelete?ids='+ids;
                    axios.get(url)
                    .then(({data:result})=>{
                        this.$notify({
                            title: '成功',
                            message: result.message,
                            type: 'success'
                            });
                        this.findAllgrade();
                    }).catch(()=>{
                            this.$notify.error({
                                title: '错误',
                                message: '删除异常'
                            });
                    });
                }).catch(()=>{

                });
            },
            //修改年级
            updateGrade(row){
                this.gradeDialog.form = row;
                this.gradeDialog.visible = true;
                this.gradeDialog.title = '修改年级信息';
            },
            //删除年级
            deleteGrade(id){
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(()=>{
                    let url = '/grade/deleteById?id='+id;
                    axios.get(url)
                    .then(({data:result})=>{
                        this.$notify({
                            title: '成功',
                            message: result.message,
                            type: 'success'
                            });
                        this.findAllgrade();
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
                let url= '/grade/saveOrUpdate'
                axios.post(url,this.gradeDialog.form).then(({data:result})=>{
                    if(result.status = 200){	
                        //1. 关闭模态框
						this.closegradeDialog();		
						//2. 提示成功
						this.$notify({
                            title: '成功',
                            message: result.message,
                            type: 'success'
                        });
                        //3.刷新
                        this.findAllgrade();
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
            //查询年级信息
            
            findAllgrade(){
                let url = '/grade/findAll';
                axios.get(url).then(({data:result})=>{
                    this.grades = result.data;
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
    .grade{
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
