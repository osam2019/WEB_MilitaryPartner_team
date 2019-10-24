<template>
	<v-row justify="center" align='center'>
		
		<v-col cols=12>
			<v-card  class='mx-auto py-4 text-center' max-width=400>
				<v-icon color='red' class='mr-2' v-show='userWarn'>mdi-alert-outline</v-icon>
				<span>{{ userMessage }}</span>
			</v-card> 
		</v-col>
		
		<v-col cols=12 style='height:180px' v-show='!isDateSelected && $vuetify.breakpoint.smAndUp' />
		
		<v-col cols='11' sm='5' md='4' xl='3' v-show='!isDateSelected'>
			<v-date-picker
				show-current=false
				locale ='ko'
				v-model="startDate"
				full-width
				no-title
				:events="betweenDates"
			></v-date-picker>
		</v-col>
		
		<v-col cols=1 class='mx-n5 text-center' v-show="$vuetify.breakpoint.smAndUp && !isDateSelected">
			<v-icon :color='tildeColor'>mdi-tilde</v-icon>
		</v-col>
		
		<v-col class='mb-12 mb-sm-0' cols='11' sm='5' md='4' xl='3' v-show='!isDateSelected'>
			<v-date-picker
				show-current=false
				locale ='ko'
				v-model="endDate"
				full-width
				no-title
				:events="betweenDates"
			></v-date-picker>
		</v-col>
		
		
		<v-col class='mt-9' cols='12' sm='12' md=10 lg='8' xl='6' v-show='isDateSelected'>
			<v-data-table
				:loading='tableLoading'
				:headers="headers"
				:items="dates"
				:page.sync="currentPage"
				:items-per-page="10"
				class="elevation-1"
				hide-default-footer
				@click:row='clickRow'
				@page-count="pageCount = $event"
			>
				<template v-slot:item.score="{ item }">
						{{ displayScore(item.score) }}
				</template>

				<template v-slot:no-data>
					<p class='text-center my-12 headline'>해당 기간에 모집일정이 아직 없습니다.</p>
				</template>

				<template v-slot:loading>
					<p class='text-center my-12 headline'>해당 기간에 모집일정을 조회중입니다.</p>
				</template>

				<template v-slot:footer="{ pagination }">
					<v-pagination
						v-model="currentPage"
						:length="pageCount"
					></v-pagination>

				</template>

			</v-data-table>
		</v-col>

		<v-btn
			height=50
			class='mb-12'
			fixed bottom width=400 color='teal'
			@click='dateSelect'
			:loading = 'isLoaing'
			:disabled = 'isButtonDisable'
		><v-icon color='white'>{{ buttonIcon }}</v-icon></v-btn>
	</v-row>
</template>

<script>
	import router from '@/router'
	
	export default {
		data: () => ({
			currentPage: 1,
			pageCount: 1,
			
			headers: [
				{ text: '특기', align:'center', value: 'name' },
				{ text: '군종', align:'center', value: 'group' },
				{ text: '계열', align:'center', value: 'sort' },
				{ text: '평점', align:'center', value: 'score' },
				{ text: '입대', align:'center', value: 'enlist' },
				{ text: '전역', align:'center', value: 'discharge' },
				{ text: '합격발표', align:'center', value: 'accept' },
				{ text: '등록마감', align:'center', value: 'register' },
			],
			
			dates: [],
			
			startDate: '',
			endDate: '',
			
			buttonIcon: 'mdi-table-search',
			
			isDateSelected: false,
			isLoaing: false,
			
			userMessageAdd: '',
			
			isButtonDisable: true,
			isEmptyData: true,
		}),
		
		watch: {
			startDate(val) {
				if(this.endDate && val) {
					if(new Date(this.endDate) >= new Date(val)) {
						this.isButtonDisable = false
					} else {
						this.isButtonDisable = true
					}
				}
			},
			endDate(val) {
				if(this.startDate && val) {
					if(new Date(this.startDate) <= new Date(val)) {
						this.isButtonDisable = false
					} else {
						this.isButtonDisable = true
					}
				}
			}
		},
		
		computed: {
			betweenDates() {
				if(this.startDate != '' && this.endDate != ''){
					var arr = new Array()
					var start = new Date(this.startDate)
					var end = new Date(this.endDate)
					
					while (start <= end) {
						arr.push(start.yyyymmdd());
						start.setDate(start.getDate() + 1);
					}
					
					return arr;
				} else {
					return null
				}
			},
			
			userWarn() {
				if(new Date(this.startDate) > new Date(this.endDate)) { return true } 
				else { return false }
			},
			
			tildeColor() {
				if(new Date(this.startDate) > new Date(this.endDate)) { return 'red' } 
				else { return 'teal' }
			},
			
			userMessage() {
				if(this.startDate == '' && this.endDate == '') { return '희망하는 입영기간을 선택하세요'}
					
				var start = new Date(this.startDate)
				var end = new Date(this.endDate)
				if(start > end) { return '오른쪽에 더 늦은 날을 입력하세요'}
				
				start = this.startDate
				end = this.endDate
				
				return start + ' ~ ' + end
			},
			
			tableLoading() {
				if(this.isEmptyData) {
					return false
				} else {
					return !this.dates.length
				}
			},
		},
		
		beforeRouteEnter (to, from, next) {
			next(vm => {
				if(vm.$store.state.currentStartDate != ''){
					vm.startDate = vm.$store.state.currentStartDate
					vm.endDate = vm.$store.state.currentEndDate
					vm.dateSelect()
				}
			})
		},
		
		methods: {
			displayScore(val){
				console.log('test' + val)
				if(isNaN(val)) {return 'X'}
				else if(val == 0) {return '.'}
				else{return val.toString().substring(0,4)}
			},
			
			clickRow(item) {
				router.push('manage/' + item.mosId)
			},
			
			getRecruits() {
				this.isLoaing = true
				
				this.$firebase.firestore().collectionGroup('DATE')
					.where('enlist', '>=', this.startDate)
					.where("enlist", "<=", this.endDate).get()
				
				.then(querySnapshot => {
					this.dates = []
					this.isEmptyData =  querySnapshot.empty
					
					var idx = 0
					querySnapshot.forEach(recruitDoc => {
						const { accept, discharge, enlist, register } = recruitDoc.data()

						recruitDoc.ref.parent.parent.get()
						.then(mosDoc => {
							var name = mosDoc.data().name
							var group = mosDoc.data().group
							var sort = mosDoc.data().sort
							var id = mosDoc.id
							
							this.getMosRates(mosDoc.id, idx++)
							this.dates.push({ 
								accept, discharge, enlist, register, mosId:id, name:name, id:recruitDoc.id, group:group, sort:sort, score: 0
							})
						})
					});
					
					this.isLoaing = false
					this.isDateSelected = true
				})
				.catch(error => {
					console.log("Error getting Rates:", error);
				});
			},
			
			dateSelect() {
				if(this.isDateSelected){
					this.$store.state.currentStartDate = this.$store.state.currentEndDate = ''
					this.isDateSelected = false
					this.buttonIcon = 'mdi-table-search'
					this.startDate = this.endDate = ''
					this.isButtonDisable = true
					this.dates= []
				} else {
					this.$store.state.currentStartDate = this.startDate
					this.$store.state.currentEndDate = this.endDate
					this.buttonIcon = 'mdi-refresh'
					this.getRecruits()
				}
			},
			
			getMosRates(id, index) {
				this.$firebase.firestore().collection("MOS").doc(id).collection("RATE").get()
				.then(querySnapshot => {
					var sum = 0
					var count = 0
					
					querySnapshot.forEach(doc => {
						sum += doc.data().score
						count ++
					});

					this.dates[index].score = sum/count;
				})
				.catch(error => {
					console.log("Error getting Rates:", error);
				});
			},
		}
	}
</script>