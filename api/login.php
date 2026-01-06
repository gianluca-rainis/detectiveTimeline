<?php
    include($_SERVER['DOCUMENT_ROOT'] . "/api/db_connection.php");

    session_unset();
    session_destroy();
    session_start();

    $email = $password = "";

    if ($_SERVER['REQUEST_METHOD'] == "POST") {
        $email = getInput($_POST['email']);
        $password = getInput($_POST['password']);

        $sql = "SELECT * FROM accounts WHERE email=?;";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();

        $restult = $stmt->get_result();

        while ($row = $restult->fetch_assoc()) {
            if (password_verify($password, $row['password'])) {
                $_SESSION['id'] = $row['id'];
                $_SESSION['email'] = $row['email'];
            }
        }

        $stmt->close();
        $conn->close();
    }

    exit;

    function getInput($data) {
        return trim(htmlspecialchars($data));
    }
?>