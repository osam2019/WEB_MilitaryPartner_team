<template>
	<v-app>
		<core-navigation />
		<core-content />
		
	</v-app>
</template>

<script>
	export default {
		components: {
			CoreContent: () => import ('@/components/core/Content'),
			CoreNavigation: () => import ('@/components/core/Navigation'),
		},
	}
</script>