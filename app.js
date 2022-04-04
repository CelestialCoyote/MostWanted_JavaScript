"use strict";

//Menu functions.
//Used for the overall flow of the application.
/////////////////////////////////////////////////////////////////
//#region

// app is the function called to start the entire application
function app(people) {
  let searchType = promptFor(
    `Do you know the name of the person you are looking for?\nEnter 'yes' or 'no'`,
    yesNo
  ).toLowerCase();
  let searchResults;
  let singleIndividual;

  switch (searchType) {
    case "yes":
      searchResults = searchByName(people);
      break;
    case "no":
      searchResults = searchByCriteriaChoice(people);
      break;
    default: // restart app
      app(people);
      break;
  }

  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  // Check if searchResults is returned 'undefined' from quitRestartMenu().
  // TODO: Probably not best way to handle this condition, find better option.
  if (searchResults === undefined) {
    return; // stop execution.
  } else if(searchResults.length <= 1) {
    singleIndividual = searchResults[0];          // Get single object out of returned array.
    mainMenu(singleIndividual, people);           // Go to mainMenu() to display results of search.
  }
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people) {
  // Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people.
  // We need people in order to find descendants and other information that the user may want.
  if (!person) {
    alert("Could not find that individual.");
    return app(people); // restart
  }

  // Changed !person to person[0].firstName and person[0].lastName to correctly access object array.
  let displayOption = promptFor(`Found ${person.firstName} ${person.lastName}.\nDo you want to know their 'info', 'family', or 'descendants'?\nType the option you want or 'restart' or 'quit'.`, autoValid);

  switch (displayOption) {
    case "info":
      displayPerson(person);
      break;
    case "family":
      displayFamily(person, people);
      break;
    case "descendants":
      displayDescendants(person, people);
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

function quitRestartMenu(people) {
  // Display options to restart search or quit.
  let displayOption = promptFor(
    `
    Type in 'restart' to begin a new search,
    or 'quit', to quit program.`,
    autoValid
  );

  switch (displayOption) {
    case "restart":
      app(people); // restart
      break;
    case "quit":
      return; // stop execution
    default:
      return quitRestartMenu(people); // ask again
  }
}

//#endregion

//Filter functions.
//Ideally you will have a function for each trait.
/////////////////////////////////////////////////////////////////
//#region

// Returns an array with a single object.
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

  return foundPerson;
}

// Start search(es) by various criteria.
// 1. Allow the user to choose which criteria to begin search.
// 2. If the search returns an array with 2 or more individuals, allows user to choose another criteria and search again to narrow list.
// 3. If the initial search, or any subsequent searches, results in either a single individual or no matches, fall through to mainMenu().
function searchByCriteriaChoice(people) {
  let criteria = promptFor(
    "What criteria would like to use?\n(gender, dob, height, weight, eyecolor, occupation)",
    autoValid
  );
  let suspectArray = people;
  let userChoice = "";
  let suspects = "";
  let tryAgain = "";

  switch (criteria) {
    case "gender":
      userChoice = promptFor("What gender?\n(male or female)", autoValid);
      suspects = searchGeneral("gender", userChoice, suspectArray);
      break;
    case "dob":
      userChoice = promptFor(
        "What is the date of birth?\n(mm/dd/yyyy)",
        autoValid
      );
      suspects = searchGeneral("dob", userChoice, suspectArray);
      break;
    case "height":
      userChoice = promptFor(
        "What is the height?\n(in inches; 5 feet 5 inches = 65 inches)",
        autoValid
      );
      suspects = searchGeneral("height", parseInt(userChoice), suspectArray);
      break;
    case "weight":
      userChoice = promptFor("What is the weight?\n(in pounds)", autoValid);
      suspects = searchGeneral("weight", parseInt(userChoice), suspectArray);
    case "eyecolor":
      userChoice = promptFor(
        "What is the eye color?\n(black, blue, brown, green, hazel)",
        autoValid
      );
      suspects = searchGeneral("eyeColor", userChoice, suspectArray);
      break;
    case "occupation":
      userChoice = promptFor("What is the occupation?", autoValid);
      suspects = searchGeneral("occupation", userChoice, suspectArray);
      break;
    default:
      userChoice = promptFor(
        "That is not a valid criteria selection, do you want to try again?\n(Y/N)",
        autoValid
      );

      if (userChoice.toUpperCase() == "Y") {
        return searchByCriteriaChoice(people);
      } else {
        return quitRestartMenu(people);
      }
  }

  // Display message to search again with new criteria, or return the arraay with a single individual or an empty array.
  if (suspects.length > 1) {
    tryAgain = promptFor(
      `There are ${suspects.length} possible suspects:\n${displayPeople(suspects)}.\nDo you want to add another search criteria?\n(Y / N)`,
      autoValid
    );

    if (tryAgain.toUpperCase() == "Y") {
      return searchByCriteriaChoice(suspects);
    } else {
      return quitRestartMenu(people);
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
    } else {
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
  return people
    .map(function (person) {
      return person.firstName + " " + person.lastName;
    })
    .join(",\n");
}

// Display person found's information.
// This includes their full name, dob, characteristics, & occupation.
function displayPerson(person) {
  // Create string will all information about person.
  let personInfo = `First Name: ${person.firstName}\n`;
  personInfo += `Last Name: ${person.lastName}\n`;
  personInfo += `Date of Birth: ${person.dob}\n`;
  personInfo += `Height: ${person.height} inches\n`;
  personInfo += `Weight: ${person.weight} pounds\n`;
  personInfo += `Eye Color: ${person.eyeColor}\n`;
  personInfo += `Occupation: ${person.occupation}`;

  alert(personInfo);
}

// Display list of descendants for person found.
function displayDescendants(person, people) {
  let totalDescendants = 0;
  let message = "";

  let children = findDescendants(person, people);

  // Construct message for alert message.
  if (children.length == 0) {
    message = `${person.firstName} ${person.lastName} has no known descendants.`;
  } else {
    message = `${person.firstName} ${person.lastName} is the parent of \n`;
    for (let i = 0; i < children.length; i++) {
      message += `${children[i].firstName} ${children[i].lastName}\n`;
    }
  }

  // Display alert with list of descendants.
  alert(message);
}

// Display immediate family of person found.
// Includes currentSpouse, parents, & siblings.
function displayFamily(person, people) {
  let familyInformation = "";

  let spouse = findSpouse(person, people);
  let parents = findParents(person, people);
  let siblings = findSiblings(person, people);

  familyInformation += `${spouse}\n${parents}\n${siblings}`;

  alert(familyInformation);
}

function findDescendants(person, people) {
  // Create an array to hold individuals found by referencing the id numbers listed
  // in the potentialMatch.parents attribute.
  let descendants = people.filter(function (potentialMatch) {
    if (
      potentialMatch.parents[0] === person.id ||  // First id in potentialMatch.parents is a match to person.id.
      potentialMatch.parents[1] === person.id     // Second id in potentialMatch.parents is a match to person.id.
    ) {
      // Second id in potentialMatch.parents is a match to person.id.
      return true;
    } else {
      return false; // No matches, not a parent of person.
    }
  });

  return descendants;
}

// Find currentSpouse of person found using id number in currentSpouse key-value pair.
function findSpouse(person, people) {
  let spouseMessage = "";

  // Check to see if person.currentSpouse is 'null'.
  if (person.currentSpouse === null) {
    spouseMessage = "No known spouse.";
  } else {
    // Create an array to hold individual information found by referencing the
    // id number listed in person.currentSpouse attribute.
    let spouse = people.filter(function (potentialMatch) {
      if (potentialMatch.id === person.currentSpouse) {
        // potentialMatch.id is a match for currentSpouse id in person.
        return true;
      } else {
        return false; // No match, not a spouse of person.
      }
    });

    spouseMessage = `${person.firstName} ${person.lastName}'s current spouse is ${spouse[0].firstName} ${spouse[0].lastName}`;
  }

  return spouseMessage;
}

// Find the parents of 'person' by using id number(s) listed in parents key-value pair.
function findParents(person, people) {
  let parentMessage = "";

  // Create new array to store individuals found by referencing id numbers listed in a
  // suspects parents attribute.  It is an array with 0, 1, or 2 individuals.
  let parents = people.filter(function (potentialMatch) {
    if (
      potentialMatch.id === person.parents[0] || // potentialMatch.id and first parent id for person match.
      potentialMatch.id === person.parents[1]
    ) {
      // potentialMatch.id and second parent id for person match.
      return true;
    } else {
      return false; // No matches, not a parent of person.
    }
  });

  // Construct message for alert message.
  if (parents.length == 0) {
    parentMessage = `${person.firstName} ${person.lastName} has no known parents.`;
  } else {
    parentMessage = `${person.firstName} ${person.lastName} is the child of \n`;
    for (let i = 0; i < parents.length; i++) {
      parentMessage += `${parents[i].firstName} ${parents[i].lastName}\n`;
    }
  }

  return parentMessage;
}

// Find the siblings of 'person' by using id number(s) listed in parents key-value pair.
function findSiblings(person, people) {
  let siblingMessage = "";

  // Create new array to store individuals found in people array to have at least on parent in common with person.
  let siblings = people.filter(function (potentialMatch) {
    // Initial checks that disqualify potentialMatch for finding siblings.
    if (
      potentialMatch.parents.length === 0 || // No parents in potentialMatch, siblings cannot be found.
      person.parents.length === 0 || // No parents in person, siblings cannot be found.
      potentialMatch.id === person.id
    ) {
      // potentialMatch and person are the same individual.
      return false;
      // None of the above checks are true, check if andy id numbers in parents are a match.
    } else {
      // There is at least one parent id listed in potentialMatch.parents and person.parents.
      if (
        potentialMatch.parents[0] === person.parents[0] || // First id in potentialMatch and first person match.
        potentialMatch.parents[0] === person.parents[1]
      ) {
        // First id in potentialMatch and second id in person match.
        return true;
      } else if (
        person.parents.length > 1 && // There is a second parent id listed in person.parents.
        (potentialMatch.parents[1] === person.parents[0] || // Second id in potentialMatch and first in person match.
          potentialMatch.parents[1] === person.parents[1])
      ) {
        // Second id in potentialMatch and second in person match.
        return true;
      } else {
        return false; // No parent id numbers match.
      }
    }
  });

  // Construct message for alert message.
  if (siblings.length == 0) {
    siblingMessage = `${person.firstName} ${person.lastName} has no known siblings.`;
  } else {
    siblingMessage = `${person.firstName} ${person.lastName} is the sibling of \n`;
    for (let i = 0; i < siblings.length; i++) {
      siblingMessage += `${siblings[i].firstName} ${siblings[i].lastName}\n`;
    }
  }

  return siblingMessage;
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
  } while (response === "" || isValid === false);
  return response;
}

// helper function/callback to pass into promptFor to validate yes/no answers.
function yesNo(input) {
  if (input.toLowerCase() == "yes" || input.toLowerCase() == "no") {
    return true;
  } else {
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
function customValidation(input) {}

//#endregion
