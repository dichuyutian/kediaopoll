<!-- 课调管理 -->
<template>
	<div class="survey">
		<!-- 按钮 -->
		<div class="btns">
			<!-- <el-button size='mini' @click='toAddSurvey' type="primary" >添加</el-button>
			<el-button size='mini' @click='batchDeleteSurveys' type="danger">批量删除</el-button> -->
		</div>
		<!-- 按钮结束 -->
		<!-- 表格 -->
		<div v-loading='loading'>
			<el-table :border='true' size='mini' :data="surveys" style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" fixed></el-table-column>
	      <el-table-column prop="clazzVM.grade.name" label="年级" width="100"></el-table-column>
	      <el-table-column prop="clazzVM.name" label="班级" width="160"></el-table-column>
	      <el-table-column prop="course.name" label="课程" width="160"></el-table-column>
	      <el-table-column prop="user.name" label="讲师" width="100"></el-table-column>
	      <el-table-column prop="qnVM.name" label="问卷"></el-table-column>
	      <el-table-column prop="surveydate" label="创建时间" width="160"></el-table-column>
		  <el-table-column prop="status" label="状态" width="160"></el-table-column>
	      <el-table-column label="操作" width='100' fixed="right" align='center'>
	      	<template slot-scope='{row}'>
	      		<el-button type='text' size='mini' @click='checkSurvey(row.id)'>审核</el-button>
	      		
	      	</template>
	      </el-table-column>
	    </el-table>
		</div>
		<!-- 表格结束 -->
		<!-- 模态框 -->
		<el-dialog :title="surveyDialog.title" :visible.sync="surveyDialog.visible">
			{{surveyDialog.form}}
		  <el-form ref="surveyForm" :rules='rules' :model="surveyDialog.form" label-position='left' size='small'>
		    <el-form-item label="班级" label-width="60px" prop="name" style="width:100%">
		      <el-select v-model="surveyDialog.form.clazzId">
				  <el-option :key="v.id" v-for='v in clazzs' :label="v.name" :value="v.id"></el-option>	
			  </el-select>
		    </el-form-item>
			<el-form-item label="课程" label-width="60px" prop="name">
		      <el-select v-model="surveyDialog.form.courseId">
				  <el-option :key="v.id" v-for='v in courses' :label="v.name" :value="v.id"></el-option>	
			  </el-select>
		    </el-form-item>
			<el-form-item label="问卷" label-width="60px" prop="name">
		      <el-select v-model="surveyDialog.form.questionnaireId">
				  <el-option :key="v.id" v-for='v in questionnaires' :label="v.name" :value="v.id"></el-option>	
			  </el-select>
		    </el-form-item>
			<el-form-item label="讲师" label-width="60px" prop="name">
		      <el-select v-model="surveyDialog.form.userId">
				  <el-option :key="v.id" v-for='v in teachers' :label="v.name" :value="v.id"></el-option>	
			  </el-select>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='mini' @click='closeSurveyDialog'>取 消</el-button>
		    <el-button size='mini' @click='closeSurveyDialog'>取 消</el-button>
		    <el-button size='mini' type="primary" @click='saveOrUpdateSurvey'>确 定</el-button>
		  </div>
		</el-dialog>
		<!-- 按钮结束 -->

	</div>
</template>
<script>
	import getAxios from '@/http/getAxios'
	let axios = getAxios();
	export default {
		data(){
			return {
				loading:false,
				surveys:[],
				rules:{
				},
				multipleSelection:[],
				surveyDialog:{
					title:'',
					visible:false,
					form:{}
				},
				teachers:[],
				clazzs:[],
				courses:[],
				questionnaires:[]
			}
		},
		created(){
			this.findAllSurveys();
			this.findAllClazz();
			this.findAllUsers();
			this.findAllQuestionnaire();
			this.findAllCourse();
		},
		methods:{
			closeSurveyDialog(){
				this.surveyDialog.visible = false;
				this.surveyDialog.form = {};
				this.$refs.surveyForm.resetFields();
			},
			toUpdateSurvey(row){
				this.surveyDialog.title = '修改课调';
				this.surveyDialog.visible = true;
				this.surveyDialog.form = row;
			},
			//审核
			checkSurvey(id){
				this.$confirm('是否审核?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
					}).then(()=>{
						axios.get('/survey/checkSurvey?id='+id)
						.then(({data:result})=>{
							this.findAllSurveys();
							this.$notify.success({title:'成功',message:result.message})
						})
						.catch(()=>{
							this.$notify.error({title:'错误',message:'服务器异常'})
						})
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
			findAllSurveys(){
				this.loading = true;
				axios.get('/survey/findAllSurveyVM')
				.then(({data:result})=>{
					this.surveys = result.data;
				})
				.finally(()=>{
					this.loading = false;
				});
			},
			findAllUsers(){
				axios.get('/user/findAll')
				.then(({data:result})=>{
					this.teachers = result.data;
				});
			},
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
	.btns {
		margin-bottom: .5em;
	}
	i.fa {
		padding: 0 .3em;
		cursor: pointer;
	}
	i.fa.fa-trash {
		color: #F56C6C;
	}
</style>