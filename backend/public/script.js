
document.addEventListener("DOMContentLoaded", function() {
    navigate("/"); // Initial navigation to the root
});

// Adjust the navigate function to correctly handle the expected JSON structure
function navigate(path) {
    let apiPath = 'api/list/' + path;
    apiPath = apiPath.replace('//', '/');
    fetch(apiPath)
        .then(response => response.json())
        .then(data => {
            // Assuming the API returns a structure with a 'files' key
            if(data && Array.isArray(data)) {
                updateView(data, path);
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

    // add a back button
    const back = document.createElement('span');
    back.className = 'back';
    back.textContent = 'Back';
    back.onclick = () => {
        const paths = path.split('/').filter(Boolean);
        paths.pop();
        navigate('/' + paths.join('/'));
    };
    back.style.display = path === '/' ? 'none' : 'inline';
    back.style.cursor = 'pointer';
    back.style.border = '1px solid black';
    back.style.padding = '5px';
    back.style.borderRadius = '5px';
    breadcrumbs.appendChild(back);

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

async function handle_audio(audio_data) {
    const audio = new Audio();
    audio.src = URL.createObjectURL(audio_data);
    audio.play();
}

async function handle_image(image_data) {
    const image = new Image();
    image.src = URL.createObjectURL(image_data);
    document.body.appendChild(image);
}

async function handle_video(video_data) {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(video_data);
    video.controls = true;
    document.body.appendChild(video);
}

async function handle_text(text_data) {
    const text = await text_data.text();
    console.log('Text content:', text);
    const pre = document.createElement('pre');
    pre.textContent = text;
    document.body.appendChild(pre);
}

async function handle_downloadable(data, filename) {
    // automatically download the file
    const blob = await data.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

}


async function fetchFileContent(path) {
    const apiPath = 'api/files/' + path;
    
    // different behavior for file content
    fetch(apiPath)
        .then(response => {
            console.log('Response:', response);
            let contentType = null;
            try {
                contentType = response.headers.get('content-type');
            } catch (error) {
                console.error('Error getting content type:', error);
                contentType = null;
            }

            if (!contentType) {
                // determine content type from path
                const parts = path.split('.');
                const extension = parts[parts.length - 1];
                if (['mp3', 'wav', 'ogg'].includes(extension)) {
                    contentType = 'audio/mpeg';
                } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
                    contentType = 'image/' + extension;
                } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
                    contentType = 'video/' + extension;
                } else if (['txt', 'json', 'xml', 'csv'].includes(extension)) {
                    contentType = 'text/plain';
                } else {
                    contentType = 'application/octet-stream';
                }

                console.log('Determined content type by extension:', contentType);
            }

            if (contentType.includes('audio')) {
                return response.blob().then(handle_audio);
            } else if (contentType.includes('image')) {
                return response.blob().then(handle_image);
            } else if (contentType.includes('video')) {
                return response.blob().then(handle_video);
            } else if (contentType.includes('text')) {
                return handle_text(response);
            } else {
                return handle_downloadable(response, path);
            }
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
