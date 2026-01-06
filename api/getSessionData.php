<?php
    header('Content-Type: application/json');
    error_reporting(E_ALL);
    ini_set('display_errors', '0');

    session_start();

    try {
        if (isset($_SESSION['id']) && isset($_SESSION['email'])) {
            echo json_encode(['id' => $_SESSION['id'], 'email' => $_SESSION['email']]);
            exit;
        }
        else {
            echo json_encode(null);
            exit;
        }
    } catch (\Throwable $th) {
        echo json_encode(null);
        exit;
    }
?>