var parse = require('csv-parse');
var fs = require('fs');
var input_file = "checklist_all_id_data.csv";
var global_counter = 0;
var global_num_ppl = 0;

var file = fs.readFileSync(input_file).toString();

// Holds object of Checklist topic:Number of Checklists
var checklists_per_topic = [];
// Holds all checklists
var checklist_array = [];


parse(file, {}, function(err, output) {
	// Used to see how many unique checklist there are for each topic 
	var static_checklist_name = trim(output[0][0]);
	
	// Number of checklists per topic
	var checklist_counter = 0;

	// only take data for checklists with this many check items
	// Set equal to -1 to select all checklists
	// var check_num_threshold = -1;


	// Loop through every row (checklist)
	for(var i = 0; i < output.length; i++ ){
		var new_obj = {};
		new_obj["counter"] = i;
		var personal_checks_array = [];
		
		var checklist_name = output[i][0];
		var check_obj = {};
		// check_obj["name"] = output[i][0];
		check_counter = 0;
		var num_check_items = 0;
		// for every personal check array of check items
		var temp_ppl_array = [];
		for(var j = 6; j<output[i].length; j++) {

			if(output[i][j].length==0) {
				// console.log(temp_ppl_array);
				check_obj[check_counter] = temp_ppl_array;
				personal_checks_array.push(temp_ppl_array);
				num_check_items++;
				break;
			}
		
			if(output[i][j]==="^") {
				// console.log("Hit splice");
				// remove name of check item freq and first two values
				temp_ppl_array.splice(-2,2);
				// temp_ppl_array.splice(0,1);
				// console.log(temp_ppl_array);
				check_obj[check_counter] = temp_ppl_array;
				
				check_counter ++;
				temp_ppl_array = [];
				num_check_items++;
			} else {
				var person_obj = {};
				person_obj["id"] = output[i][j];
				j++;
				person_obj["completed"] = output[i][j];
				// console.log(person_obj);
				temp_ppl_array.push(person_obj);
			}
		} // loop through personal checks

		var base_ppl_array = [];
		

		for(var l = 0; l<check_obj["0"].length; l++) {
			var obj = {};
			obj["id"]=check_obj["0"][l]["id"];
			obj["count"]=0;
			base_ppl_array.push(obj);
		}

		// console.log(base_ppl_array);
		for(var key in check_obj) {
			for(var p = 0; p<check_obj[key].length; p++) {
				if(check_obj[key][p]["completed"]=="TRUE") {
					if(base_ppl_array[p]!=undefined) {
						base_ppl_array[p]["count"] ++;
					}
				}
			}
		}
		// console.log(base_ppl_array);
		// console.log(num_check_items);
		// console.log(num_check_items);

		// every person
		for(var r = 0; r<base_ppl_array.length; r++) {
			// console.log(base_ppl_array[r]["count"]);
			if(base_ppl_array[r]!=undefined) {
				if(base_ppl_array[r]["count"]==num_check_items) {
				global_counter++;
				}
			}
		}
		global_num_ppl += base_ppl_array.length;
	} // loop through checklists
	
	console.log(global_counter);
	console.log(global_num_ppl);
	console.log(global_counter/global_num_ppl)
});

function find_add(key) {

}

function count_check_items(output, i) {
	var name_row = 2;
	var interval_to_next_row = 4;
	var check_item_counter = 0;

	for(var j = name_row; j<output[i].length; j+=interval_to_next_row) {
		if(output[i][j].length==0) break;
		else check_item_counter++;
	}
	return check_item_counter;
}

// function find_average_checklists_per_topic(output) {
// 	var sum = 0;
// 	// Number of topics
// 	var count = checklists_per_topic.length;

// 	// Loop through ever topic
// 	for(var i = 0; i<count; i++) {
// 		// add the number of checklists per topic
// 		sum += parseInt(checklists_per_topic[i].count)
// 	}
// 	// Find average by dividing the total number of checklists by how many topics there are
// 	console.log(sum/count);
// }

// function find_adoption(output,check_num_threshold) {
// 	// only look at checklists with at least this many users
// 	var num_people_added_threshold = 0;
// 	var counter = 0;
// 	var checklist_counter = 0;
// 	var participant_row = 4;

// 	// Loop through every row
// 	for(var i = 0; i < output.length; i++ ){
// 		if(check_num_threshold == -1 || count_check_items(output,i)==check_num_threshold) {
// 			checklist_counter++;
// 			// get the number of people who added //
// 			if(output[i][participant_row] <= (num_people_added_threshold+1) ) {
// 				counter ++;
// 			}
// 		}	
// 	}
// 	// Find the percentage of checklists with only a certain amount of users
// 	console.log(counter/checklist_counter);
// }


// // Finds the average based on percentage checked averaged for every check item for every checklist
// function find_average_percent_check(output,check_num_threshold) {
// 	var participant_row = 4;
// 	var checked_row = 3;
// 	var interval_to_next_checked = 4;

// 	// Loop through every row (every checklist) //
// 	for(var i = 0; i < output.length; i++ ){
// 		// Check Threshold 
// 		if(check_num_threshold == -1 || count_check_items(output,i)==check_num_threshold) {
// 			// Get the name of the checklist
// 			var chklist_name = trim(output[i][0]);
// 			// Create an object with the name and the number of participants
// 			var obj = {name:chklist_name, participating:output[i][participant_row]};

// 			// total number checked
// 			var sum_checked = 0;
// 			// Count the number of check items
// 			var check_item_counter = 0;

// 			// Loop through every column starting at the checked row
// 			for(var j = checked_row; j < output[i].length; j+=interval_to_next_checked) {
// 				// Exclude empty 
// 				if(output[i][j].length!=0) {
// 					// Add to sum checked
// 					sum_checked +=parseInt(output[i][j]);
// 					check_item_counter ++;
// 				}
// 			}
			
// 			// Average of the checklist based on (total checked/number of check items)/number of users participating
// 			obj.average = (sum_checked/check_item_counter)/obj.participating;
// 			checklist_array.push(obj);
// 		}
// 	}
// 	print_average();
// }

// function print_average() {
// 	var num_chklists = checklist_array.length;
// 	var sum = 0;
// 	// Loop through every checklist 
// 	for(var i = 0; i<checklist_array.length; i++) {
// 		// Make sure the number is legitimate 
// 		if(isFinite(checklist_array[i].average)) {
// 			// Parse to float and add 
// 			sum += parseFloat(checklist_array[i].average);
// 		}
		
// 	}
// 	// Average found by averaging the participant average of every checklist
// 	console.log(sum/num_chklists);
// }

// function print_num_topics() {
// 	console.log(checklists_per_topic.length);
// }

function trim(name) {
	return name.trim();
}

// function print_topics() {
// 	for(var i = 0; i<checklists_per_topic.length; i++) {
// 		console.log(checklists_per_topic[i]);
// 	}
// }

// function print_num_checklists(arr) {
// 	console.log(arr.length);
// }



