'use strict'
//本部分基础功能四则运算中使用PI作为圆周率pi的代表，E代表e，支持的符号集为｛＋，－ ， *, /, 数字集合, PI, E, . ,sin(), cos(), tan(), ()! ,log()(),()^(),log(),num!,num^(),()^num,num^num｝
function isAdvancedBadWord(str)
{
	let len = str.length;
	for(let i = 0; i < len; i ++)
	{
		if(str[i] == 'I')
		{
			if(str[i+1] == 'n' && str[i+2] == 'f' && str[i+3] == 'i' && str[i+4] == 'n' 
				&& str[i+5] == 'i' && str[i+6] == 't' && str[i+7] == 'y')
			{
				i = i + 7;
				continue;
			}
			return false;
		}
		if(str[i] == 'P')
		{
			if(str[i+1] == 'I')
			{
				i = i + 1;
				continue;
			}			
			return false;
		}
		if(str[i] == 's')
		{
			if(str[i+1] == 'i' && str[i+2] == 'n')
			{
				i = i+2;
				continue;
			}
			else
				return false;
		}
		if(str[i] == 'c')
		{
			if(str[i+1] == 'o' && str[i+2] == 's')
			{
				i = i + 2;
				continue;
			}
			else
				return false;
		}
		if(str[i] == 't')
		{
			if(str[i+1] == 'a' && str[i+2] == 'n')
			{
				i = i + 2;
				continue;
			}
			else
				return false;
		}
		if(str[i] == 'l')
		{
			if(str[i+1] == 'o' && str[i+2] == 'g')
			{
				i = i + 2;
				continue;
			}
			else
				return false;
		}
		if(str[i]!='0' && str[i]!='1' && str[i] != '2' && str[i]!='3' && str[i] != '4' && str[i]!='5' && str[i] != '6'
		 && str[i]!='7' && str[i] != '8' && str[i]!='9' && str[i] != 'P' && str[i]!='I' && str[i] != '+'&& str[i]!='-' 
		&& str[i] != '*' && str[i]!='/' && str[i] != 'e'  && str[i] != ' ' && str[i] != '.' && str[i] != '(' && str[i] != ')'
		&& str[i] != '[' && str[i] != ']'&& str[i] != '{' && str[i] != '}'&& str[i] != '^' && str[i] != '!' && str[i] != 'E')
			return false;
	}
	return true;
}

function factorial(num)
{
	if(num == 0)
	return 1;
	var tempFac = num*factorial(num-1);
	if(tempFac == Infinity)
		return Infinity;
	return (tempFac);
}

function isInteger(num)
{
	return num%1 === 0;
}

function isAdvancedLegal(str)
{
	var data = str;
	var len = str.length;
	if(!isAdvancedBadWord(str))
	{
		console.log('have bad word!');
		return false;
	}
	while(true)
	{
		var tempdata = data;
		for(let i = 0; i < tempdata.length; i++)
		{
			if(tempdata[i] == '^')//处理()^(),^(),()^,^
			{
				var startIndex = -1;
				var endIndex = -1;
				if(tempdata[i-1] != ')' || tempdata[i+1] != '(')
				{
					//console.log(tempdata);
					let sd = 0;
					let se = 0;
					if(tempdata[i-1] != ')' && tempdata[i+1] != '(')
					{
						let j = i-1;
						while(j >= 0)
						{
							if(tempdata[j] >= '0' && tempdata[j] <= '9')
							{
								j --;
								continue;
							}
							if(tempdata[j] == '.')
							{
								if(sd == 0)
								{
									j--;
									sd++;
									continue;
								}
							}
							break;
						}
						if(j == i-1)
						{
							console.log('Wrong Expression!');
							return false;
						}
						let k = i + 1;
						while(k < tempdata.length)
						{
							if(tempdata[k] >= '0' && tempdata[k] <= '9')
							{
								k++;
								continue;
							}
							if(tempdata[k] == '.')
							{
								if(se == 0)
								{
									k++;
									se++;
									continue;
								}
							}
							break;
						}
						if(k == i+1)
						{
							console.log('Wrong Expression!');
							return false;
						}
						startIndex = j+1;
						endIndex = k;
						var pre = tempdata.slice(startIndex, i);
						var sub = tempdata.slice(i+1, endIndex);
						var preResult = isAdvancedLegal(pre);
						var subResult = isAdvancedLegal(sub);
						if(preResult === false || subResult === false)
							return false;
						try{
							var powResult = String(Math.pow(preResult, subResult));
							if(powResult == Infinity)
							{
								console.log('Power: out of range!');
								return false;
							}
						}
						catch(err)
						{
							console.log('Wrong Expression!');
							return false;
						}
						var forReplace = tempdata.substring(startIndex,endIndex);
						tempdata = tempdata.replace(forReplace,powResult);
						i = startIndex + powResult.length;
						continue;
					}
					else if(tempdata[i-1] == ')' && tempdata[i+1] != '(')
					{
						var d = 0;
						let k = i + 1;
						for(let j = i-1; j >= 0; j--)
						{
							if(tempdata[j] == ')')
								d++;
							if(tempdata[j] == '(')
							{
								if(d == 1)
								{
									startIndex = j;
									break;
								}
								else
									d--;
							}
						}
						if(startIndex == -1)
						{
							console.log('Wrong Expression!');
							return false;
						}
						while(k < tempdata.length)
						{
							if(tempdata[k] >= '0' && tempdata[k] <= '9')
							{
								k++;
								continue;
							}
							if(tempdata[k] == '.')
							{
								if(se == 0)
								{
									k++;
									se++;
									continue;
								}
							}
							break;
						}
						if(k == i+1)
						{
							console.log('Wrong Expression!');
							return false;
						}
						endIndex = k-1;
						var pre = tempdata.slice(startIndex, i);
						var sub = tempdata.slice(i+1, endIndex+1);
						var preResult = isAdvancedLegal(pre);
						var subResult = isAdvancedLegal(sub);
						if(preResult === false || subResult === false)
							return false;
						try{
							var powResult = String(Math.pow(preResult, subResult));
							if(powResult == Infinity)
							{
								console.log('Power: out of range!');
								return false;
							}
						}
						catch(err)
						{
							console.log('Wrong Expression!');
							return false;
						}
						var forReplace = tempdata.substring(startIndex,endIndex+1);
						tempdata = tempdata.replace(forReplace,powResult);
						i = startIndex + powResult.length;
						continue;
					}
					else if(tempdata[i-1] != ')' && tempdata[i+1] == '(')
					{
						let j = i-1;
						while(j >= 0)
						{
							if(tempdata[j] >= '0' && tempdata[j] <= '9')
							{
								j--;
								continue;
							}
							if(tempdata[j] == '.')
							{
								if(sd == 0)
								{
									j--;
									sd++;
									continue;
								}
							}
							break;
						}
						if(j == i-1)
						{
							console.log('Wrong Expression!');
							return false;
						}
						startIndex = j+1;
						for(let k = i+1; k <= tempdata.length; k++)
						{
							if(tempdata[k] == '(')
								se++;
							if(tempdata[k] == ')')
							{
								if(se == 1)
								{
									endIndex = k;
									break;
								}
								else
									se--;
							}
						}
						if(endIndex == -1)
						{
							console.log('Wrong Expression!');
							return false;
						}
						var pre = tempdata.slice(startIndex, i);
						var sub = tempdata.slice(i+1, endIndex+1);
						var preResult = isAdvancedLegal(pre);
						var subResult = isAdvancedLegal(sub);
						if(preResult === false || subResult === false)
							return false;
						try{
							var powResult = String(Math.pow(preResult, subResult));
							if(powResult == Infinity)
							{
								console.log('Power: out of range!');
								return false;
							}
						}
						catch(err)
						{
							console.log('Wrong Expression!');
							return false;
						}
						var forReplace = tempdata.substring(startIndex,endIndex+1);
						tempdata = tempdata.replace(forReplace,powResult);
						i = startIndex + powResult.length;
						continue;
					}

				}
				var d = 0;
				var e = 0;
				for(let j = i-1; j >= 0; j--)
				{
					if(tempdata[j] == ')')
						d++;
					if(tempdata[j] == '(')
					{
						if(d == 1)
						{
							startIndex = j;
							break;
						}
						else
							d--;
					}
				}
				for(let j = i+1; j <= tempdata.length; j++)
				{
					if(tempdata[j] == '(')
						e++;
					if(tempdata[j] == ')')
					{
						if(e == 1)
						{
							endIndex = j;
							break;
						}
						else
							e--;
					}
				}
				if(startIndex == -1 ||endIndex == -1)
				{
					console.log('Wrong Expression!');
					return false;
				}
				var pre = tempdata.slice(startIndex, i);
				var sub = tempdata.slice(i+1, endIndex+1);
				var preResult = isAdvancedLegal(pre);
				var subResult = isAdvancedLegal(sub);
				if(preResult === false || subResult === false)
					return false;
				try{
					var powResult = String(Math.pow(preResult, subResult));
					if(powResult == Infinity)
					{
						console.log('Power: out of range!');
						return false;
					}
				}
				catch(err)
				{
					console.log('Wrong Expression!');
					return false;
				}
				var forReplace = tempdata.substring(startIndex,endIndex+1);
				tempdata = tempdata.replace(forReplace,powResult);
				i = startIndex + powResult.length;
				continue;
			}

			else if(tempdata[i] == '!')//处理()!,!
			{
				if(i < tempdata.length)
				{
					if(tempdata[i+1] >='0' && tempdata[i+1] <= '9' || tempdata[i+1] == '.')
					{
						console.log('Wrong Expression!');
						return false;
					}
				}
				var startIndex = -1;
				var endIndex = -1;
				if(tempdata[i-1] != ')')
				{
					var dot = 0;
					let j = i-1;
					while(j >= 0)
					{
						if(tempdata[j] >= '0' && tempdata[j] <= '9')
						{
							j --;
							continue;
						}
						if(tempdata[j] == '.')
						{
							if(dot == 0)
							{
								j--;
								dot++;
								continue;
							}
						}
						break;
					}
					if(j == i-1)
					{
						console.log('Wrong Expression!');
						return false;
					}
					var singleFac = isAdvancedLegal(tempdata.substring(j+1,i));
					if(singleFac < 0)
					{
						console.log('Factorial: number is negative!');
						return false;
					}
					if(!isInteger(singleFac))
					{
						console.log('Factorial: number is not a integer!');
						return false;
					}
					var sinFac = factorial(singleFac);
					if(sinFac == Infinity)
					{
						console.log('Factorial: out of range!');
						return false;
					}
					var sinFacResult = String(sinFac);
					var forReplace = tempdata.substring(j+1,i+1);
					tempdata = tempdata.replace(forReplace,sinFacResult);
					i = j+1+sinFacResult.length;
					continue;
				}
				var f = 0;
				for(let j = i-1; j >= 0; j--)
				{
					if(tempdata[j] == ')')
						f++;
					if(tempdata[j] == '(')
					{
						if(f == 1)
						{
							startIndex = j;
							break;
						}
						else
							f--;
					}
				}
				if(startIndex == -1)
				{
					console.log('Wrong Expression!');
					return false;
				}
				var pre = tempdata.slice(startIndex, i);
				var preResult = isAdvancedLegal(pre);
				if(preResult === false)
					return false;
				if(!isInteger(preResult))
				{
					console.log('Factorial: number is not a integer!');
					return false;
				}
				if(preResult < 0)
				{
					console.log('Factorial: number is negative!');
					return false;
				}
				var facData = factorial(preResult);
				if(facData == Infinity)
					{
						console.log('Factorial: out of range!');
						return false;
					}
				var facResult = String(facData);
				var forReplace = tempdata.substring(startIndex,i+1);
				tempdata = tempdata.replace(forReplace,facResult);
				i = startIndex + facResult.length;
				continue;
			}
			else if(tempdata[i-2] == 'l' && tempdata[i-1] == 'o' && tempdata[i] == 'g')//处理log()(), log()
			{
				var startIndex = i+1;
				var middleIndex = -1;
				var endIndex = -1;
				if(tempdata[i+1] != '(')
				{
					console.log('Wrong Expression!');
					return false;
				}
				var p = 0;
				var s = 0;
				for(let j = i+1; j <= tempdata.length; j++)
				{
					if(tempdata[j] == '(')
						p++;
					if(tempdata[j] == ')')
					{
						if(p == 1)
						{
							middleIndex = j;
							break;
						}
						else
							p--;
					}
				}
				if(middleIndex == -1 || tempdata[middleIndex+1] != '(')
				{
					var pre = tempdata.slice(startIndex, middleIndex+1);
					var preResult = isAdvancedLegal(pre);
					if(preResult === false)
						return false;
					if(preResult <= 0)
					{
						console.log('Log: bad  antilog number!')
						return false;
					}
					var singleResult = String(Math.log(preResult));
					if(Math.log(preResult) == Infinity)
					{
						console.log('Log:Out of range!')
						return false;
					}
					var forReplace = tempdata.substring(i-2,middleIndex+1);
					tempdata = tempdata.replace(forReplace,singleResult);
					i = i - 2 + singleResult.length;
					continue;
				}
				for(let j = middleIndex+1; j <=tempdata.length; j++)
				{
					if(tempdata[j] == '(')
						s++;
					if(tempdata[j] == ')')
					{
						if(s == 1)
						{
							endIndex = j;
							break;
						}
						else
							s--;
					}
				}
				if(endIndex == -1)
				{
					console.log('Wrong Expression!');
					return false;
				}
				var pre = tempdata.slice(startIndex, middleIndex+1);
				var sub = tempdata.slice(middleIndex+1, endIndex+1);
				var preResult = isAdvancedLegal(pre);
				var subResult = isAdvancedLegal(sub);
				if(preResult === false || subResult === false)
					return false;
				if(preResult <= 0|| preResult == 1)
				{
					console.log('Log: bad base number!');
					return false;
				}
				if(subResult <= 0)
				{
					console.log('Log: bad  antilog number!')
					return false;
				}
				var logPreResult = Math.log(preResult);
				var logSubResult = Math.log(subResult);
				var logResult = String(logSubResult/logPreResult);
				if(isNaN(logResult))
				{
					console.log('Log: bad numbers!')
					return false;
				}
				var forReplace = tempdata.substring(i-2,endIndex+1);
				tempdata = tempdata.replace(forReplace,logResult);
				i = i-2 + logResult.length;
				continue;
			}	
		}
		if(tempdata == data)
		{
			break;
		}
		data = tempdata;
	}
	while(true)
	{
		var tempdata = data;
		tempdata = tempdata.replace(' ','');
		tempdata = tempdata.replace('PI','@');
		tempdata = tempdata.replace('sin','#');
		tempdata = tempdata.replace('cos', ':');
		tempdata = tempdata.replace('tan', '?');
		tempdata = tempdata.replace('log', ';');
		tempdata = tempdata.replace('E', '$');
		if(tempdata == data)
		{
			break;
		}
		data = tempdata;
	}
	while(true)
	{
		var tempdata = data;
		tempdata = tempdata.replace('@','Math.PI');
		tempdata = tempdata.replace('$','Math.E');
		tempdata = tempdata.replace('{', '(');
		tempdata = tempdata.replace('}', ')');
		tempdata = tempdata.replace('#','Math.sin');
		tempdata = tempdata.replace('?','Math.tan');
		tempdata = tempdata.replace(':', 'Math.cos');
		tempdata = tempdata.replace(';', 'Math.log');
		if(tempdata == data)
		{
			break;
		}
		data = tempdata;
	}
	try{
		if(data == '')
			return 0;
		var tempResult = eval(data);
		return tempResult;
	}
	catch(err)
	{
		console.log('Wrong Expression!');
		return false;
	}
}
//删除了export
export function calculate(eq, type){
	return(isAdvancedLegal(eq));
}