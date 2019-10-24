<template>
	<v-row v-resize="onResize" justify="center" >
		<v-dialog 
			v-model="isIntroView" 
			fullscreen hide-overlay 
			transition="dialog-bottom-transition" 
		>
			
			<v-card>
				<v-carousel touch :continuous='false' :height='windowHeight'>
					<v-carousel-item
						v-for="(item,i) in items"
						:key="i"
						:src="item.src"
					></v-carousel-item>
				</v-carousel>
				
				<v-btn
							 id='position'
					dark center x-large
					bottom outlined 
					class='font-weight-black ma-12 title' 
					fixed @click="closeIntro"
				>
				시작하기
				</v-btn>
			</v-card>
			
		</v-dialog>
	</v-row>
</template>

<script>
  export default {
		props:['isIntroView'],
		data: () => ({
			windowHeight: 0,
			
			items: [
				{ src: 'https://firebasestorage.googleapis.com/v0/b/military-partner.appspot.com/o/Intro_1.png?alt=media&token=69a3fd52-8939-435b-b33c-12a11ddbc12b', },
				{ src: 'https://firebasestorage.googleapis.com/v0/b/military-partner.appspot.com/o/Intro_2.png?alt=media&token=fb86ce72-52e6-44ca-89de-25006067f1ca', },
				{ src: 'https://firebasestorage.googleapis.com/v0/b/military-partner.appspot.com/o/Intro_3.png?alt=media&token=59c313e7-6c27-465e-b0f7-3d6b63b74c42', },
				{ src: 'https://firebasestorage.googleapis.com/v0/b/military-partner.appspot.com/o/Intro_4.png?alt=media&token=45d8d6ba-7194-40fc-94f1-fad79b8f4eaf', },
			],
		}),
		
		methods: {
			onResize () {
				this.windowHeight = window.innerHeight 
			},
			
			closeIntro() {
				this.$cookies.set("isNotFirst", false, '1d');
				this.$emit('closeIntro')
			}
		},
		
  }
</script>