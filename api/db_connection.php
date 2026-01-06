<?php
    header("Content-Type: application/json");
    
    // Try to load from .env file (local development)
    $env = @parse_ini_file(__DIR__ . '/../.env');
    
    // Get database credentials from environment variables (production) or .env file (local)
    $host = getenv('host') ?: ($env['host'] ?? null);
    $user = getenv('user') ?: ($env['user'] ?? null);
    $password = getenv('password') ?: ($env['password'] ?? null);
    $dbname = getenv('dbName') ?: ($env['dbName'] ?? null);
    $port = getenv('port') ?: ($env['port'] ?? 12898);

    if (!$host || !$user || !$password || !$dbname) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Missing database configuration']);
        exit;
    }

    $conn = new mysqli($host, $user, $password, $dbname, $port);

    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $conn->connect_error]);
        exit;
    }
?>