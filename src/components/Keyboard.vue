<template>
	<div id="keyboard">
		<select v-model="type">
			<option value="normal" v-on:click="$bus.emit('clear')">标准</option>
			<option value="ROE" v-on:click="$bus.emit('clear')">汇率</option>
			<option value="kin" v-on:click="$bus.emit('clear')">亲戚</option>
			<option value="canvas" v-on:click="$bus.emit('clear')">绘图</option>
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
				<button v-on:click="getInput('爸爸')" v-bind:disabled="!hasFamilyMembers.father">爸爸</button>
				<button v-on:click="getInput('妈妈')" v-bind:disabled="!hasFamilyMembers.mother">妈妈</button>
			</div>
			<div>
				<button v-on:click="getInput('老公')"  v-bind:disabled="!hasFamilyMembers.husband">丈夫</button>
				<button v-on:click="getInput('老婆')"  v-bind:disabled="!hasFamilyMembers.wife">妻子</button>
			</div>
			<div class="special">
				<button v-on:click="getInput('哥哥')"  v-bind:disabled="!hasFamilyMembers.elderBrother">哥哥</button>
				<button v-on:click="getInput('弟弟')"  v-bind:disabled="!hasFamilyMembers.youngerBrother">弟弟</button>
			</div>
			<div class="special">
				<button v-on:click="getInput('姐姐')"  v-bind:disabled="!hasFamilyMembers.elderSister">姐姐</button>
				<button v-on:click="getInput('妹妹')"  v-bind:disabled="!hasFamilyMembers.youngerSister">妹妹</button>
			</div>
			<div class="special">
				<button v-on:click="getInput('儿子')"  v-bind:disabled="!hasFamilyMembers.son">儿子</button>
				<button v-on:click="getInput('女儿')"  v-bind:disabled="!hasFamilyMembers.daughter">女儿</button>
			</div>
			<div class="special">
				<button v-on:click="getInput('d')">回退</button>
				<button v-on:click="getInput('=')">计算</button>
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
			sex:'请选择性别',
			hasFamilyMembers:{
				father:false,
				mother:false,
				elderBrother:false,
				youngerBrother:false,
				elderSister:false,
				youngerSister:false,
				husband:false,
				wife:false,
				son:false,
				daughter:false
			},
			clear:true
		}
	},
	mounted() {
		window.addEventListener('keydown', this.keyboardInput);
		let self = this;
		bus.$on("change",function(type){
			self.clear = false;
			self.type = type;	
			setTimeout(()=>self.clear = true, 200);
		})
		bus.$on("render", function(eq){
			self.clear= false;
			self.type = "canvas";
			setTimeout(()=>{render(eq), self.clear=true}, 1000);
		})
		bus.$on("kinbutton", function(name, value){
			self.hasFamilyMembers[name] = value;
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
			else if (this.type == 'kin'){
				bus.$emit('kinInput', str, this.sex);
			}
		},
		keyboardInput(event){
			var key = event.key;
			if (this.type == "normal"){
				var direct = "1234567890!*-+/!^().=x";
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
		from: function(val){
			if (this.to.indexOf("货币") == -1){
				bus.$emit("updateRate", this.from, this.to)
			}
		}, 
		to: function(val){
			if (this.from.indexOf("货币") == -1){
				bus.$emit("updateRate", this.from, this.to)
			}
		},
		sex: function(val){
			if (this.type == "kin"){
				bus.$emit("kinInput", "t", this.sex);
			}
		},
		type: function(val){
			if (this.clear){
				bus.$emit("clear");
			}
			if (val == 'kin'){
				bus.$emit("kinInput", "", this.sex);
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
	width:800px;
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
