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
				<button v-on:click="getInput('PI')">Pi</button>
				<button v-on:click="getInput('E')">e</button>
				<button v-on:click="getInput('x')">x</button>
				<button v-on:click="getInput('=')">=</button>
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
			<select v-model="sex" id="sex">
				<option disabled>请选择性别</option>
				<option value="male">男</option>
				<option value="female">女</option>
			</select>
			<div>
				<button>爸爸</button>
				<button>妈妈</button>
			</div>
			<div>
				<button>丈夫</button>
				<button>妻子</button>
			</div>
			<div class="special">
				<button>哥哥</button>
				<button>弟弟</button>
			</div>
			<div class="special">
				<button>儿子</button>
				<button>女儿</button>
			</div>
			<div class="special">
				<button>回退</button>
				<button>计算</button>
			</div>
		</div>
		</transition>
		<transition name="change">
		<div class="canvas" v-if="type=='canvas'">
			<canvas id="func" width="1000" height="200">Your browzer doesn't support canvas</canvas>
		</div>
		</transition>
	</div>
</template>

<script>
import bus from '../assets/eventBus'
import {render} from '../assets/funcRender'

export default {
	name:"keyboard",
	data() {
		return{
			type:'normal',
			money:['CNY', 'USD', 'JPY', 'EUR', 'GBP', 'HKD', 'CHF', 'CAD', 'AUD', 'IDR', 'MYR', 'NZD', 'PHP', 'SGD', 'KRW', 'THB'],
			from:'原货币',
			to:'目标货币',
			sex:'请选择性别'
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
				var direct = "1234567890!*-+/!^().=";
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
			if (this.type == 'ROE'){
				let direct = "1234567890.="
				if (direct.indexOf(key) != -1){
					this.getInput(key);
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
		type: function(val){
			if (val == "canvas"){
				setTimeout(()=>render("log(x)"), 1000);
			}
		},
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
.normal button, .ROE button, .kin button{
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

#sex{
	position: relative;
	top: 200px;
}

canvas{
	width:1000px;
	height:200px;
	border:5px #f0f0f0 solid;
	float: left;
	clear: left;
	position: relative;
	top: 100px;
}
.ROE, .kin{
	text-align: left;
}

.ROE button{
	margin-left: 20px
}

.special button{
	left: 430px;
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
button:hover{
	background: brown;
}

button:disabled{
	background: gray;
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
