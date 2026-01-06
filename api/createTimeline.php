<?php
    header("Content-Type: application/json");

    include($_SERVER['DOCUMENT_ROOT'] . "/api/db_connection.php");

    session_start();

    try {
        if ($_SERVER['REQUEST_METHOD'] !== "POST") {
            throw new Exception("Invalid request method.");
        }

        if (!(isset($_SESSION['id']) && !empty($_SESSION['id']))) {
            throw new Exception("Unauthorized: please log in.");
        }

        $title = getInput($_POST['title']);
        $date = getInput($_POST['date']);

        if ($title === "" || $date === "") {
            throw new Exception("Missing timeline title or date.");
        }

        $sql = "INSERT INTO timelines (accountId, title, date) VALUES (?, ?, ?);";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iss", $_SESSION['id'], $title, $date);
        $stmt->execute();

        $newTimeline = [
            'id' => $conn->insert_id,
            'accountId' => $_SESSION['id'],
            'title' => $title,
            'date' => $date
        ];

        $stmt->close();
        $conn->close();

        echo json_encode(['success' => true, 'data' => $newTimeline]);
    } catch (\Throwable $th) {
        echo json_encode(['success' => false, 'error' => strval($th)]);
    }

    exit;

    function getInput($data) {
        return trim(htmlspecialchars($data));
    }
?>