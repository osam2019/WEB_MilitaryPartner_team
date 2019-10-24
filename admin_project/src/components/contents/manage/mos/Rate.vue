<template>
	<v-data-table
		:headers="headers"
		:items="rates"
		:items-per-page="15"
		:sort-by='["time"]'
		:sort-desc="[true]"
								class="elevation-1"
	>
			<template v-slot:item.time="{ item }">
				{{ item.time.toDate().yyyymmdd() }}
			</template>

			<template v-slot:top>
				<v-toolbar flat color="white">
					<v-toolbar-title class='headline'>
						평점 & 후기 {{ mosRatingValue + ' (' + mosRatingCount + ')'}}
					</v-toolbar-title>
				</v-toolbar>
			</template>

			<template v-slot:item.action="{ item }">
				<v-icon color='#B71C1C' small @click="deleteRecruit(item)">
					mdi-delete
				</v-icon>
			</template>

			<template v-slot:no-data>
				평점 & 후기 데이터가 없습니다
			</template>
		</v-data-table>
</template>

<script>
	import router from '@/router'
	
	export default {
		props: ['id'],
		
		data: () => ({
			isLoading: true,
			headers: [
				{ text: '평점', align:'center', value: 'score',},
				{ text: '내용', align:'center', value: 'content' },
				{ text: '작성시간', align:'center', value: 'time' },
				{ text: '', value: 'action', sortable: false },
			],
			
			rates: [],
			
			mosRatingValue: ''
		}),
		
		created() {
			this.getRates()
		},
		
		computed: {
			mosRatingCount() {
				return this.rates.length
			},
		},
		
		methods: {
			calculateRateScore(){
				var sum = 0;
				this.rates.forEach((arr) => {
					sum += arr.score
				})
				if(sum == 0) {
					this.mosRatingValue = '0'
					return
				} 
				this.mosRatingValue = (sum/this.mosRatingCount).toString().substring(0, 4)
			},
			
			deleteRecruit(item) {
				this.$firebase.firestore().collection("MOS").doc(this.id).collection("RATE").doc(item.id).delete()
				.then(() => {
					console.log("Rate: successfully deleted");
					this.$toasted.show('평가가 삭제되었습니다');	
					this.getRates()
				}).catch(error => {
					console.error("Error removing Rate: ", error);
				});
				console.log(item)
			},
			
			getRates() {
				this.$firebase.firestore().collection("MOS").doc(this.id).collection("RATE").get()
				.then(querySnapshot => {
					this.rates = []
					this.isGetted = true
					querySnapshot.forEach(doc => {
						const { score, content, time } = doc.data()
						this.rates.push({
							score, content, time, id:doc.id
						})
					});
					this.calculateRateScore()
				})
				.catch(error => {
					console.log("Error getting Rates:", error);
				});
			},
		}
	}
	Date.prototype.yyyymmdd = function() {
		var mm = this.getMonth() + 1; // getMonth() is zero-based
		var dd = this.getDate();
		var hh = this.getHours();
		var mmm = this.getMinutes();
		var ss = this.getSeconds();

		return [this.getFullYear(), (mm>9 ? '' : '0') + mm, (dd>9 ? '' : '0')+dd+' '+hh+':'+mmm+':'+ss].join('-');
	};
</script>