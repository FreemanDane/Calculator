<template>
	<div id="keyboard">
		<select v-model="type">
			<option value="normal">标准</option>
			<option value="ROE">汇率</option>
			<option value="kin">亲戚</option>
			<option value="canvas">绘图</option>
		</select>
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
				<button v-on:click="getInput('=')">=</button>
				<button v-on:click="getInput('^')">^</button>
			</div>
			<div>
				<button v-on:click="getInput('sin')">Sin</button>
				<button v-on:click="getInput('cos')">Cos</button>
				<button v-on:click="getInput('tan')">Tan</button>
				<button v-on:click="getInput('!')">!</button>
				<button v-on:click="getInput('log')">Log</button>
			</div>
		</div>
		<div class="ROE" v-if="type=='ROE'">
		</div>
		<div class="kin" v-if="type=='kin'">
		</div>
		<div class="canvas" v-if="type=='canvas'">
		</div>
	</div>
</template>

<script>
import bus from '../assets/eventBus'

export default {
	name:"keyboard",
	data() {
		return{
			type:'normal'
		}
	},
	mounted() {
		window.addEventListener('keydown', this.keyboardInput);
		var self = this;
	},
	methods:{
		getInput:function(str){
			bus.$emit('newInput', str, self.type)
		},
		keyboardInput(event){
			var key = event.key;
			if (this.type == "normal"){
				var direct = "1234567890!*-+/!^()";
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
				else if (key === 'Backspace'){
					this.getInput('c');
				}
			}
		}
	}
}
</script>

<style scoped>
.normal button{
	width: 100px;
	height: 70px;
	font-size: 20px;
	top: 100px;
	position: relative;
	left:80px;
	background: cornflowerblue;
	color:white;
	border:8px transparent solid;
	border-radius: 10%
}

.normal button:hover{
	background: brown;
}

.normal div{
	float:left;
	clear:both;
	height: 90px;
}

.normal{
	height: 800px;
}

select{
	width:300px;
	height:50px;
	float:left;
	font-size: 30px;
	background: cornflowerblue;
	color: white;
	top: 50px;
	position: relative;
	border-radius: 5%;
}

</style>
