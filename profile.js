// Placeholder for the form submission logic
document.getElementById('profileForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
  
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
  
    // Simple validation
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
    } else {
      alert("Profile updated successfully!");
      // Add logic to handle form submission or API call
    }
  });
  
  // Placeholder for image upload button
  document.querySelector('.upload-btn').addEventListener('click', function() {
    alert('Upload new image feature coming soon!');
  });
  const profile = document.querySelector('.profile');
let timeout;

profile.addEventListener('mouseenter', () => {
  clearTimeout(timeout); // Clear any existing timeout
  profile.querySelector('.dropdown').style.display = 'block';
});

profile.addEventListener('mouseleave', () => {
  timeout = setTimeout(() => {
    profile.querySelector('.dropdown').style.display = 'none';
  }, 300); // Delay of 300ms before hiding the dropdown
});
