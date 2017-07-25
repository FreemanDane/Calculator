<template>
	<div id="keyboard">
		<select v-model="type">
			<option value="normal">标准</option>
			<option value="ROE">汇率</option>
			<option value="kin">亲戚</option>
			<option value="canvas">绘图</option>
		</select>
		<transition name='change'>
		<div class="normal" v-if="type=='normal'">
			<div>
				<button v-on:click="getInput('1')">1</button>
				<button v-on:click="getInput('2')">2</button>
				<button v-on:click="getInput('3')">3</button>
				<button v-on:click="getInput('c')">清除</button>
				<button v-on:click="getInput('d')">回退</button>
			</div>
			<div>
				<button v-on:click="getInput('4')">4</button>
				<button v-on:click="getInput('5')">5</button>
				<button v-on:click="getInput('6')">6</button>
				<button v-on:click="getInput('+')">+</button>
				<button v-on:click="getInput('-')">-</button>
			</div>
			<div>
				<button v-on:click="getInput('7')">7</button>
				<button v-on:click="getInput('8')">8</button>
				<button v-on:click="getInput('9')">9</button>
				<button v-on:click="getInput('*')">*</button>
				<button v-on:click="getInput('/')">/</button>
			</div>
			<div>
				<button v-on:click="getInput('(')">(</button>
				<button v-on:click="getInput('0')">0</button>
				<button v-on:click="getInput(')')">)</button>
				<button v-on:click="getInput('.')">.</button>
				<button v-on:click="getInput('^')">^</button>
			</div>
			<div>
				<button v-on:click="getInput('sin')">Sin</button>
				<button v-on:click="getInput('cos')">Cos</button>
				<button v-on:click="getInput('tan')">Tan</button>
				<button v-on:click="getInput('!')">!</button>
				<button v-on:click="getInput('log')">Log</button>
			</div>
			<div>
				<button v-on:click="getInput('PI')" class="const">Pi</button>
				<button v-on:click="getInput('E')" class="const">e</button>
				<button v-on:click="getInput('=')" id="equation-button">=</button>
			</div>
		</div>
		</transition>
		<transition name="change">
		<div class="ROE" v-if="type=='ROE'">
			<select class='from' v-model="from">
				<option disabled>原货币</option>
				<option v-for="m in money" :key='m'>{{m}}</option>
			</select>
			<select class='to' v-model="to">
				<option disabled>目标货币</option>
				<option v-for="m in money" :key='m'>{{m}}</option>
			</select>
			<div>
				<button v-on:click="getInput('1')">1</button>
				<button v-on:click="getInput('2')">2</button>
				<button v-on:click="getInput('3')">3</button>
			</div>
			<div>
				<button v-on:click="getInput('4')">4</button>
				<button v-on:click="getInput('5')">5</button>
				<button v-on:click="getInput('6')">6</button>
			</div>
			<div>
				<button v-on:click="getInput('7')">7</button>
				<button v-on:click="getInput('8')">8</button>
				<button v-on:click="getInput('9')">9</button>
			</div>
			<div class="ROE-special">
				<button v-on:click="getInput('d')">回退</button>
				<button v-on:click="getInput('0')">0</button>
				<button v-on:click="getInput('.')">.</button>
				<button v-on:click="getInput('=')">=</button>
			</div>
		</div>
		</transition>
		<transition name="change">
		<div class="kin" v-if="type=='kin'">
		</div>
		</transition>
		<transition name="change">
		<div class="canvas" v-if="type=='canvas'">
		</div>
		</transition>
	</div>
</template>

<script>
import bus from '../assets/eventBus'
import axios from 'axios'

export default {
	name:"keyboard",
	data() {
		return{
			type:'normal',
			money:['CNY', 'USD', 'JPY', 'EUR', 'GBP', 'HKD', 'SUR', 'DEM', 'CHF', 'FRF', 'CAD', 'AUD', 'ATS', 'FIM', 'BEF', 'IEP', 'ITL', 'LUF', 'NLG'
			,'PTE', 'ESP', 'IDR', 'MYR', 'NZD', 'PHP', 'SGD', 'KRW', 'THB'],
			from:'原货币',
			to:'目标货币'
		}
	},
	mounted() {
		window.addEventListener('keydown', this.keyboardInput);
		let self = this;
		bus.$on("change",function(type){
			self.type = type;
		})
	},
	methods:{
		getInput:function(str){
			if (this.type == 'normal'){
				bus.$emit('newInput', str, this.type)
			}
			else if (this.type == 'ROE'){
				bus.$emit('newInput', str + ' ' + this.from + '>' + this.to, this.type)
			}
		},
		keyboardInput(event){
			var key = event.key;
			if (this.type == "normal"){
				var direct = "1234567890!*-+/!^().";
				if (direct.indexOf(key) != -1){
					this.getInput(key);
				}
				else if (key === 's'){
					this.getInput('sin');
				}
				else if (key === 'c'){
					this.getInput('cos');
				}
				else if (key === 'l'){
					this.getInput('log');
				}
				else if (key === 't'){
					this.getInput('tan');
				}
				else if (key === 'p'){
					this.getInput('PI');
				}
				else if (key === 'e'){
					this.getInput('E')
				}
				else if (key === 'Backspace'){
					this.getInput('d');
				}
				else if (key === "Enter"){
					event.preventDefault();
					this.getInput('=');
				}
			}
		}
	},
	watch: {
		from: function(val){
			if (this.to.indexOf("货币") == -1){
				bus.$emit("updateRate", this.from, this.to)
			}
		}, 
		to: function(val){
			if (this.from.indexOf("货币") == -1){
				bus.$emit("updateRate", this.from, this.to)
			}
		} 
	}
}
</script>

<style scoped>
.normal button, .ROE button{
	width: 100px;
	height: 70px;
	font-size: 20px;
	top: 100px;
	position: relative;
	left:80px;
	background: cornflowerblue;
	color:white;
	border:8px transparent solid;
	border-radius: 10%;
	margin: 20px;
}

.ROE{
	text-align: left;
}

.ROE button{
	margin-left: 20px
}

.ROE-special button{
	left: 430px;
}

.change-enter-active{
	transition: all .3s ease;
}
.change-leave-active{
	transition: all .8s ease;
}

.change-enter, .change-leave-to{
  	transform: translateX(-20px);
	opacity: 0;
}

#equation-button{
	float:left;
	position:relative;
	width:250px;
	left: 150px;
}
.const{
	float:left;
}

.normal button:hover, .ROE button:hover{
	background: brown;
}

.normal div{
	float:left;
	clear:both;
	height: 90px;
}

.normal{
	height: 1000px;
}

select{
	width:350px;
	height:50px;
	float:left;
	font-size: 30px;
	background: cornflowerblue;
	color: white;
	top: 50px;
	margin-top: 60px;
	position: relative;
	border-radius: 5%;
	clear:left;
}

</style>
