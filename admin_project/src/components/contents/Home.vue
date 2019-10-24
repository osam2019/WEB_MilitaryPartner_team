<template>
	<v-content>
		<v-container class="fill-height" fluid>
			<v-row align="center" justify="center">
				<v-col cols=12 sm=11 md=6 xl=4>
					<v-card>
						<v-card-title>방문자 통계</v-card-title>
						
						<v-card-actions>
							<div class="flex-grow-1"></div>
							<v-btn text fab small color="indigo">
								<v-icon>mdi-chevron-down</v-icon>
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-col>
				
				<v-col cols=12 sm=11 md=6 xl=4>
					<v-card>
						<v-card-title>최근 평점</v-card-title>
						
						<v-card-actions>
							<div class="flex-grow-1"></div>

							<v-btn text fab small color="indigo" v-if="showstar" @click="add_star">
								<v-icon>mdi-chevron-down</v-icon>
							</v-btn>

							<v-btn text fab small color="indigo" @click="showstar = !showstar">
								<v-icon>{{ showstar ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
							</v-btn>
						</v-card-actions>

						<v-expand-transition>
							<div v-show="showstar">
							<v-divider></v-divider>

							<v-card-text v-for="star in stars">
								{{star.score}}
								<v-divider class="mt-7"></v-divider>
							</v-card-text>
							</div>
						</v-expand-transition>

					</v-card>
				</v-col>
				
				<v-col cols=12 sm=11 md=6 xl=4>
					<v-card>
						<v-card-title>최근 질문</v-card-title>
						
						<v-card-actions>
							<div class="flex-grow-1"></div>

							<v-btn text fab small color="indigo" v-if="showpy" @click="add_que">
								<v-icon>mdi-chevron-down</v-icon>
							</v-btn>

							<v-btn text fab small color="indigo" @click="showpy = !showpy">
								<v-icon>{{ showpy ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
							</v-btn>
						</v-card-actions>

						<v-expand-transition>
							<div v-show="showpy">
							<v-divider></v-divider>

							<v-card-text v-for="que in ques">
								{{que.title}}<v-divider class="mt-7"></v-divider>
							</v-card-text>
							</div>
						</v-expand-transition>

					</v-card>
				</v-col>
				
				<v-col cols=12 sm=11 md=6 xl=4>
					<v-card>
						<v-card-title>문의/건의</v-card-title>
						
						<v-card-actions>
							<div class="flex-grow-1"></div>
							<v-btn text fab small color="indigo">
								<v-icon>mdi-chevron-down</v-icon>
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>

<script>
  export default {
    data: () => ({
      showpy: false,
			showstar: false,
			clickstar: 0,
			stars: [{
				score: '처음 값',
			}],
			ques: [{
				title: '처음 값',
			}]
    }),
		methods: {
	  	async add_que() {
				const snapshot = await this.$firebase.firestore().collection('QNA').get()
				snapshot.forEach( v => {
					const{ title } = v.data()
					this.ques.push({
						title
					})
				})
			},
			async add_star() {
				this.clickstar = this.clickstar + 1
				const snapshot = await this.$firebase.firestore().collectionGroup("RATE")
				.orderBy('time').limit(this.clickstar).get()

				snapshot.forEach( v => {
					const{ score } = v.data()
					this.stars.push({
						score
					})
				})	
			},
		}
	}
</script>