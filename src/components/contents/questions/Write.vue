<template>
	<v-dialog v-model="isDialogView" persistent max-width=800>
		<v-card class='mx-auto' max-width=800>
			<v-card-title>질문 작성</v-card-title>
			<v-card-text>
						<v-text-field
							v-model='postTitle'
							label="제목"
							:rules='rules'
							outlined
						/>
						<v-text-field
							outlined
							v-model='postPassword'
							:append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
							:rules='rules'
							:type="show ? 'text' : 'password' "
							label='비밀번호'
							@click:append="show = !show"
						/>
						<v-textarea
							v-model='postContent' 
							label="내용"
							:rules='rules'
							auto-grow
							outlined
						/>
						<v-combobox
							v-model="postTags"
							:items="tagItems"
							:rules='rules'
							multiple chips clearable
							placeholder='태그를 입력하세요'
							outlined
						/>
			</v-card-text>
			<v-card-actions>
				<v-spacer/>
				<v-btn class='ma-2' large color='primary' @click='submitPost' :disabled='isValid'>제출</v-btn>
				<v-btn class='ma-2' large color='secondary' @click='cancelClick'>취소</v-btn>
				<v-spacer/>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
  export default {
		props: ['isDialogView'],
		
		data: () => ({
			postContentFrag: [],
			tagItems: ['육군','훈련소','준비물', '특기', '자대', '논산'],

			postTitle: '',
			postContent: '',
			postPassword: '',
			postTags: [],
			
			show: false,
			rules: [
				value => !!value || '반드시 입력해야 합니다.',
			],
		}),
	
		computed:{
			isValid () {
				if(this.postTitle != '' && this.postContent != '' && this.postPassword != '' && this.postTags.length != 0) {
					return false
				} else {
					return true
				}
			}
		},
		
		methods: {
			cancelClick() {
				this.clear()
				this.$emit('cancel')
			},
			
			divideContents(){
				var contents = []
				var cnt = 0
				for (let i of this.postContent.split('\n')) {
					console.log(i)
					console.log(this.postContent.split('\n').indexOf(i))
					for (let j of i.split(' ')) {
						console.log(j)
						console.log(i.split(' ').indexOf(j))
						contents.push({text: j, index: cnt, selected: false, reply: [], color: ''})
						cnt += 1
					}
				}
				
				return contents
			},
			
			submitPost() {
				var ID = ''
				var contents = this.divideContents()


				
				this.$firebase.firestore().collection("QNA").add({
					password: this.postPassword,
					title: this.postTitle,
					tag: this.postTags,
					time: this.$firebase.firestore.Timestamp.now(),
					views: 0,
					answers: 0,
				})
				.then(doc => {
					contents.forEach(content => {
						this.$firebase.firestore().collection("QNA").doc(doc.id).collection('CONTENTS').add(content)
						.then(() => {
							this.clear()
							this.$emit('postCompleted')
						})
						.catch(function(error) {
							console.error("Failed to create Doc: ", error);
						});
					})
				})
				.catch(function(error) {
						console.error("Failed to create Doc: ", error);
				});
				
				
			},
			
			clear() {
				this.postTitle = ''
				this.postContent = ''
				this.postContentFrag = []
				this.postPassword = ''
				this.postTags = []
			},
		}
  }
</script>
