<template>
		<v-bottom-navigation 
			color="primary" 
			shift 
			grow 
			:max-width=600
			class="mx-auto"
			:app="$vuetify.breakpoint.xsOnly"
		>
			<v-btn to="/question" value="question">
				<span>QnA</span>
				<v-icon>mdi-comment-question-outline</v-icon>
			</v-btn>

			<v-btn to="/" value="search">
				<span>Search</span>
				<v-icon>mdi-feature-search-outline</v-icon>
			</v-btn>

			<v-btn to="/information" value="information">
				<span>Info</span>
				<v-icon>mdi-account-group-outline</v-icon>
			</v-btn>
		</v-bottom-navigation>
</template>