<template>
	<v-data-table
			:headers="headers"
			:items="recruits"
			class="elevation-1"
			hide-default-footer
			:loading='isLoading'
		>
			<template v-slot:top>
				<v-toolbar flat color="white">
					<v-toolbar-title class='headline'>모집일정</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-dialog v-model="isDialogView" max-width="500px">
						<template v-slot:activator="{ on }">
							<v-btn color="teal" elevation=3 fab small dark  v-on="on"><v-icon>mdi-plus</v-icon></v-btn>
						</template>
						<v-card>
							<v-card-title>
								<span class="headline">Recruitment Schedule</span>
							</v-card-title>
							<v-card-text>
								<v-row>
									<v-col cols=12 sm=6 lg=3>
										<date-picker-menu
											whatDay='입대일'
											@setDay='enlistDay=$event'
										/>
									</v-col>
									<v-col cols=12 sm=6 lg=3>
										<date-picker-menu
											whatDay='전역일'
											@setDay='dischargeDay=$event'
										/>
									</v-col>
									<v-col cols=12 sm=6 lg=3>
										<date-picker-menu
											whatDay='마감일'
											@setDay='registerDay=$event'
										/>
									</v-col>
									<v-col cols=12 sm=6 lg=3>
										<date-picker-menu
											whatDay='합격일'
											@setDay='acceptDay=$event'
										/>
									</v-col>
								</v-row>
							</v-card-text>
							<v-card-actions class='mt-n6'>
								<v-spacer></v-spacer>
								<v-btn 
									color="blue darken-1" 
									text 
									@click="isDialogView=false"
								>Close</v-btn>

								<v-btn 
									:disabled='!isDayFormValid' 
									color="blue darken-1" 
									text 
									@click="postRecruit"
								>Save</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</v-toolbar>
			</template>

			<template v-slot:item.action="{ item }">
				<v-icon color='#B71C1C' small @click="deleteRecruit(item)">
					mdi-delete
				</v-icon>
			</template>


			<template v-slot:no-data>
				모집 데이터가 없습니다
			</template>
		</v-data-table>
</template>

<script>
	import datePickerMenu from '@/components/contents/manage/mos/Menu'
	import router from '@/router'
	
	export default {
		props: ['id'],
		
		components: {
			datePickerMenu,
		},
		
		computed: {
			isDayFormValid() {
				if(this.enlistDay && this.dischargeDay && this.registerDay && this.acceptDay){
					return true
				} else { 
					return false
				}
			}
		},
		
		data: () => ({
			isLoading: true,
			isDialogView: false,
			
			enlistDay: '',
			dischargeDay: '',
			registerDay: '',
			acceptDay: '',
			
			headers: [
				{ text: '입대일', align:'center', value: 'enlist',},
				{ text: '전역일', align:'center', value: 'discharge' },
				{ text: '마감일', align:'center', value: 'register' },
				{ text: '합격일', align:'center', value: 'accept' },
				{ text: '', value: 'action', sortable: false },
			],
			
			recruits: [],
		}),
		
		created() {
			this.getRecruits()
		},
		
		methods: {
			deleteRecruit(item) {
				this.$firebase.firestore().collection("MOS").doc(this.id).collection("DATE").doc(item.id).delete()
				.then(() => {
					console.log("Recruit: successfully deleted");
					this.$toasted.show('모집일정가 삭제되었습니다');	
					this.getRecruits()
				}).catch(error => {
					console.error("Error removing Mos: ", error);
				});
				console.log(item)
			},
			
			dialogViewClosed() {
				this.isDialogView = false
				this.getRecruits()
			},
			
			getRecruits() {
				this.$firebase.firestore().collection("MOS").doc(this.id).collection("DATE").get()
				.then(querySnapshot => {
					this.recruits = []
					this.isLoading = false
					querySnapshot.forEach(doc => {
						const { enlist, discharge, register, accept } = doc.data()
						
						this.recruits.push({
							enlist, discharge, register, accept, id:doc.id
						})
					});
				})
				.catch(error => {
					console.log("Error getting Mos:", error);
				});
			},
			
			postRecruit() {
				this.$firebase.firestore().collection("MOS").doc(this.id).collection("DATE").add({
					enlist: this.enlistDay,
					discharge: this.dischargeDay,
					register: this.registerDay,
					accept: this.acceptDay,
						// ..
				})
				.then(() => {
					console.log("Recruit successfully posted");
					this.$toasted.show('모집일정이 추가되었습니다');
					this.isDialogView = false
					this.getRecruits()
				})
				.catch(function(error) {
					console.error("Error posting Recruit: ", error);
				});
			}
		}
	}
</script>