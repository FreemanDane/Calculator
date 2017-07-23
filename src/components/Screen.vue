<template>
	<div id="screen">
		<div class="prev" v-if="show_history">
			<h2 class="equation">{{ prev.equation }}</h2>
			<h3 class="result">{{ prev.result }}</h3>
			<button id="previous-button">↑</button>
		</div>
		<div class="curr">
			<h2 class="equation">{{ curr.equation }}</h2>
			<h3 class="result">{{ curr.result }}</h3>
			<button id="show-history" v-on:click="show_history=!show_history">+</button>
		</div>
		<div class="next" v-if="show_history">
			<h2 class="equation">{{ next.equation }}</h2>
			<h3 class="result">{{ next.result }}</h3>
			<button id='next-button'>↓</button>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import vueCookie from 'vue-cookie'
import bus from '../assets/eventBus'
Vue.use(vueCookie);

let history = new Array();

for (var index = 0; index < 10; ++index){
	var key = "history" + String(i);
	var value = Vue.cookie.get(key);
	if (value !== null)
		history.push(value);
}

export default {
	name: "screen",
	data() {
		return {
			prev: {
				equation: '',
				result: ''
			},
			curr: {
				equation: '',
				result: ''
			},
			next: {
				equation: '',
				result: ''
			},
			show_history: false,
			history: history,
			currPos: history.length - 1
		}
	},
	mount() {
		if (history.length != 0){
			
		}
	},
	methods:{

	}
}
</script>