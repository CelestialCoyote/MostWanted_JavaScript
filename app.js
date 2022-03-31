"use strict"


//Menu functions.
//Used for the overall flow of the application.
/////////////////////////////////////////////////////////////////
//#region 

// app is the function called to start the entire application
function app(people) {
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  switch (searchType) {
    case 'yes':
      searchResults = searchByName(people);
      break;
    case 'no':
      searchByCriteriaChoice(people);
      //searchResults = searchByEyeColor(people);
      break;
    default:
      app(people); // restart app
      break;
  }

  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  mainMenu(searchResults, people);
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people) {
  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  // Changed !person to !person[0] to correctly access object array.
  if (!person[0]) {
    alert("Could not find that individual.");
    return app(people); // restart
  }

  // Changed !person to person[0].firstName and person[0].lastName to correctly access object array.
  let displayOption = promptFor("Found " + person[0].firstName + " " + person[0].lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'", autoValid);

  switch (displayOption) {
    case "info":
      // TODO: get person's info
      break;
    case "family":
      // TODO: get person's family
      break;
    case "descendants":
      // TODO: get person's descendants
      break;
    case "restart":
      app(people); // restart
      break;
    case "quit":
      return; // stop execution
    default:
      return mainMenu(person, people); // ask again
  }
}

//#endregion

//Filter functions.
//Ideally you will have a function for each trait.
/////////////////////////////////////////////////////////////////
//#region 

//nearly finished function used to search through an array of people to find matching first and last name and return a SINGLE person object.
function searchByName(people) {
  let firstName = promptFor("What is the person's first name?", autoValid);
  let lastName = promptFor("What is the person's last name?", autoValid);

  let foundPerson = people.filter(function (potentialMatch) {
    if (potentialMatch.firstName === firstName && potentialMatch.lastName === lastName) {
      return true;
    }
    else {
      return false;
    }
  })
  // TODO: find the person single person object using the name they entered.
  return foundPerson;
}



//unfinished function to search through an array of people to find matching eye colors. Use searchByName as reference.

function searchByEyeColor(people) {
  let color = promptFor("What is the person's eys color?", autoValid);

  let foundEyeColor = people.filter(function (potentialMatch) {
    if (potentialMatch.eyeColor === color) {
      return true;
    }
    else {
      return false;
    }
  });

  return foundEyeColor;

}

//TODO: add other trait filter functions here.
function searchByGender(people) {
  let gender = promptFor("What is the person's gender?", autoValid);

  let foundGender = people.filter(function (potentialMatch) {
    if (potentialMatch.gender === gender) {
      return true;
    }
    else {
      return false;
    }
  });

  return foundGender;

}

// Start search by various criteria.
function searchByCriteriaChoice(people) {
  let criteria = promptFor('What criteria would like to use?\n(gender, dob, height, weight, eyecolor, occupation)', autoValid);
  let suspectArray = people;
  let userChoice = '';
  let suspects = '';

  switch (criteria) {
    case 'gender':
      userChoice = promptFor('What gender?\n(male or female)', autoValid);
      suspects = searchGeneral('gender', userChoice, suspectArray);
      alert(`There are ${suspects.length} possible suspects, do you want to add another search criteria?`);
      break;
    case 'dob':
      userChoice = promptFor('What is the date of birth?\n(mm/dd/yyyy)', autoValid);
      suspects = searchGeneral('dob', userChoice, suspectArray);
      alert(`There are ${suspects.length} possible suspects, do you want to add another search criteria?`);
      break;
    case 'height':
      userChoice = promptFor('What is the height?\n(in inches; 5 feet 5 inches = 65 inches)', autoValid);
      suspects = searchGeneral('height', parseInt(userChoice), suspectArray);
      alert(`There are ${suspects.length} possible suspects, do you want to add another search criteria?`);
      break;
    case 'weight':
      userChoice = promptFor('What is the weight?\n(in pounds)', autoValid);
      suspects = searchGeneral('weight', parseInt(userChoice), suspectArray);
      alert(`There are ${suspects.length} possible suspects, do you want to add another search criteria?`);
      break;
    case 'eyecolor':
      userChoice = promptFor('What is the eye color?\n(black, blue, brown, green, hazel)', autoValid);
      suspects = searchGeneral('eyeColor', userChoice, suspectArray);
      alert(`There are ${suspects.length} possible suspects, do you want to add another search criteria?`);
      break;
    case 'occupation':
      userChoice = promptFor('What is the occupation?', autoValid);
      suspects = searchGeneral('occupation', userChoice, suspectArray);
      alert(`There are ${suspects.length} possible suspects, do you want to add another search criteria?`);
      break;
    default:
        promptFor('That is not a valid criteria selection, please try again.');
        searchByCriteria(people);
  }
}

function searchGeneral(criteria, criteriaChoice, suspectArray) {
  let selectedCriteria = suspectArray.filter(function (potentialMatch) {
    if (potentialMatch[criteria] === criteriaChoice) {
      return true;
    }
    else {
      return false;
    }
  });

  return selectedCriteria;
}


//#endregion

//Display functions.
//Functions for user interface.
/////////////////////////////////////////////////////////////////
//#region 

// alerts a list of people
function displayPeople(people) {
  alert(people.map(function (person) {
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayPerson(person) {
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  // TODO: finish getting the rest of the information to display.
  alert(personInfo);
}

//#endregion



//Validation functions.
//Functions to validate user input.
/////////////////////////////////////////////////////////////////
//#region 

//a function that takes in a question to prompt, and a callback function to validate the user input.
//response: Will capture the user input.
//isValid: Will capture the return of the validation function callback. true(the user input is valid)/false(the user input was not valid).
//this function will continue to loop until the user enters something that is not an empty string("") or is considered valid based off the callback function(valid).
function promptFor(question, valid) {
  let isValid;
  do {
    var response = prompt(question).trim();
    isValid = valid(response);
  } while (response === "" || isValid === false)
  return response;
}

// helper function/callback to pass into promptFor to validate yes/no answers.
function yesNo(input) {
  if (input.toLowerCase() == "yes" || input.toLowerCase() == "no") {
    return true;
  }
  else {
    return false;
  }
}

// helper function to pass in as default promptFor validation.
//this will always return true for all inputs.
function autoValid(input) {
  return true; // default validation only
}

//Unfinished validation function you can use for any of your custom validation callbacks.
//can be used for things like eye color validation for example.
function customValidation(input) {

}

//#endregion