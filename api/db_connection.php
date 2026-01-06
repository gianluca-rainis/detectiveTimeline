<?php
    $env = parse_ini_file(__DIR__ . '/../.env');
    
    $host = $env['host'];
    $user = $env['user'];
    $password = $env['password'];
    $dbname = $env['dbName'];
    $port = 12898;

    $conn = new mysqli($host, $user, $password, $dbname, $port);

    if ($conn->connect_error) {
        echo null;
        exit;
    }
?>