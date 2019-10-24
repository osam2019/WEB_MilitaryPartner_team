<template>
	<v-dialog :loading='isLoading' v-model="isDialogView" persistent fullscreen hide-overlay transition="dialog-bottom-transition">
		<v-card >
			<v-toolbar class='teal' block>
				<v-toolbar-title class='headline white--text'/>
				<v-spacer/>
				<v-btn @click='cancelClick' icon>
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-toolbar>
			
			<v-card v-show='!isLoading' class='mx-auto mb-12 scroll'>
				<v-card-title>{{postTitle}}</v-card-title>
				<v-divider/>
				<v-card-text class='subtitle-1 font-weight-black'>
					<span v-for='content in post' :class='content.selected ? highlighted : content.color' @dblclick='contentDbclicked(content.index)' @click='contentClicked(content.index)'>{{content.text}} </span>
				</v-card-text>
				<v-divider/>
				<v-chip @click='searchtag(tag)' class='ma-1' v-for='tag in postTag' label>{{tag}}</v-chip>
			</v-card>
			
			<v-card v-show='!isLoading' class="scroll">
				<v-card-title>'{{now_clicked}}' 에 대한 답변</v-card-title>
				<v-divider />
				<v-card-text v-for='answer in answers' class='font-weight-bold subtitle-1'>
					{{answer}}
					<v-divider />
				</v-card-text>
				
				<v-dialog v-model="isCommentDialogView" persistent max-width=500>
					<template v-slot:activator="{ on }">
						<v-btn fixed bottom right v-show='isClicked' @click="contentSelected" large color='primary'>
							<v-icon>mdi-pencil</v-icon>
						</v-btn>
					</template>
					<v-card>
						<v-card-title class="title font-weight-bold">
							'{{selectedTexts}}' 에 답변 작성
						</v-card-title>
						<v-spacer></v-spacer>
						<v-card-text>
						<v-textarea label='답변 작성' v-model='pushedAnswer' auto-grow outlined></v-textarea>
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="teal darken-1" text @click="answerYes" :disabled='isValid'>
								예
							</v-btn>
							<v-btn color="teal darken-1" text @click="answerNo">
								아니오
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</v-card>
		</v-card>
	</v-dialog>
</template>

<script>

export default {
	props: ['isDialogView', 'postId', 'postTitle', 'postTag', 'selectedTag', 'start'],
	data: () => ({
		isLoading: true,
		
		post: [],
		
		highlighted: 'yellow',
		isCommentDialogView: false,
		now_clicked: '',
		selectedContents: [],
		selectedTexts: '',
		selectedMax: 0,
		selectedMin: 0,
		pushedAnswer: '',
		answers: [],
		isClicked: 0,
		contentColor: '',
	}),
	
	watch:{
		postId(val) {
			this.isLoading = true
			this.getPost()
		}
	},
	
	computed:{
			isValid () {
				if(this.pushedAnswer != '') {
					return false
				} else {
					return true
				}
			}
		},
	
	methods: {
		
		searchtag(tag) {
			this.selectedTag = tag
			this.$emit('cancel')
			this.$emit('search')
			this.selectedContents=[]
			this.selectedTexts=''
			this.now_clicked=''
			this.answers=[]
			for (let i of this.post) {
				i.selected = false
				}
		},
		
		cancelClick() {
			this.$emit('cancel')
			this.selectedContents=[]
			this.selectedTexts=''
			this.now_clicked=''
			this.answers=[]
			for (let i of this.post) {
				i.selected = false
				}
			},
		
		getPost(){
			this.$firebase.firestore().collection("QNA").doc(this.postId).collection("CONTENTS").get()
			.then(querySnapshot => {
				this.post = []
				querySnapshot.forEach(doc => {
					const {index, text, reply, color, selected} = doc.data()
					
					this.post.push({
						index, text, reply, color, selected, id: doc.id
					})
				})
				this.isLoading = false
				this.post.sort(function(a,b) {
					return a['index'] - b['index']
				})
				
				console.log(this.post)
				this.$emit('contentCompleted')
			})
			.catch(function(error) {
						console.log("Error getting document:", error);
			});
		},
		
		
		contentDbclicked(index) {
			this.post[index].selected = !this.post[index].selected
			if (this.now_clicked == this.post[index].text) {
				console.log('same thing')
			}
			if (this.post[index].selected) {
				this.isClicked += 1;
			}
			else {
				this.isClicked -= 1;
			}
		},
		
		contentClicked(index) {
			this.now_clicked = this.post[index].text
			if (this.post[index].reply.length > 0) {
				this.answers = this.post[index].reply
			} else {
				this.answers = ['이 곳에 달린 답변이 없습니다.']
			}
		},
		
		contentSelected() {
			
			this.selectedContents=[]
			this.selectedTexts=''
			
			for (let j of this.post) {
				if (j.selected) {
					this.selectedContents.push(j.index)
				} 
				
			}
			
			if (this.selectedContents.length > 1) {
				this.selectedMax = Math.max.apply(null,this.selectedContents)
				this.selectedMin = Math.min.apply(null,this.selectedContents)
				console.log(this.selectedMax,this.selectedMin)
				for (let j of this.post) {
					if (j.index >= this.selectedMin && j.index <=this.selectedMax) {
						j.selected=true
					}
				}
				for (let j of this.post) {
					if (j.selected) {
						this.selectedTexts += (j.text +' ')
					}
				}
				this.isCommentDialogView=true
			} else {
				for (let j of this.post) {
					if (j.selected) {
						this.selectedTexts += (j.text +' ')
					}
				}
				this.isCommentDialogView=true
			}
			
		},
		
		answerNo() {
			this.isCommentDialogView=false
			for (let j of this.post) {
				if (j.selected) {
					j.selected = false
				}
			}
			this.isClicked=false
			this.pushedAnswer = ''
		},
		
		answerYes() {
			this.$firebase.firestore().collection("QNA").doc(this.postId).update({
			 answers: this.$firebase.firestore.FieldValue.increment(1)
			})
			this.post.forEach(content => {
				 if (content.selected) {
					 console.log(content)
					 var color = content.color;
					 if (color == 'pink lighten-3') {
						 this.contentColor = 'pink lighten-1'
					 } else if (color == 'pink lighten-5') {
						 this.contentColor = 'pink lighten-3'
					 } else if (color == 'white' || color == '') {
						 this.contentColor = 'pink lighten-5'
					 } else {
						 this.contentColor = 'white'
					 }	 
					 this.$firebase.firestore().collection("QNA").doc(this.postId).collection("CONTENTS").doc(content.id).update({
						reply: this.$firebase.firestore.FieldValue.arrayUnion(this.pushedAnswer),
						color: this.contentColor
						})
							.then(() => {
								console.log('Successed!')
								for (let j of this.post) {
									if (j.selected) {
										j.selected = false
									}
								}
								this.isCommentDialogView=false
								this.isClicked=false
								this.pushedAnswer = ''
								this.contentColor = ''
								this.getPost()
							})
							.catch(function(error) {
								console.log("Error getting document:", error);
							});
				}
			})
		},
	}
}
</script>

<style>
	.scroll {
		overflow-y: auto;
	}
</style>
