<template>
    <div class="question">
        <div class="btns">
            <el-button size="mini" type="primary" @click="toAddQuestion">添加</el-button>
            <el-button size="mini" type="danger" @click="batchDeleteQuestion(ids
            )">批量删除</el-button> 
        </div>
        {{ids}}
        <!-- 内容区 -->
        <div class="question-content" v-loading='loading'>
			<ul class="cont">
				<li class="question" v-for='q in questions' :key="q.id">
					<div class="question-title">
						 <el-checkbox v-model='ids' :label='q.id'></el-checkbox>
						 {{q.name}} 
							<el-tag type="success" size='small'>{{q.questionType}}</el-tag>

					</div>
					<div class="question-options" v-if='q.questionType!="简答题"'>
						<ol>
							<li v-for='o in q.options' :key="o.id">
								<span>{{o.label}}:</span>
								<span>{{o.name}}</span>
							</li>
						</ol>					
					</div>
					<div class="question-btns">
						<i class="fa fa-trash"  @click='deleteQuestion(q.id)'></i>
						<i class="fa fa-pencil" @click="updateQuestion(q)"></i>
					</div>
				</li>
			</ul>
		</div>
        <!-- 内容区结束 -->
         <!-- 模态框 -->
        <el-dialog :title="questionDialog.title" :visible.sync="questionDialog.visible" >
			{{questionDialog.form}}
		   <el-form ref="questionForm" :rules='rules' :model="questionDialog.form" label-position='left' size='small'>
		    <el-form-item label="题目名称" label-width="100px" prop="name">
		       <el-input type="textarea" :rows="2" placeholder="请输入题目名称" v-model="questionDialog.form.name"></el-input>
		    </el-form-item>
				<el-form-item label="题目类型" label-width="100px" prop="descriptioin">
		    	<el-select v-model='questionDialog.form.questionType' placeholder=''>
		    		<el-option label='单选题' value='单选题'></el-option>
		    		<el-option label='多选题' value='多选题'></el-option>
		    		<el-option label='简答题' value='简答题'></el-option>
		    	</el-select>
		    </el-form-item>
		    <el-form-item label="题目选项" label-width="100px" >
		
                <el-table size='mini' border :data="questionDialog.form.options" style="width: 100%">
                <el-table-column label="序号" width="60"> 
                    <template slot-scope='scope'>
                        {{scope.$index+1}}
                    </template>
                </el-table-column>
                <el-table-column prop="label" label="label" width="60"> 
                </el-table-column>
                <el-table-column label="选项">
                    <template slot-scope='scope'>
                        <el-input size='mini' v-model='scope.row.name'></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="分值" width="60">
                    <template slot-scope='scope'>
                        <el-input size='mini' v-model='scope.row.score'></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width='60' align='center'>
                    <template slot-scope='scope'>
                        <i class="fa fa-trash" @click='deleteOption(scope.row)'></i>
                    </template>
                </el-table-column>
                </el-table>
                <div style="text-align:right;font-size:1.5em">
                    <el-button size='mini' @click='addOption' :disabled='questionDialog.form.options.length>=5'>
                        <i class="fa fa-plus"></i>
                    </el-button>
                </div>

		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='small' @click='closequestionDialog'>取 消</el-button>
		    <el-button size='small' type="primary" @click='saveOrUpdate'>确 定</el-button>
		  </div>
		</el-dialog>
        <!-- 模态框结束 -->
    </div>
</template>
<script>
    import getAxios from '@/http/getAxios'
	//post提交数据
	let axios = getAxios('array');
	//批量删除
	let axios2 = getAxios();
    export default {
        data(){
            return {
                loading:false,
				ids:[],
				questions:[],
				rules:{},
				questionDialog:{
					title:'',
					visible:false,
					form:{
						options:[]
					}
				}
			}
        },
        created(){
            this.findAllQuestions();
        },
        methods:{
            //修改问题信息
            updateQuestion(row){
                this.questionDialog.form = row;
                this.questionDialog.visible = true;
                this.questionDialog.title = '修改问题信息';
            },
            //批量删除
            batchDeleteQuestion(ids){
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(()=>{
                   let url = '/question/batchDeleteQuestion';
                    axios2.post(url,{ids})
                    .then(({data:result})=>{
                        this.$notify({
                            title: '成功',
                            message: result.message,
                            type: 'success'
                            });
                        this.findAllQuestions();
                    }).catch(()=>{
                            this.$notify.error({
                                title: '错误',
                                message: '删除异常'
                            });
                    });
                }).catch(()=>{

                });
            },
            //删除
            deleteQuestion(id){
                
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(()=>{
                    let url = '/question/deleteQuestionById?id='+id;
                    axios.get(url)
                    .then(({data:result})=>{
                        this.$notify({
                            title: '成功',
                            message: result.message,
                            type: 'success'
                            });
                        this.findAllQuestions();
                    }).catch(()=>{
                            this.$notify.error({
                                title: '错误',
                                message: '删除异常'
                            });
                    });
                }).catch(()=>{

                });
            },
            //删除模态框option
            deleteOption(row){
				_.remove(this.questionDialog.form.options,(item)=>{
					return item == row;
				})
				this.questionDialog.form.options.push({});
				this.questionDialog.form.options.pop();
            },
            //添加option
			addOption(){
				let option = {
					name:''
				};
				let label = '';
				let score = 0;
				switch(this.questionDialog.form.options.length){
					case 0:
						label = 'A';
						score = 5;
						break;
					case 1:
						label = 'B';
						score = 4;
						break;
					case 2:
						label = 'C';
						score = 3;
						break;
					case 3:
						label = 'D';
						score = 2;
						break;
					case 4:
						label = 'E';
						score = 1;
						break;
				}
				option.label = label ;
				option.score = score ;
				this.questionDialog.form.options.push(option);
            },
            //添加问题
			toAddQuestion(){
				this.questionDialog.title = '添加问题';
				this.questionDialog.visible = true;
            },
            //保存或修改
			saveOrUpdate(){
				axios.post('/question/saveOrUpdateQuestion',this.questionDialog.form)
				.then(({data:result})=>{
					this.$notify.success({
						title:'成功',
						message:result.message
					})
					this.closequestionDialog();
					this.findAllQuestions();
				})
				.catch(()=>{
					this.$notify.error({
						title:'失败',
						message:'服务器异常'
					})
				})
            },
            //关闭模态框
			closequestionDialog(){
				this.questionDialog.visible = false;
				this.questionDialog.form = {
					options:[]
				};
            },
            //查询问题
			findAllQuestions(){
				this.loading = true;
				axios.get('/question/findAllQuestionVM')
				.then(({data:result})=>{
					this.questions = result.data;
				})
				.catch(()=>{
					this.$notify.error({
						title:"错误",
						message:"服务器异常"
					})
				})
				.finally(()=>{
					this.loading = false;
				});
			}
        }
    }
</script>
<style>
    .question{
        margin :10px;
    }
    .btns{
        float:right;
        margin:0 10px 10px 0; 
        overflow: hidden;
    }
    .question-content .cont{
        margin-top:30px;
    }
    .question {
		border-bottom: 1px solid #ededed;
		padding: .5em 0;
		position: relative;
	}
	.question > .question-title {
		line-height: 2em;
		color:#333;
	}
	.question > .question-options {
		padding: 0 2em;
	}
	.question > .question-options li {
		line-height: 2em;
	}
	.question > .question-btns {
		position: absolute;
		right: 1em;
		top: .5em;
	}
    i.fa{
        margin: 0 .3em;
        cursor: pointer;
    }
    i.fa.fa-trash{
        color: #F56C6C;
    }
</style>
