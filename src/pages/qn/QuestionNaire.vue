<template>
    <div class="questionnaire">
        <div class="btns">
            <el-button size="mini" type="primary" @click="toAddQuestionnaire">添加</el-button>
            <el-button size="mini" type="danger" @click="batchDeleteQuestionnaire(values
            )">批量删除</el-button> 
        </div>
        <div class="table" v-loading='loading'>
			<el-table :border='true' size='small' :data="questionnaires" style="width: 100%" @selection-change="selsChange">
                <el-table-column
                    type="selection"
                    width="80" >
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="问卷名称"
                    >
                </el-table-column>
                <el-table-column
                    prop="description"
                    label="描述"
                    >
                </el-table-column>
                <el-table-column label="操作" width='110'>
                    <template slot-scope='{row}'>
                        <i class="fa fa-eye" title='预览'></i>
                        <i class="fa fa-trash" @click='deleteQuestionnaire(row.id)'></i>
                        <i class="fa fa-pencil" @click="updateQuestionnaire(row)"></i>
                    </template>
                </el-table-column>
	        </el-table>
		</div>
        
         <!-- 模态框 -->
        <el-dialog :title="questionnaireDialog.title" :visible.sync="questionnaireDialog.visible" >
			{{questionnaireDialog.form}}
		  <el-form :model="questionnaireDialog.form" label-position="left">
		    <el-form-item label="问卷名称:" label-width="120px">
		      <el-input v-model="questionnaireDialog.form.name" autocomplete="off"></el-input>
		    </el-form-item>
		    
			<el-form-item label="问卷简介:" label-width="120px">
		        <el-input
					  type="textarea"
					  :rows="4"
					  placeholder="请输入内容"
					  v-model="questionnaireDialog.form.description">
				</el-input>
		    </el-form-item>
            <el-form-item label="问卷题目:" label-width="120px">
		        <el-button size='mini' @click="toChooseQuestion">点击选择</el-button>
		    </el-form-item>
		  </el-form>
          <ul class="question-list" v-loading='loading'>
				<!-- 问题 -->
				<li class="question" v-for='(q,$index) in choosedQuestions' :key="q.id">
					<div class="question-title">
						<span>{{$index+1}}、&nbsp;</span>
						{{q.name}}
						<el-tag type="warning" size='mini'>{{q.questionType}}</el-tag>
					</div>
					<div class="question-options">
						<ol>
							<li v-for='o in q.options' :key="o.id">
								<span>{{o.label}}:</span>
								<span>{{o.name}}</span>
							</li>
						</ol>
					</div>
					<div class="question-btns">
						<i class="fa fa-trash" @click='removeQuestion(q)'></i>
					</div>
				</li>
            </ul>
				<!-- 问题结束 -->
                <!-- 内层模态框 -->
              <el-dialog
                width="50%"
                title="选择题目"
                :visible.sync="innerDialog.visible"
                append-to-body>

                <ul class="choose-question-list">
                    <li v-for='q in questions' :key="q.id">
                        <el-checkbox v-model='choosedQuestions' :label='q'>{{q.name}}</el-checkbox>
                    </li>
                </ul>
                <div slot="footer" class="dialog-footer">
                        <el-button size='mini' type="primary" @click='completeChoose'>确 定</el-button>
                    </div>
             </el-dialog>
                <!-- 内层模态框结束 -->
                <div slot="footer" class="dialog-footer">
                <el-button size='small' @click='closequestionnaireDialog'>取 消</el-button>
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
                questionnaires:[],
                questions:[],
                choosedQuestions:[],
                values:[],
                loading:false,
                questionnaireDialog:{
                    title:'修改年级信息',
                    form:{},
                    visible:false
                },
                innerDialog:{
					visible:false
				}
            }
        },
        created(){
            this.findAllQuestionnaire();
            this.findAllQuestions();
        },
        methods:{
            removeQuestion(question){
				_.remove(this.choosedQuestions,item=>item== question);
				this.choosedQuestions.push({});
				this.choosedQuestions.pop();
			},
            toChooseQuestion(){
                this.innerDialog.visible = true;
            },
            completeChoose(){
				this.innerDialog.visible = false;
			},
            //获取多选框改变事件
            selsChange(values){
                this.values = values;
            },
            //关闭模态框
            closequestionnaireDialog(){
                this.questionnaireDialog.form = {};
                this.questionnaireDialog.visible = false;
            },
            //添加
            toAddQuestionnaire(){
                this.questionnaireDialog.form = {};
                this.questionnaireDialog.title = '添加年级';
                this.questionnaireDialog.visible = true;

            },
            //批量删除
            batchDeleteQuestionnaire(rows){    
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
                   let url = '/questionnaire/batchDeleteQuestion?ids='+ids;
                    axios.get(url)
                    .then(({data:result})=>{
                        this.$notify({
                            title: '成功',
                            message: result.message,
                            type: 'success'
                            });
                        this.findAllquestionnaire();
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
            updateQuestionnaire(row){
                this.questionnaireDialog.form = row;
                this.questionnaireDialog.visible = true;
                this.questionnaireDialog.title = '修改年级信息';
            },
            //删除年级
            deleteQuestionnaire(id){
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(()=>{
                    let url = '/questionnaire/deleteQuestionnaireById?id='+id;
                    axios.get(url)
                    .then(({data:result})=>{
                        this.$notify({
                            title: '成功',
                            message: result.message,
                            type: 'success'
                            });
                        this.findAllQuestionnaire();
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
                let url= '/questionnaire/saveOrUpdateQuestionnaire'
                axios.post(url,this.questionnaireDialog.form).then(({data:result})=>{
                    if(result.status = 200){	
                        //1. 关闭模态框
						this.closequestionnaireDialog();		
						//2. 提示成功
						this.$notify({
                            title: '成功',
                            message: result.message,
                            type: 'success'
                        });
                        //3.刷新
                        this.findAllQuestionnaire();
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
            
            findAllQuestionnaire(){
                let url = '/questionnaire/findAllQuestionnaire';
                axios.get(url).then(({data:result})=>{
                    this.questionnaires = result.data;
                }).catch((error)=>{
                    this.$notify.error({
                            title: '错误',
                            message: result.message
                    });
                })
            },
            findAllQuestions(){
				this.loading = true;
				axios.get('/question/findAllQuestionVM')
				.then(({data:result})=>{
					this.questions = result.data;
				})
				.catch(()=>{
					this.$notify.error({
						title:'错误',
						message:'服务器异常'
					})
				})
				.finally(()=>{
					this.loading = false;
				});
			},
        }
    }
</script>
<style>
    .questionnaire{
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
    .question-list {
 		border-top: 1px solid #ededed;
 	}
	.question {
		padding: .5em 2em;
		border-bottom: 1px solid #ededed;
		position: relative;
	}
	.question > .question-title {
		line-height: 2.5em;
		color: #333;
	}
	.question > .question-options {
		padding-left: 2em;
	}
	.question > .question-options li{
		line-height: 2em;
	}
	.question > .question-btns {
		position: absolute;
		top: .5em;
		right: 2em;
	}
	.choose-question-list > li {
		line-height: 2em;
	}
</style>
