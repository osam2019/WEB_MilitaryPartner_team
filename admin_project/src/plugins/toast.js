import Vue from 'vue'
import Toasted from 'vue-toasted';
 


Vue.use(Toasted, {
	'position': 'bottom-right',
	'duration': 1500,
	'keepOnHover': true,
	'type': 'info',
	'iconPack' :'mdi',
	'icon': 'mdi-database-plus'
})
