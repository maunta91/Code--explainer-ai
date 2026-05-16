const analyzeBtn = document.getElementById("analyzeBtn");

const loading = document.getElementById("loading");

const explanationOutput = document.getElementById("explanationOutput");

const issuesOutput = document.getElementById("issuesOutput");

const suggestionOutput = document.getElementById("suggestionOutput");

analyzeBtn.addEventListener("click", () => {

    loading.classList.remove("hidden");

    setTimeout(() => {

        loading.classList.add("hidden");

        explanationOutput.innerText =
            "This code takes user input and processes it.";

        issuesOutput.innerHTML = `
            <li>Variable naming can be improved</li>
            <li>No error handling found</li>
        `;

        suggestionOutput.innerText =
`try {
    // improved code here
} catch(error) {
    console.log(error);
}`;

    }, 2000);

});