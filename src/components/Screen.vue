<template>
	<div id="screen">
		<div class="prev part" v-if="show_history && currPos !== 0">
			<button id="previous-button" v-on:click="currPos--;update()">↑</button>
			<div class='display'>
				<div class="equation">{{ prev.equation }}</div>
				<br>
				<div class="result">{{ prev.result }}</div>
			</div>
		</div>
		<div class="curr part">
			<button id="show-history" v-on:click="show_history=!show_history">+</button>
			<div class="display">
				<div class="equation">{{ curr.equation }}</div>
				<br>
				<div class="result">{{ curr.result }}</div>
			</div>
		</div>
		<div class="next part" v-if="show_history && currPos != history.length - 1">
			<button id="next-button" v-on:click="currPos++;update()">↓</button>
			<div class="display">
				<div class="equation">{{ next.equation }}</div>
				<br>
				<div class="result">{{ next.result }}</div>
			</div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import vueCookie from 'vue-cookie'
import bus from '../assets/eventBus'
import _calculate from '../assets/calculator'
Vue.use(vueCookie);

let history = new Array;
history.push('1+1=2')
history.push('2+2=4')

for (var index = 0; index < 10; ++index){
	var key = "history" + String(index);
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
	mounted() {
		if (this.history.length != 0){
			var key = this.history[this.history.length - 1].split('=');
			var equation = key[0], result=key[1];
			this.curr.equation = equation;
			this.curr.result = result;
		}
		if (this.history.length > 1){
			var key = this.history[this.history.length - 1].split('=');
			var equation = key[0], result=key[1];
			this.prev.equation = equation;
			this.prev.result = result;
		}
		var self = this;
		bus.$on('newEquation', function(eq){
			self.calculate(eq);
			self.update();
		})
	},
	methods:{
		calculate: function(eq){
			var r = _calculate(eq);
			if (this.history.length == 10){
				this.history.shift();
			}
			this.history.push(eq + '=' + 'r')
		},
		update: function(){
			if (this.history.length == 0)
				return;
			var key = this.history[this.currPos].split('=');
			var equation = key[0], result=key[1];
			this.curr.equation = equation;
			this.curr.result = result;
			if (this.currPos != this.history.length - 1){
				var key = this.history[this.currPos + 1].split('=');
				var equation = key[0], result=key[1];
				this.next.equation = equation;
				this.next.result = result;
			}
			else{
				this.next.equation = '';
				this.next.result = '';
			}
			if (this.currPos != 0){
				var key = this.history[this.currPos - 1].split('=');
				var equation = key[0], result=key[1];
				this.prev.equation = equation;
				this.prev.result = result;
			}
			else{
				this.prev.equation = '';
				this.prev.result = '';
			}
			for (var index = 0; index < this.history.length; ++index){
				Vue.cookie.set('history'+String(index), this.history[index]);
			}
		}
	}
}
</script>

<style scoped>
	button{
		float:left top;
		border-radius: 100%;
		background: cornflowerblue;
		width:50px;
		height: 50px;
		font-size:40px;
		color:white;
	}
	button:hover{
		background: brown;
	}
	.display{
		float:left;
		width:500px;
		height: 70px;
	}
	.result{
		clear:all;
		text-align: right;
		font-size:30px;
	}
	.equation{
		float:left;
		text-align: left;
		font-size:20px;
	}
	.part{
		height: 70px;
	}

</style>