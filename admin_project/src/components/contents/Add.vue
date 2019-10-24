<template>
	<v-content>
		<v-container class="fill-height" fluid>
			<v-form @submit.prevent="postMos" ref="form" v-model="isSubmitFormValid" class='mx-auto'>
				<v-row align="center" justify="center">
				
					<v-col cols=9 sm=3>
						<v-text-field
							:rules="[rules.required]"
							v-model="mosName"
							placeholder="이름" 
							prepend-inner-icon="mdi-pencil-box-multiple-outline" 
						/>
					</v-col>
					<v-col cols=9 sm=3>
						<v-select
							:rules="[rules.required]"
							v-model='mosGroup'
							:items="this.$store.state.groups"
							prepend-inner-icon="mdi-clipboard-list-outline" 
							label="군종"
						></v-select>
					</v-col>
					<v-col cols=9 sm=3>
						<v-select
							:rules="[rules.required]"
							v-model='mosSort'
							:items="sorts"
							prepend-inner-icon="mdi-wunderlist" 
							label="계열"
						></v-select>
					</v-col>
					<v-col cols=9>
						<v-textarea
							:rules="[rules.required]"
							v-model='mosDescript'
							prepend-inner-icon="mdi-comment"
							label="특기정보"
						></v-textarea>
					</v-col>
					
					<v-col cols=12 >
						<div class="my-12 text-center">
							<v-btn 
								:loading='isSubmitLoading'
								type="submit" 
								rounded width=300 color="teal" 
								class="white--text" 
								elevation=2 
								:disabled='!isSubmitFormValid'
							>Submit</v-btn>
							<v-btn 
								color="error" elevation=2 fab small 
								class="ml-4" 
								v-on:click.native="$refs.form.reset()" 
							>
								<v-icon>
									mdi-refresh
								</v-icon>
							</v-btn>
						</div>
					</v-col>
				</v-row>
			</v-form>
		</v-container>
	</v-content>
</template>

<script>
	export default {
		data: () => ({
			mosName: '',
			mosGroup: '',
			mosSort: '',
			mosDescript: '',
			
			rules: {
				required: value => !!value || '필수 입력 항목입니다.',
			},
			
			isSubmitLoading: false,
			isSubmitFormValid: false,
		}),
		
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
			postMos() {
				this.isSubmitLoading = true
				console.log('Add: Submit data')
				
				this.$firebase.firestore().collection('MOS').add({
					name: this.mosName,
					group: this.mosGroup,
					sort: this.mosSort,
					descript: this.mosDescript,
				})
				.then(ref => {
					this.$toasted.show('특기가 추가되었습니다');
					
					this.$refs.form.reset()
					this.isSubmitLoading = false
					console.log('Add: Added document with ID: ', ref.id);
				})
				.catch(error => {
					this.isSubmitLoading = false
					console.log('Add: Failed with error: ', error);
				});
			}
		}
	}
</script>