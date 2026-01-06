<?php
    header("Content-Type: application/json");
    
    $env = parse_ini_file(__DIR__ . '/../.env');
    
    if (!$env) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Configuration file not found']);
        exit;
    }
    
    $host = $env['host'] ?? null;
    $user = $env['user'] ?? null;
    $password = $env['password'] ?? null;
    $dbname = $env['dbName'] ?? null;
    $port = 12898;

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