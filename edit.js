// Store uploaded image URLs
let uploadedImages = [];

// Handle multiple image uploads and display them in a collage (max 4 images)
document.getElementById('uploadBtn').addEventListener('click', function () {
    const fileInput = document.getElementById('parkingImages');
    const uploadedImagesCollage = document.getElementById('uploadedImagesContainer');

    // Check if files are selected
    if (fileInput.files && fileInput.files.length > 0) {
        const filesToShow = Array.from(fileInput.files).slice(0, 4); // Limit to 4 images

        filesToShow.forEach(file => {
            const storageRef = firebase.storage().ref(`parking_images/${file.name}`);

            storageRef.put(file).then(snapshot => {
                snapshot.ref.getDownloadURL().then(url => {
                    // Add image URL to the uploadedImages array
                    uploadedImages.push(url);

                    // Create the image preview in the collage
                    const imgContainer = document.createElement('div');
                    imgContainer.classList.add('image-container');

                    const img = document.createElement('img');
                    img.src = url;

                    const removeBtn = document.createElement('button');
                    removeBtn.textContent = 'Remove';
                    removeBtn.classList.add('remove-btn');

                    // Add event listener for removing image
                    removeBtn.addEventListener('click', function () {
                        uploadedImagesCollage.removeChild(imgContainer);
                        uploadedImages = uploadedImages.filter(imageUrl => imageUrl !== url);
                    });

                    imgContainer.appendChild(img);
                    imgContainer.appendChild(removeBtn);
                    uploadedImagesCollage.appendChild(imgContainer);
                }).catch(error => {
                    console.error("Error getting download URL:", error);
                });
            }).catch(error => {
                console.error("Error uploading image:", error);
            });
        });

        if (fileInput.files.length > 4) {
            alert("Only the first 4 images will be displayed in the collage.");
        }
    } else {
        alert("Please select images to upload.");
    }
});

// Handle form submission
document.getElementById("editParkingForm").addEventListener("submit", function (event) {
    event.preventDefault();  // Prevent the default form submission

    // Gather form data
    const formData = {
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
        address: document.getElementById("address").value,
        zone: document.getElementById("zone").value,
        city: document.getElementById("city").value,
        start_time: document.getElementById("startTime").value,
        end_time: document.getElementById("endTime").value,
        capacity_car: document.getElementById("capacityCar").value,
        capacity_adapted: document.getElementById("capacityAdapted").value,
        images: uploadedImages  // Add uploaded images URLs here
    };

    // Send the data to Firestore
    firebase.firestore().collection("parking_lots").add(formData)
    .then(() => {
        alert("Parking lot successfully added!");
    })
    .catch(error => {
        console.error("Error submitting form:", error);
        alert("Error submitting form");
    });
});
