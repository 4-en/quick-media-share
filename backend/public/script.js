
document.addEventListener("DOMContentLoaded", function() {
    navigate("/"); // Initial navigation to the root
});

// Adjust the navigate function to correctly handle the expected JSON structure
function navigate(path) {
    fetch(`api/list/${path}`)
        .then(response => response.json())
        .then(data => {
            // Assuming the API returns a structure with a 'files' key
            if(data.files && Array.isArray(data.files)) {
                updateView(data.files, path);
            } else {
                console.error('Unexpected data structure:', data);
            }
        })
        .catch(error => console.error('Error fetching directory:', error));
}

function updateView(data, path) {
    const content = document.getElementById('content');
    const breadcrumbs = document.getElementById('breadcrumbs');
    content.innerHTML = ''; // Clear current view
    breadcrumbs.innerHTML = generateBreadcrumbs(path);

    data.forEach(item => { // This assumes 'data' is an array.
        const element = document.createElement('div');
        element.textContent = item.path;
        element.className = item.is_dir ? 'folder' : 'file';
        element.onclick = () => {
            if (item.is_dir) {
                navigate(item.path);
            } else {
                fetchFileContent(item.path);
            }
        };
        content.appendChild(element);
    });
}


function fetchFileContent(path) {
    fetch(`api/files/${path}`)
        .then(response => response.text())
        .then(text => {
            const content = document.getElementById('content');
            content.innerHTML = `<pre>${text}</pre>`; // Display file content
        })
        .catch(error => console.error('Error fetching file:', error));
}

function generateBreadcrumbs(path) {
    const paths = path.split('/').filter(Boolean);
    let fullPath = '';
    return paths.map((p, index) => {
        fullPath += '/' + p;
        return `<span class="breadcrumb" onclick="navigate('${fullPath}')">${p}</span>`;
    }).join(' / ');
}
