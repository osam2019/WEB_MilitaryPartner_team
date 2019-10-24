<template>
	<v-row>
		<v-col class='mt-6 mt-md-2'>
			<v-card :loading='!isGetted' class='mx-auto mt-12 mt-lg-0' max-width=900>
				<v-card-title class=' '>
					<span class="grey--text text--darken-3 font-weight-black display-1">
						{{ mosName + ' : ' + mosGroup}}
					</span>
					<span>&nbsp; {{ ' - ' + mosSort }}</span>
				</v-card-title>
				
				<v-card-text class='mt-2'>
					{{ mosDescript }}
				</v-card-text>
			</v-card>
		</v-col>
	</v-row>
</template>

<script>
	
	export default{
		props: ['id'],
		
		data: () => ({
			mosName: '',
			mosGroup: '',
			mosSort: '',
			mosDescript: '',
			isGetted: false
		}),
		
		created() {
			this.getMos()
		},
		
		methods: {
			getMos() {
				this.$firebase.firestore().collection("MOS").doc(this.id).get()
				.then(doc => {
					if (doc.exists) {
						console.log("Document data:", doc.data());
						this.mosName = doc.data().name
						this.mosGroup = doc.data().group
						this.mosSort = doc.data().sort
						this.mosDescript = doc.data().descript
						// ..
					} else {
						console.log("No such Mos");
					}
					this.isGetted = true
				})
				.catch(error => {
					console.log("Error getting Mos:", error);
				});
			},
		}
	}
</script>