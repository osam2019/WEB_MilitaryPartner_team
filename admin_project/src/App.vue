<template>
	<v-app>
		<v-container class="fill-height" fluid v-if="!$isFirebaseAuth">
			<v-row align="center" justify="center">
				
				<v-progress-circular
					:size="70"
					:width="7"
					indeterminate
					color="teal"
				></v-progress-circular>
				
				<v-col cols=12>
					<p class="caption text-center">관리자 권한 요청 중입니다.</p>
				</v-col>
				
			</v-row>
		</v-container>
		
		<vue-progress-bar></vue-progress-bar>
		
		<router-view />
	</v-app>
</template>