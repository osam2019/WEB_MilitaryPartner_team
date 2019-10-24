<template>
	<v-row>
		<v-col v-if='isGetted'>
			<v-card class='mx-auto' max-width=900>
				<v-card-title>
					<v-rating 
						:value=1
						background-color="teal lighten-3"
						large length=1
						readonly
					/>
					<span class="grey--text text--darken-1">
						{{ mosRatingValue + ' (' + mosRatingCount + ')'}}
					</span>
				</v-card-title>
				
				<v-text-field counter maxlength="50" v-model='rateContent' class='mx-12' label="후기 & 평가" />
				<div class='text-center'>
					<v-rating v-model='rateScore' background-color="teal lighten-3" large />
				</div>
				
				<div class='mt-5 text-center'>
					<v-btn @click='postRate' color='blue' width=300 :disabled='postButtonDisabled'>
						<v-icon color='white'>mdi-send</v-icon>
					</v-btn>
				</div>	
				
				<v-data-table
					:headers="headers"
					:items="rates"
					:items-per-page="15"
				>
					<template v-slot:item.time="{ item }">
						{{ getFuzzy(item.time) }}
					</template>

					<template v-slot:item.score="{ item }">
					<span class="teal--text font-weight-black">
						{{ item.score }}
					</span>
					</template>
				</v-data-table>

			</v-card>
		</v-col>
	</v-row>
</template>

<script>
	
	export default{
		props: ['id'],
		
		data: () => ({
			isGetted: false,
			
			mosRatingValue: 0,
			
			rates: [],
			
			headers: [
				{ text: '평점', align:'center', value: 'score',},
				{ text: '내용', align:'center', sortable: false, value: 'content' },
				{ text: '작성시간', align:'center', value: 'time' },
			],
			
			rateContent: '',
			rateScore: 0,
		}),
		
		created() {
			this.getRates()
		},
		
		computed: {
			mosRatingCount() {
				return this.rates.length
			},
			
			postButtonDisabled() {
				if(this.rateContent != '' && this.rateScore != 0) {
					return false
				} else {
					return true
				}
			}
		},
		
		methods: {
			getFuzzy(date){
				
				var delta = Math.round((+new Date - date.toDate()) / 1000);
				
				var minute = 60,
						hour = minute * 60,
						day = hour * 24,
						week = day * 7;
				
				var fuzzy;

				if (delta < 30) { fuzzy = '방금전' }
				else if (delta < minute) { fuzzy = delta + ' 초전' } 
				else if (delta < 2 * minute) { fuzzy = '1분전' } 
				else if (delta < hour) { fuzzy = Math.floor(delta / minute) + ' 분 전' } 
				else if (Math.floor(delta / hour) == 1) { fuzzy = '1 시간 전' } 
				else if (delta < day) { fuzzy = Math.floor(delta / hour) + ' 시간 전' } 
				else if (delta < day * 2) { fuzzy = '어제' }
				else if (delta < week) { fuzzy = Math.floor(delta / day) + ' 일 전' }
				
				else { fuzzy = date.toDate().yyyymmdd() }
				return fuzzy
			},
			
			calculateRateScore(){
				var sum = 0;
				this.rates.forEach((arr) => {
					sum += arr.score
				})
				if(sum == 0) {
					this.mosRatingValue
					return
				} 
				this.mosRatingValue = (sum/this.mosRatingCount).toString().substring(0, 4)
			},
			
			getRates() {
				this.$firebase.firestore().collection("MOS").doc(this.id).collection("RATE").orderBy("time",'desc').get()
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
			
			postRate() {
				this.$firebase.firestore().collection("MOS").doc(this.id).collection("RATE").add({
					score: this.rateScore,
					content: this.rateContent,
					time: this.$firebase.firestore.Timestamp.now(),
					
				})
				.then(() => {
					console.log("Rate successfully posted");
					this.rateContent = '',
					this.rateScore = 0,
					this.getRates()
				})
				.catch(function(error) {
					console.error("Error posting Rate: ", error);
				});
			},
		}
	}
</script>