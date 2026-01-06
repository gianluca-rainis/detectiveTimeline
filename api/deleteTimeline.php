<?php
    header("Content-Type: application/json");
    error_reporting(E_ALL);
    ini_set('display_errors', '0');

    include($_SERVER['DOCUMENT_ROOT'] . "/api/db_connection.php");

    session_start();

    function getInput($data) {
        return trim(htmlspecialchars($data));
    }

    try {
        if ($_SERVER['REQUEST_METHOD'] !== "POST") {
            throw new Exception("Invalid request method.");
        }

        if (!isset($_SESSION['id']) || empty($_SESSION['id'])) {
            throw new Exception("Unauthorized: please log in.");
        }

        $timelineId = getInput($_POST['timelineId']);

        if ($timelineId <= 0) {
            throw new Exception("Invalid event id.");
        }

        // Verify ownership of the timeline
        $sql = "SELECT id FROM timelines WHERE id=? AND accountId=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $timelineId, $_SESSION['id']);
        $stmt->execute();

        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            throw new Exception("Timeline not found or unauthorized.");
        }

        $stmt->close();

        // Delete the events
        $sql = "DELETE FROM events WHERE timelineId=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $timelineId);
        $stmt->execute();
        $stmt->close();

        // Delete the timeline
        $sql = "DELETE FROM timelines WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $timelineId);
        $stmt->execute();
        $stmt->close();

        $conn->close();

        echo json_encode(['success' => true]);
    } catch (\Throwable $th) {
        echo json_encode(['success' => false, 'error' => strval($th)]);
    }

    exit;
?>