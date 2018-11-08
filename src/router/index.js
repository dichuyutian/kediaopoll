import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Base from '@/pages/base/Index'
import Course from '@/pages/base/Course'
import Clazz from '@/pages/base/Clazz'
import Grade from '@/pages/base/Grade'
import School from '@/pages/base/School'
import User from '@/pages/base/User'

import Qn from '@/pages/qn/Index'
import Question from '@/pages/qn/question'
import Questionnaire from '@/pages/qn/questionNaire'

import Survey from '@/pages/survey/Index'
import SurveyInfo from '@/pages/survey/SurveyInfo'
import SurveyMonitor from '@/pages/survey/SurveyMonitor'
import SurveyCheck from '@/pages/survey/SurveyCheck'

import Statistics from '@/pages/statistics/Index'
import SurveyList from '@/pages/statistics/SurveyList'
import SurveyClazz from '@/pages/statistics/SurveyClazz'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/base',
      component: Base,
      children:[{
        path: 'Course',
        component: Course,
      },{
        path: 'Grade',
        component: Grade,
      },{
        path: 'Clazz',
        component: Clazz,
      },{
        path: 'School',
        component: School,
      },{
        path: 'User',
        component: User,
      }]
    },{
      path: '/statistics',
      component: Statistics,
      children:[{
        path: 'surveyList',
        component: SurveyList,
      },{
        path: 'surveyClazz',
        component: SurveyClazz,
      }]
    },{
      path: '/survey',
      component: Survey,
      children:[{
        path: 'surveyInfo',
        component: SurveyInfo,
      },{
        path: 'surveyMonitor',
        component: SurveyMonitor,
      },{
        path: 'surveyCheck',
        component: SurveyCheck,
      }]
    },{
      path: '/qn',
      component: Qn,
      children:[{
        path: 'question',
        component: Question,
      },{
        path: 'questionnaire',
        component: Questionnaire,
      }]
    }
  ]
})
