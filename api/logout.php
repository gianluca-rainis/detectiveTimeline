<?php
    header("Content-Type: application/json");
    error_reporting(E_ALL);
    ini_set('display_errors', '0');

    include($_SERVER['DOCUMENT_ROOT'] . "/api/db_connection.php");

    session_start();

    session_unset();
    session_destroy();

    echo json_encode(['success' => true]);
    exit;
?>