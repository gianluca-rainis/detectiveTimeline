<?php
    header("Content-Type: application/json");

    include($_SERVER['DOCUMENT_ROOT'] . "/api/db_connection.php");

    session_start();

    $timelines = [];

    try {
        if ($_SERVER['REQUEST_METHOD'] == "POST" && isset($_SESSION['id']) && !empty($_SESSION['id'])) {
            $sql = "SELECT * FROM timelines WHERE accountId=?;";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $_SESSION['id']);
            $stmt->execute();

            $restult = $stmt->get_result();

            while ($row = $restult->fetch_assoc()) {
                $timelines[] = $row;
            }

            $stmt->close();
            $conn->close();

            echo json_encode(['success' => true, 'data' => $timelines]);
        }
    } catch (\Throwable $th) {
        echo json_encode(['success' => false, 'error' => strval($th)]);
    }

    exit;
?>