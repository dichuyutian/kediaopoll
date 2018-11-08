<!-- 课调管理 监控-->
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
		  <el-table-column prop="code" label="课调编号" width="160"></el-table-column>
	      <el-table-column label="操作" width='100' fixed="right" align='center'>
	      	<template slot-scope='{row}'>
	      		<el-button type='text' size='mini' @click='beginSurvey(row.id)'>开启</el-button>
	      		<el-button type='text' size='mini' @click='stopSurvey(row.id)'>关闭</el-button>
	      	</template>
	      </el-table-column>
	    </el-table>
		</div>
		<!-- 表格结束 -->
		
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
			//关闭
			stopSurvey(id){
				this.$confirm('确认关闭?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
				}).then(()=>{
					axios.get('/survey/stopSurvey?id='+id)
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
			//开启
			beginSurvey(id){
				this.$confirm('确认开启?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
				}).then(()=>{
					axios.get('/survey/beginSurvey?id='+id)
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