<template>
	<v-content>
		<v-container fluid class="px-sm-3 px-md-6 px-lg-12 px-xl-12">
			<v-data-iterator
				:loading='!isGetted' 
				:items="mosesDisplay" 
				:search="filterMos"
				:items-per-page='setItemsPerPage'
				:sort-by="sortBy"
				:page.sync="currentPage"
				:sort-desc="sortDesc"
				hide-default-footer
			>
				
				<template v-slot:no-results>
					<v-row align='center' justify='center'> 
						<v-col>
							<p class='text-center'>{{ filterMos }} 데이터가 없습니다.</p>
						</v-col>
					</v-row>
				</template>

				<template v-slot:no-data>
					<v-row align='center' justify='center'> 
						<v-col>
							<p class='text-center'>해당 데이터가 아직 없습니다.</p>
						</v-col>
					</v-row>
				</template>

				<template v-slot:loading>
					<v-progress-linear
						indeterminate
						color="teal"
					></v-progress-linear>
				</template>

				<template v-slot:default='props'>
					<v-row>
						<v-col 
							v-for="item in props.items" 
							:key="item.id"
							cols="12" sm="6" md="4" lg="3" xl="2"
						>
							<v-card elevation=3 class='mx-1 my-1' @click='mosClick(item.id)'>
								
								<v-card-text>
									<v-icon 
										:color="whichIconColor(item.group)"
										class='mr-2'
									>{{ whichIcon(item.group) }}</v-icon>
									<span class="title font-weight-bold">{{ item.name }} </span>
									<p class="caption"> {{ item.sort }}</p>
									
									<div class='mt-n2'>
										<v-rating
											readonly
											dense small color="orange"
											class='d-inline' 
											background-color="orange lighten-3"
											v-model='item.scoreValue'
										></v-rating>
										<span class='ml-2'>{{ socreMessage(item.scoreValue, item.scoreCount) }}</span>
									</div>
									
									<p class='mt-2 mb-n1'>{{ item.descript }}</p> 
								</v-card-text>
							</v-card>
						</v-col>
					</v-row>
				</template>

				<template v-slot:header>
					<v-row justify='center' v-if='isGetted'>
						<v-col cols=11 sm=4 lg=2>
							<v-text-field
								v-model="filterMos"
								flat
								hide-details
								prepend-inner-icon="mdi-feature-search-outline"
								label="Search"
								></v-text-field>
						</v-col>
						
						<v-col cols=7 sm=3 lg=2>
							<v-select
								v-model="sortByMark"
								flat
								hide-details
								:items="sortKeys"
								prepend-inner-icon="mdi-sort"
								label="Sort by"
							></v-select>

						</v-col>
						
						<v-col cols=4 sm=2 lg=1>
							<v-btn-toggle
								v-model="sortDesc"
								mandatory
								color="teal"
								rounded				
							>
								<v-btn :value="false">
									<v-icon>mdi-arrow-up</v-icon>
								</v-btn>
								<v-btn :value="true">
									<v-icon>mdi-arrow-down</v-icon>
								</v-btn>
							</v-btn-toggle>
						</v-col>
						
						<v-col
							cols="12"
							lg=1
							class="mt-n2 mb-n4 my-lg-0 text-center"
						>
							<v-btn-toggle
								v-model="sortGroup"
								tile
								color="teal darken-3"
								group
								multiple
							>
								<v-btn value="육군">육군</v-btn>
								<v-btn value="해군">해군</v-btn>
								<v-btn value="공군">공군</v-btn>
								<v-btn value="해병대">해병대</v-btn>
								<v-btn value="의경">의경</v-btn>
								
							</v-btn-toggle>
						</v-col>
					</v-row>
				</template>

				<template v-slot:footer="{ pagination }">
					<v-pagination
						v-show='isGetted'
						v-model="currentPage"
						:length="pagination.pageCount"
					></v-pagination>
				</template>


			</v-data-iterator>
		</v-container>

	<v-btn
		fab large fixed white
		color= "blue" bottom right
		class="mb-12"
		v-show='$vuetify.breakpoint.xsOnly'
		@click = "scrollToTop"
		><v-icon color="white">mdi-arrow-up </v-icon>
	</v-btn>

	</v-content>
</template>

<script>
	import router from '@/router'
	
	export default {
		data: () => ({
			moses: [],
			
			filterMos: '',
			sortByMark: '',
			sortDesc: true,
			sortGroup: [ "육군", "해군", "공군", "해병대", "의경" ],
			sortKeys: ['평점', '평가자'],
			
			isGetted: false,
			currentPage: 1,	
		}),
		
		created() {
			this.getMoses()
		},
		
		computed: {
			mosesDisplay() {
				if(this.sortGroup.length == 5) {
					return this.moses
				} else if (this.sortGroup.length == 0) {
					return []
				} else {
					var temp = []
					for(var i in this.sortGroup) {
						
						this.moses.forEach(doc => {
							if(doc.group == this.sortGroup[i]) {
								temp.push(doc)
							}
						});
						
					}
					return temp
				}

			},
			
			sortBy() {
				switch(this.sortByMark){
					case '평점': return 'scoreValue'
					case '평가자': return 'scoreCount'
					default: return '';
				}
			},
			
			setItemsPerPage () {
				switch (this.$vuetify.breakpoint.name) {
					case 'xs': return 30
					case 'sm': return 6
					case 'md': return 9
					case 'lg': return 12
					case 'xl': return 18
					default: return 0
				}
			},
		},
		
		methods: {
			scrollToTop() {
				window.scroll({
					top: 0,
					left: 0,
					behavior: 'smooth'
				})
			},
			
			socreMessage(score, count){
				if(score == 0) {
					return 'loading..'
				}
				if(count == 0) {
					return '평가 없음'
				}
				return score.toString().substring(0,4) + ' (' + count + ')'
			},
			
			whichIcon (group) {
				switch (group) {
					case "육군": return "mdi-tank"
					case "해군": return "mdi-ship-wheel"
					case "공군": return "mdi-airplane"
					case "의경": return "mdi-police-badge-outline"
					case "해병대": return "mdi-anchor"
					default: break
				}
			},
			
			whichIconColor (group) {
				switch (group) {
					case "육군": return "#558B2F"
					case "해군": return "#00838F"
					case "공군": return "#4527A0"
					case "의경": return "#1565C0"
					case "해병대": return "#C62828"
					default: break
				}
			},
			
			mosClick(id) {
				router.push('manage/' + id)
			},
			
			async getMoses() {
				const snapshot = await this.$firebase.firestore().collection('MOS').get()
				this.moses = []
				console.log(snapshot.docs.length + " moses in DB")
				
				var index = 0

				snapshot.forEach(value => {
					const { name, sort, group, descript } = value.data()
					var dspt = descript
					if(descript.length > 80) {
						dspt = descript.substring(0,80) + ' ..'
					}
					
					this.getMosRates(value.id, index++)
					
					this.moses.push({
						name, sort, group, descript:dspt, id:value.id, scoreValue: 0, scoreCount: 0
					})
				})
				this.isGetted = true
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
					
					this.moses[index].scoreValue = sum/count
					this.moses[index].scoreCount = count
				})
				.catch(error => {
					console.log("Error getting Rates:", error);
				});
			},
		}
	}
</script>