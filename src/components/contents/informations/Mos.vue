<template>
	<v-content>
		<v-container fluid>
			<div class='ma-2'>
					<v-btn
						dark fab fixed left
						color='deep-purple darken-2'
						@click='undo'
					>
						<v-icon>mdi-undo</v-icon>
					</v-btn>
					<v-btn 	 
						dark fab fixed right
						color='pink darken-2'
						@click='modifyMos'
					>
						<v-icon>mdi-pencil</v-icon>
					</v-btn>
			</div>
			
			<detail :id=id />
			
			<recruit :id=id />
			
			<rate :id=id />
			
		</v-container>
	</v-content>
</template>

<script>
	import router from '@/router'
	import detail from '@/components/contents/informations/details/Detail'
	import recruit from '@/components/contents/informations/details/Recruit'
	import rate from '@/components/contents/informations/details/Rate'
	
	export default {
		props: ['id'],
		
		components: {
			detail,
			recruit,
			rate
		},
		
		data: () => ({

		}),
		

		methods: {
			undo () {
				router.go(-1)
			},
			
			modifyMos() {
				alert('기여하기 기능 입니다.')
			},
		}
	}
</script>