<template>
	<v-row>
		<v-col v-if='isGetted'>
			<v-card class='mx-auto' max-width=900>
				
				<v-card-title class='pb-4'>
					현재 모집일정: {{ recruits.length }}
				</v-card-title>
				
				<v-simple-table v-if='recruits.length'>
					<template v-slot:default>
						<thead>
							<tr>
								<th class="text-center">입대일</th>
								<th class="text-center">전역일</th>
								<th class="text-center">마감일</th>
								<th class="text-center">합격일</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in recruits" :key="item.name">
								<td class="text-center">{{ item.enlist }}</td>
								<td class="text-center">{{ item.discharge }}</td>
								<td class="text-center">{{ item.register }}</td>
								<td class="text-center">{{ item.accept }}</td>
							</tr>
						</tbody>
					</template>
				</v-simple-table>


			</v-card>
		</v-col>
	</v-row>
</template>

<script>
	
	export default{
		props: ['id'],
		
		data: () => ({
			isGetted: false,
			
			recruits: [],
		}),
		
		created() {
			this.getRecruits()
		},
		
		methods: {
			getRecruits() {
				this.$firebase.firestore().collection("MOS").doc(this.id).collection("DATE").get()
				.then(querySnapshot => {
					this.recruits = []
					this.isGetted = true
					querySnapshot.forEach(doc => {
						const { enlist, discharge, accept, register } = doc.data()
						this.recruits.push({
							enlist, discharge, accept, register
						})
					});
				})
				.catch(error => {
					console.log("Error getting Rates:", error);
				});
			},
		}
	}
</script>