<?php
    header("Content-Type: application/json");

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

        $eventId = getInput($_POST['eventId']);

        if ($eventId <= 0) {
            throw new Exception("Invalid event id.");
        }

        // Verify ownership: event must belong to a timeline owned by the session user
        $sql = "SELECT events.id FROM events INNER JOIN timelines ON events.timelineId=timelines.id WHERE events.id=? AND timelines.accountId=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $eventId, $_SESSION['id']);
        $stmt->execute();

        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            throw new Exception("Event not found or unauthorized.");
        }

        $stmt->close();

        // Delete the event
        $sql = "DELETE FROM events WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $eventId);
        $stmt->execute();

        $stmt->close();
        $conn->close();

        echo json_encode(['success' => true]);
    } catch (\Throwable $th) {
        echo json_encode(['success' => false, 'error' => strval($th)]);
    }

    exit;
?>
