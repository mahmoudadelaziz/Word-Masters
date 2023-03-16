// Create a computation array (elements of the LHS expression)
let toCalc = []

// grab the calculator screen
const myDisplay = document.getElementById("display")

// Define a function to clear the calculator screen
function cleardisplay() {myDisplay.value = ""}

// Make an array of Number buttons
let NumButtons = Array.from(document.querySelectorAll(".Nums"))

// Give special event listeners to Number buttons
for(let i = 0; i < NumButtons.length; i++)
{
    // Log the number clicked (for debugging)
    NumButtons[i].addEventListener("click", (event)=>{console.log(event.target.innerText)})
    // Show the number clicked on the screen
    NumButtons[i].addEventListener("click", (event)=>{myDisplay.value += event.target.innerText})
}

// Make an array of Operation buttons
let OpButtons = Array.from(document.querySelectorAll(".Ops"))

// Give special event listeners to Number buttons
for(let i = 0; i < OpButtons.length; i++)
{
    // Log the number clicked (for debugging)
    OpButtons[i].addEventListener("click", (event)=>{console.log(event.target.innerText)})
    
    // Add the required behavior (1. clear screen, 2. expect new input, 3. add operand and operator to array)
    // Add operand and operator to Computation Array
    OpButtons[i].addEventListener("click", (event)=>{toCalc.push(myDisplay.value); toCalc.push(event.target.innerText)})

    // Clear Screen
    OpButtons[i].addEventListener("click", cleardisplay)

}

// Enable the functionality of the C "Clear" Button
document.getElementById("C").addEventListener("click", ()=>{cleardisplay(); toCalc=[]})

// Backspace functionality
function Backspace(){myDisplay.value = myDisplay.value.substr(0, myDisplay.value.length-1) }
document.getElementById("arrow").addEventListener("click", Backspace)

// Do the calculation
const equalButton = document.getElementById("equal")

function computeResult(arr){
    let toCalculate = arr.join('')
    let result = 0
    if(!['+','-','*','/'].includes(arr[arr.lenght-1]))
    {
        result = (toCalculate)
    }
    else
    {
        toCalculate.substr(0,toCalculate.length-1)
        result = (toCalculate)
    }
    return result
}

equalButton.addEventListener("click", ()=>
{
    toCalc.push(myDisplay.value);
    cleardisplay();
    let currentResult = eval(computeResult(toCalc));
    myDisplay.value = currentResult

    // reset everything (AN ISSUE HERE)
    toCalc = []
})