<?php
$request_uri = $_SERVER['REQUEST_URI'];

// Route API requests to the PHP controller
$path = parse_url($request_uri, PHP_URL_PATH);
if (preg_match('/^\/api(\/|$)/', $path)) {
    require __DIR__ . '/api/index.php';
    exit;
}

// Route all other requests to index.html for React Router
$index_html = __DIR__ . '/index.html';
if (file_exists($index_html)) {
    header("Content-Type: text/html; charset=UTF-8");
    readfile($index_html);
} else {
    http_response_code(404);
    echo "GIG BR Frontend index.html not found.";
}
