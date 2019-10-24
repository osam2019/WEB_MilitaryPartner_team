<template>
	<v-content>
		<v-container fluid class="px-sm-3 px-md-6 px-lg-12 px-xl-12">
			<v-data-iterator 
				loading 
				:items="moses" 
				hide-default-footer 
				:search="filterMos"
				:items-per-page=100
			>
				
				<template v-slot:no-results>
					<v-row align='center' justify='center'> 
						<v-col>
							<p class='text-center'>{{ filterMos }} 데이터가 없습니다.</p>
						</v-col>
					</v-row>
				</template>

				<template v-slot:header>
					<v-row justify='center'>
						<v-col cols=11 sm=4 lg=2>
							<v-text-field
								v-model="filterMos"
								clearable
								flat
								hide-details
								prepend-inner-icon="mdi-database-edit"
								label="Search"
								></v-text-field>
						</v-col>
					</v-row>

				</template>

				<template v-slot:default='props'>
					<v-row>
						<v-col 
							v-for="item in props.items" 
							:key="item.id"
							cols="12" sm="6" md="4" lg="3" xl="2"
						>
							<v-card elevation=4>
								
								<v-card-text>
									<v-icon 
										:color="whichIconColor(item.group)"
										class='mr-2'
									>{{ whichIcon(item.group) }}</v-icon>
									<span class="title font-weight-bold">{{ item.name }} </span>
									<p class="caption"> {{ item.sort }}</p>
									
									

									
									<p class='mt-2 mb-n3'>{{ item.descript }}</p> 
									
								</v-card-text>
								
								<v-card-actions>
									<v-btn icon @click='openisDialogView(item)'>
										<v-icon color='#26A69A'>mdi-trash-can</v-icon>
									</v-btn>
									
									<v-btn icon @click='pushMos(item)'>
										<v-icon color='#26A69A'>mdi-settings-outline</v-icon>
									</v-btn>
								</v-card-actions>
								
							</v-card>
						</v-col>
					</v-row>
				</template>

			</v-data-iterator>
		</v-container>

			<v-dialog v-model="isDialogView" persistent max-width="290">
				<v-card>
					<v-card-title class="headline">삭제하시겠습니까?</v-card-title>
					<v-card-text><p class='text-center'>
						{{currentDeleteGroup + ' ' + currentDeleteName}}
						</p></v-card-text>
					<v-card-actions class='mt-n8'>
						<div class="flex-grow-1"></div>
						<v-btn text @click="isDialogView = false">취소</v-btn>
						<v-btn color="red darken-1" text @click="deleteMos()">삭제</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>

	</v-content>
</template>

<script>
	import router from '@/router'
	
	export default {
		data: () => ({
			moses: [],
			
			filterMos: '',
			
			sortMos: '',
			sortDesc: false,
			sortKeys: ['평점', '입영일자', '조회수'],
			
			isDialogView: false,
			
			currentDeleteId: null,
			currentDeleteName: null,
			currentDeleteGroup: null,
		}),
		
		created() {
			this.getMoses()
		},
		
		methods: {
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
			
			pushMos(item) {
				router.push('manage/' + item.id)
			},
			
			async getMoses() {
				const snapshot = await this.$firebase.firestore().collection('MOS').get()
				this.moses = []
				
				console.log(snapshot.docs.length + " moses in DB")
				
				snapshot.forEach(v => {
					const { name, sort, group, descript } = v.data()
	
					this.moses.push({
						name, sort, group, descript, id:v.id
					})
				})
			},
			
			// hasRecruit(id) {
			// 	var result = this.$firebase.firestore().collection('MOS').doc(id).collection('DATE').get()
			// 	.then(query => {
			// 		return query.size
			// 	});
			// },
			
			openisDialogView(item) {
				this.isDialogView = true
				this.currentDeleteId = item.id
				this.currentDeleteGroup = item.group
				this.currentDeleteName = item.name
			},
			
			deleteMos() {
				this.$firebase.firestore().collection("MOS").doc(this.currentDeleteId).delete()
				.then(() => {
					this.$toasted.show('특기가 삭제되었습니다');	
					console.log("Manage: Document successfully deleted");
					this.getMoses()
					this.isDialogView = false
				})
				.catch(error => {
					console.error("Manage: Error removing document: ", error);
				});
			}
		}
	}
</script>