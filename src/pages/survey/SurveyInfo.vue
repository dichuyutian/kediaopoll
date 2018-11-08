<!-- 课调管理 -->
<template>
	<div class="survey">
		<!-- 按钮 -->
		<div class="btns">
			<el-button size='mini' @click='toAddSurvey' type="primary" >添加</el-button>
			<el-button size='mini' @click='batchDeleteSurveys' type="danger">批量删除</el-button>
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
	      <el-table-column label="操作" width='100' fixed="right" align='center'>
	      	<template slot-scope='{row}'>
	      		<i class="fa fa-trash" @click='deleteSurvey(row.id)'></i>
	      		<i class="fa fa-pencil" @click='toUpdateSurvey(row)'></i>
	      	</template>
	      </el-table-column>
	    </el-table>
		</div>
		<!-- 表格结束 -->
		<!-- 模态框 -->
		<el-dialog :title="surveyDialog.title" :visible.sync="surveyDialog.visible">
			{{surveyDialog.form}}
		  <el-form ref="surveyForm" :rules='rules' :model="surveyDialog.form" label-position='left' size='small'>
		    <el-form-item label="班级" label-width="60px"  >
		      <el-select v-model="surveyDialog.form.clazzId" style="width:100%">
				  <el-option :key="index" v-for='(v,index) in clazzs' :label="v.name" :value="v.id"></el-option>	
			  </el-select>
		    </el-form-item>
			<el-form-item label="课程" label-width="60px" prop="surveyDialog.form.course.name" >
		      <el-select v-model="surveyDialog.form.courseId" style="width:100%">
				  <el-option :key="index" v-for='(v,index) in courses' :label="v.name" :value="v.id"></el-option>	
			  </el-select>
		    </el-form-item>
			<el-form-item label="问卷" label-width="60px" prop="surveyDialog.form.qnVM.name" >
		      <el-select v-model="surveyDialog.form.questionnaireId" style="width:100%">
				  <el-option :key="index" v-for='(v,index) in questionnaires' :label="v.name" :value="v.id"></el-option>	
			  </el-select>
		    </el-form-item>
			<el-form-item label="讲师" label-width="60px" prop="surveyDialog.form.user.name" >
		      <el-select v-model="surveyDialog.form.userId" style="width:100%">
				  <el-option :key="index" v-for='(v,index) in teachers' :label="v.name" :value="v.id"></el-option>	
			  </el-select>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
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
			
			toAddSurvey(){
				this.surveyDialog.title = '添加课调';
				this.surveyDialog.visible = true;
			},
			closeSurveyDialog(){
				this.surveyDialog.visible = false;
				this.surveyDialog.form = {};
				this.$refs.surveyForm.resetFields();
			},
			saveOrUpdateSurvey(){
				this.$refs.surveyForm.validate((valid)=>{
					if(valid){
						axios.post('/survey/saveOrUpdateSurvey',this.surveyDialog.form)
						.then(({data:result})=>{
							this.findAllSurveys();
							this.closeSurveyDialog();
							this.$notify.success({title:'成功',message:result.message})
						})
						.catch(()=>{
							this.$notify.error({title:'错误',message:'服务器异常'})
						})		
					}
				});
			},
			toUpdateSurvey(row){
				this.surveyDialog.title = '修改课调';
				this.surveyDialog.visible = true;
				this.surveyDialog.form = row;
			},
			batchDeleteSurveys(){
				this.$confirm('此操作将永久删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
					}).then(()=>{
						let ids = this.multipleSelection.map((item)=>{
									return item.id;
								})
								axios.post('/survey/batchDeleteSurveyById',{ids})
								.then(({data:result})=>{
									this.findAllSurveys();
									this.$notify.success({title:'成功',message:result.message})
								})
								.catch(()=>{
									this.$notify.error({title:'错误',message:'服务器异常'})
								})
					})
						},
						handleSelectionChange(val){
							this.multipleSelection = val;
						},
						deleteSurvey(id){
							this.$confirm('此操作将永久删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
					}).then(()=>{
						axios.get('/survey/deleteSurveyById?id='+id)
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