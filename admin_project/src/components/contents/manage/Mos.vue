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
						@click='deleteMos'
					>
						<v-icon>mdi-trash-can</v-icon>
					</v-btn>
			</div>
			
			<modify :id='id'/>
			
			<v-divider/>
			
			<v-row justify='space-around' no-gutters>
				<v-col cols=11 md=5 class='my-10'>
					<recruit :id='id'/>
				</v-col>
				
				<v-divider 
					:vertical="$vuetify.breakpoint.mdAndUp" 
					v-if="$vuetify.breakpoint.mdAndUp"
					class='mt-4'
				></v-divider>
				
				<v-col cols=12
					v-if="$vuetify.breakpoint.smAndDown"
				><v-divider/></v-col>
				
				<v-col cols=11 md=5 class='my-10'>
					<rate :id='id'/>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>

<script>
	import modify from '@/components/contents/manage/mos/Modify'
	import rate from '@/components/contents/manage/mos/Rate'
	import recruit from '@/components/contents/manage/mos/Recruit'
	import router from '@/router'
	
	export default {
		props: ['id'],
		
		components: {
			modify,
			rate,
			recruit,
		},
		
		data: () => ({
			isDialogView: false,
			
			headers: [
				{ text: '입대일', align:'center', value: 'enlist',},
				{ text: '전역일', align:'center', value: 'discharge' },
				{ text: '마감일', align:'center', value: 'register' },
				{ text: '합격일', align:'center', value: 'accept' },
			],
			
			recruits: [],
		}),
		

		methods: {
			undo () {
				router.go(-1)
			},
			
			deleteMos() {
				this.$firebase.firestore().collection("MOS").doc(this.id).delete()
				.then(() => {
					console.log("Mos: successfully deleted");
					this.$toasted.show('특기가 삭제되었습니다');	
					this.undo()
					this.deleteDialog = false
				}).catch(error => {
					console.error("Error removing Mos: ", error);
				});
			},

			dialogViewClosed() {
				this.isDialogView = false
				this.getRecruits()
			},
		}
	}
</script>