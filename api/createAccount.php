<?php
    header("Content-Type: application/json");

    include($_SERVER['DOCUMENT_ROOT'] . "/api/db_connection.php");

    session_start();
    session_unset();
    session_destroy();
    session_start();

    $email = $password = $encPassword = "";

    try {
        if ($_SERVER['REQUEST_METHOD'] == "POST") {
            $email = getInput($_POST['email']);
            $password = getInput($_POST['password']);

            $sql = "SELECT * FROM accounts WHERE email=?;";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $email);
            $stmt->execute();

            $restult = $stmt->get_result();

            if ($restult->num_rows > 0) {
                throw new Exception("Email already exists!", 1);
            }
            else {
                $stmt->close();

                $encPassword = password_hash($password, PASSWORD_DEFAULT);

                $sql = "INSERT INTO accounts (email, password) VALUES (?, ?);";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ss", $email, $encPassword);
                $stmt->execute();
                $stmt->close();
            }

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

            echo json_encode(['success' => true]);
        }
    } catch (\Throwable $th) {
        echo json_encode(['success' => false, 'error' => strval($th)]);
    }

    exit;

    function getInput($data) {
        return trim(htmlspecialchars($data));
    }
?>