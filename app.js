"use strict"


//Menu functions.
//Used for the overall flow of the application.
/////////////////////////////////////////////////////////////////
//#region 

// app is the function called to start the entire application
function app(people) {
  let searchType = promptFor(`Do you know the name of the person you are looking for?\nEnter 'yes' or 'no'`, yesNo).toLowerCase();
  let searchResults;

  switch (searchType) {
    case 'yes':
      searchResults = searchByName(people);
      break;
    case 'no':
      searchResults = searchByCriteriaChoice(people);
      break;
    default:
      app(people); // restart app
      break;
  }

  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  // Check if searchResults is returned 'undefined' from quitRestartMenu().
  // TODO: Probably not best way to handle this condition, find better option.
  if(searchResults === undefined) {
    return;     // stop execution.
  } else {
    mainMenu(searchResults, people);    // Go to mainMenu() to display results of search.
  }
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
  let displayOption = promptFor(`Found ${person[0].firstName} ${person[0].lastName}.\nDo you want to know their 'info', 'family', or 'descendants'?\nType the option you want or 'restart' or 'quit'.`, autoValid);

  switch (displayOption) {
    case "info":
      displayPerson(person[0]);
      break;
    case "family":
      // TODO: get person's family
      displayFamily(person[0], people);
      break;
    case "descendants":
      displayDescendants(person[0], people);
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


// Start search(es) by various criteria.
// 1. Allow the user to choose which criteria to begin search.
// 2. If the search returns an array with 2 or more individuals, allows user to choose another criteria and search again to narrow list.
// 3. If the initial search, or any subsequent searches, results in either a single individual or no matches, fall through to mainMenu().
function searchByCriteriaChoice(people) {
  let criteria = promptFor('What criteria would like to use?\n(gender, dob, height, weight, eyecolor, occupation)', autoValid);
  let suspectArray = people;
  let userChoice = '';
  let suspects = '';
  let tryAgain = '';

  switch (criteria) {
    case 'gender':
      userChoice = promptFor('What gender?\n(male or female)', autoValid);
      suspects = searchGeneral('gender', userChoice, suspectArray);
      break;
    case 'dob':
      userChoice = promptFor('What is the date of birth?\n(mm/dd/yyyy)', autoValid);
      suspects = searchGeneral('dob', userChoice, suspectArray);
      break;
    case 'height':
      userChoice = promptFor('What is the height?\n(in inches; 5 feet 5 inches = 65 inches)', autoValid);
      suspects = searchGeneral('height', parseInt(userChoice), suspectArray);
      break;
    case 'weight':
      userChoice = promptFor('What is the weight?\n(in pounds)', autoValid);
      suspects = searchGeneral('weight', parseInt(userChoice), suspectArray);
    case 'eyecolor':
      userChoice = promptFor('What is the eye color?\n(black, blue, brown, green, hazel)', autoValid);
      suspects = searchGeneral('eyeColor', userChoice, suspectArray);
      break;
    case 'occupation':
      userChoice = promptFor('What is the occupation?', autoValid);
      suspects = searchGeneral('occupation', userChoice, suspectArray);
      break;
    default:
      userChoice = promptFor('That is not a valid criteria selection, do you want to try again?\n(Y/N)', autoValid);

      if (userChoice.toUpperCase() == 'Y') {
        return searchByCriteriaChoice(people);
      }
      else {
        app(people);
        // To do: exit the program gracefully if user selects 'N'.  
      }
  }

  // Display message to search again with new criteria, or return the arraay with a single individual or an empty array. 
  if (suspects.length > 1) {
    tryAgain = promptFor(`There are ${suspects.length} possible suspects:\n${displayPeople(suspects)}.\nDo you want to add another search criteria?\n(Y / N)`, autoValid);

    if (tryAgain.toUpperCase() == 'Y') {
      return searchByCriteriaChoice(suspects);
    }
  } else {
    return suspects;
  }
}

// Actual search function bases on chosen criteria.
// 1. User determines which criteria to be used (gender, dob, height, weight, eyecolor, occupation). 
// 2. Search parameters are passed to search routine.
//   The 'criteria' is the key of the key-value pair in data list.
//   The 'criteriaChoice' is the value of the key-value pair in data list. 'Does individual have this?'
//   The suspectArray is the current array to search.  Starts with entire list and gets narrow after each search.
function searchGeneral(criteria, criteriaChoice, suspectArray) {
  let selectedCriteria = suspectArray.filter(function (potentialMatch) {
    if (potentialMatch[criteria] === criteriaChoice) {
      return true;
    }
    else {
      return false;
    }
  });

  // Array containing matched individuals with selected criteria.
  return selectedCriteria;

}








//#endregion

//Display functions.
//Functions for user interface.
/////////////////////////////////////////////////////////////////
//#region 

// alerts a list of people
function displayPeople(people) {
  return (people.map(function (person) {
    return person.firstName + " " + person.lastName;
  }).join(",\n"));
}

function displayPerson(person) {
  let personInfo = `First Name: ${person.firstName}\n`;
  personInfo += `Last Name: ${person.lastName}\n`;
  personInfo += `Date of Birth: ${person.dob}\n`;
  personInfo += `Height: ${person.height}\n`;
  personInfo += `Weight: ${person.weight}\n`;
  personInfo += `Eye Color: ${person.eyeColor}\n`;
  personInfo += `Occupation: ${person.occupation}\n`;
  alert(personInfo);
}

// Alert a list of descendants.
function displayDescendants(person, people) {
  let message = '';
  let descendantsArray = people.filter(function (potentialMatch) {
    if (potentialMatch.parents[0] === person.id) {
      return true;
    }
    else {
      return false;
    }
  });

  // Construct message for alert message.
  if(descendantsArray.length == 0) {
    message = `${person.firstName} ${person.lastName} has no known descendants.`;
  } else {
    message = `${person.firstName} ${person.lastName} is the parent of \n`;
    for(let i = 0; i < descendantsArray.length; i++) {
      message += `${descendantsArray[i].firstName} ${descendantsArray[i].lastName}\n`;
    }
  }

  // Display alert with list of descendants.
  alert(message);
}


function displayFamily(person, people) {
  // print all of the information about a person:
  // current spouses and parents .
  findSpouse(person, people);
  findParents(person, people);
  findSiblings(person, people);

  
}

function findSpouse(person, people) {

  let spouse = people.filter(function (potentialMatch) {
    if (potentialMatch.id === person.currentSpouse) {
      return true;
    }
    else {
      return false;
    }
  });

  console.log(`Current Spouse is: ${spouse[0].firstName} ${spouse[0].lastName}`);
}

function findParents(person, people) {
  let parentMessage = '';

  let parents = people.filter(function (potentialMatch) {
    if (potentialMatch.id === person.parents[0] || potentialMatch.id === person.parents[1]) {
      return true;
    }
    else {
      return false;
    }
  });

  // Construct message for alert message.
  if(parents.length == 0) {
    parentMessage = `${person.firstName} ${person.lastName} has no known parents.`;
  } else {
    parentMessage = `${person.firstName} ${person.lastName} is the child of \n`;
    for(let i = 0; i < parents.length; i++) {
      parentMessage += `${parents[i].firstName} ${parents[i].lastName}\n`;
    }
  }

  console.log(parentMessage);
}

function findSiblings(person, people) {
  console.log('To do find siblings');
}


function searchID(key, value, array) {
  let foundFamily = array.filter(function (potentialMatch) {
    if (potentialMatch[key] === value) {
      return true;
    }
    else {
      return false;
    }
  });

  // Array containing matched individuals with selected criteria.
  return foundFamily;

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