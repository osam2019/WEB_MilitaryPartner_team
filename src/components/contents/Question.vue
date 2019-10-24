<template>
	<div>
				<v-row align='center' justify='center'>
					<v-col cols=12>
						<v-card class='mx-auto' max-width=1600>
							
							<v-card-title>
								<v-icon>mdi-frequently-asked-questions</v-icon>&nbsp;질문 게시판
								<v-spacer></v-spacer>
								<v-text-field
									v-model="search"
									append-icon="mdi-search-web"
									label="검색"
									hide-details
								></v-text-field>
							</v-card-title>
							
							<v-data-table
								:loading = 'isLoading'
								loading-text="글 목록을 불러오는 중입니다..."
								:headers="headers"
								:page.sync="page"
								hide-default-footer
								@click:row = 'onclick'
								:items="posts"
								:items-per-page="12"
								class="elevation-1"
								@page-count="pageCount = $event"
								:search="search"
								no-results-text = "해당 질문 없음"
								sort-by = "timeValue"
							>
								<template v-slot:item.title="{ item }">
									{{ cutTitle(item.title) }}
								</template>
								<template v-slot:item.time="{ item }">
									{{ getFuzzy(item.time) }}
								</template>
								<template v-slot:item.tag="{ item }">
									<v-tooltip bottom>
										<template v-slot:activator="{ on }">
										<v-chip 
											v-for='tag in item.tag.slice(0,3)' 
											:key='tag.id' class='caption' x-small v-on="on" 
											@click.stop='searchtag(tag)'
										> {{ tag }} </v-chip>
										</template>
										<span v-for='t in item.tag' :key='t.id'>
											#{{ t }} 
										</span>
									</v-tooltip>
								</template>
								<template v-slot:footer>
									<v-pagination v-model="page" :length="pageCount" />
								</template>
							</v-data-table>
						</v-card>
					</v-col>
					
				</v-row>


		<v-btn bottom right large fixed fab @click='isSubmitDialogView=true'>
			<v-icon>mdi-pencil</v-icon>
		</v-btn>
		
		<wirte 
			:isDialogView='isSubmitDialogView' 
			@postCompleted='submitClick' 
			@cancel='isSubmitDialogView = false'
		/>

		<read
			:isDialogView='isReadDialogView'
			:postId='postId'
			:postTitle='postTitle'
			:postTag='postTag'
			:selectedTag = 'selectedTag'
			@contentCompleted='contentClick'
			@cancel='reloadPage'
			@search='searchtag(selectedTag)'
		/>

	</div>
</template>

<script>
import wirte from './questions/Write';
import read from './questions/Read';
	
export default {
	components: {
			wirte,
			read,
		},
	
    data: () => ({
			search: "",
			
			page: 1,
			pageCount: 0,
			
			posts: [],
			isLoading: true,
			headers: [
				{ text: '제목', align: 'center', sortable: false, value: 'title'},
				{ text: '답변 수', align: 'center', value: 'answers' },
				{ text: '조회 수', align: 'center', value: 'views' },
				{ text: '작성 시간', align: 'center', value: 'time' },
				{ text: '태그', align: 'center', value: 'tag'}
				
			],
			
			isSubmitDialogView: false,
			isReadDialogView: false,
			
			postId: '',
			postTitle: '',
			postTag: '',
			selectedTag: '',
		}),
	
		created () {
			this.getPosts()
		},
	
		methods: {
			reloadPage () {
				this.isReadDialogView = false
				this.getPosts()
			},
			searchtag(tag) {
				this.search = tag
				this.isReadDialogView = false
			},
			submitClick() {
				this.isSubmitDialogView = false
				this.getPosts()
			},
			contentClick() {
				this.getPosts()
			},
			getPosts(){
				this.isLoading = true
				this.$firebase.firestore().collection("QNA").orderBy("time",'desc').get()
				
				.then(querySnapshot => {
					this.posts = []
					querySnapshot.forEach(doc => {
						const {title, contents, password, tag, time, views, answers} = doc.data()
						
						this.posts.push({
							title, contents, password, tag, time, views, answers, id: doc.id
						})
					})
					this.isLoading = false
				})
				.catch(function(error) {
					console.log("Error getting document:", error);
				});
				
				
			},
			
			cutTitle(title) {
				var cuttedTitle;
				if (title.length > 15) {
					cuttedTitle = title.substring(0,15) + '...'
					return cuttedTitle
				} else {
					return title
				}
			},
			
			getFuzzy(date){            
				var delta = Math.round((+new Date - date.toDate()) / 1000);
				var minute = 60, hour = minute * 60, day = hour * 24, fuzzy;
				if (delta < 30) { fuzzy = '방금전' }
				else if (delta < minute) { fuzzy = delta + ' 초전' } 
				else if (delta < 2 * minute) { fuzzy = '1분전' } 
				else if (delta < hour) { fuzzy = Math.floor(delta / minute) + ' 분 전' } 
				else if (Math.floor(delta / hour) == 1) { fuzzy = '1 시간 전' } 
				else if (delta < day) { fuzzy = Math.floor(delta / hour) + ' 시간 전' } 
				else if (delta < day * 2) { fuzzy = '어제' }
				else if (delta < day * 7) { fuzzy = '며칠전'}
				else { fuzzy = date.toDate().yyyymmdd() }
				return fuzzy
			},
			
			onclick(item) {
				this.isReadDialogView = true
				this.postId = item.id
				this.postTitle = item.title
				this.postTag = item.tag
				this.$firebase.firestore().collection("QNA").doc(item.id).update({
					views: this.$firebase.firestore.FieldValue.increment(1)
				})
			},
		},
  }
</script>
