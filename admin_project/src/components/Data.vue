<template>
	<v-app>
		<v-app-bar app>
			<v-toolbar-title><v-btn text to='/data/home'>MP Admin Center</v-btn></v-toolbar-title>
			<div class="flex-grow-1"></div>
			
			<v-btn v-on:click.native="logout" icon>
				<v-icon>mdi-logout</v-icon>
			</v-btn>
		</v-app-bar>
		
		<router-view />
		
		<v-bottom-navigation app color="teal" shift>
			<v-btn to="/data/add" value="add">
				<span>Add</span>
				<v-icon>mdi-plus-box-multiple-outline</v-icon>
			</v-btn>
			
			<!-- <v-btn to="/data/home" value="home">
				<span>Home</span>
				<v-icon>mdi-home-outline</v-icon>
			</v-btn> -->
			
			<v-btn to="/data/manage" value="manage">
				<span>Manage</span>
				<v-icon>mdi-clipboard-list-outline</v-icon>
			</v-btn>
		</v-bottom-navigation>
	</v-app>
</template>

<script>
	import router from '../router'
	
	export default {
		methods: {
			logout() {
				console.log('User signed out');
				this.$firebase.auth().signOut()
			}
		},
	}
</script>