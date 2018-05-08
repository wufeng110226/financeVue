import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import cutInfo from '@/components/cutInfo'
import newKouzi from '@/components/newKouzi'
import userPage from '@/components/userPage'
import report from '@/components/report'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },{
    	path:'/cutInfo/:id/:userId',
    	name:'cutInfo',
    	component: cutInfo
    },{
    	path:'/newKouzi',
    	name:'newKouzi',
    	component: newKouzi
    },{
    	path:'/userPage/:id',
    	name:'userPage',
    	component: userPage
    },{
    	path:'/report/:id/:userId',
    	name:'report',
    	component:report
    }
  ]
})
