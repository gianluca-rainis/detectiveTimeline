<?php
    header("Content-Type: application/json");
    error_reporting(E_ALL);
    ini_set('display_errors', '0');

    include($_SERVER['DOCUMENT_ROOT'] . "/api/db_connection.php");

    session_start();

    function getInput($data) {
        return trim(htmlspecialchars($data));
    }

    $timelineId = "";
    $timelines = [];

    try {
        if ($_SERVER['REQUEST_METHOD'] == "POST" && isset($_SESSION['id']) && !empty($_SESSION['id'])) {
            $timelineId = getInput($_POST['timelineId']);

            // Verify that the timeline exists and that the user is its owner
            $sql = "SELECT id FROM timelines WHERE id=? AND accountId=?;";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ii", $timelineId, $_SESSION['id']);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows === 0) {
                throw new Exception("Timeline not found or unauthorized.");
            }

            $stmt->close();

            $sql = "SELECT * FROM events WHERE timelineId=?;";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $timelineId);
            $stmt->execute();

            $restult = $stmt->get_result();

            while ($row = $restult->fetch_assoc()) {
                $timelines[] = $row;
            }

            $stmt->close();
            $conn->close();

            echo json_encode(['success' => true, 'data' => $timelines]);
        }
        else {
            echo json_encode(['success' => true, 'data' => []]);
        }
    } catch (\Throwable $th) {
        echo json_encode(['success' => false, 'error' => strval($th)]);
    }

    exit;
?>