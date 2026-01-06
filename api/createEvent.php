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

        if (!(isset($_SESSION['id']) && !empty($_SESSION['id']))) {
            throw new Exception("Unauthorized: please log in.");
        }

        $timelineId = getInput($_POST['timelineId']);
        $title = getInput($_POST['title']);
        $date = getInput($_POST['date']);
        $description = getInput($_POST['description']);

        if ($timelineId === 0 || $title === "" || $date === "") {
            throw new Exception("Missing required event fields.");
        }

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

        // Insert the event
        $sql = "INSERT INTO events (timelineId, title, date, description) VALUES (?, ?, ?, ?);";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("isss", $timelineId, $title, $date, $description);
        $stmt->execute();

        $newEvent = [
            'id' => $conn->insert_id,
            'timelineId' => $timelineId,
            'title' => $title,
            'date' => $date,
            'description' => $description
        ];

        $stmt->close();
        $conn->close();

        echo json_encode(['success' => true, 'data' => $newEvent]);
    } catch (\Throwable $th) {
        echo json_encode(['success' => false, 'error' => strval($th)]);
    }

    exit;
?>