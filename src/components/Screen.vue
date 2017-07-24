<template>
	<div id="screen">
		<transition name="up">
		<div class="prev part"v-if="show_history && currPos > 0">
			<button id="previous-button" v-on:click="currPos--,update()">↑</button>
			<div class='display'>
				<div class="equation">{{ prev.equation }}</div>
				<br>
				<div class="result">{{ prev.result }}</div>
			</div>
		</div>
		</transition>
		<div class="curr part">
			<button id="show-history" v-on:click="show_history=!show_history">+</button>
			<div class="display curr-display">
				<div class="equation">{{ curr.equation }}</div>
				<br>
				<div class="result">{{ curr.result }}</div>
			</div>
		</div>
		<transition name="down">
		<div class="next part" v-if="show_history && currPos < history.length - 1">
			<button id="next-button" v-on:click="currPos++,update()">↓</button>
			<div class="display">
				<div class="equation">{{ next.equation }}</div>
				<br>
				<div class="result">{{ next.result }}</div>
			</div>
		</div>
		</transition>
	</div>
</template>

<script>
import Vue from 'vue'
import vueCookie from 'vue-cookie'
import bus from '../assets/eventBus'
import {calculate} from '../assets/calculator'
Vue.use(vueCookie);

let history = new Array;
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
		bus.$on('newInput', function(eq, type){
			if (eq == '='){
				self.getResult(self.curr.equation, type);
				return;
			}
			if (eq == 'c'){
				self.curr.equation = "";
				self.curr.result = "";
				return;
			}
			if (eq == 'd'){
				var c = self.curr.equation[self.curr.equation.length - 1];
				if (c == 'n' || c == 'g'){
					self.curr.equation = self.curr.equation.slice(0, self.curr.equation.length - 3);
				}
				else{
					self.curr.equation = self.curr.equation.slice(0, self.curr.equation.length - 1);
				}
				return
			}
			self.curr.equation += eq;
		})
	},
	methods:{
		getResult: function(eq){
			var r = calculate(eq);
			if (this.history.length == 10){
				this.history.shift();
			}
			this.history.push(eq + '=' + String(r));
			this.currPos = this.history.length - 1;
			this.curr.result = String(r);
		},
		update: function(){
			if (this.history.length == 0)
				return;
			if (this.currPos == 0 && this.currPos == this.history.length - 1)
				return;
			var key = this.history[this.currPos].split('=');
			var equation = key[0], result=key[1];
			this.curr.equation = equation;
			this.curr.result = result;
			if (this.currPos < this.history.length - 1){
				var key = this.history[this.currPos + 1].split('=');
				var equation = key[0], result=key[1];
				this.next.equation = equation;
				this.next.result = result;
			}
			else{
				this.next.equation = '';
				this.next.result = '';
			}
			if (this.currPos > 0){
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
		width:60px;
		height: 60px;
		font-size:45px;
		color:white;
	}
	button:hover{
		background: brown;
	}
	.display{
		float:left;
		width:700px;
		height:65px;
		color:transparent;
		border:5px solid #ffffff;
	}
	.curr-display{
		border:5px solid #f0f0f0;
	}
	.result{
		clear:all;
		text-align: right;
		font-size:40px;
	}
	.equation{
		float:left;
		text-align: left;
		font-size:15px;
	}
	.part{
		height: 80px;
		width:850px;
		-webkit-background-clip:text;
	}
	.prev{
		background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7));
		-webkit-background-clip:text;
	}
	.curr{
		background: rgb(0,0,0);
		-webkit-background-clip:text;
	}
	.next{
		background: linear-gradient(to top, rgba(0,0,0,0), rgba(0,0,0,0.7));
		-webkit-background-clip:text;
	}
	.up-enter-active, .up-leave-active{
		transition: all .5s ease;
	}

	.up-enter, .up-leave-to{
  		transform: translateY(20px);
		opacity: 0;
	}
	.down-enter-active, .down-leave-active{
		transition: all .5s ease;
	}

	.down-enter, .down-leave-to{
  		transform: translateY(-20px);
		opacity: 0;
	}


</style>