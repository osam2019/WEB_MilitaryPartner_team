<template>
	<v-content>
		<v-container class="fill-height" fluid>
			<v-row align="center" justify="center">
				<v-col>
					<v-card :loading="cardIsload" class="mx-auto" max-width=450>
						<p class="text-center pt-12 pb-8 display-1 font-weight-black">Login</p>
						
						<v-form @submit.prevent="login">
							<p class="ml-12 mb-n4 body-2">E-mail</p>
							<v-text-field
								v-model="userEmail"
								height=45
								placeholder="Type your E-mail" 
								class="mx-12" 
								prepend-inner-icon="mdi-account-outline"
							/>
							
							<p class="ml-12 mb-n4 body-2">Password</p>
							<v-text-field
								v-model="userPassword"
								height=45
								class="mx-12" 
								placeholder="평가용 비밀번호: swadmin" 
								prepend-inner-icon="mdi-lock-outline"
								:append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
								@click:append="show_password = !show_password"
								:type="show_password ? 'text' : 'password'"
							/>
							<div class="my-12 pb-12 text-center">
								<v-btn type="submit" rounded width=300 dark color="#5E35B1">LOGIN</v-btn>
							</div>
							<p class='text-center body-2'>국방부 SW집체교육 평가중인 페이지 입니다.</p>
							<p class='text-center body-2'>무단으로 데이터 변경을 금지합니다.</p>
						</v-form>

					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>

<script>
	import router from '../router'
	
	export default {
		data: () => ({
			cardIsload: false,
			show_password: false,
			
			userEmail: "admin@admin.admin",
			userPassword: "",
		}),
		 mounted () {
			 this.onResize()
		 },
		
		methods: {
			login() {
				this.cardIsload = true
				
				this.$firebase.auth().signInWithEmailAndPassword(this.userEmail, this.userPassword)
				.then(response => {
					console.log(response);
					console.log('User signed in');
					this.cardIsload = false
				})
				.catch(error => {
					var errorCode = error.code;
					var errorMessage = error.message;
					console.log(errorCode+ ": ")
					console.log(errorMessage)
					this.cardIsload = false
				})
			}
		},
	};
</script>