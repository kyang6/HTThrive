var parse = require('csv-parse');
var fs = require('fs');
var input_file = "checklist_data_private_cleaned.csv";

var file = fs.readFileSync(input_file).toString();

// Holds object of Checklist topic:Number of Checklists
var checklists_per_topic = [];
var checklist_array = [];

parse(file, {}, function(err, output) {

	find_average(output);
	// find_adoption(output);

	
});


function find_adoption(output) {
	var counter_one = 0;

	for(var i = 0; i < output.length; i++ ){
		// get the number of people who checked //
		if(output[i][1] == 1 ) {
			counter_one ++;
		}
	}
	console.log(output.length);
	console.log(counter_one/output.length);
}


// Finds the average based on percentage checked averaged for every check item for every checklist
function find_average(output) {
	// Loop through every row //
	var sum_checked = 0;
	var sum_participating = 0;
	for(var i = 0; i < output.length; i++ ){
		// get the number of people who checked //
		var chklist_name = trim_name(output[i][0]);
		var obj = {name:chklist_name, participating:output[i][5]};
		

		if(output[i][4].length!=0) {
			if(output[i][8].length!=0) {
				sum_checked +=parseInt(output[i][4]);
				sum_participating += parseInt(output[i][5]);
			}
		}
		// for(var j = 4; j < output[i].length; j+=4) {
		// 	if(output[i][j].length!=0) {
		// 		sum_checked +=parseInt(output[i][j]);
		// 		sum_participating += parseInt(output[i][j+1]);
		// 	}
		// }
		obj.average = (sum_checked/sum_participating);
		checklist_array.push(obj);
	}
	console.log(sum_checked);
	console.log(sum_participating);
	console.log(sum_checked/sum_participating);
	// print_average();
}

function print_average() {
	var num_chklists = checklist_array.length;
	var sum = 0;
	for(var i = 0; i<checklist_array.length; i++) {
		if(isFinite(checklist_array[i].average)) {
			sum += parseFloat(checklist_array[i].average);
		}
		
	}
	// Average 
	console.log(sum/num_chklists);
}


function trim_name(name) {
	return name.slice(0,name.length-2).trim();
}




