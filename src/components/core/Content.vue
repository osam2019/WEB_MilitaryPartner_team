<template>
	<v-content>
		<v-container fluid>
			<router-view></router-view>
			<v-btn-toggle rounded dark class="togglePos">
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn 
							v-model="idDial"
							v-on='on'
							color='teal'
							v-if='$vuetify.breakpoint.smAndUp'
							@click='isIntroView = true'
						>
							<v-icon>mdi-information-variant</v-icon>
						</v-btn>
					</template>
					<span>사용 매뉴얼</span>
				</v-tooltip>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn 
							v-model="idDial"
							v-on='on'
							color='teal'
							v-if='$vuetify.breakpoint.smAndUp'
							href='https://military-partner-data.web.app/'
						>
							<v-icon>mdi-database</v-icon>
						</v-btn>
					</template>
					<span>어드민 페이지(데이터 입력)</span>
				</v-tooltip>
			</v-btn-toggle>
			<intro @closeIntro='isIntroView = false' :isIntroView='isIntroView'></intro>
		</v-container>
	</v-content>
</template>

<script>
import intro from '../Intro';
	
	export default{
		components: {
			intro,
		},
		
		mounted(){
			if (!this.$cookies.isKey('isNotFirst') || this.$cookies.get('isNotFirst') == 'true') {
				console.log('첫 실행')
				this.isIntroView = true
			}
		},
		
		data: () => ({
			isIntroView: false,
			isDial: false,
		}),
	}
</script>

<style>
	.togglePos {
		position: fixed;
		bottom: 10px;
	}
</style>