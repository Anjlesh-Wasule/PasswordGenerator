const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");

const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
// single querySelector for all the checkboxes present
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "~!@#$%^&*()_+{}:<>?/;-"

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider(); 
// set style for the strength as grey


// set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    // adding shadow to this
    indicator.style.boxShadow = `0 0 10px ${color}`;
}

function getRndInteger(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min; // returns a random integer between min and max
}

function generateRandomInteger() {
    return getRndInteger(0, 9); // returns a random integer between 0 and 9

}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123)); //  returns a alphabet integer between a and z

}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91)); //  returns a random alphabet between A and Z

}

function generateSymbol(){
    return symbols[getRndInteger(0, symbols.length - 1)]; // returns a random symbol from the symbols array
}

function calcStrength() {

    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
    
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f8");
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6){
        setIndicator("#ffe");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }

    // making the text copied appear and disapper after few seconds
    copyMsg.classList.add("active");

    setTimeout(() => {
    copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array){
    // Fisher  Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        }
        
        let str = "";
        array.forEach((el) => (str += el));
        return str
};

function handleCheckboxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;  // counting the number of checked checkboxes
    })

    // special condition when the length of the  password is 3 or less we need to increase the length of password to 4
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();  // updating the slider value

    }


};
// adding event Listners
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
});

inputSlider.addEventListener('input', (e) =>{ // slider
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if(passwordLength > 0){ // if the password displayed is non-empty
        copyContent(); 
    }
});

generateBtn.addEventListener('click', () =>{
    if(checkCount <= 0) return; //  if no checkboxes are checked return

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();  // updating the slider value
    }

    // if a password was already displayed then remove it
    password = "";

    // adding  the characters to the password
    // if(uppercaseCheck.checked) password += generateUpperCase();

    // if(lowercaseCheck.checked) password += generateLowerCase();

    // if(numbersCheck.checked) password += generateRandomInteger();

    // if(symbolsCheck.checked) password += generateSymbol();

    let funcArr = []; // array of functions to generate characters
    if(uppercaseCheck.checked) funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked) funcArr.push(generateLowerCase);
    if(numbersCheck.checked) funcArr.push(generateRandomInteger);
    if(symbolsCheck.checked) funcArr.push(generateSymbol); // adding the functions to the array

    //  now firstly add the checked characters to the password 
    for(let i=0 ; i<funcArr.length ; i++){
        password += funcArr[i](); // calling the functions and adding the result to the password
    }

    //   now add the rest of the password length with random characters
    for(let i=0 ; i<passwordLength- funcArr.length ; i++){
        let randIdx = getRndInteger(0, funcArr.length - 1);
        password += funcArr[randIdx]();
    }

    // shuffle the password
    password = shufflePassword(Array.from(password)); // converting the password to an array and shuffling it
    passwordDisplay.value = password;

    calcStrength(); // calculating the password strength

});