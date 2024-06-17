document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('uploadForm').addEventListener('submit', function(event) {
      event.preventDefault();
  
      const formData = new FormData(this);
  
      fetch('http://localhost:3000/upload-json', { // Adjust this URL to the backend service name and port
        method: 'POST',
        body: formData
      })
      .then(response => response.text())
      .then(result => {
        alert("Upload successful.");
      })
      .catch(error => {
        console.error('Error:', error);
        alert('File upload failed.');
      });
    });
  });
  