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
import {getRate} from '../assets/roe.js'
import {kinRelation} from '../assets/kin'

Vue.use(vueCookie);

let history = new Array;
let historyType = new Array;
for (var index = 0; index < 10; ++index){
	var key = "history" + String(index);
	var value = window.localStorage.getItem(key);
	if (value !== null){
		history.push(value);
		historyType.push(window.localStorage.getItem(key+'type'));
	}
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
			historyType: historyType, 
			currPos: history.length - 1,
			roeRate:0
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
		let self = this;
		bus.$on('newInput', function(eq, type){
			if (type == 'normal'){
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
					if (c == 'n' || c == 'g' || c == 's'){
						self.curr.equation = self.curr.equation.slice(0, self.curr.equation.length - 3);
					}
					else if (c == 'I'){
						self.curr.equation = self.curr.equation.slice(0, self.curr.equation.length - 2);
					}
					else{
						self.curr.equation = self.curr.equation.slice(0, self.curr.equation.length - 1);
					}
					self.curr.result = ""
					return;
				}
				self.curr.equation += eq;
			}
			else if (type == "ROE"){
				let c = eq.split(' ')[0]
				let marks = eq.split(' ')[1].split('>')
				let num = '1234567890.'
				if (eq.indexOf('货币') != -1){
					self.curr.equation = "";
					self.curr.result = "请选择货币种类";
					return;
				}
				else if (self.curr.result = "请选择货币种类"){
					self.curr.result = "";
				}
				if (c == 'd'){
					if (self.curr.equation.length == 4){
						self.curr.equation = "";
					}
					if (self.curr.equation != ""){
						self.curr.equation = self.curr.equation.slice(0, self.curr.equation.length - 4) + marks[0];
					}
					self.curr.result = ""
				}
				else if (c == '='){
					self.getResult(eq, type)
				}
				else if (num.indexOf(c) != -1){
					if (self.curr.equation != "")
						self.curr.equation = self.curr.equation.slice(0, self.curr.equation.length - 3) + c + marks[0]
					else
						self.curr.equation = c + marks[0];
				}
			}
		});
		bus.$on('updateRate', function(from, to){
			getRate(from, to);
		});
		bus.$on('newRate', function(result){
			self.roeRate = Number(result);
		})
		bus.$on('clear', function(){
			self.curr.equation = "";
			self.curr.result = "";
		})
		bus.$on('kinInput', function(str, sex){
			let familyMember={
				father:"爸爸",
				mother:"妈妈",
				elderBrother:"哥哥",
				youngerBrother:"弟弟",
				elderSister:"姐姐",
				youngerSister:"妹妹",
				husband:"老公",
				wife:"老婆",
				son:"儿子",
				daughter:"女儿"
			};
			if (str == '='){
				let list = kinRelation(self.curr.equation, sex == 'male'? 1 : 0);
				for ( let l of list){
					self.curr.result += (' ' + l);
				}
				self.history.push(self.curr.equation + '=' + self.curr.result);
				self.historyType.push('kin');
				while (self.history.length >= 10){
					self.history.shift();
				}
				while (self.historyType.length >= 10){
					self.historyType.shift();
				}
				self.currPos = self.history.length - 1;
				self.update();
			}
			else if (str == 'd'){
				if (self.curr.equation.length > 3){
					self.curr.equation = self.curr.equation.slice(0, self.curr.equation.length - 3);
				}
				else{
					self.curr.equation = 0;
				}
				self.curr.result = "";
			}
			else{
				if (self.curr.equation == ''){
					self.curr.equation = str;
				}
				else{
					self.curr.equation += ('的' + str);
				}
			}
			if (str != '='){
				let keys = Object.keys(familyMember);
				for (let k of keys){
					let eq = "";
					if (self.curr.equation == ""){
						eq = familyMember[k];
					}
					else{
						eq = self.curr.equation + "的" + familyMember[k];
					}
					let r = kinRelation(eq, sex == "male"? 1 : 0);
					bus.$emit('kinbutton', k, r.length != 0)
				}
				self.curr.result = "";
			}
		})
	},
	methods:{
		getResult: function(eq, type){
			let r = ''
			if (type == 'normal'){
				if (eq.indexOf('x') == -1){
					r = calculate(eq);
					this.history.push(eq + '=' + String(r));
				}
				else{
					this.curr.result = 'y=' + this.curr.equation;
					bus.$emit("render", eq);
					return;
				}
			}
			else if (type == 'ROE'){
				let mark = eq.split(' ')[1].split('>')
				let v = Number(this.curr.equation.slice(0, this.curr.equation.length - 3));
				r = String(v * this.roeRate) + mark[1];
				this.history.push(String(v) + mark[0] + '=' + String(r));
			}
			this.historyType.push(type);
			while (this.history.length >= 10){
				this.history.shift();
			}
			while (this.historyType.length >= 10){
				this.historyType.shift();
			}
			this.currPos = this.history.length - 1;
			this.update();
		},
		update: function(){
			if (this.history.length == 0)
				return;
			while (this.currPos < 0){
				this.currPos++;
			}
			while (this.currPos >= this.history.length){
				this.currPos--;
			}
			var key = this.history[this.currPos].split('=');
			var equation = key[0], result=key[1];
			this.curr.equation = equation;
			this.curr.result = result;
			bus.$emit("change", this.historyType[this.currPos]);
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
				window.localStorage.setItem('history'+String(index), this.history[index]);
				window.localStorage.setItem('history'+String(index) + 'type', this.historyType[index]);
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