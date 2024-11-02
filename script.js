const key = "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";
const inputText = document.getElementById("input");
const image = document.getElementById("image");
const GenBtn = document.getElementById("btn");
const svg = document.getElementById("svg");
const load = document.getElementById("loading");
const ResetBtn = document.getElementById("reset");
const downloadBtn = document.getElementById("download");

let latestObjectUrl = null;  // Variable to store the latest generated image URL

async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
        {
            headers: {
                Authorization: `Bearer ${key}`
            },
            method: "POST",
            body: JSON.stringify({ "inputs": data }),
        }
    );
    const result = await response.blob();
    return result;
}

async function generate() {
    load.style.display = "block";
    query(inputText.value).then((response) => {
        if (latestObjectUrl) {
            URL.revokeObjectURL(latestObjectUrl); // Revoke the old URL to prevent memory leaks
        }

        latestObjectUrl = URL.createObjectURL(response);
        image.src = latestObjectUrl;
        image.style.display = "block";

        load.style.display = "none"; // Hide loading icon after the image is loaded
    }).catch((error) => {
        console.error("Error generating image:", error);
        alert("Image generation failed. Please try again.");
        load.style.display = "none";
    });
}

GenBtn.addEventListener("click", () => {
    generate();
    svg.style.display = "none";
});

inputText.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        generate();
        svg.style.display = "none";
    }
});

ResetBtn.addEventListener("click", () => {
    inputText.value = "";
    window.location.reload();
});

downloadBtn.addEventListener("click", () => {
    if (latestObjectUrl) {
        download(latestObjectUrl);
    } else {
        alert("No image to download.");
    }
});

function download(objectUrl) {
    fetch(objectUrl).then(res => res.blob())
    .then(file => {
        let a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
    })
    .catch(() => alert("Failed to download"));
}
