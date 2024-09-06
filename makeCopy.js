function makeCopy(array){
	let NewArray = new Array();
	for (let i = 0; i < array.length; i++){
		NewArray[i] = new Array();
		for (let j = 0; j < array[i].length; j++){
			NewArray[i][j] = array[i][j];
		}
	}
	return NewArray;
}