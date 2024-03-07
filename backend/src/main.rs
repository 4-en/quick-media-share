use rust_embed::RustEmbed;
use std::collections::HashMap;
use std::sync::Arc;
use warp::{http::{Response, StatusCode}, Filter};

use serde::Serialize;
use std::env;

use warp::{Rejection, Reply, hyper::Body};
use tokio::fs::File;
use tokio::io::AsyncReadExt;
use std::path::PathBuf;



#[derive(Serialize)]
struct PathItem {
    path: String,
    is_dir: bool,
}

#[derive(RustEmbed)]
#[folder = "public/"] // Adjust this path to your static files directory
struct EmbeddedFiles;

// Load all embedded files into a HashMap
fn load_embedded_files() -> HashMap<String, Vec<u8>> {
    let mut files = HashMap::new();
    for file in EmbeddedFiles::iter() {
        if let Some(content) = EmbeddedFiles::get(&file) {
            files.insert(file.to_string(), content.data.into_owned());
        }
    }
    files
}

// Serve an embedded file from the HashMap
async fn serve_embedded_file(
    args: (warp::path::Tail, Arc<HashMap<String, Vec<u8>>>),
) -> Result<impl warp::Reply, warp::Rejection> {
    let (path, files) = args; // Destructure the args tuple into individual variables

    let path_str = path.as_str();
    // Determine the correct file path to search for
    let file_path = if path_str.is_empty() || path_str.ends_with('/') {
        format!("{}index.html", path_str) // If the path is empty or ends with '/', append 'index.html'
    } else {
        path_str.to_string()
    };

    // Try to serve the file directly
    if let Some(content) = files.get(&file_path) {
        return Ok(Response::builder().body(content.clone()));
    }

    // If the direct path failed and it does not already look for an index.html, try appending '/index.html'
    if !path_str.ends_with("index.html") {
        let index_path = format!("{}/index.html", path_str);
        if let Some(content) = files.get(&index_path) {
            return Ok(Response::builder().body(content.clone()));
        }
    }

    // If neither worked, return a not found error
    Err(warp::reject::not_found())

}

async fn example_api() -> Result<impl warp::Reply, warp::Rejection> {
    Ok(warp::reply::json(&"This is an example API response"))
}

fn json_error_message(message: &str) -> warp::reply::WithStatus<warp::reply::Json> {
    warp::reply::with_status(warp::reply::json(&message), StatusCode::INTERNAL_SERVER_ERROR)
}

async fn serve_or_stream_file(file_name: String) -> Result<impl Reply, Rejection> {
    let base_dir = env::current_exe()
        .expect("Failed to get current exe path")
        .parent()
        .expect("Failed to get binary directory")
        .to_path_buf();
    
    let file_path = base_dir.join(file_name);

    // Basic security check to prevent directory traversal
    if !file_path.starts_with(&base_dir) || !file_path.exists() {
        return Err(warp::reject::not_found());
    }

    // Decide whether to stream or serve directly based on the file size or type
    let metadata = tokio::fs::metadata(&file_path).await.map_err(|_| warp::reject::not_found())?;
    if metadata.len() > 10 * 1024 * 1024 { // Arbitrary threshold: 10MB
        // For large files, stream with support for range requests
        //stream_file(&file_path).await
        // TODO: Implement the `stream_file` function
        Err(warp::reject::not_found())
    } else {
        // For smaller files, serve directly
        serve_file_directly(&file_path).await
    }
}

// ignore not used
#[allow(dead_code)]
async fn stream_file(_file_path: &PathBuf) -> Result<impl Reply, Rejection> {
    // Placeholder for streaming logic with range request support
    // This should include parsing the `Range` header and responding with the appropriate part of the file.
    // For simplicity, this example does not implement the full logic.
    Ok(Response::builder().status(StatusCode::OK).body(Body::empty()).unwrap())
}


async fn serve_file_directly(file_path: &PathBuf) -> Result<impl Reply, Rejection> {
    let mut file = File::open(file_path).await.map_err(|_| warp::reject::not_found())?;
    let mut buf = Vec::new();
    file.read_to_end(&mut buf).await.map_err(|_| warp::reject::not_found())?;

    // Here you might adjust the MIME type based on the file extension for a more accurate `Content-Type`
    Ok(Response::builder().status(StatusCode::OK).body(Body::from(buf)).unwrap())
}

async fn list_files_and_dirs(requested_path: warp::filters::path::Tail) -> Result<impl warp::Reply, warp::Rejection> {
    let base_dir = env::current_exe()
        .expect("Failed to get current exe path")
        .parent()
        .expect("Failed to get binary directory")
        .to_path_buf();

    let requested_path = requested_path.as_str();
    let full_path = base_dir.join(requested_path);

    // Ensure the requested path does not escape the base directory
    if !full_path.starts_with(&base_dir) {
        return Ok(json_error_message("Access Denied"));
    }

    match std::fs::read_dir(full_path) {
        Ok(entries) => {
            let paths: Vec<PathItem> = entries.filter_map(Result::ok).map(|entry| {
                let path = entry.path();
                let is_dir = path.is_dir();
                let path_display = path.strip_prefix(&base_dir).unwrap_or(&path).display().to_string();
                PathItem { path: path_display, is_dir }
            }).collect();

            return Ok(warp::reply::with_status(warp::reply::json(&paths), StatusCode::OK));
        },
        Err(_) => {
            // Ensure textual responses are also correctly typed as `impl warp::Reply`
            Ok(json_error_message("Directory not found"))
        },
    }
}

fn print_server_info(port: u16) {
    println!("Server running on http://localhost:{}", port);
}

fn build_routes() -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    let files = load_embedded_files(); // Assuming this function loads your embedded files
    let files = Arc::new(files); // Wrap in Arc to share across threads

    let static_files = warp::path::tail()
        .map(move |tail: warp::path::Tail| (tail, files.clone()))
        .and_then(serve_embedded_file); // Serves embedded files

    let example_api_route = warp::path("api")
        .and(warp::path("example").and(warp::get()).and_then(example_api)); // Example API route

    let list_files_and_dirs_route = warp::path("api")
        .and(warp::path("list"))
        .and(warp::path::tail()) // Captures the rest of the path
        .and_then(list_files_and_dirs); // Lists files and directories

    let serve_or_stream_route = warp::path("api") // Include 'api' in the path
        .and(warp::path("files")) // Then specify 'files'
        .and(warp::path::param()) // Captures the file name as a parameter
        .and_then(serve_or_stream_file); // Serves or streams the file

    // Combine the specific API routes under 'api' and add the serve_or_stream_route
    let api_routes = list_files_and_dirs_route.or(example_api_route).or(serve_or_stream_route);

    // Then, combine the static file serving route with the API routes
    let routes = static_files.or(api_routes);

    routes.boxed() // Box the combined routes for efficiency
}

#[tokio::main]
async fn main() {
    
    let routes = build_routes();

    let port: u16 = 3030;
    print_server_info(port);

    warp::serve(routes).run(([127, 0, 0, 1], port)).await;
}
