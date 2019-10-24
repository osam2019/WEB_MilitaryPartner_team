<template>
	<v-menu
		ref="isMenuView"
		v-model="isMenuView"
		:close-on-content-click="false"
		:return-value.sync="whichDay"
		transition="scale-transition"
		offset-y
		min-width="290px"
	>
		<template v-slot:activator="{ on }">
			<v-text-field
				v-model="whichDay"
				:label="whatDay"
				readonly
				v-on="on"
			></v-text-field>
		</template>

		<v-date-picker 
			:show-current="false" 
			v-model="whichDay"
			no-title
			scrollable
		>
			<v-spacer></v-spacer>
			<v-btn text color="primary" @click="isMenuView = false">Cancel</v-btn>
			<v-btn text color="primary" @click="clickOk">OK</v-btn>
		</v-date-picker>
	</v-menu>
</template>

<script>
	export default {
		props: ['whatDay'],
		
		data: () => ({
			whichDay: '',
			isMenuView: false,
		}),
		
		methods: {
			clickOk() {	
				this.$refs.isMenuView.save(this.whichDay)
				this.$emit('setDay', this.whichDay)
			}
  	},
	}
</script>