/*
Asks a quesiton on Health Tap

How to use
phantomjs question-asker.js first_name last_name date_month date_day date_year medication_name

Example
phantomjs question-asker.js Kevin Yang 05 02 1997 Lisinopril
*/

var system = require('system');
var args = system.args;
var webPage = require('webpage');
var page = webPage.create();
page.viewportSize = {
  width: 480,
  height: 800
};

var first_name = "";
var last_name = "";
var birthday = "";
var medication = "";

// Read in the arguments from the console
if (args.length === 1) {
  console.log('Try to pass some arguments when invoking this script!');
  console.log('The format is first_name last_name date_month date_day date_year medication_name');
  phantom.exit();
} else {
  args.forEach(function(arg, i) {
  	if(i==1) {
  		first_name=arg;
  	}
  	if(i==2) {
  		last_name=arg;
  	}
  	if(i==3) {
  		birthday = arg;
  	}
  	if(i==4) {
  		birthday += " " + arg;
  	}
  	if(i==5) {
  		birthday += " " + arg;
  	}
  	if(i==6) {
  		medication = arg;
  	}
  });
}

var questions = [];

var question = "Why do I need to make sure to take hypertension medication every day?";

// Injects the correct strings into each argument
setup_functions();

// Open up the webpage
page.open('http://www.healthtap.com/ask_doctors', function(status) {
	// Ask a question
	ask_question();
});


/*
Asks questions for the user 
*/
function ask_question() {
	// Login Email
	page.evaluateJavaScript('function(){document.getElementsByClassName("fg-input email-input")[0].value = "kevin.yang@healthtap.com";}');
  	console.log(page.evaluateJavaScript('function(){return document.getElementsByClassName("fg-input email-input")[0].value;}'));
  	// Login Password
  	page.evaluateJavaScript('function(){document.getElementsByClassName("fg-input password-input")[0].value = "HTKy521997";}');
  	// Submit Login
  	page.evaluateJavaScript('function(){document.getElementsByClassName("btn primary submit-form")[0].click();}');
  	setTimeout(function(){ 
  		console.log(page.evaluateJavaScript('function(){return document.title;}')); 
  		// Click on Ask a Question
  		page.evaluateJavaScript('function(){document.getElementsByClassName("icon-box ask-docs")[0].click();}');
  		setTimeout(function() {
  			// Click on the Within a Day choose button
  			page.evaluateJavaScript('function(){document.getElementsByClassName("outline-btn picker-clickable")[1].click();}');
  			setTimeout(function() {
  				console.log(page.evaluateJavaScript('function(){return document.getElementsByClassName("picker-item-header picker-clickable")[4].innerHTML;}'));
  				// Click on Brief, educational answers choose button
  				page.evaluateJavaScript('function(){document.getElementsByClassName("outline-btn picker-clickable")[4].click();}');	
				setTimeout(function() {
					// Create new subaccount- Click on Someone Else button
					page.evaluateJavaScript('function(){document.getElementsByClassName("sprite-icon add_sub new-subaccount")[0].click();}');
					setTimeout(function() {
						// Input first name
						page.evaluateJavaScript(first_name_function);
						page.render("name.jpg");
						// Input last name
						page.evaluateJavaScript(last_name_function);
						// Choose other for the question about relation
						page.evaluateJavaScript('function(){document.getElementsByClassName("generic-select")[0].selectedIndex = 24}');
						// Input birthdate
						page.evaluateJavaScript(birthday_function);
						// Click on the first text area to activate update button
						page.sendEvent('click',250,470);
						// press shift to activate update button
						page.sendEvent('keypress', page.event.key.shift);
						setTimeout(function() {
							// Click the update button
							page.evaluateJavaScript('function(){document.getElementsByClassName("btn btn-48-right update")[0].click()}');
							setTimeout(function() {
								page.render("update.jpg");
								setTimeout(function() {
									// Input the question 
									page.evaluateJavaScript(question_function);
									// Click on the text area to activate continue button
				  					page.sendEvent('click',200,410);
				  					// Type shift to activate continue button
				  					page.sendEvent('keypress', page.event.key.shift);
				  					// Click Continue
				  					page.evaluateJavaScript('function(){document.getElementsByClassName("btn btn-48-right continue")[0].click();}');
				  					page.render("sub.jpg");
				  					setTimeout(function() {
				  					// 	page.evaluateJavaScript('function(){document.getElementsByClassName("sprite-icon circle-check-small")[1].click()}');
				  					// 	setTimeout(function() {
				  					// 		page.evaluateJavaScript(medication_function);
				  					// 		page.sendEvent('click',230,350);
											// page.sendEvent('keypress', page.event.key.shift);
											// page.render("now.jpg");
											// page.evaluateJavaScript('function(){document.getElementsByClassName("btn add btn-48-right")[0].click();}');
											setTimeout(function() {
												page.render("Medication.jpg");
												// Click on the continue function to ask question
												page.evaluateJavaScript('function(){document.getElementsByClassName("btn continue")[1].click()}');
												setTimeout(function() {
													page.render("Done.jpg");
													phantom.exit();
												},1000);
											// },500)
				  						},500);
				  					},2000);
				  				},2000);
							},400)
						},500);
					},1000);
				},2000);
  			},3000);
  		},3000);
  	}, 3000);  
};

var first_name_function;
var last_name_function;
var birthday_function;
var question_function;
var medication_function;

function setup_functions() {
	first_name_function = parse('function(){document.getElementsByClassName("generic-input first_name")[0].value = "%s"}',first_name);
	last_name_function = parse('function(){document.getElementsByClassName("generic-input last_name")[0].value = "%s"}',last_name);
	birthday_function = parse('function(){document.getElementsByClassName("generic-input date-input")[0].value = "%s"}',birthday);
	question_function = parse('function(){document.getElementsByClassName("form_comment")[0].value = "%s";}',question);
	medication_function = parse('function(){document.getElementsByClassName("generic-input attr-name")[0].value = "%s"}',medication);
}


// Replaces escape characters with string
// Usage s = parse('hello %s, how are you doing', my_name);
function parse(str) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, function() {
        return args[i++];
    });
}

