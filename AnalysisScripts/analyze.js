var parse = require('csv-parse');
var fs = require('fs');
var input_file = "checklist_all.csv";


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
	var check_num_threshold = -1;

	// Loop through every row (checklist)
	for(var i = 0; i < output.length; i++ ){
		
		// This is to count the number of check item per checklists
		if(check_num_threshold == -1 || count_check_items(output,i)==check_num_threshold) {
			// Add the name of the checklist (topic) to the topics_array
			topics_array.push(output[i][0]);
			
			var checklist_name = trim(output[i][0]);

			// if the static checklist name is the same as the current checklist then increment the counter
			if(static_checklist_name == checklist_name) {
				checklist_counter++;
			} else {
				obj = {name:static_checklist_name, count: checklist_counter};
				checklists_per_topic.push(obj);

				checklist_counter = 1;
				static_checklist_name = checklist_name;
			}
		}
	}
	
	// find_average_percent_check(output,check_num_threshold);
	find_adoption(output,check_num_threshold);
	// find_average_checklists_per_topic(output);

	// print_num_checklists(topics_array);
	// print_num_topics();
	// print_topics();
	
	
});

var topics_array = [];

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

function find_average_checklists_per_topic(output) {
	var sum = 0;
	// Number of topics
	var count = checklists_per_topic.length;

	// Loop through ever topic
	for(var i = 0; i<count; i++) {
		// add the number of checklists per topic
		sum += parseInt(checklists_per_topic[i].count)
	}
	// Find average by dividing the total number of checklists by how many topics there are
	console.log(sum/count);
}

function find_adoption(output,check_num_threshold) {
	// only look at checklists with at least this many users
	var num_people_added_threshold = 0;
	var counter = 0;
	var checklist_counter = 0;
	var participant_row = 4;

	// Loop through every row
	for(var i = 0; i < output.length; i++ ){
		if(check_num_threshold == -1 || count_check_items(output,i)==check_num_threshold) {
			checklist_counter++;
			// get the number of people who added //
			if(output[i][participant_row] <= (num_people_added_threshold+1) ) {
				counter ++;
			}
		}	
	}
	// Find the percentage of checklists with only a certain amount of users
	console.log(counter/checklist_counter);
}


// Finds the average based on percentage checked averaged for every check item for every checklist
function find_average_percent_check(output,check_num_threshold) {
	var participant_row = 4;
	var checked_row = 3;
	var interval_to_next_checked = 4;

	// Loop through every row (every checklist) //
	for(var i = 0; i < output.length; i++ ){
		// Check Threshold 
		if(check_num_threshold == -1 || count_check_items(output,i)==check_num_threshold) {
			// Get the name of the checklist
			var chklist_name = trim(output[i][0]);
			// Create an object with the name and the number of participants
			var obj = {name:chklist_name, participating:output[i][participant_row]};

			// total number checked
			var sum_checked = 0;
			// Count the number of check items
			var check_item_counter = 0;

			// Loop through every column starting at the checked row
			for(var j = checked_row; j < output[i].length; j+=interval_to_next_checked) {
				// Exclude empty 
				if(output[i][j].length!=0) {
					// Add to sum checked
					sum_checked +=parseInt(output[i][j]);
					check_item_counter ++;
				}
			}
			
			// Average of the checklist based on (total checked/number of check items)/number of users participating
			obj.average = (sum_checked/check_item_counter)/obj.participating;
			checklist_array.push(obj);
		}
	}
	print_average();
}

function print_average() {
	var num_chklists = checklist_array.length;
	var sum = 0;
	// Loop through every checklist 
	for(var i = 0; i<checklist_array.length; i++) {
		// Make sure the number is legitimate 
		if(isFinite(checklist_array[i].average)) {
			// Parse to float and add 
			sum += parseFloat(checklist_array[i].average);
		}
		
	}
	// Average found by averaging the participant average of every checklist
	console.log(sum/num_chklists);
}

function print_num_topics() {
	console.log(checklists_per_topic.length);
}

function trim(name) {
	return name.trim();
}

function print_topics() {
	for(var i = 0; i<checklists_per_topic.length; i++) {
		console.log(checklists_per_topic[i]);
	}
}

function print_num_checklists(arr) {
	console.log(arr.length);
}



