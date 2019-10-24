<template>
	<v-form @submit.prevent="putMos" v-model="isModifyFormValid">
		<v-row align="center" justify="center" no-gutters class='mt-md-12'>
			<v-col cols=11 md=3 class='px-md-2 mt-12 pt-7 mt-md-0 pt-md-0'>
				<v-text-field
					solo
					:rules="[rules.required]"
					v-model="mosName"
					placeholder="이름" 
					prepend-inner-icon="mdi-pencil-box-multiple-outline" 
				/>
			</v-col>
			<v-col cols=5 md=3 class='px-md-2'>
				<v-select
					@change='checkIsSortEmpty'
					solo
					:rules="[rules.required]"
					v-model='mosGroup'
					:items="this.$store.state.groups"
					prepend-inner-icon="mdi-clipboard-list-outline" 
					label="군종"
				></v-select>
			</v-col>
			<v-col cols=5 offset=1 offset-md=0 md=3 class='px-md-2'>
				<v-select
					solo
					:rules="[rules.required]"
					v-model='mosSort'
					:items="sorts"
					prepend-inner-icon="mdi-wunderlist" 
					label="분류"
				></v-select>
			</v-col>
			<v-col cols=11 md=9 class='px-md-2'>
				<v-textarea
					solo
					:rules="[rules.required]"
					v-model='mosDescript'
					prepend-inner-icon="mdi-comment"
					label="특기정보"
				></v-textarea>
			</v-col>
					
			<v-col cols=12 class='pa-2 mb-3 mt-n2'>
				<div class="text-center">
					<v-btn 
						:loading='isModifyLoading'
						type="submit" 
						rounded width=300 color="teal" 
						class="white--text" 
						elevation=2 
						:disabled='!isModifyFormValid'
					>Modify</v-btn>
				</div>
			</v-col>
		</v-row>
	</v-form>
</template>

<script>
	export default {
		props: ['id'],
		
		data: () => ({
			mosName: '',
			mosGroup: '',
			mosSort: '',
			mosDescript: '',
			
			rules: {
				required: value => !!value || '필수 입력 항목입니다.',
			},
			
			isModifyLoading: false,
			isModifyFormValid: false,
			
			isSnackView: false,
		}),
		
		created() {
			this.getMos()
		},
		
		computed: {
			sorts() {
				switch (this.mosGroup) {
					case '육군': return this.$store.state.armySort;
					case '해군': return this.$store.state.navySort;
					case '공군': return this.$store.state.airforceSort;
					case '의경': return this.$store.state.policeSort;
					case '해병대': return this.$store.state.marineSort;
					default: break;
				}
			},
		},
		
		methods: {
			checkIsSortEmpty() {
				this.isModifyFormValid = false
				this.mosSort = ''
			},
			
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
				})
				.catch(error => {
					console.log("Error getting Mos:", error);
				});
			},
			
			putMos() {
				this.$firebase.firestore().collection("MOS").doc(this.id).set({
					name: this.mosName,
					group: this.mosGroup,
					sort: this.mosSort,
					descript: this.mosDescript,
						// ..
				})
				.then(() => {
					console.log("Mos successfully modified");
					this.$toasted.show('특기가 수정되었습니다');
					this.isSnackView = true
				})
				.catch(function(error) {
					console.error("Error modifying Mos: ", error);
				});
			},
		}
	}
</script>