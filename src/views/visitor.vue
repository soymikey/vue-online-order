<template>
    <div>
        <head-top></head-top>
        <visitor-pie :pieData="pieData"></visitor-pie>
    </div>
</template>

<script>
	import headTop from '@/components/adminComponent/headTop'
    import visitorPie from '@/components/adminComponent/visitorPie'
	import {getUserCity} from '@/apiService/clientApi'
    export default {
    	data(){
    		return {
    			pieData: {},
    		}
    	},
    	components: {
    		headTop,
            visitorPie,
    	},
    	mounted(){
    		this.initData();
    	},
    	methods: {
    		async initData(){
    			try{
    				const res = await getUserCity();
    				if (res.status == 1) {
    					this.pieData = res.user_city;
    				}else{
    					throw new Error(res)
    				}
    			}catch(err){
    				console.log('获取用户分布信息失败',err);
    			}
    		},
    	}
    }
</script>

<style lang="scss">
	@import '../style/mixin';
	
</style>
